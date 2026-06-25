import { MONSTERS } from '../../data/monsters'
import { toDisplayName } from '../../utils/formatGold'
import { MonsterIcon } from '../ui/Icon'
import { EmptyState } from '../ui/EmptyState'
import { getKillEstimate, type CombatLoadout } from '../../utils/combatCalc'

export function ItemDropSources({ itemId, loadout }: { itemId: number; loadout: CombatLoadout | null }) {
  const sources = MONSTERS.flatMap((monster) => {
    const drop = monster.drops.find((d) => d.itemId === itemId)
    if (!drop) return []
    const estimate = loadout ? getKillEstimate(loadout, monster) : null
    const avgQty = drop.quantityMin > 0 ? (drop.quantityMin + drop.quantityMax) / 2 : 1
    const perHour = estimate?.killsPerHour ? estimate.killsPerHour * drop.dropRate * avgQty : null
    return [{ monster, drop, perHour }]
  }).sort((a, b) => {
    if (a.perHour !== null && b.perHour !== null) return b.perHour - a.perHour
    if (a.perHour !== null) return -1
    if (b.perHour !== null) return 1
    return b.drop.dropRate - a.drop.dropRate
  })

  if (sources.length === 0) {
    return <EmptyState>No monster in our data drops this item.</EmptyState>
  }

  return (
    <div className="space-y-1">
      {sources.map(({ monster, drop, perHour }) => (
          <div
            key={monster.id}
            className="flex items-center justify-between rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
          >
            <span className="flex items-center gap-2 text-gray-100">
              <MonsterIcon monsterId={monster.id} />
              {toDisplayName(monster.name)}
              {monster.isBoss && <span className="ml-2 text-xs text-rose-400">Boss</span>}
              {drop.quantityMin > 0 && (
                <span className="text-gray-400">({drop.quantityMin}-{drop.quantityMax})</span>
              )}
            </span>
            <span className="text-gray-500">
              {(drop.dropRate * 100).toFixed(2)}%
              {perHour !== null && (
                <span className="text-amber-400"> · ~{perHour.toFixed(2)}/hr</span>
              )}
            </span>
          </div>
      ))}
    </div>
  )
}
