import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AccountRole = 'main' | 'gatherer' | 'crafter' | 'support' | 'unassigned'

export interface AccountSlot {
  username: string | null
  role: AccountRole
  nickname?: string
}

export type WishlistPriority = 'low' | 'medium' | 'high'

export interface WishlistItem {
  id: string
  itemId: number // references data/items.ts ITEMS_BY_ID — real numeric item ids, not gear.ts-specific
  forSlot: 'main' | 'alt1' | 'alt2'
  priority: WishlistPriority
  notes?: string
  acquired: boolean
}

export interface Team {
  id: string
  name: string
  accounts: {
    main: AccountSlot
    alt1: AccountSlot
    alt2: AccountSlot
  }
  wishlist: WishlistItem[]
}

function emptySlot(role: AccountRole): AccountSlot {
  return { username: null, role }
}

function createDefaultTeam(): Team {
  return {
    id: crypto.randomUUID(),
    name: 'My Team',
    accounts: {
      main: emptySlot('main'),
      alt1: emptySlot('gatherer'),
      alt2: emptySlot('crafter'),
    },
    wishlist: [],
  }
}

interface TeamState {
  team: Team
  setAccount: (slot: keyof Team['accounts'], update: Partial<AccountSlot>) => void
  setTeamName: (name: string) => void
  addWishlistItem: (itemId: number, forSlot: WishlistItem['forSlot'], priority?: WishlistPriority) => void
  removeWishlistItem: (id: string) => void
  setWishlistPriority: (id: string, priority: WishlistPriority) => void
  toggleWishlistAcquired: (id: string) => void
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      team: createDefaultTeam(),
      setAccount: (slot, update) =>
        set((state) => ({
          team: {
            ...state.team,
            accounts: {
              ...state.team.accounts,
              [slot]: { ...state.team.accounts[slot], ...update },
            },
          },
        })),
      setTeamName: (name) =>
        set((state) => ({
          team: { ...state.team, name },
        })),
      addWishlistItem: (itemId, forSlot, priority = 'medium') =>
        set((state) => ({
          team: {
            ...state.team,
            wishlist: [
              ...state.team.wishlist,
              { id: crypto.randomUUID(), itemId, forSlot, priority, acquired: false },
            ],
          },
        })),
      removeWishlistItem: (id) =>
        set((state) => ({
          team: { ...state.team, wishlist: state.team.wishlist.filter((w) => w.id !== id) },
        })),
      setWishlistPriority: (id, priority) =>
        set((state) => ({
          team: {
            ...state.team,
            wishlist: state.team.wishlist.map((w) => (w.id === id ? { ...w, priority } : w)),
          },
        })),
      toggleWishlistAcquired: (id) =>
        set((state) => ({
          team: {
            ...state.team,
            wishlist: state.team.wishlist.map((w) => (w.id === id ? { ...w, acquired: !w.acquired } : w)),
          },
        })),
    }),
    { name: 'idle-clanner-team' },
  ),
)
