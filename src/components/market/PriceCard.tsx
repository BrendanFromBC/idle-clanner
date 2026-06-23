import { useState } from 'react'
import type { MarketPrice } from '../../types/market'
import { useMarketPriceDetail } from '../../hooks/useMarketPriceDetail'
import { useMarketPriceHistory } from '../../hooks/useMarketPriceHistory'
import { formatGold } from '../../utils/formatGold'
import { PriceHistoryChart } from './PriceHistoryChart'
import { ItemIcon } from '../ui/Icon'
import { Skeleton } from '../ui/Skeleton'
import { ErrorMessage } from '../ui/ErrorMessage'

export function PriceCard({ price }: { price: MarketPrice }) {
  const [expanded, setExpanded] = useState(false)
  const { data: detail, isLoading } = useMarketPriceDetail(expanded ? price.itemId : null)
  const {
    data: history,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useMarketPriceHistory(expanded ? price.itemId : null)

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-3">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="flex items-center gap-2 font-medium text-gray-900">
          <ItemIcon itemId={price.itemId} />
          {price.displayName}
        </span>
        <span className="flex gap-4 text-sm">
          <span className="text-green-700">
            Sell {formatGold(price.lowestSellPrice)}
          </span>
          <span className="text-red-600">
            Buy {formatGold(price.highestBuyPrice)}
          </span>
        </span>
      </button>

      {expanded && (
        <div className="mt-3 border-t border-gray-200 pt-3 text-sm text-gray-600">
          {isLoading && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          )}
          {detail && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="1d avg" value={formatGold(detail.averagePrice1Day)} />
              <Stat label="7d avg" value={formatGold(detail.averagePrice7Days)} />
              <Stat label="30d avg" value={formatGold(detail.averagePrice30Days)} />
              <Stat label="24h volume" value={formatGold(detail.tradeVolume1Day)} />
            </div>
          )}

          <div className="mt-3 border-t border-gray-200 pt-3">
            <div className="mb-1 text-xs text-gray-400">Last ~24h average price</div>
            {isHistoryLoading && <Skeleton className="h-16 w-full" />}
            {isHistoryError && <ErrorMessage>Couldn't load price history.</ErrorMessage>}
            {history && <PriceHistoryChart points={history} />}
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-gray-900">{value}</div>
    </div>
  )
}
