import { useState } from 'react'
import type { AccountSlot } from '../../store/teamStore'
import { usePlayerProfile } from '../../hooks/usePlayerProfile'
import { RoleBadge } from './RoleBadge'
import { Skeleton } from '../ui/Skeleton'
import { ErrorMessage } from '../ui/ErrorMessage'
import { EmptyState } from '../ui/EmptyState'
import { SkillIcon } from '../ui/Icon'
import { formatUpgradeName } from '../../utils/upgradeLabels'

function AccountCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-2/3" />
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
        {Array.from({ length: 21 }).map((_, i) => (
          <Skeleton key={i} className="h-6" />
        ))}
      </div>
    </div>
  )
}

export function AccountCard({ account }: { account: AccountSlot }) {
  const { data: profile, isLoading, isError } = usePlayerProfile(account.username)
  const [upgradesOpen, setUpgradesOpen] = useState(false)

  if (!account.username) {
    return <EmptyState>No account set</EmptyState>
  }

  const ownedUpgrades = profile
    ? Object.entries(profile.upgrades).filter(([, v]) => v > 0)
    : []

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{account.username}</h3>
        <RoleBadge role={account.role} />
      </div>

      {isLoading && <AccountCardSkeleton />}
      {isError && <ErrorMessage>Couldn't find a player named "{account.username}".</ErrorMessage>}

      {profile && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">
            Total level <span className="text-gray-900">{profile.totalLevel}</span>
            {profile.guildName && (
              <>
                {' '}
                · <span className="text-gray-900">{profile.guildName}</span>
              </>
            )}
          </p>
          <div className="grid grid-cols-2 gap-1 text-xs sm:grid-cols-3">
            {Object.entries(profile.skills).map(([name, skill]) => (
              <div
                key={name}
                className="flex items-center justify-between gap-1 rounded bg-gray-900 px-2 py-1"
              >
                <SkillIcon name={name} />
                <span className="shrink-0 text-white">{skill.level}</span>
              </div>
            ))}
          </div>

          {ownedUpgrades.length > 0 && (
            <div className="border-t border-gray-100 pt-2">
              <button
                type="button"
                onClick={() => setUpgradesOpen((o) => !o)}
                className="flex w-full items-center justify-between text-xs text-gray-500 hover:text-gray-700"
              >
                <span>Upgrades ({ownedUpgrades.length})</span>
                <span>{upgradesOpen ? '▲' : '▼'}</span>
              </button>
              {upgradesOpen && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {ownedUpgrades.map(([key, val]) => (
                    <span
                      key={key}
                      className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                      title={`${formatUpgradeName(key)}: tier ${val}`}
                    >
                      {formatUpgradeName(key)}
                      {val > 1 && (
                        <span className="ml-1 text-gray-400">×{val}</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
