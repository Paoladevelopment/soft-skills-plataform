import { Priority, Status, TaskType } from "../common.enums"

export interface Task {
  taskId: string
  title: string
  description: string
  taskType: TaskType
  status: Status
  priority: Priority
  estimatedTime: number | null 
  actualTime: number | null 
  isOptional: boolean
  dueDate: string | null
  createdAt: string | null
  updatedAt: string | null
  startedAt: string | null
  completedAt: string | null
}

export interface Objective {
  objectiveId: string
  title: string
  description: string
  status: Status
  priority: Priority
  dueDate: string | null
  createdAt: string | null
  updatedAt: string | null
  startedAt: string | null
  completedAt: string | null
  totalTasks: number
  completedTasks: number
}

export interface LearningGoal {
  learningGoalId: string
  title: string
  description: string
  impact: string
  userId: string
  createdAt: string | null
  updatedAt: string | null
  startedAt: string | null
  completedAt: string | null
  totalObjectives?: number
  completedObjectives?: number
}
