import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ACTIVITIES } from '../data/activities'
import { useTeam } from '../hooks/useTeam'
import { usePlayerProfile } from '../hooks/usePlayerProfile'
import { useMarketPrices } from '../hooks/useMarketPrices'
import { rankActivitiesForSkill, getAllSkills } from '../utils/xpPerHour'
import { toDisplayName, formatGold } from '../utils/formatGold'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { CardRowSkeletonList } from '../components/ui/Skeleton'
import { SkillIcon } from '../components/ui/Icon'

const SLOTS = ['main', 'alt1', 'alt2'] as const
type Slot = (typeof SLOTS)[number]

const ALL_SKILLS = getAllSkills(ACTIVITIES)

function formatXp(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toFixed(0)
}

export function XpCalculatorPage() {
  const team = useTeam()
  const configuredSlots = SLOTS.filter((s) => team.accounts[s].username)
  const [activeSlot, setActiveSlot] = useState<Slot>('main')
  const effectiveSlot = configuredSlots.includes(activeSlot) ? activeSlot : configuredSlots[0]
  const account = effectiveSlot ? team.accounts[effectiveSlot] : null

  const [activeSkill, setActiveSkill] = useState(ALL_SKILLS[0] ?? '')

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-100">XP Calculator</h2>

      {configuredSlots.length === 0 ? (
        <EmptyState>
          No accounts set up.{' '}
          <Link to="/" className="font-medium text-gray-300 underline">Add your team on the Dashboard</Link>.
        </EmptyState>
      ) : (
        <>
          {/* Account tabs */}
          <div className="flex gap-2 overflow-x-auto border-b border-slate-700">
            {configuredSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setActiveSlot(slot)}
                className={`whitespace-nowrap px-3 py-2 text-sm font-medium ${
                  effectiveSlot === slot ? 'border-b-2 border-gray-100 text-gray-100' : 'text-gray-400'
                }`}
              >
                {team.accounts[slot].username}
              </button>
            ))}
          </div>

          {/* Skill picker */}
          <div className="flex flex-wrap gap-1.5">
            {ALL_SKILLS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => setActiveSkill(skill)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  activeSkill === skill
                    ? 'border-amber-400/60 bg-slate-700 text-amber-300'
                    : 'border-slate-700 bg-slate-800 text-gray-400 hover:border-slate-500 hover:text-gray-200'
                }`}
              >
                <SkillIcon name={skill.toLowerCase()} size={14} />
                {skill}
              </button>
            ))}
          </div>

          {account && effectiveSlot && (
            <SkillPanel
              username={account.username}
              slot={effectiveSlot}
              skillKey={activeSkill}
            />
          )}
        </>
      )}
    </div>
  )
}

type SortKey = 'xpPerHour' | 'goldPerHour'

function SkillPanel({ username, slot: _slot, skillKey }: { username: string | null; slot: Slot; skillKey: string }) {
  const { data: profile, isLoading, isError } = usePlayerProfile(username)
  const { data: rawPrices } = useMarketPrices()
  const [sortBy, setSortBy] = useState<SortKey>('xpPerHour')

  const marketMap = useMemo(() => {
    const m = new Map<number, { lowestSellPrice: number; highestBuyPrice: number; lowestPriceVolume: number; highestPriceVolume: number }>()
    if (rawPrices) {
      for (const p of rawPrices) m.set(p.itemId, { lowestSellPrice: p.lowestSellPrice, highestBuyPrice: p.highestBuyPrice, lowestPriceVolume: p.lowestPriceVolume, highestPriceVolume: p.highestPriceVolume })
    }
    return m
  }, [rawPrices])

  const ranked = useMemo(() => {
    if (!profile) return []
    const playerLevel = profile.skills[skillKey.toLowerCase()]?.level ?? 0
    return rankActivitiesForSkill(skillKey, profile, ACTIVITIES, marketMap, playerLevel)
  }, [profile, skillKey, marketMap])

  const sorted = useMemo(() => {
    if (sortBy === 'xpPerHour') return ranked
    // Gold/hr sort: profit (negative cost) is best, null data sinks to bottom
    return [...ranked].sort((a, b) => {
      if (a.goldCostPerHour === null && b.goldCostPerHour === null) return 0
      if (a.goldCostPerHour === null) return 1
      if (b.goldCostPerHour === null) return -1
      return a.goldCostPerHour - b.goldCostPerHour // most negative (profitable) first
    })
  }, [ranked, sortBy])

  if (!username) return <EmptyState>No account set for this slot.</EmptyState>
  if (isLoading) return <CardRowSkeletonList count={6} />
  if (isError) return <ErrorMessage>Couldn't find player "{username}".</ErrorMessage>
  if (!profile) return null

  const playerLevel = profile.skills[skillKey.toLowerCase()]?.level ?? 0
  const boost = ranked[0]?.boost

  return (
    <div className="space-y-3">
      {/* Boost summary */}
      {boost && (
        <div className="rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3">
          <p className="mb-2 text-xs uppercase text-gray-500">Your {skillKey} XP boosts</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <BoostChip label="Tool" value={boost.toolBoost} />
            <BoostChip label="Cape" value={boost.capeBoost} />
            <BoostChip label="Armour" value={boost.armourBoost} />
            <BoostChip label="Enchantments" value={boost.enchantmentBoost} />
            <BoostChip label="Total" value={boost.totalBoost} highlight />
          </div>
          {boost.totalBoost === 0 && (
            <p className="mt-1 text-xs text-slate-500">
              No boosts detected from equipped gear or jewelry for this skill.
            </p>
          )}
          <p className="mt-2 text-xs text-slate-500">
            Upgrades and active potions aren't visible in the public API — add them manually if relevant.
          </p>
        </div>
      )}

      {sorted.length === 0 ? (
        <EmptyState>No {skillKey} activities unlocked at level {playerLevel}.</EmptyState>
      ) : (
        <div className="space-y-1">
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 px-3 py-1">
            <span className="text-xs uppercase text-gray-500">Activity</span>
            <button
              type="button"
              onClick={() => setSortBy('xpPerHour')}
              className={`text-right text-xs font-medium uppercase transition-colors ${sortBy === 'xpPerHour' ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              XP/hr {sortBy === 'xpPerHour' && '↓'}
            </button>
            <button
              type="button"
              onClick={() => setSortBy('goldPerHour')}
              className={`w-20 text-right text-xs font-medium uppercase transition-colors ${sortBy === 'goldPerHour' ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Gold/hr {sortBy === 'goldPerHour' && '↓'}
            </button>
          </div>
          {sorted.map(({ activity, boostedXpPerHour, baseXpPerHour, goldCostPerHour }, i) => (
            <div
              key={activity.id}
              className={`grid grid-cols-[1fr_auto_auto] items-center gap-x-4 rounded-lg border px-3 py-2.5 text-sm ${
                i === 0 ? 'border-amber-400/30 bg-slate-800' : 'border-slate-700 bg-slate-800'
              }`}
            >
              <div>
                <span className="font-medium text-gray-100">{toDisplayName(activity.name)}</span>
                <span className="ml-2 text-xs text-gray-500">lv {activity.levelRequired}</span>
              </div>
              <div className="text-right">
                <span className={i === 0 && sortBy === 'xpPerHour' ? 'font-semibold text-amber-300' : 'text-gray-200'}>
                  {formatXp(boostedXpPerHour)}
                </span>
                {boost && boost.totalBoost > 0 && (
                  <div className="text-xs text-gray-500">{formatXp(baseXpPerHour)} base</div>
                )}
              </div>
              <div className="w-20 text-right">
                {goldCostPerHour === null ? (
                  <span className="text-gray-600">—</span>
                ) : goldCostPerHour < 0 ? (
                  <span className={`font-medium ${i === 0 && sortBy === 'goldPerHour' ? 'text-amber-300' : 'text-emerald-400'}`}>
                    +{formatGold(-goldCostPerHour)}
                  </span>
                ) : goldCostPerHour === 0 ? (
                  <span className="text-gray-400">free</span>
                ) : (
                  <span className={`${i === 0 && sortBy === 'goldPerHour' ? 'font-medium text-amber-300' : 'text-rose-400'}`}>
                    -{formatGold(goldCostPerHour)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BoostChip({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  if (value === 0 && !highlight) return null
  return (
    <span className={highlight ? 'font-semibold text-amber-300' : 'text-gray-300'}>
      {label}: <span className={value > 0 ? (highlight ? 'text-amber-300' : 'text-emerald-400') : 'text-gray-500'}>+{value}%</span>
    </span>
  )
}
