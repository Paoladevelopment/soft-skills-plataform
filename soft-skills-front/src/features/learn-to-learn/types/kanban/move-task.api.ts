export interface MoveTaskPayload {
  task_id: string
  from_column: string
  to_column: string
  new_position: number
  reason?: string
}

export interface MoveTaskResponse {
  message: string
  data: {
    id: string
    status: string
    column: string
    position: number
  }
  old: {
    id: string
    status: string
    column: string
    position: number
  }
}

export type ApiErrorData = {
  detail?: {
    error?: string
    required_actions?: string[]
  }
}