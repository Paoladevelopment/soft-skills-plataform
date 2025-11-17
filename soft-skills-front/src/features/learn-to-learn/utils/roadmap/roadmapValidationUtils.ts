import { Roadmap } from '../../types/roadmap/roadmap.models'
import i18n from '../../../../i18n/config'

export interface ValidationResult {
  isValid: boolean
  errorMessage?: string
}

export interface ValidationMessages {
  noObjectives: string
  unassignedTasks: string
}

/**
 * General validation function for public roadmaps.
 * A public roadmap must have at least one objective and all tasks must be connected to objectives.
 */
export function validatePublicRoadmap(roadmap: Roadmap, messages: ValidationMessages): ValidationResult {
  const hasNoObjectives = roadmap.objectives.length === 0
  const orphanObjective = roadmap.objectives.find(obj => obj.objectiveId === '__unassigned__')
  const hasUnassignedTasks = orphanObjective && orphanObjective.tasks.length > 0

  if (hasNoObjectives) {
    return {
      isValid: false,
      errorMessage: messages.noObjectives
    }
  }

  if (hasUnassignedTasks) {
    return {
      isValid: false,
      errorMessage: messages.unassignedTasks
    }
  }

  return {
    isValid: true
  }
}

/**
 * Validates if a roadmap can be made public.
 * A public roadmap must have at least one objective and all tasks must be connected to objectives.
 */
export function validateRoadmapForPublicVisibility(roadmap: Roadmap): ValidationResult {
  return validatePublicRoadmap(roadmap, {
    noObjectives: i18n.t('toasts.validation.noObjectives', { ns: 'roadmap' }),
    unassignedTasks: i18n.t('toasts.validation.unassignedTasksVisibility', { ns: 'roadmap' })
  })
}

/**
 * Validates if a roadmap can be saved as public.
 * Similar to validateRoadmapForPublicVisibility but with different error message for saving context.
 */
export function validateRoadmapForPublicSave(roadmap: Roadmap): ValidationResult {
  return validatePublicRoadmap(roadmap, {
    noObjectives: i18n.t('toasts.validation.noObjectives', { ns: 'roadmap' }),
    unassignedTasks: i18n.t('toasts.validation.unassignedTasksSave', { ns: 'roadmap' })
  })
}
