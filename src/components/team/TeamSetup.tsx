import { useState } from 'react'
import type { AccountRole, AccountSlot } from '../../store/teamStore'
import { useTeam, useTeamActions } from '../../hooks/useTeam'
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback'

const ROLES: AccountRole[] = ['main', 'gatherer', 'crafter', 'support', 'unassigned']
const SLOTS = ['main', 'alt1', 'alt2'] as const
type Slot = (typeof SLOTS)[number]

export function TeamSetup() {
  const team = useTeam()
  const { setAccount } = useTeamActions()

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <h2 className="text-xl font-semibold text-gray-100">Set up your team</h2>
      <p className="text-sm text-gray-400">
        Enter up to 3 Idle Clans usernames and assign each a role.
      </p>

      {SLOTS.map((slot) => (
        <AccountRow key={slot} slot={slot} account={team.accounts[slot]} setAccount={setAccount} />
      ))}
    </div>
  )
}

function AccountRow({
  slot,
  account,
  setAccount,
}: {
  slot: Slot
  account: AccountSlot
  setAccount: (slot: Slot, update: Partial<AccountSlot>) => void
}) {
  // Local state gives instant typing feedback; the store (and the API
  // fetch it triggers) only updates after the user pauses typing.
  const [localUsername, setLocalUsername] = useState(account.username ?? '')
  const commitUsername = useDebouncedCallback((value: string) => {
    setAccount(slot, { username: value || null })
  }, 400)

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 p-3 sm:flex-nowrap sm:gap-3">
<input
        type="text"
        placeholder="Username"
        value={localUsername}
        onChange={(e) => {
          setLocalUsername(e.target.value)
          commitUsername(e.target.value)
        }}
className="min-w-0 flex-1 rounded border border-slate-600 bg-slate-700 px-2 py-1 text-sm text-gray-100 placeholder-slate-500"
      />
      <select
        value={account.role}
        onChange={(e) => setAccount(slot, { role: e.target.value as AccountRole })}
        className="w-full rounded border border-slate-600 bg-slate-700 px-2 py-1 text-sm text-gray-100 sm:w-auto"
      >
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </div>
  )
}
