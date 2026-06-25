import type { AccountRole } from '../../store/teamStore'

const ROLE_COLORS: Record<AccountRole, string> = {
  main: 'bg-purple-900 text-purple-200',
  gatherer: 'bg-green-900 text-emerald-300',
  crafter: 'bg-amber-900 text-amber-200',
  support: 'bg-blue-900 text-blue-200',
  unassigned: 'bg-gray-800 text-gray-400',
}

export function RoleBadge({ role }: { role: AccountRole }) {
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium uppercase ${ROLE_COLORS[role]}`}>
      {role}
    </span>
  )
}
