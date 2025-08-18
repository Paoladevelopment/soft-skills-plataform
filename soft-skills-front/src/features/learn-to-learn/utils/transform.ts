import { LearningGoal } from "../types/planner/planner.models"
import { LearningGoalResponse } from "../types/planner/learningGoals.api"

export function transformGoalResponse(goal: LearningGoalResponse): LearningGoal {
  return {
    id: goal.learningGoalId,
    title: goal.title,
    description: goal.description,
    impact: goal.impact,
    userId: goal.userId,
    createdAt: goal.createdAt ? new Date(goal.createdAt) : null,
    updatedAt: goal.updatedAt ? new Date(goal.updatedAt) : null,
    startedAt: goal.startedAt ? new Date(goal.startedAt) : null,
    completedAt: goal.completedAt ? new Date(goal.completedAt) : null,
    totalObjectives: goal.totalObjectives ?? 0,
    completedObjectives: goal.completedObjectives ?? 0
  }
}