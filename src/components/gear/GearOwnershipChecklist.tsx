import { GEAR } from '../../data/gear'
import { ITEMS_BY_ID } from '../../data/items'
import { useOwnedItemsStore, type AccountSlotKey } from '../../store/ownedItemsStore'
import { usePlayerProfile } from '../../hooks/usePlayerProfile'
import { ItemIcon } from '../ui/Icon'

const TOOL_GEAR = GEAR.filter((g) => g.category === 'tool')
const TOOL_SKILLS = [...new Set(TOOL_GEAR.map((g) => g.skill!))]

// Live-equipped display, not self-report — the API actually exposes this
// (unlike inventory), so there's nothing to ask the player to track. Raw
// equipment slot keys verified against a real profile response, 2026-06-23
// (`ammunition`/`belt` in particular aren't in equipmentSlots.ts's curated
// GearSlot mapping, since that file only covers slots gear.ts curates BiS
// for — going straight to the raw API keys here instead).
const EQUIPPED_SLOTS: { label: string; rawSlot: string }[] = [
  { label: 'Pet', rawSlot: 'pet' },
  { label: 'Helmet', rawSlot: 'head' },
  { label: 'Cape', rawSlot: 'cape' },
  { label: 'Weapon', rawSlot: 'rightHand' },
  { label: 'Body', rawSlot: 'body' },
  { label: 'Off-hand', rawSlot: 'leftHand' },
  { label: 'Gloves', rawSlot: 'gloves' },
  { label: 'Legs', rawSlot: 'legs' },
  { label: 'Toolbelt', rawSlot: 'belt' },
  { label: 'Boots', rawSlot: 'boots' },
  { label: 'Ammo', rawSlot: 'ammunition' },
]

// Self-contained: only needs a slot (+ username, to look up live equipment)
// to read/write. No dependency on player role or page layout — safe to drop
// anywhere (Dashboard now, wherever the redesign wants it later).
export function GearOwnershipChecklist({
  slot,
  title,
  username,
}: {
  slot: AccountSlotKey
  title?: string
  username: string | null
}) {
  const ownedIds = useOwnedItemsStore((s) => s.ownedByAccount[slot])
  const setOwnedInGroup = useOwnedItemsStore((s) => s.setOwnedInGroup)
  const { data: profile } = usePlayerProfile(username)

  // Tools are still self-reported (mutually-exclusive tier per skill) — this
  // count only covers that now that Combat shows live-equipped data instead.
  const totalGroups = TOOL_SKILLS.length
  const ownedGroups = TOOL_SKILLS.filter((skill) =>
    TOOL_GEAR.some((g) => g.skill === skill && ownedIds.includes(g.id)),
  ).length

  return (
    <div className="rounded-lg border border-slate-600 bg-slate-800 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-100">{title ?? 'Gear ownership'}</h4>
        <span className="text-xs text-gray-400">
          {ownedGroups}/{totalGroups} marked owned
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="mb-1 text-xs uppercase text-gray-400">Equipped</p>
          <div className="grid grid-cols-3 gap-1">
            {EQUIPPED_SLOTS.map(({ label, rawSlot }) => {
              const itemId = profile?.equipment[rawSlot]
              const item = itemId !== undefined ? ITEMS_BY_ID.get(itemId) : undefined
              return (
                <div key={rawSlot} className="rounded border border-slate-700 px-2 py-1.5 text-xs">
                  <div className="text-gray-400">{label}</div>
                  {item ? (
                    <div className="mt-0.5 flex items-center gap-1">
                      <ItemIcon itemId={item.id} size={16} />
                      <span className="truncate text-gray-100" title={item.displayName}>
                        {item.displayName}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-0.5 text-slate-500">Empty</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase text-gray-400">Tools — select the tier you own</p>
          <div className="space-y-1">
            {TOOL_SKILLS.map((skill) => {
              const tiers = TOOL_GEAR.filter((g) => g.skill === skill).sort((a, b) => a.tier - b.tier)
              const groupItemIds = tiers.map((t) => t.id)
              const ownedTierId = tiers.find((t) => ownedIds.includes(t.id))?.id ?? ''

              return (
                <label key={skill} className="flex items-center justify-between gap-2 text-sm text-gray-300">
                  <span className="w-20 shrink-0 capitalize">{skill}</span>
                  <select
                    className="min-w-0 flex-1 rounded border border-slate-600 bg-slate-700 px-2 py-1 text-xs text-gray-100"
                    value={ownedTierId}
                    onChange={(e) => {
                      const itemId = e.target.value === '' ? null : Number(e.target.value)
                      setOwnedInGroup(slot, groupItemIds, itemId)
                    }}
                  >
                    <option value="">None</option>
                    {tiers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.displayName}
                      </option>
                    ))}
                  </select>
                </label>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
