import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getObjectivesByLearningGoal } from '../api/LearningGoals'
import { createObjective, deleteObjective, getObjectiveById, updateObjective } from '../api/Objectives'
import { useDebounce } from './useDebounce'
import { CreateObjectivePayload, Objective, FetchObjectivesResponse, UpdateObjectivePayload } from '../types/planner/objectives.api'
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
      const { data: objective } = await getObjectiveById(objectiveId!)
      return objective
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
            objectiveId: `temp-${Date.now()}`,
            title: newObjective.title,
            description: newObjective.description || '',
            status: Status.NotStarted,
            priority: newObjective.priority,
            dueDate: newObjective.due_date || null,
            createdAt: null,
            updatedAt: null,
            startedAt: null,
            completedAt: null,
            totalTasks: 0,
            completedTasks: 0,
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

export const useUpdateObjective = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateObjectivePayload }) => {
      const { data, message } = await updateObjective(id, payload)
      return { objective: data, message }
    },
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['objectives', 'detail', id] })
      await queryClient.cancelQueries({ queryKey: ['objectives', 'list'] })

      const previousDetail = queryClient.getQueryData(['objectives', 'detail', id])
      const previousLists = queryClient.getQueriesData({ queryKey: ['objectives', 'list'] })

      queryClient.setQueryData(['objectives', 'detail', id], (oldData: Objective | undefined) => {
        if (!oldData) return oldData
        return { ...oldData, ...payload, updatedAt: new Date().toISOString() }
      })

      queryClient.setQueriesData(
        { queryKey: ['objectives', 'list'] },
        (oldData: FetchObjectivesResponse | undefined) => {
          if (!oldData || !oldData.data) return oldData
          return {
            ...oldData,
            data: oldData.data.map((objective) =>
              objective.objectiveId === id 
                ? { ...objective, ...payload, updatedAt: new Date().toISOString() }
                : objective
            )
          }
        }
      )

      return { previousDetail, previousLists }
    },
    onError: (_error: Error, { id }, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(['objectives', 'detail', id], context.previousDetail)
      }

      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      
      showToast('Failed to update objective. Please try again.', 'error')
    },
    onSuccess: ({ objective, message }, { id }) => {
      queryClient.setQueryData(['objectives', 'detail', id], objective)
      showToast(message || 'Objective updated successfully!', 'success', 2000)
    }
  })
}

export const useDeleteObjective = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteObjective(id)
      return response
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['objectives', 'detail', id] })
      await queryClient.cancelQueries({ queryKey: ['objectives', 'list'] })

      const previousLists = queryClient.getQueriesData({ queryKey: ['objectives', 'list'] })

      queryClient.setQueriesData(
        { queryKey: ['objectives', 'list'] },
        (oldData: FetchObjectivesResponse | undefined) => {
          if (!oldData || !oldData.data) return oldData
          const filteredObjectives = oldData.data.filter((objective) => objective.objectiveId !== id)
          return {
            ...oldData,
            data: filteredObjectives,
            total: oldData.total - 1
          }
        }
      )

      queryClient.removeQueries({ queryKey: ['objectives', 'detail', id] })

      return { previousLists }
    },
      
    onError: (error: Error, _id, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      
      showToast(error.message || 'Error deleting objective', 'error')
    },
    onSuccess: ({ message }) => {
      showToast(message || 'Objective deleted successfully', 'success')
    }
  })
}
