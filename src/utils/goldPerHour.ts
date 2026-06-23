import { ACTIVITIES, type ActivityDefinition } from '../data/activities'
import { ITEMS_BY_ID } from '../data/items'
import type { MarketPrice } from '../types/market'
import type { SkillData } from '../types/player'

function priceFor(itemId: number, marketPrices: MarketPrice[]) {
  return marketPrices.find((p) => p.itemId === itemId)
}

// Buying an input costs the lowest active sell price (the cheapest ask).
// Selling an output earns the highest active buy price (the best bid).
// Returns null when we don't have enough price data to trust the number —
// better to omit an activity than imply a profit that isn't real.
export function getActivityGoldPerHour(
  activity: ActivityDefinition,
  marketPrices: MarketPrice[],
): number | null {
  let costPerAction = 0
  for (const input of activity.inputItems) {
    const price = priceFor(input.itemId, marketPrices)
    if (!price || price.lowestPriceVolume === 0) return null
    costPerAction += price.lowestSellPrice * input.quantity
  }

  let revenuePerAction = 0
  for (const output of activity.outputItems) {
    const price = priceFor(output.itemId, marketPrices)
    if (!price || price.highestPriceVolume === 0) return null
    revenuePerAction += price.highestBuyPrice * output.quantity
  }

  if (activity.outputItems.length === 0) return null // nothing sellable produced (e.g. a pure XP task)

  return (revenuePerAction - costPerAction) * activity.baseActionsPerHour
}

export interface RankedActivity {
  activity: ActivityDefinition
  goldPerHour: number
}

export function rankActivitiesForSkills(
  skills: Record<string, SkillData>,
  marketPrices: MarketPrice[],
): RankedActivity[] {
  const ranked: RankedActivity[] = []
  for (const activity of ACTIVITIES) {
    const level = skills[activity.skillKey.toLowerCase()]?.level ?? 0
    if (level < activity.levelRequired) continue
    const goldPerHour = getActivityGoldPerHour(activity, marketPrices)
    if (goldPerHour === null) continue
    ranked.push({ activity, goldPerHour })
  }
  return ranked.sort((a, b) => b.goldPerHour - a.goldPerHour)
}

export interface NextUnlock {
  activity: ActivityDefinition
  goldPerHour: number
  levelsNeeded: number
}

// The nearest locked activity (by level) for this skill that would beat the
// player's current best unlocked gold/hr for that same skill.
export function getNextUnlock(
  skillKey: string,
  currentLevel: number,
  marketPrices: MarketPrice[],
): NextUnlock | null {
  const skillActivities = ACTIVITIES.filter((a) => a.skillKey === skillKey)

  let bestUnlocked = 0
  for (const activity of skillActivities) {
    if (activity.levelRequired > currentLevel) continue
    const gph = getActivityGoldPerHour(activity, marketPrices)
    if (gph !== null && gph > bestUnlocked) bestUnlocked = gph
  }

  const locked = skillActivities
    .filter((a) => a.levelRequired > currentLevel)
    .sort((a, b) => a.levelRequired - b.levelRequired)

  for (const activity of locked) {
    const gph = getActivityGoldPerHour(activity, marketPrices)
    if (gph !== null && gph > bestUnlocked) {
      return { activity, goldPerHour: gph, levelsNeeded: activity.levelRequired - currentLevel }
    }
  }
  return null
}

// ─── Ironman mode ────────────────────────────────────────────────────────
// Ironman accounts can't use the player market at all — not to sell outputs,
// and not to buy inputs. Outputs are valued at the local/NPC shop price
// instead (data/items.ts `baseValue`, only when `shopSellable`). Inputs
// can't be bought, so they have to be self-gathered by *some* account on the
// team — which costs time, not gold. We surface two numbers:
//   - fullPipelineGoldPerHour: revenue ÷ (this activity's time + time to
//     gather every input from scratch), i.e. the honest sustainable rate.
//   - materialsFreeGoldPerHour: revenue × this activity's own rate, ignoring
//     input time entirely — useful if the player is sitting on a stockpile.

export interface IronmanGoldPerHour {
  fullPipelineGoldPerHour: number | null
  materialsFreeGoldPerHour: number | null
}

function getShopValue(itemId: number): number | null {
  const item = ITEMS_BY_ID.get(itemId)
  if (!item || !item.shopSellable) return null
  return item.baseValue
}

