// Thresholds are a judgment call (not derived from any in-game data) chosen
// to feel intuitive: +/-10% reads as a real but ordinary swing, +/-50% reads
// as a likely-unsustainable outlier (e.g. a thin sell-side listing).
export interface PriceComparison {
  label: string
  symbol: string
}

export function comparePriceToAverage(current: number, average7d: number): PriceComparison | null {
  if (average7d <= 0) return null
  const ratio = current / average7d
  if (ratio >= 1.5) return { label: 'greatly above 7d avg', symbol: '↑↑' }
  if (ratio >= 1.1) return { label: 'above 7d avg', symbol: '↑' }
  if (ratio <= 0.5) return { label: 'greatly below 7d avg', symbol: '↓↓' }
  if (ratio <= 0.9) return { label: 'below 7d avg', symbol: '↓' }
  return { label: 'on par with 7d avg', symbol: '≈' }
}
