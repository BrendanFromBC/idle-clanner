import type { AccountRole, Team } from '../store/teamStore'

const SLOTS = ['main', 'alt1', 'alt2'] as const
type Slot = (typeof SLOTS)[number]

const VALID_ROLES: AccountRole[] = ['main', 'gatherer', 'crafter', 'support', 'unassigned']

export function teamTag(team: Team): string {
  return team.name
}

// One query param per slot, value "username:role". Team name+discriminator
// encoded as "TeamName#1234" in the "team" param — URLSearchParams encodes
// the # as %23 automatically so it doesn't collide with the URL fragment.
export function buildShareSearchParams(team: Team): URLSearchParams {
  const params = new URLSearchParams()
  params.set('team', teamTag(team))
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

export interface ParsedShareLink {
  accounts: Partial<Record<Slot, SharedAccount>>
  teamTag?: string   // e.g. "MyTeam#4821" — undefined if param was absent
}

// Returns null if the URL has none of the expected slot params (common case —
// most visits aren't from a share link). Malformed individual slot values are
// skipped rather than rejecting the whole link.
export function parseShareSearchParams(params: URLSearchParams): ParsedShareLink | null {
  let found = false
  const accounts: Partial<Record<Slot, SharedAccount>> = {}

  for (const slot of SLOTS) {
    const raw = params.get(slot)
    if (!raw) continue
    found = true
    const separatorIndex = raw.lastIndexOf(':')
    if (separatorIndex === -1) continue
    const username = raw.slice(0, separatorIndex)
    const role = raw.slice(separatorIndex + 1) as AccountRole
    if (!username || !VALID_ROLES.includes(role)) continue
    accounts[slot] = { username, role }
  }

  const teamTagRaw = params.get('team') ?? undefined
  if (teamTagRaw) found = true

  return found ? { accounts, teamTag: teamTagRaw } : null
}
