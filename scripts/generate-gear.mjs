// Builds src/data/gear.ts: a curated BiS gear/tool list. Run with:
//   node scripts/generate-gear.mjs
//
// The ITEM SELECTION below is curated from the wiki's "Best in slot gear"
// page (https://idleclans.wiki/w/Best_in_slot_gear) — that's the judgment
// call a generator can't make. Once an item is selected, its stats and
// level requirement are pulled straight from GET /api/Configuration/game-data
// (authoritative), not guessed.

const res = await fetch('https://query.idleclans.com/api/Configuration/game-data')
const raw = await res.text()
const cleaned = raw
  .replace(/ObjectId\("[a-f0-9]+"\)/g, 'null')
  .replace(/ISODate\("[^"]*"\)/g, 'null')
const data = JSON.parse(cleaned)
const itemsById = new Map(data.Items.Items.map((i) => [i.ItemId, i]))

// slot/category/skill are curated by hand from the wiki's section headers.
// Source: https://idleclans.wiki/w/Best_in_slot_gear (fetched 2026-06-22)
const CURATED = [
  // ── Combat (melee/slash training BiS) ──────────────────────────────────
  { itemId: 791, slot: 'weapon', category: 'combat' },
  { itemId: 922, slot: 'offhand', category: 'combat' },
  { itemId: 925, slot: 'helmet', category: 'combat' },
  { itemId: 923, slot: 'body', category: 'combat' },
  { itemId: 924, slot: 'legs', category: 'combat' },
  { itemId: 701, slot: 'boots', category: 'combat' },
  { itemId: 700, slot: 'gloves', category: 'combat' },
  { itemId: 527, slot: 'cape', category: 'combat' }, // Strength Cape Tier 4
  { itemId: 988, slot: 'belt', category: 'combat' }, // Silhenik's Lunar Belt
  { itemId: 426, slot: 'amulet', category: 'combat' }, // Diamond Amulet Enchanted
  { itemId: 425, slot: 'ring', category: 'combat' }, // Diamond Ring Enchanted
  { itemId: 788, slot: 'pet', category: 'combat' }, // Pet Melee Tier 8 ("Lil' fighter T8")

]

// Skilling tools: full 8-tier ladder per skill, not just the endgame item.
// Item naming is a clean `{tier}_{baseName}` pattern, verified against
// items.ts for every skill below before relying on it (see conversation
// history / commit notes — not assumed).
// Source: https://idleclans.wiki/w/Best_in_slot_gear for which base item is
// each skill's tool; the per-tier names are read directly from the API.
const TOOL_TIERS = ['normal', 'refined', 'great', 'elite', 'superior', 'outstanding', 'godlike', 'otherworldly']
const TOOL_BASE_NAME_BY_SKILL = {
  crafting: 'crafting_needle',
  woodcutting: 'hatchet',
  carpentry: 'saw',
  fishing: 'fishing_rod',
  cooking: 'cooking_pan',
  mining: 'pickaxe',
  smithing: 'hammer',
  foraging: 'secateurs',
  farming: 'rake',
  agility: 'jumping_rope',
  plundering: 'lockpicks',
  brewing: 'philosopher_stone',
  invocation: 'brush',
}

const itemsByName = new Map(data.Items.Items.map((i) => [i.Name, i]))

for (const [skill, baseName] of Object.entries(TOOL_BASE_NAME_BY_SKILL)) {
  TOOL_TIERS.forEach((tierName, i) => {
    const item = itemsByName.get(`${tierName}_${baseName}`)
    if (!item) throw new Error(`${tierName}_${baseName} not found in game-data`)
    CURATED.push({ itemId: item.ItemId, slot: 'tool', category: 'tool', skill, tierOverride: i + 1 })
  })
}

const STAT_FIELDS = [
  'StrengthBonus',
  'AccuracyBonus',
  'ArcheryAccuracyBonus',
  'ArcheryStrengthBonus',
  'MagicAccuracyBonus',
  'MagicStrengthBonus',
  'DefenceBonus',
  'ArcheryDefenceBonus',
  'MagicDefenceBonus',
]

const gear = CURATED.map(({ itemId, slot, category, skill, tierOverride }) => {
  const item = itemsById.get(itemId)
  if (!item) throw new Error(`itemId ${itemId} not found in game-data`)

  const stats = {}
  for (const field of STAT_FIELDS) {
    if (item[field]) stats[field] = item[field]
  }

  return {
    id: item.ItemId,
    name: item.Name,
    displayName: item.Name.split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' '),
    slot,
    category,
    skill: skill ?? null,
    stats,
    levelRequired: item.LevelRequirement?.Level ?? 0,
    // Combat items here are single-entry (endgame only, tier 5 = BiS).
    // Tool items carry their real ladder position (1 = Normal .. 8 = Otherworldly).
    tier: tierOverride ?? 5,
    acquisitionMethods: item.tradeable !== false ? [{ type: 'market' }] : [{ type: 'unknown' }],
    tradeable: !item.CanNotBeTraded,
    // Weapon-only fields (0/false for everything else). Raw codes, not
    // decoded — see monsters.ts's attackStyleWeakness note for why we're not
    // guessing the Style/WeaponClass mapping yet.
    attackInterval: item.AttackInterval ?? 0,
    style: item.Style ?? 0,
    weaponClass: item.WeaponClass ?? 0,
    extraBoostAgainstWeakEnemiesPercentage: item.ExtraBoostAgainstWeakEnemiesPercentage ?? 0,
    twoHanded: item.TwoHanded ?? false,
  }
})

const header = `// Curated BiS gear list. Item SELECTION is hand-picked from the wiki's
// "Best in slot gear" page (https://idleclans.wiki/w/Best_in_slot_gear,
// fetched 2026-06-22) — see scripts/generate-gear.mjs for the curated list
// and sourcing notes. Stats and level requirements are pulled from the live
// API (authoritative), not guessed.
//
// Scope: one BiS item per combat slot (melee/slash training, no tier ladder
// yet — TODO). Skilling tools DO have the full 8-tier ladder per skill
// (Normal..Otherworldly, tier 1-8), so getUpgradePath()/the ownership
// dropdown can work across the whole tool progression, not just BiS.
// TODO: boss-specific BiS (e.g. Astaroths Scimitar, Grimwark's Shield) and
// magic/archery training sets aren't covered — melee was chosen as the
// default/most common style.

export interface GearItem {
  id: number
  name: string
  displayName: string
  slot: string
  category: 'combat' | 'tool'
  skill: string | null
  stats: Record<string, number>
  levelRequired: number
  tier: number
  acquisitionMethods: { type: string }[]
  tradeable: boolean
  attackInterval: number
  style: number // raw API code, undecoded
  weaponClass: number // raw API code, undecoded
  extraBoostAgainstWeakEnemiesPercentage: number
  twoHanded: boolean
}

export const GEAR: GearItem[] = `

const fs = await import('node:fs/promises')
await fs.writeFile(
  new URL('../src/data/gear.ts', import.meta.url),
  header + JSON.stringify(gear, null, 2) + '\n',
)

console.log(`Wrote ${gear.length} gear items to src/data/gear.ts`)
