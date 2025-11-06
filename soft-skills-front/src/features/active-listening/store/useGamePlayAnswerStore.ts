import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { IGamePlayAnswerStore } from '../types/game-sessions/gamePlayAnswer.store'

const initialState = {
  selectedIndex: null as number | null,
  filledBlanks: [] as string[],
  textResponse: '',
  clarifyQuestions: [''],
}

export const useGamePlayAnswerStore = create<IGamePlayAnswerStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      setSelectedIndex: (index) => {
        set((state) => {
          state.selectedIndex = index
        }, false, 'GAME_PLAY_ANSWER/SET_SELECTED_INDEX')
      },

      setFilledBlanks: (blanks) => {
        set((state) => {
          state.filledBlanks = blanks
        }, false, 'GAME_PLAY_ANSWER/SET_FILLED_BLANKS')
      },

      setTextResponse: (response) => {
        set((state) => {
          state.textResponse = response
        }, false, 'GAME_PLAY_ANSWER/SET_TEXT_RESPONSE')
      },

      setClarifyQuestions: (questions) => {
        set((state) => {
          state.clarifyQuestions = questions
        }, false, 'GAME_PLAY_ANSWER/SET_CLARIFY_QUESTIONS')
      },

      updateBlank: (index, value) => {
        set((state) => {
          state.filledBlanks[index] = value
        }, false, 'GAME_PLAY_ANSWER/UPDATE_BLANK')
      },

      addClarifyQuestion: () => {
        set((state) => {
          state.clarifyQuestions.push('')
        }, false, 'GAME_PLAY_ANSWER/ADD_CLARIFY_QUESTION')
      },

      removeClarifyQuestion: (index) => {
        set((state) => {
          state.clarifyQuestions.splice(index, 1)
        }, false, 'GAME_PLAY_ANSWER/REMOVE_CLARIFY_QUESTION')
      },

      updateClarifyQuestion: (index, value) => {
        set((state) => {
          state.clarifyQuestions[index] = value
        }, false, 'GAME_PLAY_ANSWER/UPDATE_CLARIFY_QUESTION')
      },

      reset: () => {
        set(initialState, false, 'GAME_PLAY_ANSWER/RESET')
      },

      getSnapshot: () => {
        const state = get()
        return {
          selectedIndex: state.selectedIndex,
          filledBlanks: state.filledBlanks,
          textResponse: state.textResponse,
          clarifyQuestions: state.clarifyQuestions,
        }
      },
    })),
    { name: 'gamePlayAnswerStore' }
  )
)

