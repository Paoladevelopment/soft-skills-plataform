import { Priority, Status, TaskType } from "../common.enums"

export interface Task {
  id: string
  title: string
  description: string
  taskType: TaskType
  status: Status
  priority: Priority
  estimatedTime: number | null 
  actualTime: number | null 
  dueDate: Date | null
  orderIndex: number
  isOptional: boolean
  startedAt: Date | null
  completedAt: Date | null
}

export interface Objective {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  dueDate: Date | null
  orderIndex: number
  startedAt: Date | null
  completedAt: Date | null
  totalTasks: number
  completedTasks: number
}

export interface LearningGoal {
  id: string
  title: string
  description: string
  impact: string
  userId: string
  createdAt: Date | null
  updatedAt: Date | null
  startedAt: Date | null
  completedAt: Date | null
  totalObjectives: number
  completedObjectives: number
}
