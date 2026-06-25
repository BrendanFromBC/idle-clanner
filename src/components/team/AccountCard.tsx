import { useState } from 'react'
import type { AccountSlot } from '../../store/teamStore'
import { usePlayerProfile } from '../../hooks/usePlayerProfile'
import { RoleBadge } from './RoleBadge'
import { Skeleton } from '../ui/Skeleton'
import { ErrorMessage } from '../ui/ErrorMessage'
import { EmptyState } from '../ui/EmptyState'
import { SkillIcon } from '../ui/Icon'
import { formatUpgradeName } from '../../utils/upgradeLabels'
import { xpProgress } from '../../utils/xpToLevel'

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
    <div className="rounded-lg border border-slate-600 bg-slate-800 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-gray-100">{account.username}</h3>
        <RoleBadge role={account.role} />
      </div>

      {isLoading && <AccountCardSkeleton />}
      {isError && <ErrorMessage>Couldn't find a player named "{account.username}".</ErrorMessage>}

      {profile && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">
            Total level <span className="text-gray-100">{profile.totalLevel}</span>
            {profile.guildName && (
              <>
                {' '}
                · <span className="text-gray-100">{profile.guildName}</span>
              </>
            )}
          </p>
          <div className="grid gap-1 text-xs" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(3.5rem, 1fr))' }}>
            {Object.entries(profile.skills).map(([name, skill]) => {
              const progress = xpProgress(skill.xp, skill.level)
              return (
                <div
                  key={name}
                  className="relative flex items-center justify-center gap-1 overflow-hidden rounded-t bg-slate-700 px-1 py-1"
                >
                  <div
                    className="absolute bottom-0 left-0 h-0.5 bg-emerald-500"
                    style={{ width: `${progress * 100}%` }}
                  />
                  <SkillIcon name={name} size={24} />
                  <span className="shrink-0 text-gray-100">{String(skill.level).padStart(2, '0')}</span>
                </div>
              )
            })}
          </div>

          {ownedUpgrades.length > 0 && (
            <div className="border-t border-slate-700 pt-2">
              <button
                type="button"
                onClick={() => setUpgradesOpen((o) => !o)}
                className="flex w-full items-center justify-between text-xs text-gray-400 hover:text-gray-200"
              >
                <span>Upgrades ({ownedUpgrades.length})</span>
                <span>{upgradesOpen ? '▲' : '▼'}</span>
              </button>
              {upgradesOpen && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {ownedUpgrades.map(([key, val]) => (
                    <span
                      key={key}
                      className="rounded bg-slate-700 px-2 py-0.5 text-xs text-gray-300"
                      title={`${formatUpgradeName(key)}: tier ${val}`}
                    >
                      {formatUpgradeName(key)}
                      {val > 1 && (
                        <span className="ml-1 text-gray-500">×{val}</span>
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
