import type { AccountSlot } from '../../store/teamStore'
import { usePlayerProfile } from '../../hooks/usePlayerProfile'
import { RoleBadge } from './RoleBadge'

function AccountCardSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-4 w-2/3 rounded bg-gray-200" />
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={i} className="h-6 rounded bg-gray-200" />
        ))}
      </div>
    </div>
  )
}

export function AccountCard({ account }: { account: AccountSlot }) {
  const { data: profile, isLoading, isError } = usePlayerProfile(account.username)

  if (!account.username) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-4 text-center text-sm text-gray-500">
        No account set
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{account.username}</h3>
        <RoleBadge role={account.role} />
      </div>

      {isLoading && <AccountCardSkeleton />}
      {isError && (
        <p className="text-sm text-red-500">
          Couldn't find a player named "{account.username}".
        </p>
      )}

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
          <div className="grid grid-cols-3 gap-1 text-xs">
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
