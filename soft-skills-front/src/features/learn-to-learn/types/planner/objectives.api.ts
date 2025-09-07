import { Priority, Status } from "../common.enums"

export interface Objective {
  objectiveId: string
  title: string
  description: string
  status: Status
  priority: Priority
  dueDate: string | null
  createdAt: string | null
  updatedAt: string | null
  startedAt: string | null
  completedAt: string | null
  totalTasks: number
  completedTasks: number
}

export interface FetchObjectivesResponse {
  message: string
  data: Objective[]
  total: number
  offset: number
  limit: number
}

export interface CreateObjectivePayload {
  title: string
  description?: string
  priority: Priority
  due_date?: string
  learning_goal_id?: string
  order_index?: number
}

export interface UpdateObjectivePayload {
  title?: string
  description?: string
  status?: Status
  priority?: Priority
  due_date?: string
}

export interface CreateObjectiveResponse {
  message: string
  data: Objective
}

export interface UpdateObjectiveResponse {
  message: string
  data: Objective
}

export interface DeleteObjectiveResponse {
  message: string
  objective_id: string
}

export interface FetchObjectiveResponse {
  message: string
  data: Objective
}