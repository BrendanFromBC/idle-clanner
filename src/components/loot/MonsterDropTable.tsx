import type { MonsterDefinition } from '../../data/monsters'
import { ITEMS_BY_ID } from '../../data/items'
import { GEAR } from '../../data/gear'
import { toDisplayName } from '../../utils/formatGold'
import { getWeaknessLabel } from '../../utils/combatStyle'

const BIS_WEAPON = GEAR.find((g) => g.slot === 'weapon')

export function MonsterDropTable({ monster }: { monster: MonsterDefinition }) {
  const drops = [...monster.drops].sort((a, b) => b.dropRate - a.dropRate)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          {toDisplayName(monster.name)}
          {monster.isBoss && (
            <span className="ml-2 rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              Boss
            </span>
          )}
        </h3>
        <span className="text-xs text-gray-400">Combat level {monster.combatLevelRequirement}</span>
      </div>

      <div className="rounded border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
        <p className="mb-2 text-gray-400">
          Raw combat stats — we can't compute an accurate kills/hr or DPS number (the wiki's own
          formula is outdated and the real one is locked behind an in-game premium panel), so this
          is for comparing by eye, not a calculated estimate.
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
          <Stat label="Health" value={monster.health} />
          <Stat label="Defence" value={monster.defenceBonus} />
          <Stat label="Archery def." value={monster.archeryDefenceBonus} />
          <Stat label="Magic def." value={monster.magicDefenceBonus} />
          <Stat label="Weak to" value={getWeaknessLabel(monster.attackStyleWeakness)} />
          {BIS_WEAPON && (
            <>
              <Stat label="Your weapon str." value={BIS_WEAPON.stats.StrengthBonus ?? 0} />
              <Stat label="Your weapon acc." value={BIS_WEAPON.stats.AccuracyBonus ?? 0} />
              <Stat label="Attack interval" value={`${BIS_WEAPON.attackInterval}ms`} />
            </>
          )}
        </div>
      </div>

      <div className="space-y-1">
        {drops.map((drop) => {
          const item = ITEMS_BY_ID.get(drop.itemId)
          return (
            <div
              key={drop.itemId}
              className="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <span className="text-gray-900">{item?.displayName ?? `Item #${drop.itemId}`}</span>
              <span className="text-gray-500">
                {drop.quantityMin > 0 && `${drop.quantityMin}-${drop.quantityMax} · `}
                {(drop.dropRate * 100).toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-gray-400">{label}</div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  )
}
