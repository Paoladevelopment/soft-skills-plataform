import {
  StudyPlace,
  TimeOfDay,
  NoiseLevel,
  CollaborationMode,
  PerceivedDifficulty,
  Mood,
  LearningMethod,
} from '../types/self-evaluation/self-evaluation.enums'
import i18n from '../../../i18n/config'

export const formatStudyPlace = (place: StudyPlace): string => {
  const key = `common:enums.studyPlace.${place}`
  const translated = i18n.t(key)
  
  return translated !== key ? translated : place
}

export const formatTimeOfDay = (time: TimeOfDay): string => {
  const key = `common:enums.timeOfDay.${time}`
  const translated = i18n.t(key)

  return translated !== key ? translated : time
}

export const formatNoiseLevel = (level: NoiseLevel): string => {
  const key = `common:enums.noiseLevel.${level}`
  const translated = i18n.t(key)

  return translated !== key ? translated : level
}

export const formatCollaborationMode = (mode: CollaborationMode): string => {
  const key = `common:enums.collaborationMode.${mode}`
  const translated = i18n.t(key)

  return translated !== key ? translated : mode
}

export const formatDifficulty = (difficulty: PerceivedDifficulty): string => {
  const key = `common:enums.perceivedDifficulty.${difficulty}`
  const translated = i18n.t(key)

  return translated !== key ? translated : difficulty
}

export const formatMood = (mood: Mood): string => {
  const key = `common:enums.mood.${mood}`
  const translated = i18n.t(key)

  return translated !== key ? translated : mood
}

export const formatLearningMethod = (method: LearningMethod): string => {
  const key = `common:enums.learningMethod.${method}`
  const translated = i18n.t(key)
  return translated !== key ? translated : method
}

export const getMoodDisplay = (mood: Mood): string => {
  const positiveMoods = [Mood.ENERGIZED, Mood.CALM]
  if (positiveMoods.includes(mood)) {
    return i18n.t('common:enums.mood.POSITIVE')
  }

  return formatMood(mood)
}

