import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTeam } from '../hooks/useTeam'
import { usePlayerProfile } from '../hooks/usePlayerProfile'
import { useMarketPrices } from '../hooks/useMarketPrices'
import { GEAR } from '../data/gear'
import { getEquippedItemId } from '../utils/equipmentSlots'
import { GearUpgradeCard } from '../components/gear/GearUpgradeCard'
import { CardRowSkeletonList } from '../components/ui/Skeleton'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { EmptyState } from '../components/ui/EmptyState'

const SLOTS = ['main', 'alt1', 'alt2'] as const
type Slot = (typeof SLOTS)[number]

const COMBAT_GEAR = GEAR.filter((g) => g.category === 'combat')

// gear.ts now stores the full 8-tier ladder per tool skill (for the
// ownership dropdown / future upgrade-path UI) — the recommendations list
// here only wants the BiS (highest-tier) entry per skill.
const BIS_TOOL_GEAR = Object.values(
  GEAR.filter((g) => g.category === 'tool').reduce<Record<string, (typeof GEAR)[number]>>((acc, item) => {
    const skill = item.skill ?? ''
    if (!acc[skill] || item.tier > acc[skill].tier) acc[skill] = item
    return acc
  }, {}),
)

export function GearPage() {
  const team = useTeam()
  const configuredSlots = SLOTS.filter((slot) => team.accounts[slot].username)
  const [activeSlot, setActiveSlot] = useState<Slot>('main')
  const effectiveSlot = configuredSlots.includes(activeSlot) ? activeSlot : configuredSlots[0]
  const account = effectiveSlot ? team.accounts[effectiveSlot] : null

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900">Gear Guide</h2>

      {configuredSlots.length > 0 && (
        <div className="flex gap-2 overflow-x-auto border-b border-gray-200">
          {configuredSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setActiveSlot(slot)}
              className={`whitespace-nowrap px-3 py-2 text-sm font-medium ${
                effectiveSlot === slot
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-500'
              }`}
            >
              {team.accounts[slot].username}
            </button>
          ))}
        </div>
      )}

      {account && effectiveSlot ? (
        <AccountGearPanel account={account} slot={effectiveSlot} />
      ) : (
        <EmptyState>
          No accounts set up yet.{' '}
          <Link to="/" className="font-medium text-gray-700 underline">
            Add your team on the Dashboard
          </Link>
          .
        </EmptyState>
      )}
    </div>
  )
}

function AccountGearPanel({
  account,
  slot,
}: {
  account: ReturnType<typeof useTeam>['accounts']['main']
  slot: Slot
}) {
  const { data: profile, isLoading, isError } = usePlayerProfile(account.username)
  const { data: marketPrices } = useMarketPrices()

  if (!account.username) {
    return (
      <EmptyState>
        No account set for this slot.{' '}
        <Link to="/" className="font-medium text-gray-700 underline">
          Add one on the Dashboard
        </Link>
        .
      </EmptyState>
    )
  }
  if (isLoading) return <CardRowSkeletonList count={6} />
  if (isError) return <ErrorMessage>Couldn't find a player named "{account.username}".</ErrorMessage>
  if (!profile || !marketPrices) return null

  // Role drives which gear set this account sees: "main" trains combat, the
  // other roles (gatherer/crafter/support/unassigned) are skilling-focused.
  // There's no per-alt "assigned skill" field on AccountSlot, so within the
  // skilling set we rank by the player's own trained skill levels instead of
  // guessing a single skill.
  const isCombatRole = account.role === 'main'
  const gearList = isCombatRole
    ? COMBAT_GEAR
    : [...BIS_TOOL_GEAR].sort(
        (a, b) => (profile.skills[b.skill ?? '']?.level ?? 0) - (profile.skills[a.skill ?? '']?.level ?? 0),
      )

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase text-gray-400">
        {isCombatRole ? 'Melee combat gear' : 'Skilling gear'} · role: {account.role}
      </p>
      {gearList.map((item) => (
        <GearUpgradeCard
          key={item.id}
          bisItem={item}
          currentItemId={getEquippedItemId(profile.equipment, item.slot)}
          marketPrices={marketPrices}
          slot={slot}
        />
      ))}
    </div>
  )
}
