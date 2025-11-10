import {
  StudyPlace,
  TimeOfDay,
  NoiseLevel,
  CollaborationMode,
  PerceivedDifficulty,
  Mood,
  LearningMethod,
} from '../types/self-evaluation/self-evaluation.enums'

export const formatStudyPlace = (place: StudyPlace): string => {
  const map: Record<StudyPlace, string> = {
    [StudyPlace.HOME_DESK]: 'Home office',
    [StudyPlace.HOME_COMMON_AREA]: 'Home common area',
    [StudyPlace.OFFICE_DESK]: 'Office desk',
    [StudyPlace.COWORKING]: 'Coworking space',
    [StudyPlace.LIBRARY]: 'Library',
    [StudyPlace.CLASSROOM]: 'Classroom',
    [StudyPlace.UNIVERSITY_CAMPUS]: 'University campus',
    [StudyPlace.CAFE]: 'Cafe',
    [StudyPlace.BOOKSTORE]: 'Bookstore',
    [StudyPlace.DORM_ROOM]: 'Dorm room',
    [StudyPlace.DORM_COMMON_AREA]: 'Dorm common area',
    [StudyPlace.OUTDOORS]: 'Outdoors',
    [StudyPlace.TRANSIT]: 'Transit',
    [StudyPlace.OTHER]: 'Other',
  }
  return map[place] || place
}

export const formatTimeOfDay = (time: TimeOfDay): string => {
  const map: Record<TimeOfDay, string> = {
    [TimeOfDay.MORNING]: 'Morning',
    [TimeOfDay.AFTERNOON]: 'Afternoon',
    [TimeOfDay.EVENING]: 'Evening',
    [TimeOfDay.NIGHT]: 'Night',
  }
  return map[time] || time
}

export const formatNoiseLevel = (level: NoiseLevel): string => {
  const map: Record<NoiseLevel, string> = {
    [NoiseLevel.QUIET]: 'Quiet',
    [NoiseLevel.MODERATE]: 'Moderate',
    [NoiseLevel.NOISY]: 'Noisy',
  }
  return map[level] || level
}

export const formatCollaborationMode = (mode: CollaborationMode): string => {
  const map: Record<CollaborationMode, string> = {
    [CollaborationMode.SOLO]: 'Solo study',
    [CollaborationMode.PAIR]: 'Pair study',
    [CollaborationMode.GROUP]: 'Group study',
  }
  return map[mode] || mode
}

export const formatDifficulty = (difficulty: PerceivedDifficulty): string => {
  const map: Record<PerceivedDifficulty, string> = {
    [PerceivedDifficulty.EASY]: 'Easy',
    [PerceivedDifficulty.MODERATE]: 'Medium',
    [PerceivedDifficulty.HARD]: 'Hard',
  }
  return map[difficulty] || difficulty
}

export const formatMood = (mood: Mood): string => {
  const map: Record<Mood, string> = {
    [Mood.ENERGIZED]: 'Energized',
    [Mood.CALM]: 'Calm',
    [Mood.NEUTRAL]: 'Neutral',
    [Mood.TIRED]: 'Tired',
    [Mood.FRUSTRATED]: 'Frustrated',
    [Mood.STRESSED]: 'Stressed',
    [Mood.OTHER]: 'Other',
  }
  return map[mood] || mood
}

export const formatLearningMethod = (method: LearningMethod): string => {
  const map: Record<LearningMethod, string> = {
    [LearningMethod.PRACTICE]: 'Hands-on practice',
    [LearningMethod.NOTE_TAKING]: 'Taking notes',
    [LearningMethod.SPACED_REPETITION]: 'Spaced repetition',
    [LearningMethod.SUMMARIZATION]: 'Summarization',
    [LearningMethod.TEACH_BACK]: 'Teaching others',
    [LearningMethod.FLASHCARDS]: 'Flashcards',
    [LearningMethod.OTHER]: 'Other',
  }
  return map[method] || method
}

export const getMoodDisplay = (mood: Mood): string => {
  const positiveMoods = [Mood.ENERGIZED, Mood.CALM]
  if (positiveMoods.includes(mood)) {
    return 'Positive'
  }

  return formatMood(mood)
}