// A "gather source" is a zero-input activity producing this item — we don't
// chase multi-step crafting chains (e.g. ore → bar → tool) to keep this
// tractable; only items obtainable in one direct gathering step are
// considered self-sufficient. Among eligible sources (team meets the level),
// the fastest output rate is used.
function findGatherSource(
  itemId: number,
  teamSkillLevels: Record<string, number>,
): { activity: ActivityDefinition; outputUnitsPerHour: number } | null {
  let best: { activity: ActivityDefinition; outputUnitsPerHour: number } | null = null
  for (const activity of ACTIVITIES) {
    if (activity.inputItems.length > 0) continue
    const output = activity.outputItems.find((o) => o.itemId === itemId)
    if (!output) continue
    const teamLevel = teamSkillLevels[activity.skillKey.toLowerCase()] ?? 0
    if (teamLevel < activity.levelRequired) continue
    const rate = output.quantity * activity.baseActionsPerHour
    if (!best || rate > best.outputUnitsPerHour) best = { activity, outputUnitsPerHour: rate }
  }
  return best
}

export function getIronmanGoldPerHour(
  activity: ActivityDefinition,
  teamSkillLevels: Record<string, number>,
): IronmanGoldPerHour {
  if (activity.outputItems.length === 0) {
    return { fullPipelineGoldPerHour: null, materialsFreeGoldPerHour: null }
  }

  let revenuePerAction = 0
  for (const output of activity.outputItems) {
    const value = getShopValue(output.itemId)
    if (value === null) return { fullPipelineGoldPerHour: null, materialsFreeGoldPerHour: null }
    revenuePerAction += value * output.quantity
  }

  const materialsFreeGoldPerHour = revenuePerAction * activity.baseActionsPerHour

  let totalHoursPerAction = 1 / activity.baseActionsPerHour
  for (const input of activity.inputItems) {
    const source = findGatherSource(input.itemId, teamSkillLevels)
    if (!source) return { fullPipelineGoldPerHour: null, materialsFreeGoldPerHour }
    totalHoursPerAction += input.quantity / source.outputUnitsPerHour
  }

  return {
    fullPipelineGoldPerHour: revenuePerAction / totalHoursPerAction,
    materialsFreeGoldPerHour,
  }
}

export interface RankedIronmanActivity {
  activity: ActivityDefinition
  fullPipelineGoldPerHour: number | null
  materialsFreeGoldPerHour: number | null
}

export function rankIronmanActivitiesForSkills(
  skills: Record<string, SkillData>,
  teamSkillLevels: Record<string, number>,
): RankedIronmanActivity[] {
  const ranked: RankedIronmanActivity[] = []
  for (const activity of ACTIVITIES) {
    const level = skills[activity.skillKey.toLowerCase()]?.level ?? 0
    if (level < activity.levelRequired) continue
    const result = getIronmanGoldPerHour(activity, teamSkillLevels)
    if (result.materialsFreeGoldPerHour === null) continue
    ranked.push({ activity, ...result })
  }
  // Sort by the honest sustainable rate when we have it; activities whose
  // inputs can't be self-gathered sink to the bottom (still shown, with
  // their materials-free number, but not treated as a real top pick).
  return ranked.sort((a, b) => {
    const aKey = a.fullPipelineGoldPerHour ?? -Infinity
    const bKey = b.fullPipelineGoldPerHour ?? -Infinity
    return bKey - aKey
  })
}

export interface IronmanNextUnlock {
  activity: ActivityDefinition
  fullPipelineGoldPerHour: number | null
  materialsFreeGoldPerHour: number
  levelsNeeded: number
}

export function getIronmanNextUnlock(
  skillKey: string,
  currentLevel: number,
  teamSkillLevels: Record<string, number>,
): IronmanNextUnlock | null {
  const skillActivities = ACTIVITIES.filter((a) => a.skillKey === skillKey)

  let bestUnlocked = 0
  for (const activity of skillActivities) {
    if (activity.levelRequired > currentLevel) continue
    const { fullPipelineGoldPerHour } = getIronmanGoldPerHour(activity, teamSkillLevels)
    if (fullPipelineGoldPerHour !== null && fullPipelineGoldPerHour > bestUnlocked) {
      bestUnlocked = fullPipelineGoldPerHour
    }
  }

  const locked = skillActivities
    .filter((a) => a.levelRequired > currentLevel)
    .sort((a, b) => a.levelRequired - b.levelRequired)

  for (const activity of locked) {
    const result = getIronmanGoldPerHour(activity, teamSkillLevels)
    if (result.fullPipelineGoldPerHour !== null && result.fullPipelineGoldPerHour > bestUnlocked) {
      return {
        activity,
        fullPipelineGoldPerHour: result.fullPipelineGoldPerHour,
        materialsFreeGoldPerHour: result.materialsFreeGoldPerHour ?? result.fullPipelineGoldPerHour,
        levelsNeeded: activity.levelRequired - currentLevel,
      }
    }
  }
  return null
}
