// Formats any snake_case API name (activity, monster, etc.) for display.
export function toDisplayName(name: string): string {
  return name.split('_').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' ')
}

const SUFFIXES: [number, string][] = [
  [1_000_000_000, 'B'],
  [1_000_000, 'M'],
  [1_000, 'K'],
]

export function formatGold(value: number): string {
  for (const [threshold, suffix] of SUFFIXES) {
    if (Math.abs(value) >= threshold) {
      return `${(value / threshold).toFixed(1).replace(/\.0$/, '')}${suffix}`
    }
  }
  return value.toLocaleString()
}
