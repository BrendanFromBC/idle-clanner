import { useClanProfile } from '../../hooks/useClanProfile'
import { CLAN_UPGRADE_LIST } from '../../utils/upgradeLabels'
import { Skeleton } from '../ui/Skeleton'
import { ErrorMessage } from '../ui/ErrorMessage'

export function ClanCard({ clanName }: { clanName: string }) {
  const { data: clan, isLoading, isError } = useClanProfile(clanName)

  return (
    <div className="rounded-lg border border-slate-600 bg-slate-800 p-4">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="font-semibold text-gray-100">{clanName}</h3>
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
        <div>
          <p className="mb-2 text-xs font-medium text-gray-400">Clan Upgrades</p>
          <div className="flex flex-wrap gap-1">
            {CLAN_UPGRADE_LIST.map((upgrade) => {
              const repeatCount = clan.repeatableUpgradeCounts[String(upgrade.type)] ?? 0
              const unlocked = upgrade.repeatable
                ? repeatCount > 0
                : clan.upgrades.includes(upgrade.type)

              return (
                <span
                  key={upgrade.type}
                  className={`rounded px-2 py-0.5 text-xs font-medium ${
                    unlocked
                      ? 'bg-green-900 text-emerald-300'
                      : 'bg-slate-700 text-slate-500'
                  }`}
                >
                  {upgrade.name}
                  {upgrade.repeatable && unlocked && (
                    <span className="ml-1 text-emerald-400">×{repeatCount}</span>
                  )}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
