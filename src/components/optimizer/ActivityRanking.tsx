import type { RankedActivity, NextUnlock } from '../../utils/goldPerHour'
import type { ActivityDefinition } from '../../data/activities'
import type { MarketPrice } from '../../types/market'
import { formatGold, activityDisplayName } from '../../utils/formatGold'
import { ItemIcon } from '../ui/Icon'
import { useMarketPriceDetail } from '../../hooks/useMarketPriceDetail'
import { comparePriceToAverage } from '../../utils/priceComparison'
import { EmptyState } from '../ui/EmptyState'

export function ActivityRanking({
  ranked,
  nextUnlocks,
  marketPrices,
}: {
  ranked: RankedActivity[]
  nextUnlocks: NextUnlock[]
  marketPrices: MarketPrice[]
}) {
  if (ranked.length === 0) {
    return (
      <EmptyState>
        No profitable activities found at this account's current levels (or market data is
        missing for the relevant items).
      </EmptyState>
    )
  }

  const priceByItemId = new Map(marketPrices.map((p) => [p.itemId, p]))

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {ranked.slice(0, 15).map(({ activity, goldPerHour }) => (
          <ActivityRow
            key={activity.id}
            activity={activity}
            goldPerHour={goldPerHour}
            outputPrice={activity.outputItems[0] ? priceByItemId.get(activity.outputItems[0].itemId) : undefined}
          />
        ))}
      </div>

      {nextUnlocks.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-100">Level up to unlock</h3>
          {nextUnlocks.map(({ activity, goldPerHour, levelsNeeded }) => (
            <div
              key={activity.id}
              className="rounded-lg border border-amber-700 bg-amber-900/40 p-3 text-sm"
            >
              {activity.outputItems[0] && (
                <ItemIcon itemId={activity.outputItems[0].itemId} size={16} />
              )}{' '}
              <span className="font-medium text-amber-300">{activityDisplayName(activity)}</span>{' '}
              <span className="text-gray-400">
                ({activity.skillKey} level {activity.levelRequired}, {levelsNeeded} levels away) —{' '}
              </span>
              <span className="font-medium text-emerald-400">{formatGold(goldPerHour)}/hr</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ActivityRow({
  activity,
  goldPerHour,
  outputPrice,
}: {
  activity: ActivityDefinition
  goldPerHour: number
  outputPrice: MarketPrice | undefined
}) {
  const output = activity.outputItems[0]
  // 7d average only comes from the per-item comprehensive endpoint, not the
  // bulk price list — one extra request per visible row, deduped/cached by
  // TanStack Query.
  const { data: detail } = useMarketPriceDetail(output ? output.itemId : null)
  const comparison =
    outputPrice && detail ? comparePriceToAverage(outputPrice.highestBuyPrice, detail.averagePrice7Days) : null

  return (
    <div className="rounded-lg border border-slate-600 bg-slate-800 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {output && <ItemIcon itemId={output.itemId} />}
          <div>
            <div className="font-medium text-gray-100">{activityDisplayName(activity)}</div>
            <div className="text-xs text-gray-400">
              {activity.skillKey} · level {activity.levelRequired}
            </div>
          </div>
        </div>
        <div className="font-medium text-emerald-400">{formatGold(goldPerHour)}/hr</div>
      </div>
      {outputPrice && (
        <div className="mt-1 pl-8 text-xs text-gray-400">
          {formatGold(outputPrice.highestPriceVolume)} buying · {formatGold(outputPrice.highestBuyPrice)}g
          {comparison && <> · {comparison.symbol} {comparison.label}</>}
        </div>
      )}
    </div>
  )
}
