export interface SubTask {
  id: string
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'PAUSED' | 'DONE'
}

export interface TaskColumn {
  id: string
  title: string
  tasks: SubTask[]
}

export interface ObjectiveBoard {
  objectiveId: string
  objectiveTitle: string
  columns: TaskColumn[]
}
