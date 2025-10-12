import { useQuery } from '@tanstack/react-query'
import { getAllModules } from '../api/Modules'

export const useModules = (offset: number = 0, limit: number = 10) => {
  return useQuery({
    queryKey: ['modules', 'list', { offset, limit }],
    queryFn: async () => {
      const response = await getAllModules(offset, limit)
      return response
    },
    staleTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  })
}

