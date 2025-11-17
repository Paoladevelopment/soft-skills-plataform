import { z } from 'zod'
import i18n from '../../../../i18n/config'
import { 
  StudyPlace, 
  TimeOfDay, 
  NoiseLevel, 
  CollaborationMode, 
  PerceivedDifficulty, 
  Mood,
  LearningMethod
} from '../../types/self-evaluation/self-evaluation.enums'

export const selfEvaluationSchema = z.object({
  task_id: z.string().uuid(i18n.t('reports:selfEvaluation.validation.taskIdInvalid')),
  study_place: z.nativeEnum(StudyPlace, {
    required_error: i18n.t('reports:selfEvaluation.validation.studyPlaceRequired'),
  }),
  time_of_day: z.nativeEnum(TimeOfDay).nullable().optional(),
  noise_level: z.nativeEnum(NoiseLevel).nullable().optional(),
  collaboration_mode: z.nativeEnum(CollaborationMode).nullable().optional(),
  learning_intention: z.string().min(1, i18n.t('reports:selfEvaluation.validation.learningIntentionRequired')).max(800, i18n.t('reports:selfEvaluation.validation.learningIntentionMaxLength')),
  what_went_well: z.string().min(1, i18n.t('reports:selfEvaluation.validation.whatWentWellRequired')).max(2000, i18n.t('reports:selfEvaluation.validation.whatWentWellMaxLength')),
  challenges_encountered: z.string().min(1, i18n.t('reports:selfEvaluation.validation.challengesEncounteredRequired')).max(2000, i18n.t('reports:selfEvaluation.validation.challengesEncounteredMaxLength')),
  improvement_plan: z.string().min(1, i18n.t('reports:selfEvaluation.validation.improvementPlanRequired')).max(2000, i18n.t('reports:selfEvaluation.validation.improvementPlanMaxLength')),
  perceived_difficulty: z.nativeEnum(PerceivedDifficulty, {
    required_error: i18n.t('reports:selfEvaluation.validation.perceivedDifficultyRequired'),
  }),
  concentration_level: z.number().int().min(1, i18n.t('reports:selfEvaluation.validation.concentrationLevelRange')).max(10, i18n.t('reports:selfEvaluation.validation.concentrationLevelRange')),
  mood: z.nativeEnum(Mood, {
    required_error: i18n.t('reports:selfEvaluation.validation.moodRequired'),
  }),
  knowledge_connection: z.boolean(),
  learning_methods: z.array(z.nativeEnum(LearningMethod)).optional(),
  completed_at: z.string().optional(),
})

export type SelfEvaluationFormFields = z.infer<typeof selfEvaluationSchema>

export type ValidationErrors = Record<string, string>

export const getDefaultValues = (taskId: string): Partial<SelfEvaluationFormFields> => {
  const hour = new Date().getHours()
  let timeOfDay: TimeOfDay = TimeOfDay.AFTERNOON
  
  if (hour >= 5 && hour < 12) {
    timeOfDay = TimeOfDay.MORNING
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = TimeOfDay.AFTERNOON
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = TimeOfDay.EVENING
  } else {
    timeOfDay = TimeOfDay.NIGHT
  }

  const lastStudyPlace = localStorage.getItem('lastStudyPlace')
  
  return {
    task_id: taskId,
    study_place: (lastStudyPlace as StudyPlace) || StudyPlace.HOME_DESK,
    time_of_day: timeOfDay,
    concentration_level: 7,
    perceived_difficulty: PerceivedDifficulty.MODERATE,
    mood: Mood.NEUTRAL,
    knowledge_connection: true,
    learning_methods: [],
  }
}

