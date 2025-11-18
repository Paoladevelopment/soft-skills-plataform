import { Note, CreateNotePayload, UpdateNotePayload } from './note.api'

export interface INoteStore {
  notes: Note[]
  isLoading: boolean
  error: string | null

  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
  updateNote: (noteId: string, note: Note) => void
  removeNote: (noteId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  reset: () => void

  fetchTaskNotes: (taskId: string) => Promise<void>
  createNote: (taskId: string, payload: CreateNotePayload) => Promise<void>
  updateNoteById: (taskId: string, noteId: string, payload: UpdateNotePayload) => Promise<void>
  deleteNoteById: (taskId: string, noteId: string) => Promise<void>
}

