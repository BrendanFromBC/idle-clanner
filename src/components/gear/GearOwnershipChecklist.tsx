import { GEAR } from '../../data/gear'
import { useOwnedItemsStore, type AccountSlotKey } from '../../store/ownedItemsStore'

const COMBAT_GEAR = GEAR.filter((g) => g.category === 'combat')
const TOOL_GEAR = GEAR.filter((g) => g.category === 'tool')
const TOOL_SKILLS = [...new Set(TOOL_GEAR.map((g) => g.skill!))]

// Self-contained: only needs a slot to read/write. No dependency on player
// profile, role, or page layout — safe to drop anywhere (Dashboard now,
// wherever the redesign wants it later).
export function GearOwnershipChecklist({ slot, title }: { slot: AccountSlotKey; title?: string }) {
  const ownedIds = useOwnedItemsStore((s) => s.ownedByAccount[slot])
  const setOwned = useOwnedItemsStore((s) => s.setOwned)
  const setOwnedInGroup = useOwnedItemsStore((s) => s.setOwnedInGroup)

  const totalGroups = COMBAT_GEAR.length + TOOL_SKILLS.length
  const ownedGroups =
    COMBAT_GEAR.filter((g) => ownedIds.includes(g.id)).length +
    TOOL_SKILLS.filter((skill) => TOOL_GEAR.some((g) => g.skill === skill && ownedIds.includes(g.id))).length

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">{title ?? 'Gear ownership'}</h4>
        <span className="text-xs text-gray-400">
          {ownedGroups}/{totalGroups} marked owned
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="mb-1 text-xs uppercase text-gray-400">Combat</p>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {COMBAT_GEAR.map((item) => (
              <label key={item.id} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={ownedIds.includes(item.id)}
                  onChange={(e) => setOwned(slot, item.id, e.target.checked)}
                />
                {item.displayName}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase text-gray-400">Tools — select the tier you own</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {TOOL_SKILLS.map((skill) => {
              const tiers = TOOL_GEAR.filter((g) => g.skill === skill).sort((a, b) => a.tier - b.tier)
              const groupItemIds = tiers.map((t) => t.id)
              const ownedTierId = tiers.find((t) => ownedIds.includes(t.id))?.id ?? ''

              return (
                <label key={skill} className="flex items-center justify-between gap-2 text-sm text-gray-700">
                  <span className="capitalize">{skill}</span>
                  <select
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900"
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
