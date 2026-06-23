import type { MonsterDefinition } from '../../data/monsters'
import { ITEMS_BY_ID } from '../../data/items'
import { toDisplayName, formatGold } from '../../utils/formatGold'
import { getWeaknessLabel } from '../../utils/combatStyle'
import { getAreaLabel } from '../../utils/monsterAreas'
import { getKillEstimate, type CombatLoadout } from '../../utils/combatCalc'

export function MonsterDropTable({
  monster,
  loadout,
}: {
  monster: MonsterDefinition
  loadout: CombatLoadout | null
}) {
  const drops = [...monster.drops].sort((a, b) => b.dropRate - a.dropRate)
  const estimate = loadout ? getKillEstimate(loadout, monster) : null

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
        <span className="text-xs text-gray-400">
          {getAreaLabel(monster.areaId)} · Combat level {monster.combatLevelRequirement}
        </span>
      </div>

      <div className="rounded border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
        {estimate ? (
          <>
            <p className="mb-2 text-gray-400">
              Melee estimate from your equipped gear. Hit chance and max hit are each individually
              checked against real Damage Calcs panel readings (hit chance: fitted, ±2-3 percentage
              points; max hit: confirmed exact). Kills/hr combines both with a standard
              expected-damage model — it hasn't been checked against an actual observed kill rate,
              so treat it as a reasonable estimate, not a confirmed number.
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
              <Stat label="Weak to" value={getWeaknessLabel(monster.attackStyleWeakness)} />
              <Stat label="Hit chance" value={`${(estimate.hitChance * 100).toFixed(1)}%`} />
              <Stat label="Max hit" value={estimate.maxHit} />
              <Stat
                label="Kills/hr"
                value={estimate.killsPerHour !== null ? formatGold(estimate.killsPerHour) : 'too tanky'}
              />
            </div>
          </>
        ) : (
          <>
            <p className="mb-2 text-gray-400">
              No melee weapon equipped on this account (or no account selected) — showing raw stats
              only. Archery/magic kills/hr aren't supported yet, only melee has been validated
              against real test data.
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
              <Stat label="Health" value={monster.health} />
              <Stat label="Defence" value={monster.defenceBonus} />
              <Stat label="Archery def." value={monster.archeryDefenceBonus} />
              <Stat label="Magic def." value={monster.magicDefenceBonus} />
              <Stat label="Weak to" value={getWeaknessLabel(monster.attackStyleWeakness)} />
            </div>
          </>
        )}
      </div>

      <div className="space-y-1">
        {drops.map((drop) => {
          const item = ITEMS_BY_ID.get(drop.itemId)
          const perHour = estimate?.killsPerHour ? estimate.killsPerHour * drop.dropRate : null
          return (
            <div
              key={drop.itemId}
              className="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <span className="text-gray-900">{item?.displayName ?? `Item #${drop.itemId}`}</span>
              <span className="text-gray-500">
                {drop.quantityMin > 0 && `${drop.quantityMin}-${drop.quantityMax} · `}
                {(drop.dropRate * 100).toFixed(2)}%
                {perHour !== null && ` · ~${perHour < 1 ? perHour.toFixed(2) : formatGold(perHour)}/hr`}
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
