import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchKanbanTasks } from '../api/KanbanTasks'
import { moveTaskInKanban } from '../api/MoveTask'
import { transformKanbanApiResponse, mapColumnIdToApiFormat } from '../utils/kanbanUtils'
import { useToastStore } from '../../../store/useToastStore'

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

export const useKanbanMoveTasks = (objectiveId: string | null) => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()

  return useMutation({
    mutationFn: async ({ 
      taskId, 
      fromColumnId, 
      toColumnId, 
      newPosition, 
      reason 
    }: {
      taskId: string
      fromColumnId: string
      toColumnId: string
      newPosition: number
      reason?: string
    }) => {
      return await moveTaskInKanban(objectiveId!, {
        task_id: taskId,
        from_column: mapColumnIdToApiFormat(fromColumnId),
        to_column: mapColumnIdToApiFormat(toColumnId),
        new_position: newPosition,
        reason
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['kanban-tasks', objectiveId]
      })

      queryClient.invalidateQueries({
        queryKey: ['objectives', 'detail', objectiveId]
      })

      queryClient.invalidateQueries({
        queryKey: ['objectives', 'list']
      })

      queryClient.invalidateQueries({
        queryKey: ['learningGoals', 'list']
      })
      
      queryClient.invalidateQueries({
        queryKey: ['learningGoals', 'detail']
      })
    },
    onError: () => {
      showToast('Error moving task. Please try again.', 'error')
    }
  })
}
