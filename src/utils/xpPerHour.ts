import type { ActivityDefinition } from '../data/activities'
import type { PlayerProfile } from '../types/player'
import { ITEMS_BY_ID } from '../data/items'
import { SKILL_NAME_TO_ID } from './skillIds'

// All raw equipment slots that can carry a SkillBoost — tools, capes, and
// skilling armour (head/body/legs). Jewellery/amulet boosts come from
// profile.enchantmentBoosts instead (the API gives us the pre-summed total).
const XP_BOOST_SLOTS = ['rightHand', 'cape', 'head', 'body', 'legs', 'boots', 'gloves', 'belt']

export interface XpBoostBreakdown {
  toolBoost: number        // from equipped tool (rightHand)
  capeBoost: number        // from equipped cape
  armourBoost: number      // sum from head/body/legs/boots/gloves/belt
  enchantmentBoost: number // from profile.enchantmentBoosts (jewelry, pre-summed by API)
  totalBoost: number       // sum of all above
}

export function getXpBoostForSkill(
  skillName: string,
  profile: PlayerProfile,
): XpBoostBreakdown {
  const skillId = SKILL_NAME_TO_ID[skillName.toLowerCase()]

  let toolBoost = 0
  let capeBoost = 0
  let armourBoost = 0

  for (const slot of XP_BOOST_SLOTS) {
    const itemId = profile.equipment[slot]
    if (!itemId) continue
    const item = ITEMS_BY_ID.get(itemId)
    if (!item || item.skillBoostSkill !== skillId || item.skillBoostPercentage === 0) continue

    if (slot === 'rightHand') toolBoost += item.skillBoostPercentage
    else if (slot === 'cape') capeBoost += item.skillBoostPercentage
    else armourBoost += item.skillBoostPercentage
  }

  const enchantmentBoost = profile.enchantmentBoosts[skillName.toLowerCase()] ?? 0
  const totalBoost = toolBoost + capeBoost + armourBoost + enchantmentBoost

  return { toolBoost, capeBoost, armourBoost, enchantmentBoost, totalBoost }
}

export interface RankedActivity {
  activity: ActivityDefinition
  baseXpPerHour: number
  boostedXpPerHour: number
  boost: XpBoostBreakdown
  // null if any input or output price is missing from market data
  goldCostPerHour: number | null
  // XP per gold spent; null if goldCostPerHour is null or <= 0
  xpPerGold: number | null
}

export function rankActivitiesForSkill(
  skillKey: string,
  profile: PlayerProfile,
  activities: ActivityDefinition[],
  marketPrices: Map<number, { lowestSellPrice: number; highestBuyPrice: number; lowestPriceVolume: number; highestPriceVolume: number }>,
  playerLevel: number,
): RankedActivity[] {
  const skillName = skillKey.toLowerCase()
  const boost = getXpBoostForSkill(skillName, profile)

  return activities
    .filter((a) => a.skillKey.toLowerCase() === skillName && a.levelRequired <= playerLevel)
    .map((activity) => {
      const baseXpPerHour = activity.xpPerAction * activity.baseActionsPerHour
      const boostedXpPerHour = baseXpPerHour * (1 + boost.totalBoost / 100)

      // Net gold cost/hr: inputs cost money (buy at lowestSellPrice), outputs
      // earn money (sell at highestBuyPrice). Negative = net profit.
      let goldCostPerHour: number | null = 0
      for (const { itemId, quantity } of activity.inputItems) {
        const price = marketPrices.get(itemId)
        if (!price || price.lowestSellPrice === 0) { goldCostPerHour = null; break }
        goldCostPerHour += price.lowestSellPrice * quantity * activity.baseActionsPerHour
      }
      if (goldCostPerHour !== null) {
        for (const { itemId, quantity } of activity.outputItems) {
          const price = marketPrices.get(itemId)
          if (!price || price.highestBuyPrice === 0) { goldCostPerHour = null; break }
          goldCostPerHour -= price.highestBuyPrice * quantity * activity.baseActionsPerHour
        }
      }

      const xpPerGold =
        goldCostPerHour !== null && goldCostPerHour > 0
          ? boostedXpPerHour / goldCostPerHour
          : null

      return { activity, baseXpPerHour, boostedXpPerHour, boost, goldCostPerHour, xpPerGold }
    })
    .sort((a, b) => b.boostedXpPerHour - a.boostedXpPerHour)
}

// ItemCreation is an internal game grouping, not a real player-facing skill.
const EXCLUDED_SKILL_KEYS = new Set(['ItemCreation'])

export function getAllSkills(activities: ActivityDefinition[]): string[] {
  return [...new Set(activities.map((a) => a.skillKey))]
    .filter((k) => !EXCLUDED_SKILL_KEYS.has(k))
    .sort()
}
