import { z } from 'zod'
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
  task_id: z.string().uuid('Task ID must be a valid UUID'),
  study_place: z.nativeEnum(StudyPlace, {
    required_error: 'Study place is required',
  }),
  time_of_day: z.nativeEnum(TimeOfDay).nullable().optional(),
  noise_level: z.nativeEnum(NoiseLevel).nullable().optional(),
  collaboration_mode: z.nativeEnum(CollaborationMode).nullable().optional(),
  learning_intention: z.string().min(1, 'What were you trying to get better at? is required').max(800, 'What were you trying to get better at? must be 800 characters or less'),
  what_went_well: z.string().min(1, 'What worked well this time? is required').max(2000, 'What worked well this time? must be 2000 characters or less'),
  challenges_encountered: z.string().min(1, 'What was difficult? is required').max(2000, 'What was difficult? must be 2000 characters or less'),
  improvement_plan: z.string().min(1, 'What would you do differently next time? is required').max(2000, 'What would you do differently next time? must be 2000 characters or less'),
  perceived_difficulty: z.nativeEnum(PerceivedDifficulty, {
    required_error: 'Perceived difficulty is required',
  }),
  concentration_level: z.number().int().min(1, 'Concentration level must be between 1 and 10').max(10, 'Concentration level must be between 1 and 10'),
  mood: z.nativeEnum(Mood, {
    required_error: 'Mood is required',
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

