import { GEAR, type GearItem } from '../data/gear'
import type { MarketPrice } from '../types/market'

// Skilling tools have the full 8-tier ladder (Normal..Otherworldly); combat
// slots still only have the endgame BiS entry — see scripts/generate-gear.mjs.
export function getUpgradePath(slot: string, currentItemId: number | null, skill?: string): GearItem[] {
  const candidates = GEAR.filter((item) => item.slot === slot && (skill ? item.skill === skill : true))
    .sort((a, b) => a.tier - b.tier)

  if (currentItemId === null) return candidates
  const currentIndex = candidates.findIndex((item) => item.id === currentItemId)
  return currentIndex === -1 ? candidates : candidates.slice(currentIndex + 1)
}

export function getAcquisitionCost(item: GearItem, marketPrices: MarketPrice[]): number | null {
  if (!item.tradeable) return null
  const price = marketPrices.find((p) => p.itemId === item.id)
  // lowestPriceVolume === 0 means there's no active sell listing — a
  // lowestSellPrice of 0 in that case isn't a real price, it's "no data".
  if (!price || price.lowestPriceVolume === 0) return null
  return price.lowestSellPrice
}
