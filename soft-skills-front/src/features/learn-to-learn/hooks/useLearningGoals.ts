import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserLearningGoals, getLearningGoalById, createLearningGoal, updateLearningGoal, deleteLearningGoal } from '../api/LearningGoals'

import { CreateLearningGoalPayload, UpdateLearningGoalPayload, FetchLearningGoalsResponse } from '../types/planner/learningGoals.api'
import { useToastStore } from '../../../store/useToastStore'
import { useLearningGoalStore } from '../store/useLearningGoalStore'

export const useLearningGoals = (offset: number, limit: number) => {
  return useQuery({
    queryKey: ['learningGoals', 'list', { offset, limit }],
    queryFn: async () => {
      const response = await getUserLearningGoals(offset, limit)
      return response
    },
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  })
}

export const useLearningGoal = (id: string | null) => {
  return useQuery({
    queryKey: ['learningGoals', 'detail', id],
    queryFn: async () => {
      const { data: goal } = await getLearningGoalById(id!)
      return goal
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateLearningGoal = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()
  const { learningGoalsPagination } = useLearningGoalStore()

  return useMutation({
    mutationFn: async (payload: CreateLearningGoalPayload) => {
      const { data, message } = await createLearningGoal(payload)
      return { goal: data, message }
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['learningGoals', 'list'] })

      const previousGoals = queryClient.getQueriesData({ queryKey: ['learningGoals', 'list'] })

      const { limit } = learningGoalsPagination

      const firstPageData = queryClient.getQueryData(['learningGoals', 'list', { offset: 0, limit }])
      
      if (firstPageData) {
        queryClient.setQueryData(
          ['learningGoals', 'list', { offset: 0, limit }],
          (oldData: FetchLearningGoalsResponse | undefined) => {
            if (!oldData || !oldData.data) return oldData
            
            const optimisticGoal = {
              learningGoalId: `temp-${crypto.randomUUID()}`,
              title: payload.title,
              description: payload.description || '',
              impact: payload.impact || '',
              userId: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              startedAt: null,
              completedAt: null,
              totalObjectives: 0,
              completedObjectives: 0
            }
            
            return {
              ...oldData,
              data: [optimisticGoal, ...oldData.data],
              total: oldData.total + 1
            }
          }
        )
      }

      return { previousGoals }
    },
    onError: (error: Error, _payload, context) => {
      if (context?.previousGoals) {
        context.previousGoals.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }

      showToast(error.message || 'Error creating goal', 'error')
    },
    onSuccess: ({ goal, message }, payload) => {
      const { limit } = learningGoalsPagination

      const firstPageData = queryClient.getQueryData(['learningGoals', 'list', { offset: 0, limit }])
      
      if (firstPageData) {
        queryClient.setQueryData(
          ['learningGoals', 'list', { offset: 0, limit }],
          (oldData: FetchLearningGoalsResponse | undefined) => {
            if (!oldData || !oldData.data) return oldData
            
            const updatedData = oldData.data.map((item) => 
              (item.learningGoalId && item.learningGoalId.startsWith('temp-')) ? goal : item
            )
            
            return {
              ...oldData,
              data: updatedData
            }
          }
        )
      }

      showToast(message || `${payload.title} added to your learning goals.`, 'success')
    }
  })
}

export const useUpdateLearningGoal = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateLearningGoalPayload }) => {
      const { data, message } = await updateLearningGoal(id, payload)
      return { goal: data, message, changed: true }
    },
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['learningGoals', 'detail', id] })
      await queryClient.cancelQueries({ queryKey: ['learningGoals', 'list'] })

      const previousDetail = queryClient.getQueryData(['learningGoals', 'detail', id])
      const previousLists = queryClient.getQueriesData({ queryKey: ['learningGoals', 'list'] })

      if (previousDetail) {
        queryClient.setQueryData(['learningGoals', 'detail', id], {
          ...previousDetail,
          ...payload,
          updatedAt: new Date().toISOString()
        })
      }

      queryClient.setQueriesData(
        { queryKey: ['learningGoals', 'list'] },
        (oldData: FetchLearningGoalsResponse | undefined) => {
          if (!oldData || !oldData.data) return oldData
          
          return {
            ...oldData,
            data: oldData.data.map(goal => 
              goal.learningGoalId === id 
                ? { ...goal, ...payload, updatedAt: new Date().toISOString() }
                : goal
            )
          }
        }
      )

      return { previousDetail, previousLists }
    },
    onError: (error: Error, { id }, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(['learningGoals', 'detail', id], context.previousDetail)
      }

      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }

      showToast(error.message || 'Error updating goal', 'error')
    },
    onSuccess: ({ goal, message }, { id }) => {
      queryClient.setQueryData(['learningGoals', 'detail', id], goal)
      showToast(message || 'Goal updated successfully', 'success', 2000)
    }
  })
}

export const useDeleteLearningGoal = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()

  return useMutation({
    mutationFn: async (id: string) => {
      const { message } = await deleteLearningGoal(id)
      return { message }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['learningGoals', 'detail', id] })
      await queryClient.cancelQueries({ queryKey: ['learningGoals', 'list'] })

      const previousLists = queryClient.getQueriesData({ queryKey: ['learningGoals', 'list'] })

      queryClient.setQueriesData(
        { queryKey: ['learningGoals', 'list'] },
        (oldData: FetchLearningGoalsResponse | undefined) => {
          if (!oldData || !oldData.data) return oldData
          const filteredGoals = oldData.data.filter((goal) => goal.learningGoalId !== id)
          return {
            ...oldData,
            data: filteredGoals,
            total: oldData.total - 1
          }
        }
      )

      queryClient.removeQueries({ queryKey: ['learningGoals', 'detail', id] })

      return { previousLists }
    },
      
    onError: (error: Error, _id, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      
      showToast(error.message || 'Error deleting goal', 'error')
    },
    onSuccess: ({ message }) => {
      showToast(message || 'Goal deleted successfully', 'success')
    }
  })
}
