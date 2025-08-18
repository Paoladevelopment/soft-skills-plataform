export enum LearningGoalStatusEnum {
  COMPLETED = 'Completed',
  IN_PROGRESS = 'In progress',
  NOT_STARTED = 'Not started'
}

export type LearningGoalStatus = 'Completed' | 'In progress' | 'Not started'

export interface LearningGoalStatusInfo {
  status: LearningGoalStatus
  elapsedTime?: string
}

/**
 * Gets the appropriate chip color for a learning goal status
 */
export function getStatusChipColor(status: LearningGoalStatus): 'success' | 'primary' | 'default' {
  switch (status) {
    case LearningGoalStatusEnum.COMPLETED:
      return 'success'
    case LearningGoalStatusEnum.IN_PROGRESS:
      return 'primary'
    case LearningGoalStatusEnum.NOT_STARTED:
    default:
      return 'default'
  }
}

export function getLearningGoalStatus(
  completedAt?: Date | null,
  startedAt?: Date | null
): LearningGoalStatus {
  if (completedAt) {
    return LearningGoalStatusEnum.COMPLETED
  }
  
  if (startedAt) {
    return LearningGoalStatusEnum.IN_PROGRESS
  }
  
  return LearningGoalStatusEnum.NOT_STARTED
}

export function calculateElapsedTime(
  startedAt?: Date | null,
  completedAt?: Date | null
): string | undefined {
  if (!startedAt) {
    return undefined
  }

  const endDate = completedAt || new Date()
  
  const diffInMs = endDate.getTime() - startedAt.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (diffInDays > 0) {
    return `${diffInDays}d ${diffInHours}h`
  }
  
  return `${diffInHours}h`
}

/**
 * Gets complete status information for a learning goal
 */
export function getLearningGoalStatusInfo(
  completedAt?: Date | null,
  startedAt?: Date | null
): LearningGoalStatusInfo {
  const status = getLearningGoalStatus(completedAt, startedAt)
  const elapsedTime = calculateElapsedTime(startedAt, completedAt)
  
  return {
    status,
    elapsedTime
  }
}
