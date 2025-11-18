export interface Note {
  noteId: string
  taskId: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface CreateNotePayload {
  title: string
  content: string
}

export interface UpdateNotePayload {
  title?: string
  content?: string
}

export interface NoteResponse {
  message: string
  data: Note
}

export interface NotesResponse {
  message: string
  data: Note[]
}

export interface DeleteNoteResponse {
  message: string
  noteId: string
}

