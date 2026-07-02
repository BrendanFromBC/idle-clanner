// Maps the game's internal numeric skill IDs (as seen in ItemDefinition.skillBoostSkill
// and items' SkillBoost.Skill field) to the string skill names the API returns
// in skillExperiences and enchantmentBoosts.
//
// Derived from skill capes in game-data (e.g. mining_cape has Skill:12, woodcutting_cape
// has Skill:8) — not guessed. Skill 1 is "rigour", an internal slot that never
// appears in the player profile's skillExperiences; included for completeness.
export const SKILL_ID_TO_NAME: Record<number, string> = {
  0: 'attack',
  1: 'rigour',
  2: 'strength',
  3: 'defence',
  4: 'archery',
  5: 'magic',
  6: 'health',
  7: 'crafting',
  8: 'woodcutting',
  9: 'carpentry',
  10: 'fishing',
  11: 'cooking',
  12: 'mining',
  13: 'smithing',
  14: 'foraging',
  15: 'farming',
  16: 'agility',
  17: 'plundering',
  18: 'enchanting',
  19: 'brewing',
  20: 'exterminating',
  21: 'invocation',
}

export const SKILL_NAME_TO_ID: Record<string, number> = Object.fromEntries(
  Object.entries(SKILL_ID_TO_NAME).map(([id, name]) => [name, Number(id)])
)
