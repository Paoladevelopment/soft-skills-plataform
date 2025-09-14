import { Priority } from "../common.enums"
import { TaskType } from "../common.enums"
import { Task } from "./planner.models"

export interface CreateTaskPayload {
  title: string
  description: string
  task_type: TaskType
  priority: Priority
  estimated_time: number
  due_date?: string
  is_optional?: boolean
  objective_id: string
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  task_type?: TaskType
  priority?: Priority
  due_date?: string
  is_optional?: boolean
  estimated_time?: number
}

export interface CreateTaskResponse {
  message: string
  data: Task
}

export interface UpdateTaskResponse {
  message: string
  data: Task
}

export interface DeleteObjectiveResponse {
  message: string
  task_id: string
}

export interface FetchTaskResponse {
  message: string
  data: Task
}