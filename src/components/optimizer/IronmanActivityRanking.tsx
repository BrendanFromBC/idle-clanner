import type { RankedIronmanActivity, IronmanNextUnlock } from '../../utils/goldPerHour'
import { formatGold, activityDisplayName } from '../../utils/formatGold'
import { ItemIcon } from '../ui/Icon'
import { EmptyState } from '../ui/EmptyState'

export function IronmanActivityRanking({
  ranked,
  nextUnlocks,
}: {
  ranked: RankedIronmanActivity[]
  nextUnlocks: IronmanNextUnlock[]
}) {
  if (ranked.length === 0) {
    return (
      <EmptyState>No sellable-to-shop activities found at this account's current levels.</EmptyState>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400">
        Ironman mode: values use the local shop price, not the player market. "Full pipeline"
        accounts for the time to self-gather inputs; "materials free" assumes you're already
        stocked up.
      </p>
      <div className="space-y-2">
        {ranked.slice(0, 15).map(({ activity, fullPipelineGoldPerHour, materialsFreeGoldPerHour }) => (
          <div key={activity.id} className="rounded-lg border border-gray-300 bg-white p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activity.outputItems[0] && <ItemIcon itemId={activity.outputItems[0].itemId} />}
                <div>
                  <div className="font-medium text-gray-900">{activityDisplayName(activity)}</div>
                  <div className="text-xs text-gray-400">
                    {activity.skillKey} · level {activity.levelRequired}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-700">
                  {fullPipelineGoldPerHour !== null ? `${formatGold(fullPipelineGoldPerHour)}/hr` : '—'}
                </div>
                <div className="text-xs text-gray-400">full pipeline</div>
              </div>
            </div>
            {activity.inputItems.length > 0 && materialsFreeGoldPerHour !== null && (
              <div className="mt-1 text-xs text-gray-500">
                {formatGold(materialsFreeGoldPerHour)}/hr if materials are already stocked up
              </div>
            )}
            {fullPipelineGoldPerHour === null && (
              <div className="mt-1 text-xs text-amber-600">
                No team member can self-gather every input — only achievable from a stockpile.
              </div>
            )}
          </div>
        ))}
      </div>

      {nextUnlocks.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">Level up to unlock</h3>
          {nextUnlocks.map(({ activity, fullPipelineGoldPerHour, levelsNeeded }) => (
            <div key={activity.id} className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm">
              {activity.outputItems[0] && (
                <ItemIcon itemId={activity.outputItems[0].itemId} size={16} />
              )}{' '}
              <span className="font-medium text-gray-900">{activityDisplayName(activity)}</span>{' '}
              <span className="text-gray-600">
                ({activity.skillKey} level {activity.levelRequired}, {levelsNeeded} levels away) —{' '}
              </span>
              <span className="font-medium text-green-700">
                {fullPipelineGoldPerHour !== null ? `${formatGold(fullPipelineGoldPerHour)}/hr` : '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
