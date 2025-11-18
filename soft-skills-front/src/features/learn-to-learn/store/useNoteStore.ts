import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { INoteStore } from '../types/planner/note.store'
import { Note, CreateNotePayload, UpdateNotePayload } from '../types/planner/note.api'
import { getTaskNotes, createTaskNote, updateTaskNote, deleteTaskNote } from '../api/Notes'
import { useToastStore } from '../../../store/useToastStore'
import i18n from '../../../i18n/config'

const initialState = {
  notes: [] as Note[],
  isLoading: false,
  error: null as string | null,
}

export const useNoteStore = create<INoteStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      setNotes: (notes: Note[]) => {
        set((state) => {
          state.notes = notes
        }, false, 'NOTE/SET_NOTES')
      },

      addNote: (note: Note) => {
        set((state) => {
          state.notes.push(note)
        }, false, 'NOTE/ADD_NOTE')
      },

      updateNote: (noteId: string, note: Note) => {
        set((state) => {
          const index = state.notes.findIndex(n => n.noteId === noteId)
          if (index !== -1) {
            state.notes[index] = note
          }
        }, false, 'NOTE/UPDATE_NOTE')
      },

      removeNote: (noteId: string) => {
        set((state) => {
          state.notes = state.notes.filter(n => n.noteId !== noteId)
        }, false, 'NOTE/REMOVE_NOTE')
      },

      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading
        }, false, 'NOTE/SET_LOADING')
      },

      setError: (error: string | null) => {
        set((state) => {
          state.error = error
        }, false, 'NOTE/SET_ERROR')
      },

      clearError: () => {
        set((state) => {
          state.error = null
        }, false, 'NOTE/CLEAR_ERROR')
      },

      reset: () => {
        set(initialState, false, 'NOTE/RESET')
      },

      fetchTaskNotes: async (taskId: string) => {
        set((state) => {
          state.isLoading = true
          state.error = null
        }, false, 'NOTE/FETCH_REQUEST')

        try {
          const response = await getTaskNotes(taskId)
          get().setNotes(response.data)
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('notes.fetchError', { ns: 'tasks', defaultValue: 'Failed to fetch notes' })

            get().setError(errorMessage)
            useToastStore.getState().showToast(errorMessage, 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'NOTE/FETCH_COMPLETE')
        }
      },

      createNote: async (taskId: string, payload: CreateNotePayload) => {
        set((state) => {
          state.error = null
        }, false, 'NOTE/CREATE_REQUEST')

        try {
          const response = await createTaskNote(taskId, payload)
          get().addNote(response.data)

          const successMessage = i18n.t('notes.createSuccess', { ns: 'tasks' })
          useToastStore.getState().showToast(successMessage, 'success')
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('notes.createError', { ns: 'tasks' })

            get().setError(errorMessage)
            useToastStore.getState().showToast(errorMessage, 'error')
          }
        }
      },

      updateNoteById: async (taskId: string, noteId: string, payload: UpdateNotePayload) => {
        set((state) => {
          state.error = null
        }, false, 'NOTE/UPDATE_REQUEST')

        try {
          const response = await updateTaskNote(taskId, noteId, payload)
          get().updateNote(noteId, response.data)

          const successMessage = i18n.t('notes.updateSuccess', { ns: 'tasks' })
          useToastStore.getState().showToast(successMessage, 'success')
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('notes.updateError', { ns: 'tasks' })

            get().setError(errorMessage)
            useToastStore.getState().showToast(errorMessage, 'error')
          }
        }
      },

      deleteNoteById: async (taskId: string, noteId: string) => {
        set((state) => {
          state.error = null
        }, false, 'NOTE/DELETE_REQUEST')

        try {
          const response = await deleteTaskNote(taskId, noteId)
          get().removeNote(noteId)

          const successMessage = response.message || i18n.t('notes.deleteSuccess', { ns: 'tasks' })
          useToastStore.getState().showToast(successMessage, 'success')
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('notes.deleteError', { ns: 'tasks' })
            
            get().setError(errorMessage)
            useToastStore.getState().showToast(errorMessage, 'error')
          }
        }
      },
    })),
    { name: 'noteStore' }
  )
)

