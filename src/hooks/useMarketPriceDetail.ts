import { useQuery } from '@tanstack/react-query'
import { fetchMarketPriceDetail } from '../api/idleClansApi'

export function useMarketPriceDetail(itemId: number | null) {
  return useQuery({
    queryKey: ['marketPriceDetail', itemId],
    queryFn: () => fetchMarketPriceDetail(itemId as number),
    enabled: itemId !== null,
    staleTime: 2 * 60 * 1000,
  })
}
