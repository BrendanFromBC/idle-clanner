import type { RawMarketPrice } from '../api/types'
import { ITEMS_BY_ID } from '../data/items'

export interface MarketPrice {
  itemId: number
  name: string
  displayName: string
  lowestSellPrice: number
  lowestPriceVolume: number
  highestBuyPrice: number
  highestPriceVolume: number
}

export function toMarketPrices(raw: RawMarketPrice[]): MarketPrice[] {
  const result: MarketPrice[] = []
  for (const price of raw) {
    const item = ITEMS_BY_ID.get(price.itemId)
    if (!item) continue // price entry for an item not in our catalog (e.g. discontinued)
    result.push({
      itemId: price.itemId,
      name: item.name,
      displayName: item.displayName,
      lowestSellPrice: price.lowestSellPrice,
      lowestPriceVolume: price.lowestPriceVolume,
      highestBuyPrice: price.highestBuyPrice,
      highestPriceVolume: price.highestPriceVolume,
    })
  }
  return result
}
