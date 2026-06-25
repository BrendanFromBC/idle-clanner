import type { RawMarketPriceHistoryPoint } from '../../api/types'
import { formatGold } from '../../utils/formatGold'

const WIDTH = 280
const HEIGHT = 64
const PADDING = 4

export function PriceHistoryChart({ points }: { points: RawMarketPriceHistoryPoint[] }) {
  if (points.length < 2) {
    return <p className="text-xs text-gray-400">Not enough history yet to chart.</p>
  }

  const prices = points.map((p) => p.averagePrice)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1

  const toX = (i: number) => PADDING + (i / (points.length - 1)) * (WIDTH - PADDING * 2)
  const toY = (price: number) => HEIGHT - PADDING - ((price - min) / range) * (HEIGHT - PADDING * 2)

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p.averagePrice)}`).join(' ')

  return (
    <div>
      <svg width={WIDTH} height={HEIGHT} className="overflow-visible">
        <path d={path} fill="none" stroke="#a78bfa" strokeWidth={1.5} />
      </svg>
      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>Low {formatGold(min)}</span>
        <span>High {formatGold(max)}</span>
      </div>
    </div>
  )
}
