import { Priority, Status } from "../common.enums"

export interface Objective {
  objective_id: string
  title: string
  description: string
  status: Status
  priority: Priority
  due_date: string
  order_index: number
  started_at: string | null
  completed_at: string | null
  total_tasks: number
  completed_tasks: number
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
}