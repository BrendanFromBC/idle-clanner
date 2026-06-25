import type { RawClanProfile } from '../api/types'

export interface ClanMember {
  memberName: string
  rank: number
}

export interface ClanProfile {
  clanName: string
  tag: string
  isPrestige: boolean
  activityScore: number
  memberlist: ClanMember[]
  isRecruiting: boolean
  upgrades: number[] // type codes of purchased upgrades
  repeatableUpgradeCounts: Record<string, number>
  recruitmentMessage: string | null
}

export function toClanProfile(raw: RawClanProfile): ClanProfile {
  let upgrades: number[] = []
  if (raw.serializedUpgrades && raw.serializedUpgrades.trim() !== '') {
    try {
      upgrades = JSON.parse(raw.serializedUpgrades)
    } catch {
      upgrades = []
    }
  }
  return {
    clanName: raw.clanName,
    tag: raw.tag,
    isPrestige: raw.isPrestige,
    activityScore: raw.activityScore,
    memberlist: raw.memberlist,
    isRecruiting: raw.isRecruiting,
    upgrades,
    repeatableUpgradeCounts: raw.repeatableUpgradeCounts,
    recruitmentMessage: raw.recruitmentMessage,
  }
}
