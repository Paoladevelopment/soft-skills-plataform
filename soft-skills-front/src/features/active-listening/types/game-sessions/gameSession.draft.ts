import { PromptType, GameSessionDifficulty, PlayMode } from './gameSession.models'

export interface GameSessionDraftData {
  sessionName: string
  totalRounds: number
  maxReplaysPerRound: number
  difficulty: GameSessionDifficulty
  responseTimeLimits: { [mode: string]: number }
  selectedModes: PlayMode[]
  allowedTypes: PromptType[]
  reuseExistingChallenges: boolean
}

export interface IGameSessionDraftStore extends GameSessionDraftData {
  setSessionName: (name: string) => void
  setTotalRounds: (rounds: number) => void
  setMaxReplaysPerRound: (replays: number) => void
  setDifficulty: (difficulty: GameSessionDifficulty) => void
  togglePlayMode: (mode: PlayMode) => void
  togglePromptType: (type: PromptType) => void
  setResponseTimeLimit: (mode: string, value: number) => void
  setReuseExistingChallenges: (reuse: boolean) => void
  reset: () => void
  getSnapshot: () => GameSessionDraftData
  loadGameSession: (session: Partial<GameSessionDraftData>) => void
}

