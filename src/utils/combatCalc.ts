// Melee kills/hr calculator. Scope: MELEE ONLY (weapon style codes 1-4 —
// Stab/Slash/Pound/Crush). Archery/magic use the same augmented-accuracy
// formula per the wiki, but we have no test data for them — don't extend
// this without separately validating, the same way melee was validated.
//
// Hit chance: the wiki's own formula here is fitted/replaced, not used as
// documented — see the header note in src/utils/combatStyle.ts and the
// conversation history (2026-06-23) for the empirical derivation. Fitted
// against 10 real Damage-Calcs-panel readings (2 weapons × 5 monsters),
// mean error ~1.6 percentage points, max ~3.25. The exponent/coefficient
// below are curve-fit values, not necessarily the game's exact internal
// constants — treat the output as a close estimate, not a guarantee.
//
// Max hit and the weakness mechanics (20% defence reduction on hit chance,
// 20% max hit boost when matched) are the wiki's ORIGINAL formulas — these
// were independently confirmed exact against the same test data, no fitting
// needed.

import type { MonsterDefinition } from '../data/monsters'
import { ITEMS_BY_ID } from '../data/items'

const RESPAWN_SECONDS = 2.55

export interface CombatLoadout {
  strengthBonus: number
  accuracyBonus: number
  attackLevel: number
  strengthLevel: number
  weaponStyle: number // 0 = no weapon / not melee
  attackIntervalMs: number
}

// Sums StrengthBonus/AccuracyBonus across whatever's actually equipped
// (any item, not just curated gear.ts), and reads weapon style/speed from
// the rightHand slot. Returns null if nothing's equipped in rightHand, or
// it's not a melee weapon (style outside 1-4) — out of scope, see header.
export function getCombatLoadout(
  equipment: Record<string, number>,
  attackLevel: number,
  strengthLevel: number,
): CombatLoadout | null {
  const weaponId = equipment.rightHand
  if (weaponId === undefined) return null
  const weapon = ITEMS_BY_ID.get(weaponId)
  if (!weapon || weapon.style < 1 || weapon.style > 4) return null

  let strengthBonus = 0
  let accuracyBonus = 0
  for (const itemId of Object.values(equipment)) {
    const item = ITEMS_BY_ID.get(itemId)
    if (!item) continue
    strengthBonus += item.strengthBonus
    accuracyBonus += item.accuracyBonus
  }

  return {
    strengthBonus,
    accuracyBonus,
    attackLevel,
    strengthLevel,
    weaponStyle: weapon.style,
    attackIntervalMs: weapon.attackInterval,
  }
}

function augmented(stat: number, level: number): number {
  return (stat + 64) * (level + 8) / 10
}

export function getHitChance(loadout: CombatLoadout, monster: MonsterDefinition): number {
  const acc = augmented(loadout.accuracyBonus, loadout.attackLevel)
  let def = augmented(monster.defenceBonus, monster.defenceLevel)
  if (monster.attackStyleWeakness === loadout.weaponStyle) def *= 0.8
  // Fitted curve — see file header.
  return 1 / (1 + 1.08 * (def / acc) ** 2.52)
}

export function getMaxHit(loadout: CombatLoadout, monster: MonsterDefinition): number {
  const base = Math.floor(
    (loadout.strengthBonus / 8 +
      loadout.strengthLevel +
      13 +
      (loadout.strengthBonus * loadout.strengthLevel) / 64) /
      10,
  )
  const matched = monster.attackStyleWeakness === loadout.weaponStyle
  return matched ? Math.floor(base * 1.2) : base
}

export interface KillEstimate {
  hitChance: number
  maxHit: number
  killsPerHour: number | null // null if the loadout can't realistically kill it (DPS ~0)
}

export function getKillEstimate(loadout: CombatLoadout, monster: MonsterDefinition): KillEstimate {
  const hitChance = getHitChance(loadout, monster)
  const maxHit = getMaxHit(loadout, monster)
  const avgDamagePerHit = maxHit / 2 // damage is uniform 0..maxHit inclusive
  const attacksPerSecond = 1000 / loadout.attackIntervalMs
  const dps = attacksPerSecond * hitChance * avgDamagePerHit

  if (dps <= 0) return { hitChance, maxHit, killsPerHour: null }

  const timeToKillSeconds = monster.health / dps
  const totalSecondsPerKill = timeToKillSeconds + RESPAWN_SECONDS
  const killsPerHour = 3600 / totalSecondsPerKill

  return { hitChance, maxHit, killsPerHour }
}
