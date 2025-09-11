import { useQuery } from '@tanstack/react-query'
import { fetchKanbanTasks } from '../api/KanbanTasks'
import { transformKanbanApiResponse } from '../utils/kanbanUtils'

export const useKanbanTasks = (objectiveId: string | null, objectiveTitle: string = '') => {
  return useQuery({
    queryKey: ['kanban-tasks', objectiveId],
    queryFn: async () => {
      if (!objectiveId) throw new Error('Objective ID is required')
      
      try {
        const apiResponse = await fetchKanbanTasks(objectiveId)
        console.log('Kanban API Response:', apiResponse)
        return transformKanbanApiResponse(apiResponse, objectiveId, objectiveTitle)
      } catch (error) {
        console.error('Kanban fetch error:', error)
        throw error
      }
    },
    enabled: !!objectiveId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
