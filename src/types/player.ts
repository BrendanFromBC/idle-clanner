import type { RawPlayerProfile } from '../api/types'
import { xpToLevel } from '../utils/xpToLevel'

// The live API doesn't constrain skill names to a fixed union (it has
// skills CLAUDE.md's original list missed, e.g. rigour/exterminating/
// invocation), so we key skills by the raw string the API returns.
export interface SkillData {
  level: number
  xp: number
}

export interface PlayerProfile {
  username: string
  guildName: string | null
  skills: Record<string, SkillData>
  equipment: Record<string, number> // slot name -> item id, no entry if empty (-1)
  totalLevel: number
  bossKills: Record<string, number>
  upgrades: Record<string, number> // key → tier/count; 0 = not purchased
  enchantmentBoosts: Record<string, number> // skill name → total % boost from all equipped jewelry
}

export function toPlayerProfile(raw: RawPlayerProfile): PlayerProfile {
  const skills: Record<string, SkillData> = {}
  let totalLevel = 0
  for (const [name, xp] of Object.entries(raw.skillExperiences)) {
    const level = xpToLevel(xp)
    skills[name] = { level, xp }
    totalLevel += level
  }

  const equipment: Record<string, number> = {}
  for (const [slot, itemId] of Object.entries(raw.equipment)) {
    if (itemId !== -1) equipment[slot] = itemId
  }

  return {
    username: raw.username,
    guildName: raw.guildName,
    skills,
    equipment,
    totalLevel,
    bossKills: raw.pvmStats,
    upgrades: raw.upgrades,
    enchantmentBoosts: raw.enchantmentBoosts ?? {},
  }
}
