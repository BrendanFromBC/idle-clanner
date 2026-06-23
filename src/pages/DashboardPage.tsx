import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TeamSetup } from '../components/team/TeamSetup'
import { AccountCard } from '../components/team/AccountCard'
import { GearOwnershipChecklist } from '../components/gear/GearOwnershipChecklist'
import { ShareTeamButton } from '../components/team/ShareTeamButton'
import { useTeam, useTeamActions } from '../hooks/useTeam'
import { parseShareSearchParams, type SharedAccount } from '../utils/teamShareLink'

const SLOTS = ['main', 'alt1', 'alt2'] as const

export function DashboardPage() {
  const team = useTeam()
  const { setAccount } = useTeamActions()
  const accountsWithUsernames = SLOTS.filter((slot) => team.accounts[slot].username)

  const [searchParams, setSearchParams] = useSearchParams()
  // Lazy initializer runs once on mount only — intentional. Re-deriving this
  // from searchParams on every render would re-show the banner right after
  // the user dismisses it, since clearing the params is itself a change.
  const [pendingImport, setPendingImport] = useState<Partial<Record<(typeof SLOTS)[number], SharedAccount>> | null>(
    () => parseShareSearchParams(searchParams),
  )

  const applyImport = () => {
    if (!pendingImport) return
    for (const slot of SLOTS) {
      const shared = pendingImport[slot]
      if (shared) setAccount(slot, { username: shared.username, role: shared.role })
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
        <div className="mx-auto mt-4 flex max-w-2xl items-center justify-between gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm">
          <span className="text-gray-700">
            This link includes a shared team setup
            {Object.values(pendingImport).length > 0 &&
              ` (${Object.values(pendingImport)
                .map((a) => a?.username)
                .join(', ')})`}
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
              className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Ignore
            </button>
          </div>
        </div>
      )}

      <TeamSetup />
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <ShareTeamButton />
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-3">
        <AccountCard account={team.accounts.main} />
        <AccountCard account={team.accounts.alt1} />
        <AccountCard account={team.accounts.alt2} />
      </div>

      {accountsWithUsernames.length > 0 && (
        <div className="mx-auto max-w-5xl space-y-4 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900">Self-reported gear</h3>
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
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
