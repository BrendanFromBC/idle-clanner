// Converts a raw player upgrade key (camelCase, snake_case, or kebab-case)
// to a human-readable label.
export function formatUpgradeName(key: string): string {
  let s = key.replace(/^upgrade_/, '')
  s = s.replace(/([a-z])([A-Z])/g, '$1 $2')
  s = s.replace(/[_-]/g, ' ')
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

export interface ClanUpgradeInfo {
  type: number
  name: string
  effect: string
  cost: number        // clan credits (0 = free / item-gated)
  repeatable?: number // max purchase count if repeatable
  // Priority 1 = highest. priorityNote is for agents/tooling — never rendered in the app.
  priority: number
  priorityNote: string
}

// Full clan upgrade catalog, ordered by assessed priority (ascending = higher priority first).
// Source: idleclans.wiki/w/Clan (Clan upgrades table) + /api/Configuration/game-data, 2026-06-24.
// priorityNote rationale is intentionally kept here (not in UI) for future agent/tooling use.
export const CLAN_UPGRADE_LIST: ClanUpgradeInfo[] = [
  {
    type: 31, name: 'No Time to Waste', cost: 5000, priority: 1,
    effect: 'Removes the cooldown from gatherer events',
    priorityNote: 'Immediately multiplies daily event throughput — compound value from day 1. Cheapest-per-impact upgrade in the game.',
  },
  {
    type: 33, name: 'Gotta Get Crafting', cost: 5000, priority: 2,
    effect: 'Removes the cooldown from crafting events',
    priorityNote: 'Same logic as No Time to Waste but for crafting — same cost, same compounding benefit.',
  },
  {
    type: 32, name: 'More Crafting', cost: 5000, priority: 3,
    effect: '+1 crafting event completion daily',
    priorityNote: 'Pairs with Gotta Get Crafting. Crafting events are the primary crafting resource source.',
  },
  {
    type: 30, name: 'More Gathering', cost: 10000, priority: 4,
    effect: '+2 gatherer event completions daily',
    priorityNote: 'Gatherer events are the main credit/resource engine for most clans. +2 is a big delta.',
  },
  {
    type: 35, name: 'Laid-Back Events', cost: 10000, priority: 5,
    effect: 'Auto-starts next clan event when current one ends (if not on cooldown)',
    priorityNote: 'Pure passive QoL — captures runs that would be missed while offline. Effectively free throughput.',
  },
  {
    type: 51, name: "Keep 'em Coming", cost: 5000, priority: 6,
    effect: 'Automatically restarts clan boss fights',
    priorityNote: 'No skill requirement and very cheap. If the clan runs any boss, this is free passive kills.',
  },
  {
    type: 19, name: 'Group Effort', cost: 5000, priority: 7,
    effect: 'Plundering success rates +10%',
    priorityNote: 'Cheap, always-on bonus. High value if any team member does plundering.',
  },
  {
    type: 17, name: 'Strength in Numbers', cost: 12500, priority: 8,
    effect: '+10% combat XP when fighting with clan members',
    priorityNote: 'Solid XP multiplier for combat. Disabled for ironman. Worth it for XP-focused mains.',
  },
  {
    type: 23, name: 'Gatherers', cost: 22500, priority: 9,
    effect: 'Gathering skills 5% faster',
    priorityNote: 'Permanent passive speed boost across all gathering skills — compounds across all alts.',
  },
  {
    type: 16, name: 'Get Up!', cost: 25000, priority: 10,
    effect: 'Enemy respawn timers reduced by 50%',
    priorityNote: 'Halves downtime between kills — meaningful kills/hr increase for active PvM accounts.',
  },
  {
    type: 21, name: 'Yoink', cost: 17500, priority: 11,
    effect: '15% chance to not consume a boss key on entry',
    priorityNote: 'Long-term key savings. Value scales directly with boss key prices on the market.',
  },
  {
    type: 18, name: 'Potioneering', cost: 30000, priority: 12,
    effect: 'Potion effects last 25% longer',
    priorityNote: 'High value if the clan uses potions heavily. Lower priority if potion usage is minimal.',
  },
  {
    type: 22, name: 'Bullseye', cost: 20000, priority: 13,
    effect: 'Arrows gain a permanent 20% boost in combat',
    priorityNote: 'Archery-specific. Only meaningful if clan members regularly use archery combat.',
  },
  {
    type: 20, name: "An Offer They Can't Refuse", cost: 50000, priority: 14,
    effect: 'All NPC sales yield 10% more gold',
    priorityNote: 'Broad benefit — every member selling to shops gains 10%. High cost but no skill gate.',
  },
  {
    type: 37, name: 'Turkey Chasers', cost: 10000, priority: 15,
    effect: '+1 extra combat event completion daily',
    priorityNote: 'Likely seasonal/combat events. Lower priority unless the clan actively runs combat events.',
  },
  {
    type: 38, name: 'Line the Turkeys Up', cost: 5000, priority: 16,
    effect: 'Removes cooldown from daily combat events',
    priorityNote: 'Pairs with Turkey Chasers. Only useful if combat events are actively run.',
  },
  {
    type: 52, name: 'Clan Boss Slayers', cost: 50000, priority: 17,
    effect: '+10% damage against clan bosses',
    priorityNote: 'Requires Spider fang, Spider wing, Spider jaw in clan vault. Defer until clan regularly clears bosses.',
  },
  {
    type: 65, name: 'Royal Extermination', cost: 0, repeatable: 20, priority: 18,
    effect: '+1% clan damage per tier against Exterminating enemies (up to ×20)',
    priorityNote: 'Free credit-wise but needs a rare item. Stacks to +20% — good late-game for exterminating runs.',
  },
  {
    type: 54, name: 'Ways of the Genie', cost: 250000, priority: 19,
    effect: 'Otherworldly essence effect increases from 30% to 72%',
    priorityNote: 'Transformative for essence users but extremely expensive. Late-game clans with regular essence access only.',
  },
]

// Derived lookup: type code → display name.
export const CLAN_UPGRADE_NAMES: Record<number, string> = Object.fromEntries(
  CLAN_UPGRADE_LIST.map((u) => [u.type, u.name])
)
