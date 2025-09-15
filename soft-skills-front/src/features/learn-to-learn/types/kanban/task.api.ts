import { Priority } from '../common.enums'
import { TaskType } from '../common.enums'

export enum TaskStatus {
  NOT_STARTED = 'notStarted',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
  PAUSED = 'paused'
}


export interface TaskItem {
  taskId: string
  title: string
  description: string
  taskType: TaskType
  status: TaskStatus
  priority: Priority
  dueDate: string | null
  isOptional: boolean
}

export interface TaskColumnResponse {
  page: number
  perPage: number
  total: number
  totalPages: number
  hasNext: boolean
  items: TaskItem[]
}

export interface KanbanApiResponse {
  columns: {
    notStarted: TaskColumnResponse
    inProgress: TaskColumnResponse
    completed: TaskColumnResponse
    paused: TaskColumnResponse
  }
}
