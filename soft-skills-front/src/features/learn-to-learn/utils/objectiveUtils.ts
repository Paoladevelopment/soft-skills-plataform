import { Status } from '../types/common.enums'
import { calculateElapsedTime } from './timeUtils'
import { PRIORITY_COLORS, STATUS_COLORS, PriorityColorValue, StatusColorValue } from '../types/ui/colors'

export interface ObjectiveStatusInfo {
  status: string
  elapsedTime?: string
}

/**
 * General function to get status chip color
 * Works for both objectives and learning goals
 */
export function getStatusChipColor(status: string): StatusColorValue {
  switch (status) {
    case Status.Completed:
    case 'completed':
      return STATUS_COLORS.COMPLETED
    case Status.InProgress:
    case 'in_progress':
      return STATUS_COLORS.IN_PROGRESS
    case Status.Paused:
    case 'paused':
      return STATUS_COLORS.PAUSED
    case Status.NotStarted:
    case 'not_started':
    default:
      return STATUS_COLORS.NOT_STARTED
  }
}

/**
 * @deprecated Use getStatusChipColor instead
 */
export function getObjectiveStatusChipColor(status: string): StatusColorValue {
  return getStatusChipColor(status)
}

/**
 * General function to format status strings
 * Converts snake_case to readable format
 */
export function formatStatus(status: string): string {
  return status.replace('_', ' ')
}

/**
 * @deprecated Use formatStatus instead
 */
export function formatObjectiveStatus(status: string): string {
  return formatStatus(status)
}

/**
 * Gets complete status information for an objective
 */
export function getObjectiveStatusInfo(
  status: string,
  startedAt?: string | null,
  completedAt?: string | null
): ObjectiveStatusInfo {
  const formattedStatus = formatObjectiveStatus(status)
  const elapsedTime = calculateElapsedTime(startedAt, completedAt)
  
  return {
    status: formattedStatus,
    elapsedTime
  }
}

export function getPriorityColor(priority: string): PriorityColorValue {
  if (priority === 'high') return PRIORITY_COLORS.HIGH
  if (priority === 'medium') return PRIORITY_COLORS.MEDIUM
  
  return PRIORITY_COLORS.LOW
}
