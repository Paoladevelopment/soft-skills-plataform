import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { PomodoroPreferencesStore } from '../types/pomodoroPreferences/pomodoroPreferences.store'
import { useToastStore } from '../../../store/useToastStore'
import { getPomodoroPreferences, createOrUpdatePomodoroPreferences } from '../api/PomodoroPreferences'
import { CreateOrUpdatePomodoroPreferencesPayload } from '../types/pomodoroPreferences/pomodoroPreferences.api'

export const usePomodoroPreferencesStore = create<PomodoroPreferencesStore>()(
  devtools(
    immer((set, get) => ({
      preferences: null,
      isConfigured: false,
      effectivePomodoroLengthMinutes: 0,
      isLoading: false,
      error: null,

      setPreferences: (preferences) => {
        set((state) => {
          state.preferences = preferences
        }, false, 'POMODORO/SET_PREFERENCES')
      },

      setLoading: (loading) => {
        set((state) => {
          state.isLoading = loading
        }, false, 'POMODORO/SET_LOADING')
      },

      setError: (error) => {
        set((state) => {
          state.error = error
        }, false, 'POMODORO/SET_ERROR')
      },

      clearError: () => {
        set((state) => {
          state.error = null
        }, false, 'POMODORO/CLEAR_ERROR')
      },

      reset: () => {
        set((state) => {
          state.preferences = null
          state.isConfigured = false
          state.effectivePomodoroLengthMinutes = 0
          state.isLoading = false
          state.error = null
        }, false, 'POMODORO/RESET')
      },

      setIsConfigured: (isConfigured) => {
        set((state) => {
          state.isConfigured = isConfigured
        }, false, 'POMODORO/SET_IS_CONFIGURED')
      },

      setEffectivePomodoroLengthMinutes: (effectivePomodoroLengthMinutes) => {
        set((state) => {
          state.effectivePomodoroLengthMinutes = effectivePomodoroLengthMinutes
        }, false, 'POMODORO/SET_EFFECTIVE_POMODORO_LENGTH_MINUTES')
      },

      fetchPomodoroPreferences: async () => {
        set((state) => {
          state.isLoading = true
          state.error = null
        }, false, 'POMODORO/FETCH_REQUEST')

        try {
          const response = await getPomodoroPreferences()
          
          if (response.preferences) {
            get().setPreferences(response.preferences)
          }

          get().setIsConfigured(response.configured)
          get().setEffectivePomodoroLengthMinutes(response.effective_pomodoro_length_minutes)
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || 'Error fetching pomodoro preferences'
            get().setError(errorMessage)

            useToastStore.getState().showToast(errorMessage, 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'POMODORO/FETCH_COMPLETE')
        }
      },

      updatePomodoroPreferences: async (payload: CreateOrUpdatePomodoroPreferencesPayload) => {
        set((state) => {
          state.isLoading = true
          state.error = null
        }, false, 'POMODORO/UPDATE_REQUEST')

        try {
          const response = await createOrUpdatePomodoroPreferences(payload)
          
          get().setPreferences(response.data)
          get().setIsConfigured(true)
          get().setEffectivePomodoroLengthMinutes(response.data.pomodoro_length_minutes)

          useToastStore.getState().showToast('Pomodoro preferences updated successfully!', 'success')
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || 'Error updating pomodoro preferences'
            get().setError(errorMessage)

            useToastStore.getState().showToast(errorMessage, 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'POMODORO/UPDATE_COMPLETE')
        }
      },
    })),

    { name: 'pomodoroPreferencesStore' }
  )
)
