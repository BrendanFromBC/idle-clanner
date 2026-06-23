import { useQuery } from '@tanstack/react-query'
import { fetchPlayerProfile } from '../api/idleClansApi'
import { toPlayerProfile } from '../types/player'

export function usePlayerProfile(username: string | null) {
  return useQuery({
    queryKey: ['playerProfile', username],
    queryFn: () => fetchPlayerProfile(username as string).then(toPlayerProfile),
    enabled: username !== null,
    staleTime: 5 * 60 * 1000,
  })
}
