import { useQuery } from '@tanstack/react-query'
import { fetchClanRecruitment } from '../api/idleClansApi'
import { toClanProfile } from '../types/clan'

export function useClanProfile(clanName: string | null) {
  return useQuery({
    queryKey: ['clan', clanName],
    queryFn: () => fetchClanRecruitment(clanName!).then(toClanProfile),
    enabled: clanName !== null,
    staleTime: 5 * 60 * 1000,
  })
}
