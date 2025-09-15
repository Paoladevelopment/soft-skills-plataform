import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, getTaskById, updateTask, deleteTask } from '../api/Tasks'
import { CreateTaskPayload, UpdateTaskPayload } from '../types/planner/task.api'
import { Task } from '../types/planner/planner.models'
import { useToastStore } from '../../../store/useToastStore'
import { KanbanApiResponse, TaskColumnResponse} from '../types/kanban/task.api'
import { ObjectiveBoard } from '../types/kanban/board.types'
import { mapApiPriorityToComponentPriority, mapStatusToComponentStatus } from '../utils/kanbanUtils'

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
      
      showToast('Failed to create task. Please try again.', 'error')
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
      
      showToast('Task created successfully!', 'success')
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateTaskPayload }) => {
      return await updateTask(id, payload)
    },
    
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', 'detail', id] })
      
      const kanbanQueries = queryClient.getQueriesData({ queryKey: ['kanban-tasks'] })
      
      const previousTaskDetail = queryClient.getQueryData(['tasks', 'detail', id])
      const previousKanbanQueries = kanbanQueries.map(([queryKey, data]) => [queryKey, data])

      queryClient.setQueryData(['tasks', 'detail', id], (oldData: Task | undefined) => {
        if (!oldData) return oldData
        return { ...oldData, ...payload, updatedAt: new Date().toISOString() }
      })

      kanbanQueries.forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, (oldData: KanbanApiResponse | undefined) => {
          if (!oldData) return oldData

          const updateTaskInColumn = (column: TaskColumnResponse | undefined) => {
            if (!column?.items) return column
            return {
              ...column,
              items: column.items.map((task) =>
                task.taskId === id 
                  ? { ...task, ...payload }
                  : task
              )
            }
          }

          return {
            ...oldData,
            columns: {
              notStarted: updateTaskInColumn(oldData.columns?.notStarted),
              inProgress: updateTaskInColumn(oldData.columns?.inProgress),
              completed: updateTaskInColumn(oldData.columns?.completed),
              paused: updateTaskInColumn(oldData.columns?.paused),
            }
          }
        })
      })

      return { previousTaskDetail, previousKanbanQueries }
    },
    
    onError: (_error, { id }, context) => {
      if (context?.previousTaskDetail) {
        queryClient.setQueryData(['tasks', 'detail', id], context.previousTaskDetail)
      }

      if (context?.previousKanbanQueries) {
        context.previousKanbanQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey as readonly unknown[], data)
        })
      }
      
      showToast('Failed to update task. Please try again.', 'error')
    },
    
    onSuccess: (task, { id }) => {
      queryClient.setQueryData(['tasks', 'detail', id], task)
      
      queryClient.invalidateQueries({ queryKey: ['kanban-tasks'] })
      
      showToast('Task updated successfully!', 'success')
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteTask(id)
    },
    
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', 'detail', id] })
      
      const kanbanQueries = queryClient.getQueriesData({ queryKey: ['kanban-tasks'] })
      const previousKanbanQueries = kanbanQueries.map(([queryKey, data]) => [queryKey, data])

      kanbanQueries.forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, (oldData: KanbanApiResponse | undefined) => {
          if (!oldData) return oldData

          const removeTaskFromColumn = (column: TaskColumnResponse | undefined) => {
            if (!column?.items) return column
            return {
              ...column,
              items: column.items.filter((task) => task.taskId !== id),
              total: Math.max(0, column.total - 1)
            }
          }

          return {
            ...oldData,
            columns: {
              notStarted: removeTaskFromColumn(oldData.columns?.notStarted),
              inProgress: removeTaskFromColumn(oldData.columns?.inProgress),
              completed: removeTaskFromColumn(oldData.columns?.completed),
              paused: removeTaskFromColumn(oldData.columns?.paused),
            }
          }
        })
      })

     
      queryClient.removeQueries({ queryKey: ['tasks', 'detail', id] })

      return { previousKanbanQueries }
    },
      
    onError: (error, _id, context) => {
      if (context?.previousKanbanQueries) {
        context.previousKanbanQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey as readonly unknown[], data)
        })
      }
      
      showToast(error.message || 'Error deleting task', 'error')
    },
    
    onSuccess: ({ message }) => {
      showToast(message || 'Task deleted successfully', 'success')
    },
  })
}
