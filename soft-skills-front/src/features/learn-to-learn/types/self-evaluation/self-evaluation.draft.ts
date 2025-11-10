import type { 
  StudyPlace, 
  TimeOfDay, 
  NoiseLevel, 
  CollaborationMode, 
  PerceivedDifficulty, 
  Mood,
  LearningMethod 
} from './self-evaluation.enums'

export interface SelfEvaluationDraftData {
  task_id: string | null
  study_place: StudyPlace | null
  time_of_day: TimeOfDay | null
  noise_level: NoiseLevel | null
  collaboration_mode: CollaborationMode | null
  learning_intention: string
  what_went_well: string
  challenges_encountered: string
  improvement_plan: string
  perceived_difficulty: PerceivedDifficulty | null
  concentration_level: number
  mood: Mood | null
  knowledge_connection: boolean
  learning_methods: LearningMethod[]
}

export interface ISelfEvaluationDraftStore extends SelfEvaluationDraftData {
  setStudyPlace: (value: StudyPlace) => void
  setTimeOfDay: (value: TimeOfDay | null) => void
  setNoiseLevel: (value: NoiseLevel | null) => void
  setCollaborationMode: (value: CollaborationMode | null) => void
  setLearningIntention: (value: string) => void
  setWhatWentWell: (value: string) => void
  setChallengesEncountered: (value: string) => void
  setImprovementPlan: (value: string) => void
  setPerceivedDifficulty: (value: PerceivedDifficulty) => void
  setConcentrationLevel: (value: number) => void
  setMood: (value: Mood) => void
  setKnowledgeConnection: (value: boolean) => void
  toggleLearningMethod: (method: LearningMethod) => void
  reset: () => void
  getSnapshot: () => SelfEvaluationDraftData
  initialize: (taskId: string) => void
}

