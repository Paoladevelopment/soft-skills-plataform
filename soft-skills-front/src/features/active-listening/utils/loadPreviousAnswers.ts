import { PlayMode } from '../types/game-sessions/gameSession.models'
import { ClozeModePayload, Evaluation, ModePayload } from '../types/game-sessions/gamePlay.models'
import { IGamePlayAnswerStore } from '../types/game-sessions/gamePlayAnswer.store'
import { countBlanks } from './clozeUtils'

/**
 * Loads previous answers from evaluation into the answer store
 */
export function loadPreviousAnswers(
  evaluation: Evaluation | undefined,
  playMode: PlayMode,
  modePayload: ModePayload,
  answerStore: IGamePlayAnswerStore
): void {
  if (!evaluation?.answerPayload) {
    // Initialize empty state
    initializeEmptyAnswers(playMode, modePayload, answerStore)
    return
  }

  // Load answers from evaluation
  switch (playMode) {
    case PlayMode.FOCUS: {
      loadFocusAnswer(evaluation, answerStore)
      break
    }
    case PlayMode.CLOZE: {
      loadClozeAnswer(evaluation, modePayload, answerStore)
      break
    }
    case PlayMode.PARAPHRASE:
    case PlayMode.SUMMARIZE: {
      loadTextAnswer(evaluation, answerStore)
      break
    }
    case PlayMode.CLARIFY: {
      loadClarifyAnswer(evaluation, answerStore)
      break
    }
  }
}

/**
 * Initialize empty answers for a given play mode
 */
function initializeEmptyAnswers(
  playMode: PlayMode,
  modePayload: ModePayload,
  answerStore: IGamePlayAnswerStore
): void {
  if (playMode === PlayMode.CLOZE) {
    const blankCount = countBlanks((modePayload as ClozeModePayload).textWithBlanks)
    answerStore.setFilledBlanks(Array(blankCount).fill(''))
  }
}

/**
 * Load focus mode answer
 */
function loadFocusAnswer(evaluation: Evaluation, answerStore: IGamePlayAnswerStore): void {
  if (evaluation.answerPayload.selectedIndex !== undefined) {
    answerStore.setSelectedIndex(evaluation.answerPayload.selectedIndex)
  }
}

/**
 * Load cloze mode answer
 */
function loadClozeAnswer(
  evaluation: Evaluation,
  modePayload: ModePayload,
  answerStore: IGamePlayAnswerStore
): void {
  if (evaluation.answerPayload.blanks) {
    answerStore.setFilledBlanks(evaluation.answerPayload.blanks)
  } else {
    const blankCount = countBlanks((modePayload as ClozeModePayload).textWithBlanks)
    answerStore.setFilledBlanks(Array(blankCount).fill(''))
  }
}

/**
 * Load text mode answer (paraphrase or summarize)
 */
function loadTextAnswer(evaluation: Evaluation, answerStore: IGamePlayAnswerStore): void {
  if (evaluation.answerPayload.paraphrase) {
    answerStore.setTextResponse(evaluation.answerPayload.paraphrase)
  } else if (evaluation.answerPayload.summary) {
    answerStore.setTextResponse(evaluation.answerPayload.summary)
  }
}

/**
 * Load clarify mode answer
 */
function loadClarifyAnswer(evaluation: Evaluation, answerStore: IGamePlayAnswerStore): void {
  if (evaluation.answerPayload.questions) {
    answerStore.setClarifyQuestions(evaluation.answerPayload.questions)
  }
}

