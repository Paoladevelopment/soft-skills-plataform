import { useQuery } from '@tanstack/react-query'
import { getPublicRoadmaps } from '../api/Roadmaps'
import { PublicRoadmapsParams } from '../types/roadmap/roadmap.api'

interface UsePublicRoadmapsParams extends PublicRoadmapsParams {
  page?: number
  pageSize?: number
}

export function usePublicRoadmaps(params: UsePublicRoadmapsParams = {}) {
  const { page = 1, pageSize = 12, ...filterParams } = params
  const offset = (page - 1) * pageSize

  const queryParams: PublicRoadmapsParams = {
    ...filterParams,
    offset,
    limit: pageSize
  }

  return useQuery({
    queryKey: ['publicRoadmaps', queryParams],
    queryFn: () => getPublicRoadmaps(queryParams),
    staleTime: 60_000,
    placeholderData: (previousData) => previousData,
  })
}
