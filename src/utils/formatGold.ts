import type { ActivityDefinition } from '../data/activities'
import { ITEMS_BY_ID } from '../data/items'

// Formats any snake_case API name (activity, monster, etc.) for display.
export function toDisplayName(name: string): string {
  return name.split('_').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' ')
}

// An activity's own name is the task being performed (e.g. "magical" for
// chopping a Magical tree), not the item it produces — for woodcutting in
// particular that drops the "Log" suffix entirely. Prefer the actual output
// item's name; fall back to the activity name only if there's no output.
export function activityDisplayName(activity: ActivityDefinition): string {
  const output = activity.outputItems[0]
  const item = output && ITEMS_BY_ID.get(output.itemId)
  return item?.displayName ?? toDisplayName(activity.name)
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
