import { useMemo, useState } from 'react'
import { MONSTERS } from '../data/monsters'
import { ITEMS } from '../data/items'
import { MonsterDropTable } from '../components/loot/MonsterDropTable'
import { ItemDropSources } from '../components/loot/ItemDropSources'
import { toDisplayName } from '../utils/formatGold'

const SORTED_MONSTERS = [...MONSTERS].sort((a, b) => a.name.localeCompare(b.name))

export function LootPage() {
  const [mode, setMode] = useState<'monster' | 'item'>('monster')

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <h2 className="text-xl font-semibold text-gray-900">Loot Odds</h2>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setMode('monster')}
          className={`px-3 py-2 text-sm font-medium ${
            mode === 'monster' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500'
          }`}
        >
          By monster
        </button>
        <button
          type="button"
          onClick={() => setMode('item')}
          className={`px-3 py-2 text-sm font-medium ${
            mode === 'item' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500'
          }`}
        >
          Best monster for an item
        </button>
      </div>

      {mode === 'monster' ? <MonsterBrowser /> : <ItemReverseLookup />}
    </div>
  )
}

function MonsterBrowser() {
  const [selectedId, setSelectedId] = useState<number | null>(SORTED_MONSTERS[0]?.id ?? null)
  const monster = MONSTERS.find((m) => m.id === selectedId)

  return (
    <div className="space-y-4">
      <select
        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
        value={selectedId ?? ''}
        onChange={(e) => setSelectedId(Number(e.target.value))}
      >
        {SORTED_MONSTERS.map((m) => (
          <option key={m.id} value={m.id}>
            {toDisplayName(m.name)}
            {m.isBoss ? ' (Boss)' : ''}
          </option>
        ))}
      </select>
      {monster && <MonsterDropTable monster={monster} />}
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
        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
      />

      {!selectedItem && matches.length > 0 && (
        <div className="space-y-1">
          {matches.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedItemId(item.id)}
              className="block w-full rounded border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
            >
              {item.displayName}
            </button>
          ))}
        </div>
      )}

      {selectedItem && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{selectedItem.displayName}</h3>
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
