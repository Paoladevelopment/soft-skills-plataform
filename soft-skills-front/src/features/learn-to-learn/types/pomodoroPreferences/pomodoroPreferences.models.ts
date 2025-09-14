export interface PomodoroPreferences {
  pomodoro_preferences_id: string
  auto_start_breaks: boolean
  auto_start_work: boolean
  cycles_per_long_break: number
  long_break_minutes: number
  pomodoro_length_minutes: number
  short_break_minutes: number
  sound_enabled: boolean
  volume: number
  created_at: string
  updated_at: string
}