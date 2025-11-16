import { Status } from '../types/common.enums'
import { calculateElapsedTime } from '../../../utils/timeUtils'
import { PRIORITY_COLORS, STATUS_COLORS, PriorityColorValue, StatusColorValue } from '../types/ui/colors'
import i18n from '../../../i18n/config'

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
 * Uses i18n to translate status values
 */
export function formatStatus(status: string): string {
  // Map status values to translation keys (camelCase)
  const statusMap: Record<string, string> = {
    'not_started': 'notStarted',
    'in_progress': 'inProgress',
    'completed': 'completed',
    'paused': 'paused',
    'notstarted': 'notStarted',
    'inprogress': 'inProgress'
  }
  
  const normalizedStatus = status.toLowerCase().replace(/_/g, '')
  const statusKey = statusMap[normalizedStatus] || statusMap[status.toLowerCase()] || normalizedStatus
  const key = `goals:objectives.filters.${statusKey}`
  
  const translated = i18n.t(key)
  return translated !== key ? translated : status.replace(/_/g, ' ')
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
  const lowerPriority = priority.toLowerCase()
  
  if (lowerPriority === 'high') return PRIORITY_COLORS.HIGH
  if (lowerPriority === 'medium') return PRIORITY_COLORS.MEDIUM
  
  return PRIORITY_COLORS.LOW
}

/**
 * Formats priority strings using i18n
 */
export function formatPriority(priority: string): string {
  const priorityKey = priority.toLowerCase()
  const key = `goals:objectives.filters.${priorityKey}`
  
  const translated = i18n.t(key)
  return translated !== key ? translated : priority
}
