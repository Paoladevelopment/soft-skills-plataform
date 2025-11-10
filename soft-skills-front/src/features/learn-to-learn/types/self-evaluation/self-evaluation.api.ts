import { 
  StudyPlace, 
  TimeOfDay, 
  NoiseLevel, 
  CollaborationMode, 
  PerceivedDifficulty, 
  Mood,
  LearningMethod 
} from './self-evaluation.enums'

export type SelfEvaluationCreate = {
  task_id: string
  study_place: StudyPlace
  time_of_day?: TimeOfDay | null
  noise_level?: NoiseLevel | null
  collaboration_mode?: CollaborationMode | null
  learning_intention: string
  what_went_well: string
  challenges_encountered: string
  improvement_plan: string
  perceived_difficulty: PerceivedDifficulty
  concentration_level: number
  mood: Mood
  knowledge_connection: boolean
  learning_methods?: LearningMethod[]
  completed_at?: string
}

export type SelfEvaluationCreated = {
  evaluationId: string
  taskId: string
  createdAt: string
}

export type SelfEvaluationRead = {
  evaluationId: string
  taskId: string
  userId: string
  studyPlace: StudyPlace
  timeOfDay?: TimeOfDay | null
  noiseLevel?: NoiseLevel | null
  collaborationMode?: CollaborationMode | null
  learningIntention: string
  whatWentWell: string
  challengesEncountered: string
  improvementPlan: string
  perceivedDifficulty: PerceivedDifficulty
  concentrationLevel: number
  mood: Mood
  knowledgeConnection: boolean
  learningMethods?: LearningMethod[]
  createdAt: string
}

