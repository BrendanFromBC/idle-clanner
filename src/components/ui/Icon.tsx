import { ITEM_ICON_URLS, MONSTER_ICON_URLS } from '../../data/icons'

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
