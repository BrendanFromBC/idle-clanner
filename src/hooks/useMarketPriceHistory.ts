import { useQuery } from '@tanstack/react-query'
import { fetchMarketPriceHistory } from '../api/idleClansApi'

export function useMarketPriceHistory(itemId: number | null) {
  return useQuery({
    queryKey: ['marketPriceHistory', itemId],
    queryFn: () => fetchMarketPriceHistory(itemId as number),
    enabled: itemId !== null,
    staleTime: 2 * 60 * 1000,
  })
}
