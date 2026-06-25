import { useClanProfile } from '../../hooks/useClanProfile'
import { CLAN_UPGRADE_NAMES } from '../../utils/upgradeLabels'
import { Skeleton } from '../ui/Skeleton'
import { ErrorMessage } from '../ui/ErrorMessage'

export function ClanCard({ clanName }: { clanName: string }) {
  const { data: clan, isLoading, isError } = useClanProfile(clanName)

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="font-semibold text-gray-900">{clanName}</h3>
        {clan?.isPrestige && (
          <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
            Prestige
          </span>
        )}
        {clan && (
          <span className="ml-auto text-xs text-gray-400">
            {clan.memberlist.length} members · activity {clan.activityScore.toFixed(1)}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}
      {isError && <ErrorMessage>Couldn't load clan data for "{clanName}".</ErrorMessage>}

      {clan && (
        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-medium text-gray-500">Clan Upgrades</p>
            {clan.upgrades.length === 0 ? (
              <p className="text-xs text-gray-400">No clan upgrades purchased.</p>
            ) : (
              <div className="flex flex-wrap gap-1">
                {clan.upgrades.map((typeCode) => (
                  <span
                    key={typeCode}
                    className="rounded bg-green-50 px-2 py-0.5 text-xs text-green-800"
                  >
                    {CLAN_UPGRADE_NAMES[typeCode] ?? `Upgrade #${typeCode}`}
                  </span>
                ))}
              </div>
            )}
          </div>

          {Object.keys(clan.repeatableUpgradeCounts).length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-gray-500">Repeatable Upgrades</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(clan.repeatableUpgradeCounts).map(([key, count]) => (
                  <span
                    key={key}
                    className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-800"
                  >
                    {CLAN_UPGRADE_NAMES[Number(key)] ?? `Upgrade #${key}`}
                    <span className="ml-1 text-blue-500">×{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
