import type { MonsterDefinition } from '../../data/monsters'
import { ITEMS_BY_ID } from '../../data/items'
import { toDisplayName } from '../../utils/formatGold'
import { getWeaknessLabel } from '../../utils/combatStyle'
import { getAreaLabel } from '../../utils/monsterAreas'
import { getKillEstimate, type CombatLoadout } from '../../utils/combatCalc'
import { ItemIcon, MonsterIcon } from '../ui/Icon'

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
        <h3 className="flex items-center gap-2 font-semibold text-gray-100">
          <MonsterIcon monsterId={monster.id} />
          {toDisplayName(monster.name)}
          {monster.isBoss && (
            <span className="ml-2 rounded bg-rose-950/60 px-2 py-0.5 text-xs font-medium text-rose-400">
              Boss
            </span>
          )}
        </h3>
        <span className="text-xs text-gray-400">
          {getAreaLabel(monster.areaId)} · Combat level {monster.combatLevelRequirement}
        </span>
      </div>

      <div className="rounded border border-slate-700 bg-slate-900 p-3 text-xs text-gray-400">
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
                value={estimate.killsPerHour !== null ? estimate.killsPerHour.toFixed(2) : 'too tanky'}
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
          const avgQty = drop.quantityMin > 0 ? (drop.quantityMin + drop.quantityMax) / 2 : 1
          const perHour = estimate?.killsPerHour ? estimate.killsPerHour * drop.dropRate * avgQty : null
          return (
            <div
              key={drop.itemId}
              className="flex items-center justify-between rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2 text-gray-100">
                <ItemIcon itemId={drop.itemId} />
                {item?.displayName ?? `Item #${drop.itemId}`}
                {drop.quantityMin > 0 && (
                  <span className="text-gray-400"> ({drop.quantityMin}-{drop.quantityMax})</span>
                )}
              </span>
              <span className="text-gray-500">
                {(drop.dropRate * 100).toFixed(2)}%
                {perHour !== null && (
                  <span className="text-amber-400"> · ~{perHour.toFixed(2)}/hr</span>
                )}
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
      <div className="font-medium text-gray-100">{value}</div>
    </div>
  )
}
