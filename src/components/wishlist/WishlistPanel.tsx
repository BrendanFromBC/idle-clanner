import { useMemo, useState } from 'react'
import { ITEMS } from '../../data/items'
import { useTeam, useWishlistActions } from '../../hooks/useTeam'
import { useMarketPrices } from '../../hooks/useMarketPrices'
import { WishlistItemRow } from './WishlistItemRow'
import type { AccountSlot } from '../../store/teamStore'

const SLOTS = ['main', 'alt1', 'alt2'] as const
type Slot = (typeof SLOTS)[number]

export function WishlistPanel() {
  const team = useTeam()
  const { addWishlistItem } = useWishlistActions()
  const { data: marketPrices } = useMarketPrices()
  const [search, setSearch] = useState('')
  const [forSlot, setForSlot] = useState<Slot>('main')

  const matches = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return []
    return ITEMS.filter((i) => i.displayName.toLowerCase().includes(query)).slice(0, 10)
  }, [search])

  const accountsWithUsernames = SLOTS.filter((slot) => team.accounts[slot].username)

  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-lg border border-gray-300 bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-900">Add a wishlist goal</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search for an item…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
          />
          <select
            value={forSlot}
            onChange={(e) => setForSlot(e.target.value as Slot)}
            className="rounded border border-gray-300 bg-white px-2 py-2 text-sm text-gray-900"
          >
            {SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {team.accounts[slot].username ?? slot.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        {matches.length > 0 && (
          <div className="space-y-1">
            {matches.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  addWishlistItem(item.id, forSlot)
                  setSearch('')
                }}
                className="block w-full rounded border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
              >
                {item.displayName}
              </button>
            ))}
          </div>
        )}
      </div>

      {team.wishlist.length === 0 && (
        <p className="text-sm text-gray-500">No wishlist goals yet — search above to add one.</p>
      )}

      {marketPrices &&
        accountsWithUsernames.map((slot) => {
          const items = team.wishlist.filter((w) => w.forSlot === slot)
          if (items.length === 0) return null
          return <AccountWishlist key={slot} slot={slot} account={team.accounts[slot]} items={items} marketPrices={marketPrices} />
        })}

      {marketPrices &&
        team.wishlist.filter((w) => !accountsWithUsernames.includes(w.forSlot)).length > 0 && (
          <AccountWishlist
            slot={null}
            account={null}
            items={team.wishlist.filter((w) => !accountsWithUsernames.includes(w.forSlot))}
            marketPrices={marketPrices}
          />
        )}
    </div>
  )
}

function AccountWishlist({
  slot,
  account,
  items,
  marketPrices,
}: {
  slot: Slot | null
  account: AccountSlot | null
  items: ReturnType<typeof useTeam>['wishlist']
  marketPrices: NonNullable<ReturnType<typeof useMarketPrices>['data']>
}) {
  const sorted = [...items].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.priority] - order[b.priority]
  })

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-900">
        {account?.username ?? slot?.toUpperCase() ?? 'Unassigned'}
      </h4>
      <div className="space-y-2">
        {sorted.map((w) => (
          <WishlistItemRow key={w.id} wishlistItem={w} marketPrices={marketPrices} />
        ))}
      </div>
    </div>
  )
}
