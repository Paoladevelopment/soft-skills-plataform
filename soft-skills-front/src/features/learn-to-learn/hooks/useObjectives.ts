import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getObjectivesByLearningGoal } from '../api/LearningGoals'
import { createObjective } from '../api/Objectives'
import { useDebounce } from './useDebounce'
import { CreateObjectivePayload, Objective, FetchObjectivesResponse } from '../types/planner/objectives.api'
import { Status } from '../types/common.enums'
import { useToastStore } from '../../../store/useToastStore'

export const useObjectives = (
  learningGoalId: string | null,
  offset: number = 0,
  limit: number = 10,
  status?: string,
  priority?: string[],
  search?: string,
  orderBy?: string[]
) => {
  const debouncedSearch = useDebounce(search)

  return useQuery({
    queryKey: ['objectives', 'list', learningGoalId, { offset, limit, status, priority, search: debouncedSearch, orderBy }],
    queryFn: async () => {
      if (!learningGoalId) throw new Error('Learning goal ID is required')

      const response = await getObjectivesByLearningGoal(learningGoalId, offset, limit, status, priority, debouncedSearch, orderBy)
      
      return response
    },
    enabled: !!learningGoalId,
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  })
}

export const useObjective = (objectiveId: string | null) => {
  return useQuery({
    queryKey: ['objectives', 'detail', objectiveId],
    queryFn: async () => {
      return null
    },
    enabled: !!objectiveId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateObjective = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()

  return useMutation({
    mutationFn: (payload: CreateObjectivePayload) => 
      createObjective(payload),
    
    onMutate: async (newObjective) => {
      await queryClient.cancelQueries({ 
        queryKey: ['objectives', 'list'] 
      })

      const previousObjectives = queryClient.getQueriesData({ 
        queryKey: ['objectives', 'list'] 
      })

      queryClient.setQueriesData(
        { queryKey: ['objectives', 'list'] },
        (oldData: FetchObjectivesResponse | undefined) => {
          if (!oldData || !oldData.data) return oldData
          
          const optimisticObjective: Objective = {
            objective_id: `temp-${Date.now()}`,
            title: newObjective.title,
            description: newObjective.description || '',
            status: Status.NotStarted,
            priority: newObjective.priority,
            due_date: newObjective.due_date || '',
            order_index: oldData.data.length,
            started_at: null,
            completed_at: null,
            total_tasks: 0,
            completed_tasks: 0,
          }

          return {
            ...oldData,
            data: [optimisticObjective, ...oldData.data],
            total: oldData.total + 1,
          }
        }
      )

      return { previousObjectives }
    },
    
    onError: (_err, _newObjective, context) => {
      if (context?.previousObjectives) {
        context.previousObjectives.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      
      showToast('Failed to create objective. Please try again.', 'error')
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['objectives', 'list'] 
      })
      
      showToast('Objective created successfully!', 'success')
    },
  })
}
