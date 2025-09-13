import { useQuery } from '@tanstack/react-query'
import { fetchKanbanTasks } from '../api/KanbanTasks'
import { transformKanbanApiResponse } from '../utils/kanbanUtils'

export const useKanbanTasks = (objectiveId: string | null, objectiveTitle: string = '') => {
  return useQuery({
    queryKey: ['kanban-tasks', objectiveId],
    queryFn: async () => {
      if (!objectiveId) throw new Error('Objective ID is required')
      
      const apiResponse = await fetchKanbanTasks(objectiveId)
      return transformKanbanApiResponse(apiResponse, objectiveId, objectiveTitle)
    },
    enabled: !!objectiveId,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
  })
}
