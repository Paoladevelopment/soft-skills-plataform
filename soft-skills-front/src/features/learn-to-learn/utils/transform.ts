import { LearningGoal } from "../types/planner/planner.models"
import { LearningGoalResponse } from "../types/planner/learningGoals.api"

export function transformGoalResponse(goal: LearningGoalResponse): LearningGoal {
  return {
    id: goal.learningGoalId,
    title: goal.title,
    description: goal.description,
    impact: goal.impact,
    userId: goal.userId,
    startedAt: goal.startedAt ? new Date(goal.startedAt) : null,
    completedAt: goal.completedAt ? new Date(goal.completedAt) : null,
    objectives: [],
    totalObjectives: goal.totalObjectives,
    completedObjectives: goal.completedObjectives
  }
}