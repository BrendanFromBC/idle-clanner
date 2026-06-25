// Converts a raw player upgrade key (camelCase, snake_case, or kebab-case)
// to a human-readable label.
export function formatUpgradeName(key: string): string {
  let s = key.replace(/^upgrade_/, '')
  s = s.replace(/([a-z])([A-Z])/g, '$1 $2')
  s = s.replace(/[_-]/g, ' ')
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

// Clan upgrade type codes → display names.
// Source: GET /api/Configuration/game-data → ClanUpgrades.Items[].Type +
// TierDescriptionLocKeys, verified 2026-06-24.
export const CLAN_UPGRADE_NAMES: Record<number, string> = {
  16: 'Get Up',
  17: 'Strength in Numbers',
  18: 'Bigger Bottles',
  19: 'Group Effort',
  20: "An Offer They Can't Refuse",
  21: 'Yoink',
  22: 'Bullseye',
  23: 'Gatherers',
  30: 'Gatherer Event Completions',
  31: 'Gatherer Event Cooldown',
  32: 'Crafting Event Completions',
  33: 'Crafting Event Cooldown',
  35: 'Easy Events',
  37: 'Turkey Chasers',
  38: 'Line the Turkeys Up',
}
