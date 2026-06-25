import { useState } from 'react'
import type { AccountRole, AccountSlot } from '../../store/teamStore'
import { usePlayerProfile } from '../../hooks/usePlayerProfile'
import { useTeamActions } from '../../hooks/useTeam'
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback'
import { Skeleton } from '../ui/Skeleton'
import { ErrorMessage } from '../ui/ErrorMessage'
import { SkillIcon } from '../ui/Icon'
import { formatUpgradeName } from '../../utils/upgradeLabels'
import { xpProgress } from '../../utils/xpToLevel'

const ROLES: AccountRole[] = ['main', 'gatherer', 'crafter', 'support', 'unassigned']

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

export function AccountCard({ account, slot }: { account: AccountSlot; slot: 'main' | 'alt1' | 'alt2' }) {
  const { setAccount } = useTeamActions()
  const [localUsername, setLocalUsername] = useState(account.username ?? '')
  const commitUsername = useDebouncedCallback((value: string) => {
    setAccount(slot, { username: value || null })
  }, 400)

  const { data: profile, isLoading, isError } = usePlayerProfile(account.username)
  const [upgradesOpen, setUpgradesOpen] = useState(false)

  const ownedUpgrades = profile
    ? Object.entries(profile.upgrades).filter(([, v]) => v > 0)
    : []

  return (
    <div className="rounded-lg border border-slate-600 bg-slate-800 p-4">
      <div className="mb-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="Username"
          value={localUsername}
          onChange={(e) => {
            setLocalUsername(e.target.value)
            commitUsername(e.target.value)
          }}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-gray-100 placeholder-slate-500 outline-none border-b border-slate-600 hover:border-slate-400 focus:border-amber-400 transition-colors pb-0.5"
        />
        <select
          value={account.role}
          onChange={(e) => setAccount(slot, { role: e.target.value as AccountRole })}
          className="rounded border border-slate-600 bg-slate-700 px-1.5 py-0.5 text-xs text-gray-300"
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <AccountCardSkeleton />}
      {isError && <ErrorMessage>Couldn't find a player named "{account.username}".</ErrorMessage>}

      {!account.username && (
        <p className="text-xs text-slate-500">Enter a username above to load this account.</p>
      )}

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
