import { api } from "../../../config/api"
import { fetchWithAuth } from "../../../utils/fetchWithAuth"
import { MoveTaskPayload, MoveTaskResponse } from "../types/kanban/move-task.api"

export async function moveTaskInKanban(
  objectiveId: string, 
  payload: MoveTaskPayload
): Promise<MoveTaskResponse> {
  const response = await fetchWithAuth(api.objectives.moveTask(objectiveId), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  return response.data
}
