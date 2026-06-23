import type { RawPlayerProfile, RawMarketPrice, RawMarketPriceDetail } from './types'

const BASE_URL = 'https://query.idleclans.com'

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) {
    throw new Error(`Idle Clans API error ${res.status}: ${path}`)
  }
  return res.json() as Promise<T>
}

export function fetchPlayerProfile(username: string): Promise<RawPlayerProfile> {
  return getJson<RawPlayerProfile>(`/api/Player/profile/${encodeURIComponent(username)}`)
}

export function fetchMarketPrices(): Promise<RawMarketPrice[]> {
  return getJson<RawMarketPrice[]>('/api/PlayerMarket/items/prices/latest')
}

export function fetchMarketPriceDetail(itemId: number): Promise<RawMarketPriceDetail> {
  return getJson<RawMarketPriceDetail>(`/api/PlayerMarket/items/prices/latest/comprehensive/${itemId}`)
}
