import { MONSTERS } from '../../data/monsters'
import { toDisplayName } from '../../utils/formatGold'
import { MonsterIcon } from '../ui/Icon'
import { EmptyState } from '../ui/EmptyState'

export function ItemDropSources({ itemId }: { itemId: number }) {
  const sources = MONSTERS.flatMap((monster) => {
    const drop = monster.drops.find((d) => d.itemId === itemId)
    return drop ? [{ monster, drop }] : []
  }).sort((a, b) => b.drop.dropRate - a.drop.dropRate)

  if (sources.length === 0) {
    return <EmptyState>No monster in our data drops this item.</EmptyState>
  }

  return (
    <div className="space-y-1">
      {sources.map(({ monster, drop }) => (
        <div
          key={monster.id}
          className="flex items-center justify-between rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
        >
          <span className="flex items-center gap-2 text-gray-100">
            <MonsterIcon monsterId={monster.id} />
            {toDisplayName(monster.name)}
            {monster.isBoss && <span className="ml-2 text-xs text-rose-400">Boss</span>}
          </span>
          <span className="text-gray-500">
            {drop.quantityMin > 0 && `${drop.quantityMin}-${drop.quantityMax} · `}
            {(drop.dropRate * 100).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  )
}
