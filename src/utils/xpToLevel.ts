// XP required to reach each level (index 0 = level 1, index 119 = level 120).
// Source: https://idleclans.wiki/w/XP_Table
export const XP_TABLE: number[] = [
  0, 75, 151, 227, 303, 380, 531, 683, 836, 988, 1141, 1294, 1447, 1751, 2054,
  2358, 2663, 2967, 3272, 3577, 4182, 4788, 5393, 5999, 6606, 7212, 7819,
  9026, 10233, 11441, 12648, 13856, 15065, 16273, 18682, 21091, 23500, 25910,
  28319, 30729, 33140, 37950, 42761, 47572, 52383, 57195, 62006, 66818,
  76431, 86043, 95656, 105269, 114882, 124496, 134109, 153323, 172538,
  191752, 210967, 230182, 249397, 268613, 307028, 345444, 383861, 422277,
  460694, 499111, 537528, 614346, 691163, 767981, 844800, 921618, 998437,
  1075256, 1228875, 1382495, 1536114, 1689734, 1843355, 1996975, 2150596,
  2457817, 2765038, 3072260, 3379481, 3686703, 3993926, 4301148, 4915571,
  5529994, 6144417, 6758841, 7373264, 7987688, 8602113, 9830937, 11059762,
  12288587, 13517412, 14746238, 15975063, 17203889, 19661516, 22119142,
  24576769, 27034396, 29492023, 31949651, 34407278, 39322506, 44237735,
  49152963, 54068192, 58983421, 63898650, 68813880, 78644309, 88474739,
]

export const MAX_LEVEL = XP_TABLE.length

export function xpToLevel(xp: number): number {
  let level = 1
  for (let i = 1; i < XP_TABLE.length; i++) {
    if (xp < XP_TABLE[i]) break
    level = i + 1
  }
  return level
}

// Returns 0–1 progress toward the next level. Returns 1 at max level.
export function xpProgress(xp: number, level: number): number {
  if (level >= MAX_LEVEL) return 1
  const currentXp = XP_TABLE[level - 1]
  const nextXp = XP_TABLE[level]
  return (xp - currentXp) / (nextXp - currentXp)
}
