import type { GearItem } from '../../data/gear'
import { ITEMS_BY_ID } from '../../data/items'
import type { MarketPrice } from '../../types/market'
import { getAcquisitionCost } from '../../utils/gearHelpers'
import { formatGold } from '../../utils/formatGold'
import { useOwnedItemsStore, type AccountSlotKey } from '../../store/ownedItemsStore'
import { ItemIcon } from '../ui/Icon'

// Ownership is self-reported on the Dashboard (see GearOwnershipChecklist) —
// this card only reads that state to avoid showing a misleading "buy this"
// price for something the player already owns but isn't wearing.

export function GearUpgradeCard({
  bisItem,
  currentItemId,
  marketPrices,
  slot,
}: {
  bisItem: GearItem
  currentItemId: number | null
  marketPrices: MarketPrice[]
  slot: AccountSlotKey
}) {
  const isEquipped = currentItemId === bisItem.id
  const selfReportedOwned = useOwnedItemsStore((s) => s.isOwned(slot, bisItem.id))
  const owned = isEquipped || selfReportedOwned

  const currentName = currentItemId !== null ? ITEMS_BY_ID.get(currentItemId)?.displayName : null
  const cost = getAcquisitionCost(bisItem, marketPrices)

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase text-gray-400">{bisItem.slot}</span>
        {isEquipped && (
          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            BiS equipped
          </span>
        )}
        {!isEquipped && selfReportedOwned && (
          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
            Marked as owned
          </span>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between gap-3">
        <span className="text-sm text-gray-500">
          {currentName ?? (currentItemId === null ? 'Nothing equipped' : `Unknown item #${currentItemId}`)}
        </span>
        {!isEquipped && <span className="text-gray-400">→</span>}
        {!isEquipped && (
          <span className="flex items-center gap-2 font-medium text-gray-900">
            <ItemIcon itemId={bisItem.id} />
            {bisItem.displayName}
          </span>
        )}
      </div>

      {!owned && (
        <p className="mt-2 text-sm text-gray-600">
          {cost !== null
            ? `Buy from market for ${formatGold(cost)} gold`
            : 'Not currently buyable on the market'}
          {bisItem.levelRequired > 0 && ` · requires level ${bisItem.levelRequired}`}
        </p>
      )}
    </div>
  )
}
