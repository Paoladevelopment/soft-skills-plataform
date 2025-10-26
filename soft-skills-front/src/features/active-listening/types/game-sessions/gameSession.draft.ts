import { PromptType, GameSessionDifficulty, PlayMode } from './gameSession.models'

export interface IGameSessionDraftStore {
  sessionName: string
  totalRounds: number
  maxReplaysPerRound: number
  difficulty: GameSessionDifficulty
  responseTimeLimits: { [mode: string]: number }
  selectedModes: PlayMode[]
  allowedTypes: PromptType[]
  audioEffects: { [effect: string]: number }

  setSessionName: (name: string) => void
  setTotalRounds: (rounds: number) => void
  setMaxReplaysPerRound: (replays: number) => void
  setDifficulty: (difficulty: GameSessionDifficulty) => void
  togglePlayMode: (mode: PlayMode) => void
  togglePromptType: (type: PromptType) => void
  setResponseTimeLimit: (mode: string, value: number) => void
  setAudioEffect: (effect: string, value: number) => void
  reset: () => void
  getSnapshot: () => Omit<IGameSessionDraftStore, 'setSessionName' | 'setTotalRounds' | 'setMaxReplaysPerRound' | 'setDifficulty' | 'togglePlayMode' | 'togglePromptType' | 'setResponseTimeLimit' | 'setAudioEffect' | 'reset' | 'getSnapshot' | 'loadGameSession'>
  loadGameSession: (session: Partial<Omit<IGameSessionDraftStore, 'setSessionName' | 'setTotalRounds' | 'setMaxReplaysPerRound' | 'setDifficulty' | 'togglePlayMode' | 'togglePromptType' | 'setResponseTimeLimit' | 'setAudioEffect' | 'reset' | 'getSnapshot' | 'loadGameSession'>>) => void
}

