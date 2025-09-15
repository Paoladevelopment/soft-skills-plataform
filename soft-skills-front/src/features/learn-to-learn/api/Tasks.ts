import { api } from "../../../config/api"
import { fetchWithAuth } from "../../../utils/fetchWithAuth"
import { 
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskResponse,
  DeleteTaskResponse
} from "../types/planner/task.api"
import { Task } from "../types/planner/planner.models"

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const response = await fetchWithAuth(api.tasks.create, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  return response.data
}

export async function getTaskById(id: string): Promise<TaskResponse> {
  const response = await fetchWithAuth(api.tasks.byId(id))
  return response.data
}

export async function updateTask(id: string, payload: UpdateTaskPayload): Promise<TaskResponse> {
  const response = await fetchWithAuth(api.tasks.update(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  return response.data
}

export async function deleteTask(id: string): Promise<DeleteTaskResponse> {
  const response = await fetchWithAuth(api.tasks.delete(id), {
    method: "DELETE",
  })

  return response
}
