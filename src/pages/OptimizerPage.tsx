import { useMemo, useState } from 'react'
import { useTeam } from '../hooks/useTeam'
import { usePlayerProfile } from '../hooks/usePlayerProfile'
import { useMarketPrices } from '../hooks/useMarketPrices'
import { useSettingsStore } from '../store/settingsStore'
import { ACTIVITIES } from '../data/activities'
import {
  rankActivitiesForSkills,
  getNextUnlock,
  rankIronmanActivitiesForSkills,
  getIronmanNextUnlock,
  type RankedActivity,
} from '../utils/goldPerHour'
import { ActivityRanking } from '../components/optimizer/ActivityRanking'
import { IronmanActivityRanking } from '../components/optimizer/IronmanActivityRanking'
import { formatGold, activityDisplayName } from '../utils/formatGold'

const SLOTS = ['main', 'alt1', 'alt2'] as const
type Slot = (typeof SLOTS)[number]
type Account = ReturnType<typeof useTeam>['accounts']['main']

const SKILL_KEYS = [...new Set(ACTIVITIES.map((a) => a.skillKey))]

export function OptimizerPage() {
  const team = useTeam()
  const [activeSlot, setActiveSlot] = useState<Slot>('main')
  const { data: marketPrices } = useMarketPrices()
  const ironmanMode = useSettingsStore((s) => s.ironmanMode)
  const setIronmanMode = useSettingsStore((s) => s.setIronmanMode)

  const mainProfile = usePlayerProfile(team.accounts.main.username)
  const alt1Profile = usePlayerProfile(team.accounts.alt1.username)
  const alt2Profile = usePlayerProfile(team.accounts.alt2.username)
  const profilesBySlot = { main: mainProfile, alt1: alt1Profile, alt2: alt2Profile }

  // Highest level any team member has in each skill — used in ironman mode
  // to decide whether *someone* on the team could self-gather an input.
  const teamSkillLevels = useMemo(() => {
    const levels: Record<string, number> = {}
    for (const { data } of [mainProfile, alt1Profile, alt2Profile]) {
      if (!data) continue
      for (const [skill, info] of Object.entries(data.skills)) {
        levels[skill] = Math.max(levels[skill] ?? 0, info.level)
      }
    }
    return levels
  }, [mainProfile.data, alt1Profile.data, alt2Profile.data])

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-gray-900">Profit Calculator</h2>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={ironmanMode}
            onChange={(e) => setIronmanMode(e.target.checked)}
          />
          Ironman mode
        </label>
      </div>

      <TeamSummary marketPrices={marketPrices} ironmanMode={ironmanMode} teamSkillLevels={teamSkillLevels} />

      <div>
        <div className="flex gap-2 overflow-x-auto border-b border-gray-200">
          {SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setActiveSlot(slot)}
              className={`whitespace-nowrap px-3 py-2 text-sm font-medium ${
                activeSlot === slot ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500'
              }`}
            >
              {team.accounts[slot].username ?? slot.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="pt-4">
          <AccountOptimizerPanel
            account={team.accounts[activeSlot]}
            profileQuery={profilesBySlot[activeSlot]}
            marketPrices={marketPrices}
            ironmanMode={ironmanMode}
            teamSkillLevels={teamSkillLevels}
          />
        </div>
      </div>
    </div>
  )
}

function AccountOptimizerPanel({
  account,
  profileQuery,
  marketPrices,
  ironmanMode,
  teamSkillLevels,
}: {
  account: Account
  profileQuery: ReturnType<typeof usePlayerProfile>
  marketPrices: ReturnType<typeof useMarketPrices>['data']
  ironmanMode: boolean
  teamSkillLevels: Record<string, number>
}) {
  const { data: profile, isLoading, isError } = profileQuery

  if (!account.username) return <p className="text-sm text-gray-500">No account set for this slot.</p>
  if (isLoading) return <p className="text-sm text-gray-500">Loading profile…</p>
  if (isError) return <p className="text-sm text-red-500">Couldn't load this player.</p>
  if (!profile) return null

  if (ironmanMode) {
    const ranked = rankIronmanActivitiesForSkills(profile.skills, teamSkillLevels)
    const nextUnlocks = SKILL_KEYS.map((skillKey) =>
      getIronmanNextUnlock(skillKey, profile.skills[skillKey.toLowerCase()]?.level ?? 0, teamSkillLevels),
    ).filter((u): u is NonNullable<typeof u> => u !== null)
    return <IronmanActivityRanking ranked={ranked} nextUnlocks={nextUnlocks} />
  }

  if (!marketPrices) return null
  const ranked = rankActivitiesForSkills(profile.skills, marketPrices)
  const nextUnlocks = SKILL_KEYS.map((skillKey) =>
    getNextUnlock(skillKey, profile.skills[skillKey.toLowerCase()]?.level ?? 0, marketPrices),
  ).filter((u): u is NonNullable<typeof u> => u !== null)
  return <ActivityRanking ranked={ranked} nextUnlocks={nextUnlocks} marketPrices={marketPrices} />
}

function TeamSummary({
  marketPrices,
  ironmanMode,
  teamSkillLevels,
}: {
  marketPrices: ReturnType<typeof useMarketPrices>['data']
  ironmanMode: boolean
  teamSkillLevels: Record<string, number>
}) {
  const team = useTeam()
  const mainProfile = usePlayerProfile(team.accounts.main.username)
  const alt1Profile = usePlayerProfile(team.accounts.alt1.username)
  const alt2Profile = usePlayerProfile(team.accounts.alt2.username)

  const entries = useMemo(() => {
    return SLOTS.map((slot, i) => {
      const account = team.accounts[slot]
      const profile = [mainProfile, alt1Profile, alt2Profile][i].data
      if (!account.username || !profile) {
        return { slot, account, bestName: null as string | null, bestGoldPerHour: null as number | null }
      }

      if (ironmanMode) {
        const ranked = rankIronmanActivitiesForSkills(profile.skills, teamSkillLevels)
        const best = ranked.find((r) => r.fullPipelineGoldPerHour !== null) ?? ranked[0]
        return {
          slot,
          account,
          bestName: best ? activityDisplayName(best.activity) : null,
          bestGoldPerHour: best ? best.fullPipelineGoldPerHour ?? best.materialsFreeGoldPerHour : null,
        }
      }

      if (!marketPrices) return { slot, account, bestName: null, bestGoldPerHour: null }
      const ranked = rankActivitiesForSkills(profile.skills, marketPrices)
      const best: RankedActivity | undefined = ranked[0]
      return {
        slot,
        account,
        bestName: best ? activityDisplayName(best.activity) : null,
        bestGoldPerHour: best ? best.goldPerHour : null,
      }
    })
  }, [team, marketPrices, ironmanMode, teamSkillLevels, mainProfile.data, alt1Profile.data, alt2Profile.data])

  const withAccounts = entries.filter((e) => e.account.username)
  if (withAccounts.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-900">Team — best activity per account</h3>
      {withAccounts.map(({ slot, account, bestName, bestGoldPerHour }) => (
        <div
          key={slot}
          className="flex items-center justify-between rounded-lg border border-gray-300 bg-white p-3 text-sm"
        >
          <span className="font-medium text-gray-900">{account.username}</span>
          {bestName && bestGoldPerHour !== null ? (
            <span className="text-gray-600">
              {bestName} — <span className="font-medium text-green-700">{formatGold(bestGoldPerHour)}/hr</span>
            </span>
          ) : (
            <span className="text-gray-400">No profitable activity found</span>
          )}
        </div>
      ))}
    </div>
  )
}

