import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  StudyPlace, 
  TimeOfDay, 
  PerceivedDifficulty, 
  Mood,
  NoiseLevel,
  CollaborationMode,
} from '../types/self-evaluation/self-evaluation.enums'
import { ISelfEvaluationDraftStore } from '../types/self-evaluation/self-evaluation.draft'

const getInitialState = (taskId: string | null) => {
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
    noise_level: NoiseLevel.QUIET,
    collaboration_mode: CollaborationMode.SOLO,
    learning_intention: '',
    what_went_well: '',
    challenges_encountered: '',
    improvement_plan: '',
    perceived_difficulty: PerceivedDifficulty.MODERATE,
    concentration_level: 7,
    mood: Mood.NEUTRAL,
    knowledge_connection: true,
    learning_methods: [],
  }
}

const initialState = getInitialState(null)

export const useSelfEvaluationDraftStore = create<ISelfEvaluationDraftStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStudyPlace: (value) => {
        localStorage.setItem('lastStudyPlace', value)
        set({ study_place: value })
      },

      setTimeOfDay: (value) => {
        set({ time_of_day: value })
      },

      setNoiseLevel: (value) => {
        set({ noise_level: value })
      },

      setCollaborationMode: (value) => {
        set({ collaboration_mode: value })
      },

      setLearningIntention: (value) => {
        set({ learning_intention: value })
      },

      setWhatWentWell: (value) => {
        set({ what_went_well: value })
      },

      setChallengesEncountered: (value) => {
        set({ challenges_encountered: value })
      },

      setImprovementPlan: (value) => {
        set({ improvement_plan: value })
      },

      setPerceivedDifficulty: (value) => {
        set({ perceived_difficulty: value })
      },

      setConcentrationLevel: (value) => {
        set({ concentration_level: value })
      },

      setMood: (value) => {
        set({ mood: value })
      },

      setKnowledgeConnection: (value) => {
        set({ knowledge_connection: value })
      },

      toggleLearningMethod: (method) => {
        set((state) => ({
          learning_methods: state.learning_methods.includes(method)
            ? state.learning_methods.filter((m) => m !== method)
            : [...state.learning_methods, method],
        }))
      },

      reset: () => {
        const currentTaskId = get().task_id
        set(getInitialState(currentTaskId))
      },

      initialize: (taskId) => {
        set(getInitialState(taskId))
      },

      getSnapshot: () => {
        const state = get()
        return {
          task_id: state.task_id,
          study_place: state.study_place,
          time_of_day: state.time_of_day,
          noise_level: state.noise_level,
          collaboration_mode: state.collaboration_mode,
          learning_intention: state.learning_intention,
          what_went_well: state.what_went_well,
          challenges_encountered: state.challenges_encountered,
          improvement_plan: state.improvement_plan,
          perceived_difficulty: state.perceived_difficulty,
          concentration_level: state.concentration_level,
          mood: state.mood,
          knowledge_connection: state.knowledge_connection,
          learning_methods: state.learning_methods,
        }
      },
    }),
    {
      name: 'self-evaluation-draft',
    }
  )
)

