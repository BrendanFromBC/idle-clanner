import type { RankedActivity, NextUnlock } from '../../utils/goldPerHour'
import { formatGold, activityDisplayName } from '../../utils/formatGold'
import { ItemIcon } from '../ui/Icon'

export function ActivityRanking({
  ranked,
  nextUnlocks,
}: {
  ranked: RankedActivity[]
  nextUnlocks: NextUnlock[]
}) {
  if (ranked.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No profitable activities found at this account's current levels (or market data is
        missing for the relevant items).
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {ranked.slice(0, 15).map(({ activity, goldPerHour }) => (
          <div
            key={activity.id}
            className="flex items-center justify-between rounded-lg border border-gray-300 bg-white p-3"
          >
            <div className="flex items-center gap-2">
              {activity.outputItems[0] && <ItemIcon itemId={activity.outputItems[0].itemId} />}
              <div>
                <div className="font-medium text-gray-900">{activityDisplayName(activity)}</div>
                <div className="text-xs text-gray-400">
                  {activity.skillKey} · level {activity.levelRequired}
                </div>
              </div>
            </div>
            <div className="font-medium text-green-700">{formatGold(goldPerHour)}/hr</div>
          </div>
        ))}
      </div>

      {nextUnlocks.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">Level up to unlock</h3>
          {nextUnlocks.map(({ activity, goldPerHour, levelsNeeded }) => (
            <div
              key={activity.id}
              className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm"
            >
              {activity.outputItems[0] && (
                <ItemIcon itemId={activity.outputItems[0].itemId} size={16} />
              )}{' '}
              <span className="font-medium text-gray-900">{activityDisplayName(activity)}</span>{' '}
              <span className="text-gray-600">
                ({activity.skillKey} level {activity.levelRequired}, {levelsNeeded} levels away) —{' '}
              </span>
              <span className="font-medium text-green-700">{formatGold(goldPerHour)}/hr</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
