import { useMemo, useState } from 'react'
import { MONSTERS } from '../data/monsters'
import { ITEMS } from '../data/items'
import { MonsterDropTable } from '../components/loot/MonsterDropTable'
import { ItemDropSources } from '../components/loot/ItemDropSources'
import { toDisplayName } from '../utils/formatGold'
import { getAreaLabel } from '../utils/monsterAreas'
import { useTeam } from '../hooks/useTeam'
import { usePlayerProfile } from '../hooks/usePlayerProfile'
import { getCombatLoadout, type CombatLoadout } from '../utils/combatCalc'
import { EmptyState } from '../components/ui/EmptyState'

const SORTED_MONSTERS = [...MONSTERS].sort(
  (a, b) => a.areaSortOrder - b.areaSortOrder || a.name.localeCompare(b.name),
)
const MONSTERS_BY_AREA = Object.entries(
  SORTED_MONSTERS.reduce<Record<string, typeof MONSTERS>>((acc, m) => {
    ;(acc[m.areaId] ??= []).push(m)
    return acc
  }, {}),
).sort(([, a], [, b]) => a[0].areaSortOrder - b[0].areaSortOrder)

const SLOTS = ['main', 'alt1', 'alt2'] as const
type Slot = (typeof SLOTS)[number]

export function LootPage() {
  const [mode, setMode] = useState<'monster' | 'item'>('monster')
  const team = useTeam()
  const configuredSlots = SLOTS.filter((slot) => team.accounts[slot].username)
  const [activeSlot, setActiveSlot] = useState<Slot>('main')
  const effectiveSlot = configuredSlots.includes(activeSlot) ? activeSlot : configuredSlots[0]
  const { data: profile } = usePlayerProfile(effectiveSlot ? team.accounts[effectiveSlot].username : null)

  const loadout: CombatLoadout | null = useMemo(() => {
    if (!profile) return null
    const attackLevel = profile.skills.attack?.level ?? 0
    const strengthLevel = profile.skills.strength?.level ?? 0
    return getCombatLoadout(profile.equipment, attackLevel, strengthLevel)
  }, [profile])

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-100">Loot Odds</h2>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto border-b border-slate-700">
          <button
            type="button"
            onClick={() => setMode('monster')}
            className={`whitespace-nowrap px-3 py-2 text-sm font-medium ${
              mode === 'monster' ? 'border-b-2 border-gray-100 text-gray-100' : 'text-gray-400'
            }`}
          >
            By monster
          </button>
          <button
            type="button"
            onClick={() => setMode('item')}
            className={`whitespace-nowrap px-3 py-2 text-sm font-medium ${
              mode === 'item' ? 'border-b-2 border-gray-100 text-gray-100' : 'text-gray-400'
            }`}
          >
            Best monster for an item
          </button>
        </div>
        {configuredSlots.length > 0 && (
          <select
            value={effectiveSlot}
            onChange={(e) => setActiveSlot(e.target.value as Slot)}
            className="rounded border border-slate-600 bg-slate-700 px-2 py-1 text-xs text-gray-100"
          >
            {configuredSlots.map((slot) => (
              <option key={slot} value={slot}>
                {team.accounts[slot].username}
              </option>
            ))}
          </select>
        )}
      </div>

      {mode === 'monster' ? <MonsterBrowser loadout={loadout} /> : <ItemReverseLookup />}
    </div>
  )
}

function MonsterBrowser({ loadout }: { loadout: CombatLoadout | null }) {
  const [selectedId, setSelectedId] = useState<number | null>(SORTED_MONSTERS[0]?.id ?? null)
  const monster = MONSTERS.find((m) => m.id === selectedId)

  return (
    <div className="space-y-4">
      <select
        className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-gray-100"
        value={selectedId ?? ''}
        onChange={(e) => setSelectedId(Number(e.target.value))}
      >
        {MONSTERS_BY_AREA.map(([areaId, areaMonsters]) => (
          <optgroup key={areaId} label={getAreaLabel(areaId)}>
            {areaMonsters.map((m) => (
              <option key={m.id} value={m.id}>
                {toDisplayName(m.name)}
                {m.isBoss ? ' (Boss)' : ''}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {monster && <MonsterDropTable monster={monster} loadout={loadout} />}
    </div>
  )
}

function ItemReverseLookup() {
  const [search, setSearch] = useState('')

  const matches = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return []
    return ITEMS.filter((i) => i.displayName.toLowerCase().includes(query)).slice(0, 20)
  }, [search])

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const selectedItem = ITEMS.find((i) => i.id === selectedItemId)

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search for an item…"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setSelectedItemId(null)
        }}
        className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-gray-100"
      />

      {!selectedItem && search.trim().length > 0 && matches.length === 0 && (
        <EmptyState>No items match "{search}".</EmptyState>
      )}

      {!selectedItem && matches.length > 0 && (
        <div className="space-y-1">
          {matches.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedItemId(item.id)}
              className="block w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-left text-sm text-gray-100 hover:bg-slate-700"
            >
              {item.displayName}
            </button>
          ))}
        </div>
      )}

      {selectedItem && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-100">{selectedItem.displayName}</h3>
            <button
              type="button"
              onClick={() => setSelectedItemId(null)}
              className="text-xs text-gray-400 underline"
            >
              Change item
            </button>
          </div>
          <ItemDropSources itemId={selectedItem.id} />
        </div>
      )}
    </div>
  )
}
