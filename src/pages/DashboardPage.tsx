import { TeamSetup } from '../components/team/TeamSetup'
import { AccountCard } from '../components/team/AccountCard'
import { GearOwnershipChecklist } from '../components/gear/GearOwnershipChecklist'
import { useTeam } from '../hooks/useTeam'

const SLOTS = ['main', 'alt1', 'alt2'] as const

export function DashboardPage() {
  const team = useTeam()
  const accountsWithUsernames = SLOTS.filter((slot) => team.accounts[slot].username)

  return (
    <div className="space-y-6">
      <TeamSetup />
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
