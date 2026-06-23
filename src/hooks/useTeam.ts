import { useTeamStore } from '../store/teamStore'

export function useTeam() {
  return useTeamStore((state) => state.team)
}

export function useTeamActions() {
  const setAccount = useTeamStore((state) => state.setAccount)
  const setTeamName = useTeamStore((state) => state.setTeamName)
  return { setAccount, setTeamName }
}

export function useWishlistActions() {
  const addWishlistItem = useTeamStore((state) => state.addWishlistItem)
  const removeWishlistItem = useTeamStore((state) => state.removeWishlistItem)
  const setWishlistPriority = useTeamStore((state) => state.setWishlistPriority)
  const toggleWishlistAcquired = useTeamStore((state) => state.toggleWishlistAcquired)
  return { addWishlistItem, removeWishlistItem, setWishlistPriority, toggleWishlistAcquired }
}
