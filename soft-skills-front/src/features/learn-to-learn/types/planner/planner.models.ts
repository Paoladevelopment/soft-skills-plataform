import { Priority, TaskStatus, TaskType } from "../common.enums"

export interface Task {
  id: string
  title: string
  description: string
  taskType: TaskType
  status: TaskStatus
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
  status: TaskStatus
  priority: Priority
  dueDate: Date | null
  orderIndex: number
  startedAt: Date | null
  completedAt: Date | null
  tasks?: Task[]
}

export interface LearningGoal {
  id: string
  title: string
  description: string
  impact: string
  userId: string
  startedAt: Date | null
  completedAt: Date | null
  objectives?: Objective[]
  totalObjectives: number
  completedObjectives: number
}
