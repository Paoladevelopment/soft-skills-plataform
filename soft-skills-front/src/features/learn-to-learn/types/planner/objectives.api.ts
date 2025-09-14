import { Priority, Status } from "../common.enums"
import { Objective } from "./planner.models"
export interface FetchObjectivesResponse {
  message: string
  data: Objective[]
  total: number
  offset: number
  limit: number
}

export interface CreateObjectivePayload {
  title: string
  description: string
  priority: Priority
  due_date?: string
  learning_goal_id: string
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