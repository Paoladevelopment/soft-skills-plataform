import { Priority } from "../common.enums"
import { TaskType } from "../common.enums"
import { Task } from "./planner.models"

export interface CreateTaskPayload {
  title: string
  description: string
  task_type: TaskType
  priority: Priority
  estimated_seconds: number
  pomodoro_length_seconds_snapshot: number
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
  estimated_seconds?: number
  actual_seconds?: number
  pomodoro_length_seconds_snapshot?: number
}

export interface TaskResponse {
  message: string
  data: Task
}

export interface DeleteTaskResponse {
  message: string
  task_id: string
}