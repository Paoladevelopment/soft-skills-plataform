import { PomodoroPreferences } from "./pomodoroPreferences.models"

export interface CreateOrUpdatePomodoroPreferencesPayload {
  auto_start_breaks: boolean
  auto_start_work: boolean
  cycles_per_long_break: number
  long_break_minutes: number
  pomodoro_length_minutes: number
  short_break_minutes: number
  sound_enabled: boolean
  volume: number
}

export interface CreateOrUpdatePomodoroPreferencesResponse {
  message: string
  data: PomodoroPreferences
}

export interface GetPomodoroPreferencesResponse {
  configured: boolean
  effective_pomodoro_length_minutes: number
  preferences: PomodoroPreferences | null
}

