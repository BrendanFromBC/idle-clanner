import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AccountSlotKey = 'main' | 'alt1' | 'alt2'

interface OwnedItemsState {
  // itemIds the player has manually marked as owned, per account slot. The
  // public API only exposes *equipped* gear, not inventory — this is the
  // self-report workaround for "I own this but it's not worn right now."
  ownedByAccount: Record<AccountSlotKey, number[]>
  setOwned: (slot: AccountSlotKey, itemId: number, owned: boolean) => void
  isOwned: (slot: AccountSlotKey, itemId: number) => boolean
  // For mutually-exclusive groups (e.g. a skill's tool tiers — you only own
  // one tier "now"): clears every id in `groupItemIds` then sets `itemId`
  // (or just clears, if itemId is null — "none owned").
  setOwnedInGroup: (slot: AccountSlotKey, groupItemIds: number[], itemId: number | null) => void
}

export const useOwnedItemsStore = create<OwnedItemsState>()(
  persist(
    (set, get) => ({
      ownedByAccount: { main: [], alt1: [], alt2: [] },
      setOwned: (slot, itemId, owned) =>
        set((state) => {
          const current = state.ownedByAccount[slot]
          const next = owned
            ? [...current, itemId].filter((id, i, arr) => arr.indexOf(id) === i)
            : current.filter((id) => id !== itemId)
          return { ownedByAccount: { ...state.ownedByAccount, [slot]: next } }
        }),
      isOwned: (slot, itemId) => get().ownedByAccount[slot].includes(itemId),
      setOwnedInGroup: (slot, groupItemIds, itemId) =>
        set((state) => {
          const current = state.ownedByAccount[slot]
          const withoutGroup = current.filter((id) => !groupItemIds.includes(id))
          const next = itemId !== null ? [...withoutGroup, itemId] : withoutGroup
          return { ownedByAccount: { ...state.ownedByAccount, [slot]: next } }
        }),
    }),
    { name: 'idle-clanner-owned-items' },
  ),
)
