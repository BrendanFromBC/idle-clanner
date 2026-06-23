import { useMemo, useState } from 'react'
import { useMarketPrices } from '../hooks/useMarketPrices'
import { MarketSearch } from '../components/market/MarketSearch'
import { PriceCard } from '../components/market/PriceCard'

export function MarketPage() {
  const { data: prices, isLoading, isError } = useMarketPrices()
  const [search, setSearch] = useState('')

  const isSearching = search.trim().length > 0

  const filtered = useMemo(() => {
    if (!prices) return []
    const query = search.trim().toLowerCase()
    if (!query) return prices
    return prices
      .filter((p) => p.displayName.toLowerCase().includes(query))
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
  }, [prices, search])

  // No bulk 24h-volume field exists (see useMarketPriceDetail's
  // tradeVolume1Day, only fetchable per-item on demand) — proxy "hottest"
  // with the combined volume at the best bid/ask from the bulk endpoint.
  const hottest = useMemo(() => {
    if (!prices) return []
    return [...prices]
      .sort(
        (a, b) =>
          b.lowestPriceVolume + b.highestPriceVolume - (a.lowestPriceVolume + a.highestPriceVolume),
      )
      .slice(0, 10)
  }, [prices])

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <h2 className="text-xl font-semibold text-gray-900">Market</h2>
      <MarketSearch value={search} onChange={setSearch} />

      {isLoading && <p className="text-sm text-gray-500">Loading market prices…</p>}
      {isError && <p className="text-sm text-red-500">Couldn't load market prices.</p>}

      {prices && isSearching && (
        <>
          <p className="text-xs text-gray-400">
            {filtered.length} of {prices.length} tradeable items
          </p>
          <div className="space-y-2">
            {filtered.map((price) => (
              <PriceCard key={price.itemId} price={price} />
            ))}
          </div>
        </>
      )}

      {prices && !isSearching && (
        <>
          <p className="text-xs text-gray-400">Hottest items of the day</p>
          <div className="space-y-2">
            {hottest.map((price) => (
              <PriceCard key={price.itemId} price={price} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
