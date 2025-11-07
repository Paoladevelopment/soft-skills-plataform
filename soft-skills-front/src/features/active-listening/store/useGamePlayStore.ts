import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { IGamePlayStore } from '../types/game-sessions/gamePlay.store'
import { CurrentRound } from '../types/game-sessions/gamePlay.models'
import { SubmitAttemptPayloadAPI } from '../types/game-sessions/gamePlay.api'
import { useToastStore } from '../../../store/useToastStore'
import { getCurrentRound, submitAttempt, advanceRound } from '../api/GamePlay'

export const useGamePlayStore = create<IGamePlayStore>()(
  devtools(
    immer((set, get) => ({
      currentRound: null,
      isLoading: false,
      isSubmitting: false,
      replayCount: 0,
      elapsedTime: 0,
      timerRunning: false,
      error: null,

      setCurrentRound: (round: CurrentRound | null) => {
        set((state) => {
          state.currentRound = round
        }, false, 'GAME_PLAY/SET_CURRENT_ROUND')
      },

      setIsLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading
        }, false, 'GAME_PLAY/SET_IS_LOADING')
      },

      setIsSubmitting: (submitting: boolean) => {
        set((state) => {
          state.isSubmitting = submitting
        }, false, 'GAME_PLAY/SET_IS_SUBMITTING')
      },

      setError: (error: string | null) => {
        set((state) => {
          state.error = error
        }, false, 'GAME_PLAY/SET_ERROR')
      },

      incrementReplayCount: () => {
        set((state) => {
          state.replayCount += 1
        }, false, 'GAME_PLAY/INCREMENT_REPLAY_COUNT')
      },

      resetReplayCount: () => {
        set((state) => {
          state.replayCount = 0
        }, false, 'GAME_PLAY/RESET_REPLAY_COUNT')
      },

      setElapsedTime: (time: number) => {
        set((state) => {
          state.elapsedTime = time
        }, false, 'GAME_PLAY/SET_ELAPSED_TIME')
      },

      setTimerRunning: (running: boolean) => {
        set((state) => {
          state.timerRunning = running
        }, false, 'GAME_PLAY/SET_TIMER_RUNNING')
      },

      fetchCurrentRound: async (sessionId: string) => {
        get().setIsLoading(true)
        get().setError(null)

        try {
          const response = await getCurrentRound(sessionId)
          get().setCurrentRound(response.data)
          get().resetReplayCount()
          get().setElapsedTime(0)
          get().setError(null)
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'Error fetching current round'
          get().setError(errorMessage)
          useToastStore.getState().showToast(errorMessage, 'error')
        } finally {
          get().setIsLoading(false)
        }
      },

      submitAttempt: async (sessionId: string, payload: SubmitAttemptPayloadAPI) => {
        get().setIsSubmitting(true)

        try {
          const currentRound = get().currentRound
          if (!currentRound) {
            useToastStore.getState().showToast('No current round available', 'error')
            return {
              isCorrect: false,
              feedbackShort: 'Error: No current round',
              canAdvance: false,
            }
          }

          const response = await submitAttempt(sessionId, currentRound.currentRound, payload)
          const responseData = response.data
          
          useToastStore.getState().showToast(responseData.feedbackShort, responseData.isCorrect ? 'success' : 'error')

          return {
            isCorrect: responseData.isCorrect,
            feedbackShort: responseData.feedbackShort,
            canAdvance: responseData.canAdvance,
            score: responseData.score,
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error submitting attempt', 'error')
          }
          
          return null
        } finally {
          get().setIsSubmitting(false)
        }
      },

      advanceRound: async (sessionId: string) => {
        get().setIsLoading(true)

        try {
          await advanceRound(sessionId)

          await get().fetchCurrentRound(sessionId)
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error advancing to next round', 'error')
          }
        } finally {
          get().setIsLoading(false)
        }
      },

      reset: () => {
        set((state) => {
          state.currentRound = null
          state.isLoading = false
          state.isSubmitting = false
          state.replayCount = 0
          state.elapsedTime = 0
          state.timerRunning = false
          state.error = null
        }, false, 'GAME_PLAY/RESET')
      },
    })),

    { name: 'gamePlayStore' }
  )
)

