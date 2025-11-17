import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, getTaskById, updateTask, deleteTask } from '../api/Tasks'
import { CreateTaskPayload, UpdateTaskPayload } from '../types/planner/task.api'
import { useToastStore } from '../../../store/useToastStore'
import { ObjectiveBoard } from '../types/kanban/board.types'
import { mapApiPriorityToComponentPriority, mapStatusToComponentStatus } from '../utils/kanbanUtils'
import { useTranslation } from 'react-i18next'

export const useTask = (taskId: string | null) => {
  return useQuery({
    queryKey: ['tasks', 'detail', taskId],
    queryFn: async () => {
      if (!taskId) throw new Error('Task ID is required')
      return await getTaskById(taskId)
    },
    enabled: !!taskId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()
  const { t } = useTranslation('goals')

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ 
        queryKey: ['kanban-tasks', newTask.objective_id] 
      })

      const previousKanbanTasks = queryClient.getQueryData(['kanban-tasks', newTask.objective_id])

      queryClient.setQueryData(['kanban-tasks', newTask.objective_id], (oldData: ObjectiveBoard | undefined) => {
        if (!oldData || !oldData.columns) {
          return oldData
        }

        const todoColumn = oldData.columns.find(col => col.id === 'todo')
        if (!todoColumn) {
          return oldData
        }

        const optimisticTask = {
          id: `temp-${Date.now()}`,
          title: newTask.title,
          description: newTask.description,
          priority: mapApiPriorityToComponentPriority(newTask.priority),
          dueDate: newTask.due_date || null,
          status: 'TODO' as const,
        }

        const updatedColumns = oldData.columns.map(col => 
          col.id === 'todo' 
            ? { ...col, tasks: [...col.tasks, optimisticTask] }
            : col
        )

        return {
          ...oldData,
          columns: updatedColumns
        }
      })

      return { previousKanbanTasks }
    },
    
    onError: (_err, newTask, context) => {
      if (context?.previousKanbanTasks) {
        queryClient.setQueryData(['kanban-tasks', newTask.objective_id], context.previousKanbanTasks)
      }
      
      showToast(t('toasts.tasks.createError'), 'error')
    },
    
    onSuccess: (task, payload) => {
      queryClient.setQueryData(['kanban-tasks', payload.objective_id], (oldData: ObjectiveBoard | undefined) => {
        if (!oldData || !oldData.columns) {
          return oldData
        }

        const realTask = {
          id: task.taskId,
          title: task.title,
          description: task.description,
          priority: mapApiPriorityToComponentPriority(task.priority),
          dueDate: task.dueDate || null,
          status: mapStatusToComponentStatus(task.status),
        }

        const updatedColumns = oldData.columns.map(col => 
          col.id === 'todo' 
            ? { 
                ...col, 
                tasks: col.tasks.map(item => 
                  item.id.startsWith('temp-') ? realTask : item
                )
              }
            : col
        )

        return {
          ...oldData,
          columns: updatedColumns
        }
      })
      
      showToast(t('toasts.tasks.createSuccess'), 'success')
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()
  const { t } = useTranslation('goals')

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateTaskPayload }) => {
      return await updateTask(id, payload)
    },
        
    onError: () => {
      showToast(t('toasts.tasks.updateError'), 'error')
    },
    
    onSuccess: (task, { id }) => {
      queryClient.setQueryData(['tasks', 'detail', id], task)
      
      queryClient.invalidateQueries({ queryKey: ['kanban-tasks'] })
      
      showToast(t('toasts.tasks.updateSuccess'), 'success')
    },
  })
}

export const useDeleteTask = (objectiveId: string | null) => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()
  const { t } = useTranslation('goals')

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteTask(id)
    },

    onError: (error) => {
      const message = (error as Error)?.message || t('toasts.tasks.deleteError')
      showToast(message, 'error')
    },
    
    onSuccess: ({ message }) => {
      if (objectiveId) {
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
      }

      showToast(message || t('toasts.tasks.deleteSuccess'), 'success')
    },
  })
}
