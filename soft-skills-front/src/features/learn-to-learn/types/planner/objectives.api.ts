import { Priority, Status } from "../common.enums"

export interface CreateObjectivePayload {
  title: string
  description: string
  orderIndex: number
  learningGoalId: string
  dueDate?: string
  priority: Priority
}

export interface UpdateObjectivePayload {
  title?: string
  description?: string
  priority?: Priority
  dueDate?: string
}

export interface ObjectiveResponse {
  title: string
  description: string
  status: Status
  priority: Priority
  orderIndex: number
  dueDate: string | null
  objectiveId: string
  startedAt: string | null
  completedAt: string | null
  totalTasks: number
  completedTasks: number
}

export interface FetchObjectivesResponse {
  message: string
  data: ObjectiveResponse[]
  total: number
  offset: number
  limit: number
}