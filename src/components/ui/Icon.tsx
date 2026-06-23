import { ITEM_ICON_URLS, MONSTER_ICON_URLS, SKILL_ICON_URLS } from '../../data/icons'

// Renders nothing if the wiki has no resolved icon for this id (see
// scripts/generate-icons.mjs — ~91% item coverage, 100% monster coverage).
export function ItemIcon({ itemId, size = 24 }: { itemId: number; size?: number }) {
  const url = ITEM_ICON_URLS.get(itemId)
  if (!url) return null
  return <img src={url} width={size} height={size} alt="" className="shrink-0" />
}

export function MonsterIcon({ monsterId, size = 24 }: { monsterId: number; size?: number }) {
  const url = MONSTER_ICON_URLS.get(monsterId)
  if (!url) return null
  return <img src={url} width={size} height={size} alt="" className="shrink-0" />
}

// `name` is the raw skill key (e.g. "woodcutting") used to look up the icon
// AND as the fallback when an icon is missing/still loading — callers using
// this to replace a text label should keep `name` legible (it renders as
// plain text via the `title` attribute on hover, and as alt text for
// screen readers either way).
export function SkillIcon({ name, size = 20 }: { name: string; size?: number }) {
  const url = SKILL_ICON_URLS.get(name)
  if (!url) return <span className="text-gray-400">{name}</span>
  return <img src={url} width={size} height={size} alt={name} title={name} className="shrink-0" />
}
