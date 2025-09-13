import { KanbanApiResponse, TaskItem, TaskStatus } from '../types/kanban/task.api'
import { Priority } from '../types/common.enums'
import { ObjectiveBoard, SubTask, TaskColumn } from '../types/kanban/board.types'
import { CardData, ColumnData, ColumnModel, Task, DropTargetRecord } from '../types/kanban/drag-drop.types'
import { normalizeDate } from './dateUtils'

/**
 * Transforms a TaskItem from the API to a SubTask for the component
 */
function transformTaskItem(task: TaskItem): SubTask {
  return {
    id: task.taskId,
    title: task.title,
    description: task.description,
    priority: mapApiPriorityToComponentPriority(task.priority),
    dueDate: normalizeDate(task.dueDate),
    status: mapApiStatusToComponentStatus(task.status)
  }
}

/**
 * Maps API priority values to component priority values
 */
function mapApiPriorityToComponentPriority(apiPriority: Priority): 'LOW' | 'MEDIUM' | 'HIGH' {
  switch (apiPriority) {
    case Priority.High:
      return 'HIGH'
    case Priority.Medium:
      return 'MEDIUM'
    case Priority.Low:
      return 'LOW'
    default:
      return 'LOW'
  }
}

/**
 * Maps API status values to component status values
 */
function mapApiStatusToComponentStatus(apiStatus: TaskStatus): 'TODO' | 'IN_PROGRESS' | 'PAUSED' | 'DONE' {
  switch (apiStatus) {
    case TaskStatus.NOT_STARTED:
      return 'TODO'
    case TaskStatus.IN_PROGRESS:
      return 'IN_PROGRESS'
    case TaskStatus.COMPLETED:
      return 'DONE'
    case TaskStatus.PAUSED:
      return 'PAUSED'
    default:
      return 'TODO'
  }
}

/**
 * Maps API column keys to component column configuration
 */
function createColumnFromApiData(
  columnId: string, 
  columnTitle: string, 
  tasks: TaskItem[]
): TaskColumn {
  return {
    id: columnId,
    title: columnTitle,
    tasks: tasks.map(transformTaskItem)
  }
}

/**
 * Transforms the API response to the ObjectiveBoard format expected by the component
 */
export function transformKanbanApiResponse(
  apiResponse: KanbanApiResponse,
  objectiveId: string,
  objectiveTitle: string
): ObjectiveBoard {
  const columns: TaskColumn[] = [
    createColumnFromApiData('todo', 'TO DO', apiResponse.columns.notStarted.items),
    createColumnFromApiData('in-progress', 'IN PROGRESS', apiResponse.columns.inProgress.items),
    createColumnFromApiData('done', 'DONE', apiResponse.columns.completed.items),
    createColumnFromApiData('paused', 'PAUSED', apiResponse.columns.paused.items)
  ]

  return {
    objectiveId,
    objectiveTitle,
    columns
  }
}

/**
 * Finds a column by its ID
 */
export const findColumnById = (columns: ColumnModel[], columnId: string): ColumnModel | undefined =>
  columns.find(col => col.id === columnId)

/**
 * Finds the index of a task by its ID
 */
export const findTaskIndexById = (tasks: Task[], taskId: string): number =>
  tasks.findIndex(task => task.id === taskId)

/**
 * Updates tasks for a specific column
 */
export const updateColumnTasks = (columns: ColumnModel[], columnId: string, newTasks: Task[]): ColumnModel[] =>
  columns.map(col => (col.id === columnId ? { ...col, tasks: newTasks } : col))

/**
 * Removes a task from a column by task ID
 */
export const removeTaskFromColumn = (tasks: Task[], taskId: string): Task[] =>
  tasks.filter(task => task.id !== taskId)

/**
 * Inserts a task at a specific position in a task list
 */
export const insertTaskAtPosition = (tasks: Task[], task: Task, position: number): Task[] => {
  const newTasks = tasks.slice()
  newTasks.splice(Math.max(0, Math.min(position, newTasks.length)), 0, task)
  return newTasks
}

/**
 * Type-safe casting helper for CardData
 */
export const asCardData = (x: unknown): CardData => x as CardData

/**
 * Extracts column ID from a drop target record
 */
export const columnIdFrom = (rec: DropTargetRecord): string => (rec.data as CardData | ColumnData).columnId
