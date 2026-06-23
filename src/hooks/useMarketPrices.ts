import { useQuery } from '@tanstack/react-query'
import { fetchMarketPrices } from '../api/idleClansApi'
import { toMarketPrices } from '../types/market'

export function useMarketPrices() {
  return useQuery({
    queryKey: ['marketPrices'],
    queryFn: () => fetchMarketPrices().then(toMarketPrices),
    staleTime: 2 * 60 * 1000,
  })
}
