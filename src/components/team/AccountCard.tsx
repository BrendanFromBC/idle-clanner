import type { AccountSlot } from '../../store/teamStore'
import { usePlayerProfile } from '../../hooks/usePlayerProfile'
import { RoleBadge } from './RoleBadge'
import { Skeleton } from '../ui/Skeleton'
import { ErrorMessage } from '../ui/ErrorMessage'
import { EmptyState } from '../ui/EmptyState'

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

  if (!account.username) {
    return <EmptyState>No account set</EmptyState>
  }

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
              <div key={name} className="flex justify-between rounded bg-gray-900 px-2 py-1">
                <span className="text-gray-400">{name}</span>
                <span className="text-white">{skill.level}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
