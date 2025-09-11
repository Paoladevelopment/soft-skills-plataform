import { Priority } from '../common.enums'

export enum TaskStatus {
  NOT_STARTED = 'notStarted',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
  PAUSED = 'paused'
}


export interface TaskItem {
  objectiveId: string
  title: string
  description: string
  taskType: string
  status: TaskStatus
  priority: Priority
  estimatedTime: number
  actualTime: number | null
  dueDate: string | null
  isOptional: boolean
  taskId: string
  startedAt: string | null
  completedAt: string | null
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
