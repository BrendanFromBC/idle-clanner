import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTeam } from '../hooks/useTeam'
import { usePlayerProfile } from '../hooks/usePlayerProfile'
import { useMarketPrices } from '../hooks/useMarketPrices'
import { GEAR } from '../data/gear'
import { getEquippedItemId } from '../utils/equipmentSlots'
import { GearUpgradeCard } from '../components/gear/GearUpgradeCard'
import { ItemIcon } from '../components/ui/Icon'
import { CardRowSkeletonList } from '../components/ui/Skeleton'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { EmptyState } from '../components/ui/EmptyState'
import { useOwnedItemsStore } from '../store/ownedItemsStore'

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

// Set of valid tool item IDs per skill — used to filter out combat weapons
// that share the rightHand slot from appearing as "currently equipped" on
// every tool card.
const TOOL_IDS_BY_SKILL: Record<string, Set<number>> = GEAR
  .filter((g) => g.category === 'tool' && g.skill)
  .reduce<Record<string, Set<number>>>((acc, g) => {
    ;(acc[g.skill!] ??= new Set()).add(g.id)
    return acc
  }, {})

export function GearPage() {
  const team = useTeam()
  const configuredSlots = SLOTS.filter((slot) => team.accounts[slot].username)
  const [activeSlot, setActiveSlot] = useState<Slot>('main')
  const effectiveSlot = configuredSlots.includes(activeSlot) ? activeSlot : configuredSlots[0]
  const account = effectiveSlot ? team.accounts[effectiveSlot] : null

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-100">Gear Guide</h2>

      {configuredSlots.length > 0 && (
        <div className="flex gap-2 overflow-x-auto border-b border-slate-700">
          {configuredSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setActiveSlot(slot)}
              className={`whitespace-nowrap px-3 py-2 text-sm font-medium ${
                effectiveSlot === slot
                  ? 'border-b-2 border-gray-100 text-gray-100'
                  : 'text-gray-400'
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
          <Link to="/" className="font-medium text-gray-300 underline">
            Add your team on the Dashboard
          </Link>
          .
        </EmptyState>
      )}
    </div>
  )
}

function getSlotKey(item: (typeof GEAR)[number]): string {
  return item.category === 'tool' ? (item.skill ?? item.slot) : item.slot
}

function getEquippedIdForItem(
  equipment: Record<string, number>,
  item: (typeof GEAR)[number],
): number | null {
  const equippedId = getEquippedItemId(equipment, item.slot)
  if (item.category === 'tool' && equippedId !== null) {
    return TOOL_IDS_BY_SKILL[item.skill ?? '']?.has(equippedId) ? equippedId : null
  }
  return equippedId
}

function SlotLabel(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// If the weapon slot has a tool equipped, label it by the tool's skill rather
// than "Weapon" — a pickaxe in your mainhand isn't a weapon.
function getEquippedSlotLabel(key: string, equippedId: number | null): string {
  if (key === 'weapon' && equippedId !== null) {
    for (const [skill, ids] of Object.entries(TOOL_IDS_BY_SKILL)) {
      if (ids.has(equippedId)) return SlotLabel(skill)
    }
  }
  return SlotLabel(key)
}

function EmptySlotIcon() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded border border-dashed border-slate-600">
      <span className="text-slate-600 text-xs">—</span>
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
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const { data: profile, isLoading, isError } = usePlayerProfile(account.username)
  const { data: marketPrices } = useMarketPrices()
  const ownedIds = useOwnedItemsStore((s) => s.ownedByAccount[slot])

  if (!account.username) {
    return (
      <EmptyState>
        No account set for this slot.{' '}
        <Link to="/" className="font-medium text-gray-300 underline">
          Add one on the Dashboard
        </Link>
        .
      </EmptyState>
    )
  }
  if (isLoading) return <CardRowSkeletonList count={6} />
  if (isError) return <ErrorMessage>Couldn't find a player named "{account.username}".</ErrorMessage>
  if (!profile || !marketPrices) return null

  const isCombatRole = account.role === 'main'
  const gearList = isCombatRole
    ? COMBAT_GEAR
    : [...BIS_TOOL_GEAR].sort(
        (a, b) => (profile.skills[b.skill ?? '']?.level ?? 0) - (profile.skills[a.skill ?? '']?.level ?? 0),
      )

  // Search equipped gear list first, then BiS tools — so clicking a tool in
  // the self-reported section works even on combat-role accounts where gearList
  // is COMBAT_GEAR and contains no tools.
  const selectedItem = selectedKey
    ? (gearList.find((g) => getSlotKey(g) === selectedKey) ?? BIS_TOOL_GEAR.find((g) => getSlotKey(g) === selectedKey) ?? null)
    : null
  const selectedCurrentId = selectedItem ? getEquippedIdForItem(profile.equipment, selectedItem) : null

  return (
    <div className="space-y-4">
      <p className="text-xs uppercase text-gray-500">
        {isCombatRole ? 'Combat loadout' : 'Skilling tools'} · role: {account.role}
      </p>

      {selectedItem ? (
        <GearUpgradeCard
          bisItem={selectedItem}
          currentItemId={selectedCurrentId}
          marketPrices={marketPrices}
          slot={slot}
        />
      ) : (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-600 py-6 text-sm text-slate-500">
          Select a slot below to see upgrade info
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {gearList.map((item) => {
          const key = getSlotKey(item)
          const equippedId = getEquippedIdForItem(profile.equipment, item)
          const isBis = equippedId === item.id
          const hasEquipped = equippedId !== null
          const isSelected = selectedKey === key

          return (
            <button
              key={item.id}
              type="button"
              title={SlotLabel(key)}
              onClick={() => setSelectedKey(isSelected ? null : key)}
              className={`flex flex-col items-center gap-1.5 rounded-lg border p-2 text-center transition-colors ${
                isSelected
                  ? 'border-amber-400/60 bg-slate-700 ring-1 ring-amber-400/20'
                  : 'border-slate-700 bg-slate-800 hover:border-slate-500 hover:bg-slate-750'
              }`}
            >
              <div className="relative">
                {hasEquipped ? (
                  <ItemIcon
                    itemId={equippedId}
                    size={32}
                    fallback={
                      <div className="flex h-8 w-8 items-center justify-center rounded border border-slate-500 bg-slate-700">
                        <span className="text-xs text-slate-400">?</span>
                      </div>
                    }
                  />
                ) : (
                  <EmptySlotIcon />
                )}
                {isBis && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-400" title="BiS equipped" />
                )}
                {!isBis && hasEquipped && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-400" title="Upgrade available" />
                )}
              </div>
              <span className="w-full truncate text-xs text-gray-400">{getEquippedSlotLabel(key, equippedId)}</span>
            </button>
          )
        })}
      </div>

      {(() => {
        const reportedTools = BIS_TOOL_GEAR
          .map((item) => ({ item, ownedTier: GEAR.filter((g) => g.category === 'tool' && g.skill === item.skill).find((g) => ownedIds.includes(g.id)) ?? null }))
          .filter(({ ownedTier }) => ownedTier !== null) as { item: typeof gearList[number]; ownedTier: typeof GEAR[number] }[]

        if (reportedTools.length === 0) return (
          <div>
            <p className="mb-2 text-xs uppercase text-gray-500">Self-reported tools</p>
            <p className="text-xs text-slate-500">
              No tools marked as owned yet. Set them in{' '}
              <Link to="/" className="underline text-slate-400">Self-reported gear on the Dashboard</Link>.
            </p>
          </div>
        )

        return (
          <div>
            <p className="mb-2 text-xs uppercase text-gray-500">Self-reported tools</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {reportedTools.map(({ item, ownedTier }) => {
                const key = getSlotKey(item)
                const isSelected = selectedKey === key
                const isBis = ownedTier.id === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    title={SlotLabel(key)}
                    onClick={() => setSelectedKey(isSelected ? null : key)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-2 text-center transition-colors ${
                      isSelected
                        ? 'border-amber-400/60 bg-slate-700 ring-1 ring-amber-400/20'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-500 hover:bg-slate-750'
                    }`}
                  >
                    <div className="relative">
                      <ItemIcon
                        itemId={ownedTier.id}
                        size={32}
                        fallback={
                          <div className="flex h-8 w-8 items-center justify-center rounded border border-slate-500 bg-slate-700">
                            <span className="text-xs text-slate-400">?</span>
                          </div>
                        }
                      />
                      {isBis ? (
                        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-400" title="BiS owned" />
                      ) : (
                        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-400" title="Upgrade available" />
                      )}
                    </div>
                    <span className="w-full truncate text-xs text-gray-400">{SlotLabel(key)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })()}

    </div>
  )
}
