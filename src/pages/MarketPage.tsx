import { useMemo, useState } from 'react'
import { useMarketPrices } from '../hooks/useMarketPrices'
import { MarketSearch } from '../components/market/MarketSearch'
import { PriceCard } from '../components/market/PriceCard'

export function MarketPage() {
  const { data: prices, isLoading, isError } = useMarketPrices()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!prices) return []
    const query = search.trim().toLowerCase()
    const matches = query
      ? prices.filter((p) => p.displayName.toLowerCase().includes(query))
      : prices
    return [...matches].sort((a, b) => a.displayName.localeCompare(b.displayName))
  }, [prices, search])

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <h2 className="text-xl font-semibold text-gray-900">Market</h2>
      <MarketSearch value={search} onChange={setSearch} />

      {isLoading && <p className="text-sm text-gray-500">Loading market prices…</p>}
      {isError && <p className="text-sm text-red-500">Couldn't load market prices.</p>}

      {prices && (
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
    </div>
  )
}
