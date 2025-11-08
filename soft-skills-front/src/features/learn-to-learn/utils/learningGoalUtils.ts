import { calculateElapsedTime } from '../../../utils/timeUtils'

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
  completedAt?: string | null,
  startedAt?: string | null
): LearningGoalStatus {
  if (completedAt) {
    return LearningGoalStatusEnum.COMPLETED
  }
  
  if (startedAt) {
    return LearningGoalStatusEnum.IN_PROGRESS
  }
  
  return LearningGoalStatusEnum.NOT_STARTED
}


/**
 * Gets complete status information for a learning goal
 */
export function getLearningGoalStatusInfo(
  completedAt?: string | null,
  startedAt?: string | null
): LearningGoalStatusInfo {
  const status = getLearningGoalStatus(completedAt, startedAt)
  const elapsedTime = calculateElapsedTime(startedAt, completedAt)
  
  return {
    status,
    elapsedTime
  }
}
