// Raw shapes returned by https://query.idleclans.com — verified against the
// live API (GET /api/Player/profile/{name}), not the assumptions in CLAUDE.md.
// Equipment values are item IDs (-1 = empty slot), not item names. Skill
// values are XP only; levels must be derived via xpToLevel().

export interface RawPlayerProfile {
  username: string
  gameMode: string
  guildName: string | null
  skillExperiences: Record<string, number>
  equipment: Record<string, number>
  enchantmentBoosts: Record<string, number>
  upgrades: Record<string, number>
  pvmStats: Record<string, number>
  hoursOffline: number
  taskTypeOnLogout: number
  taskNameOnLogout: string | null
  activeServerId: string | null
}

export interface RawMarketPrice {
  itemId: number
  lowestSellPrice: number
  lowestPriceVolume: number
  highestBuyPrice: number
  highestPriceVolume: number
}

export interface RawMarketPriceDetail {
  itemId: number
  lowestSellPricesWithVolume: { key: number; value: number }[]
  highestBuyPricesWithVolume: { key: number; value: number }[]
  averagePrice1Day: number
  averagePrice7Days: number
  averagePrice30Days: number
  tradeVolume1Day: number
}
