import { api } from "../../../config/api"
import { fetchWithAuth } from "../../../utils/fetchWithAuth"
import { 
  CreateResourcePayload,
  UpdateResourcePayload,
  ResourceResponse,
  ResourcesResponse,
  DeleteResourceResponse
} from "../types/planner/resource.api"

export async function getTaskResources(taskId: string): Promise<ResourcesResponse> {
  const url = api.tasks.resources(taskId)

  const response = await fetchWithAuth(url)
  return response
}

export async function createTaskResource(taskId: string, payload: CreateResourcePayload): Promise<ResourceResponse> {
  const url = api.tasks.resources(taskId)

  const response = await fetchWithAuth(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  return response
}

export async function updateTaskResource(
  taskId: string, 
  resourceId: string, 
  payload: UpdateResourcePayload
): Promise<ResourceResponse> {
  const url = api.tasks.resourceById(taskId, resourceId)

  const response = await fetchWithAuth(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  return response
}

export async function deleteTaskResource(taskId: string, resourceId: string): Promise<DeleteResourceResponse> {
  const url = api.tasks.resourceById(taskId, resourceId)

  const response = await fetchWithAuth(url, {
    method: "DELETE",
  })

  return response
}

