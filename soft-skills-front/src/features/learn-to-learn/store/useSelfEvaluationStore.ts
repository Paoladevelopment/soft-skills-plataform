import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { SelfEvaluationStore } from '../types/self-evaluation/self-evaluation.store'
import { createSelfEvaluation } from '../api/SelfEvaluations'
import { useToastStore } from '../../../store/useToastStore'
import { useSelfEvaluationDraftStore } from './useSelfEvaluationDraftStore'

export const useSelfEvaluationStore = create<SelfEvaluationStore>()(
  devtools(
    (set) => ({
      isOpen: false,
      submitting: false,
      initialTaskId: null,

      open: (taskId) => {
        useSelfEvaluationDraftStore.getState().initialize(taskId)
        set({ 
          isOpen: true, 
          initialTaskId: taskId 
        }, false, 'SELF_EVAL/OPEN')
      },

      close: () => {
        set({ 
          isOpen: false, 
          initialTaskId: null 
        }, false, 'SELF_EVAL/CLOSE')
      },

      submit: async (payload) => {
        set({ 
          submitting: true 
        }, false, 'SELF_EVAL/SUBMIT_START')

        try {
          const res = await createSelfEvaluation(payload)

          set({ 
            submitting: false 
          }, false, 'SELF_EVAL/SUBMIT_SUCCESS')

          useToastStore.getState().showToast('Self-evaluation saved successfully', 'success')
          return res
        } catch (error) {
          set({ 
            submitting: false 
          }, false, 'SELF_EVAL/SUBMIT_ERROR')
          
          const errorMessage = error instanceof Error ? error.message : 'Failed to save self-evaluation'
          useToastStore.getState().showToast(errorMessage, 'error')
        }
      },
    }),
    { name: 'selfEvaluationStore' }
  )
)

