export interface CreateLearningGoalPayload {
  title: string
  description: string
  impact: string
}

export interface UpdateLearningGoalPayload {
  title?: string
  description?: string
  impact?: string
}

export interface LearningGoalResponse {
  learningGoalId: string
  title: string
  description: string
  impact: string
  userId: string
  startedAt: string | null
  completedAt: string | null
  totalObjectives?: number
  completedObjectives?: number
}

export interface FetchLearningGoalsResponse {
  message: string
  data: LearningGoalResponse[]
  total: number
  offset: number
  limit: number
}

export interface CreateLearningGoalResponse {
  message: string
  data: LearningGoalResponse
}

export interface FetchLearningGoalResponse {
  message: string
  data: LearningGoalResponse
}

export interface UpdateLearningGoalResponse {
  message: string
  data: LearningGoalResponse
}

export interface DeleteLearningGoalResponse {
  message: string
  learningGoalId: string
}