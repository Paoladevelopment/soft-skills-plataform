export enum GameSessionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum GameSessionDifficulty {
  EASY = 'easy',
  INTERMEDIATE = 'intermediate',
  HARD = 'hard',
}

export enum PlayMode {
  FOCUS = 'focus',
  CLOZE = 'cloze',
  PARAPHRASE = 'paraphrase',
  SUMMARIZE = 'summarize',
  CLARIFY = 'clarify',
  MIXED = 'mixed',
}

export enum PromptType {
  DESCRIPTIVE = 'descriptive',
  CONVERSATIONAL = 'conversational',
  HISTORICAL_EVENT = 'historical_event',
  INSTRUCTIONAL = 'instructional',
  DIALOGUE = 'dialogue',
  NARRATED_DIALOGUE = 'narrated_dialogue',
}

export enum AudioStorage {
  S3 = 's3',
  SUPABASE = 'supabase',
  GCS = 'gcs',
  NONE = 'none',
}

export enum AudioEffectType {
  REVERB = 'reverb',
  ECHO = 'echo',
  BACKGROUND_NOISE = 'background_noise',
  SPEED_VARIATION = 'speed_variation',
}

export type ResponseTimeLimits = Partial<Record<PlayMode, number>>

export type AudioEffects = {
  reverb?: number
  echo?: number
  backgroundNoise?: number
  speedVariation?: number
}

export interface GameSessionConfig {
  totalRounds: number
  maxReplaysPerRound: number
  difficulty: GameSessionDifficulty
  responseTimeLimits: ResponseTimeLimits
  selectedModes: PlayMode[]
  allowedTypes: PromptType[]
  audioEffects: AudioEffects
}

export interface BaseGameSession {
  id: string
  name: string
  status: GameSessionStatus
  createdAt: string
  currentRound: number
  totalScore: number
}

export interface GameSessionListItem extends BaseGameSession {
  totalRounds: number
}

export interface GameSession extends GameSessionListItem {
  startedAt: string | null
  finishedAt: string | null
  config: GameSessionConfig
}

