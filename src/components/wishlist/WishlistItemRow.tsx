import type { WishlistItem, WishlistPriority } from '../../store/teamStore'
import { ITEMS_BY_ID } from '../../data/items'
import type { MarketPrice } from '../../types/market'
import { useWishlistActions } from '../../hooks/useTeam'
import { formatGold } from '../../utils/formatGold'
import { ItemIcon } from '../ui/Icon'

const PRIORITIES: WishlistPriority[] = ['low', 'medium', 'high']

export function WishlistItemRow({
  wishlistItem,
  marketPrices,
}: {
  wishlistItem: WishlistItem
  marketPrices: MarketPrice[]
}) {
  const { removeWishlistItem, setWishlistPriority, toggleWishlistAcquired } = useWishlistActions()
  const item = ITEMS_BY_ID.get(wishlistItem.itemId)
  const price = marketPrices.find((p) => p.itemId === wishlistItem.itemId)

  const acquisitionText =
    item && !item.tradeable
      ? 'Not tradeable on the market'
      : price && price.lowestPriceVolume > 0
        ? `Buy from market for ${formatGold(price.lowestSellPrice)} gold`
        : 'No active market listing'

  return (
    <div className={`rounded-lg border border-slate-600 bg-slate-800 p-3 ${wishlistItem.acquired ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={wishlistItem.acquired}
            onChange={() => toggleWishlistAcquired(wishlistItem.id)}
          />
          <span
            className={`flex items-center gap-2 font-medium text-gray-100 ${wishlistItem.acquired ? 'line-through' : ''}`}
          >
            <ItemIcon itemId={wishlistItem.itemId} />
            {item?.displayName ?? `Item #${wishlistItem.itemId}`}
          </span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase text-gray-400">{wishlistItem.forSlot}</span>
          <select
            value={wishlistItem.priority}
            onChange={(e) => setWishlistPriority(wishlistItem.id, e.target.value as WishlistPriority)}
            className="rounded border border-slate-600 bg-slate-700 px-2 py-1 text-xs text-gray-100"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => removeWishlistItem(wishlistItem.id)}
            className="text-xs text-rose-400 underline"
          >
            Remove
          </button>
        </div>
      </div>
      <p className="mt-1 text-sm text-gray-400">{acquisitionText}</p>
    </div>
  )
}
