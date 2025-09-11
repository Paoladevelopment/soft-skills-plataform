import { KanbanApiResponse, TaskItem, TaskStatus } from '../types/kanban/task.api'
import { Priority } from '../types/common.enums'
import { ObjectiveBoard, SubTask, TaskColumn } from '../types/kanban/board.types'
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
  console.log('API Status:', apiStatus)
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
