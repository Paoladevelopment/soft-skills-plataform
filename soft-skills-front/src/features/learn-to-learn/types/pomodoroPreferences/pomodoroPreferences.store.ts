import { PomodoroPreferences } from "./pomodoroPreferences.models"
import { CreateOrUpdatePomodoroPreferencesPayload } from "./pomodoroPreferences.api"

export interface PomodoroPreferencesStore {
  preferences: PomodoroPreferences | null
  isConfigured: boolean
  effectivePomodoroLengthMinutes: number
  isLoading: boolean
  error: string | null
  
  setPreferences: (preferences: PomodoroPreferences) => void
  setIsConfigured: (isConfigured: boolean) => void
  setEffectivePomodoroLengthMinutes: (effectivePomodoroLengthMinutes: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  reset: () => void
  
  fetchPomodoroPreferences: () => Promise<void>
  updatePomodoroPreferences: (payload: CreateOrUpdatePomodoroPreferencesPayload) => Promise<void>
}
