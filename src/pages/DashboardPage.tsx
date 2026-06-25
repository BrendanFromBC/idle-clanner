import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AccountCard } from '../components/team/AccountCard'
import { ClanCard } from '../components/team/ClanCard'
import { GearOwnershipChecklist } from '../components/gear/GearOwnershipChecklist'
import { ShareTeamButton } from '../components/team/ShareTeamButton'
import { useTeam, useTeamActions } from '../hooks/useTeam'
import { usePlayerProfile } from '../hooks/usePlayerProfile'
import { parseShareSearchParams, type ParsedShareLink } from '../utils/teamShareLink'
import { useDebouncedCallback } from '../hooks/useDebouncedCallback'

const SLOTS = ['main', 'alt1', 'alt2'] as const

export function DashboardPage() {
  const team = useTeam()
  const { setAccount, setTeamName } = useTeamActions()
  const [localTeamName, setLocalTeamName] = useState(team.name)
  const commitTeamName = useDebouncedCallback((value: string) => {
    setTeamName(value || 'My Team')
  }, 400)
  const accountsWithUsernames = SLOTS.filter((slot) => team.accounts[slot].username)

  // Fetch profiles for all 3 slots (disabled for unconfigured slots) to detect
  // a shared clan — TanStack Query caches these so AccountCard pays no extra cost.
  const mainProfile = usePlayerProfile(team.accounts.main.username)
  const alt1Profile = usePlayerProfile(team.accounts.alt1.username)
  const alt2Profile = usePlayerProfile(team.accounts.alt2.username)
  const allProfileQueries = [mainProfile, alt1Profile, alt2Profile]

  // All configured slots must have loaded profiles before we determine the clan.
  const allConfiguredLoaded = SLOTS.every(
    (slot, i) => !team.accounts[slot].username || allProfileQueries[i].data !== undefined,
  )
  const configuredProfileDatas = SLOTS.map((slot, i) =>
    team.accounts[slot].username ? allProfileQueries[i].data : undefined,
  ).filter((d) => d !== undefined)

  const sharedClanName =
    allConfiguredLoaded &&
    configuredProfileDatas.length > 0 &&
    configuredProfileDatas.every(
      (p) => p?.guildName && p.guildName === configuredProfileDatas[0]?.guildName,
    )
      ? (configuredProfileDatas[0]?.guildName ?? null)
      : null

  const [searchParams, setSearchParams] = useSearchParams()
  // Lazy initializer runs once on mount only — intentional. Re-deriving this
  // from searchParams on every render would re-show the banner right after
  // the user dismisses it, since clearing the params is itself a change.
  const [pendingImport, setPendingImport] = useState<ParsedShareLink | null>(
    () => parseShareSearchParams(searchParams),
  )

  const applyImport = () => {
    if (!pendingImport) return
    for (const slot of SLOTS) {
      const shared = pendingImport.accounts[slot]
      if (shared) setAccount(slot, { username: shared.username, role: shared.role })
    }
    if (pendingImport.teamTag) {
      setTeamName(pendingImport.teamTag)
      setLocalTeamName(pendingImport.teamTag)
    }
    setPendingImport(null)
    setSearchParams({}, { replace: true })
  }

  const dismissImport = () => {
    setPendingImport(null)
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="space-y-6">
      {pendingImport && (
        <div className="mx-auto mt-4 flex max-w-2xl items-center justify-between gap-3 rounded-lg border border-amber-700 bg-amber-900/40 p-3 text-sm">
          <span className="text-amber-300">
            Shared team link:{' '}
            <span className="font-semibold text-amber-200">
              {pendingImport.teamTag ?? Object.values(pendingImport.accounts).map((a) => a?.username).join(', ')}
            </span>
            . Load it? This will overwrite your current team.
          </span>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={applyImport}
              className="rounded bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
            >
              Load
            </button>
            <button
              type="button"
              onClick={dismissImport}
              className="rounded border border-slate-600 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-slate-700"
            >
              Ignore
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={localTeamName}
            onChange={(e) => {
              setLocalTeamName(e.target.value)
              commitTeamName(e.target.value)
            }}
            className="min-w-0 flex-1 bg-transparent text-2xl font-bold text-gray-100 placeholder-slate-500 outline-none border-b border-transparent hover:border-slate-600 focus:border-amber-400 transition-colors pb-0.5"
          />
          <ShareTeamButton />
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-3">
        <AccountCard account={team.accounts.main} slot="main" />
        <AccountCard account={team.accounts.alt1} slot="alt1" />
        <AccountCard account={team.accounts.alt2} slot="alt2" />
      </div>

      {sharedClanName && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <ClanCard clanName={sharedClanName} />
        </div>
      )}

      {accountsWithUsernames.length > 0 && (
        <div className="mx-auto max-w-5xl space-y-4 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-100">Self-reported gear</h3>
          <p className="text-xs text-gray-400">
            The game's API only shows equipped gear, not inventory — mark items you own but
            aren't currently wearing so the Gear Guide doesn't suggest buying them again.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {accountsWithUsernames.map((slot) => (
              <GearOwnershipChecklist
                key={slot}
                slot={slot}
                title={team.accounts[slot].username ?? slot}
                username={team.accounts[slot].username}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
