import { useState } from 'react'
import { useTeam } from '../../hooks/useTeam'
import { buildShareSearchParams, teamTag } from '../../utils/teamShareLink'

function IconShare() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

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
      title={copied ? 'Link copied!' : `Share ${teamTag(team)}`}
      className={`flex items-center justify-center rounded-lg p-2 transition-colors ${
        copied
          ? 'text-emerald-400'
          : 'text-slate-400 hover:bg-slate-700 hover:text-gray-200'
      }`}
    >
      {copied ? <IconCheck /> : <IconShare />}
    </button>
  )
}
