import { api } from "../../../config/api"
import { fetchWithAuth, FetchError } from "../../../utils/fetchWithAuth"
import { MoveTaskPayload, MoveTaskResponse } from "../types/kanban/move-task.api"

const SELF_EVALUATION_REQUIRED_STATUS = 428

export class SelfEvaluationRequiredError extends Error {
  constructor(public taskId: string) {
    super('Self evaluation required')
    this.name = 'SelfEvaluationRequiredError'
  }
}

export async function moveTaskInKanban(
  objectiveId: string, 
  payload: MoveTaskPayload
): Promise<MoveTaskResponse> {
  try {
    const response = await fetchWithAuth(api.objectives.moveTask(objectiveId), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    return response.data
  } catch (error: unknown) {
    const err = error as FetchError
    
    if (err?.status === SELF_EVALUATION_REQUIRED_STATUS) {
      throw new SelfEvaluationRequiredError(payload.task_id)
    }
    
    throw error
  }
}
