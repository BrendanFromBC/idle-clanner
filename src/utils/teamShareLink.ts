import type { AccountRole, Team } from '../store/teamStore'

const SLOTS = ['main', 'alt1', 'alt2'] as const
type Slot = (typeof SLOTS)[number]

const VALID_ROLES: AccountRole[] = ['main', 'gatherer', 'crafter', 'support', 'unassigned']

// One query param per slot, value "username:role" — URLSearchParams handles
// the encoding. Slots with no username are omitted entirely so an empty
// team doesn't produce a link full of "main=:main&alt1=:gatherer..." noise.
export function buildShareSearchParams(team: Team): URLSearchParams {
  const params = new URLSearchParams()
  for (const slot of SLOTS) {
    const account = team.accounts[slot]
    if (!account.username) continue
    params.set(slot, `${account.username}:${account.role}`)
  }
  return params
}

export interface SharedAccount {
  username: string
  role: AccountRole
}

// Returns null if the URL has none of the expected slot params at all (the
// common case — most visits aren't from a share link). Malformed individual
// values (missing role, unknown role) are skipped rather than rejecting the
// whole link, so a partially-corrupted URL still imports what it can.
export function parseShareSearchParams(params: URLSearchParams): Partial<Record<Slot, SharedAccount>> | null {
  let found = false
  const result: Partial<Record<Slot, SharedAccount>> = {}
  for (const slot of SLOTS) {
    const raw = params.get(slot)
    if (!raw) continue
    found = true
    const separatorIndex = raw.lastIndexOf(':')
    if (separatorIndex === -1) continue
    const username = raw.slice(0, separatorIndex)
    const role = raw.slice(separatorIndex + 1) as AccountRole
    if (!username || !VALID_ROLES.includes(role)) continue
    result[slot] = { username, role }
  }
  return found ? result : null
}
