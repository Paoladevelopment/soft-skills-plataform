export interface IGamePlayAnswerStore {
  selectedIndex: number | null
  filledBlanks: string[]
  textResponse: string
  clarifyQuestions: string[]

  setSelectedIndex: (index: number | null) => void
  setFilledBlanks: (blanks: string[]) => void
  setTextResponse: (response: string) => void
  setClarifyQuestions: (questions: string[]) => void

  updateBlank: (index: number, value: string) => void
  addClarifyQuestion: () => void
  removeClarifyQuestion: (index: number) => void
  updateClarifyQuestion: (index: number, value: string) => void

  reset: () => void
  getSnapshot: () => {
    selectedIndex: number | null
    filledBlanks: string[]
    textResponse: string
    clarifyQuestions: string[]
  }
}

