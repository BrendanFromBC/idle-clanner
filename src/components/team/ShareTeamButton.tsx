import { useState } from 'react'
import { useTeam } from '../../hooks/useTeam'
import { buildShareSearchParams } from '../../utils/teamShareLink'

export function ShareTeamButton() {
  const team = useTeam()
  const [copied, setCopied] = useState(false)
  const hasAnyConfiguredAccount =
    team.accounts.main.username !== null ||
    team.accounts.alt1.username !== null ||
    team.accounts.alt2.username !== null

  const copyShareLink = async () => {
    const params = buildShareSearchParams(team)
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!hasAnyConfiguredAccount) return null

  return (
    <button
      type="button"
      onClick={copyShareLink}
      className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
    >
      {copied ? 'Link copied!' : 'Copy share link'}
    </button>
  )
}
