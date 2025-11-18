import { api } from "../../../config/api"
import { fetchWithAuth } from "../../../utils/fetchWithAuth"
import { 
  CreateNotePayload,
  UpdateNotePayload,
  NoteResponse,
  NotesResponse,
  DeleteNoteResponse
} from "../types/planner/note.api"

export async function getTaskNotes(taskId: string): Promise<NotesResponse> {
  const url = api.tasks.notes(taskId)

  const response = await fetchWithAuth(url)
  return response
}

export async function createTaskNote(taskId: string, payload: CreateNotePayload): Promise<NoteResponse> {
  const url = api.tasks.notes(taskId)

  const response = await fetchWithAuth(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  return response
}

export async function updateTaskNote(
  taskId: string, 
  noteId: string, 
  payload: UpdateNotePayload
): Promise<NoteResponse> {
  const url = api.tasks.noteById(taskId, noteId)

  const response = await fetchWithAuth(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  return response
}

export async function deleteTaskNote(taskId: string, noteId: string): Promise<DeleteNoteResponse> {
  const url = api.tasks.noteById(taskId, noteId)

  const response = await fetchWithAuth(url, {
    method: "DELETE",
  })

  return response
}

