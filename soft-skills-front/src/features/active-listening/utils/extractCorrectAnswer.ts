import { EvaluationAnswer } from '../types/game-sessions/gamePlay.models'

type CorrectAnswerInput = string | string[] | EvaluationAnswer

export const extractSelectedIndex = (correctAnswer: CorrectAnswerInput): number | undefined => {
  if (typeof correctAnswer === 'object' && !Array.isArray(correctAnswer)) {
    return (correctAnswer as EvaluationAnswer).selectedIndex
  }

  return undefined
}

export const extractBlanks = (correctAnswer: CorrectAnswerInput): string[] => {
  if (Array.isArray(correctAnswer)) {
    return correctAnswer
  }

  if (typeof correctAnswer === 'object' && !Array.isArray(correctAnswer) && 'blanks' in correctAnswer) {
    return (correctAnswer as EvaluationAnswer).blanks || []
  }

  return []
}

export const extractParaphrase = (correctAnswer: CorrectAnswerInput): string | undefined => {
  if (typeof correctAnswer === 'string') {
    return correctAnswer
  }

  if (typeof correctAnswer === 'object' && !Array.isArray(correctAnswer) && 'paraphrase' in correctAnswer) {
    return (correctAnswer as EvaluationAnswer).paraphrase
  }

  return undefined
}

export const extractSummary = (correctAnswer: CorrectAnswerInput): string | undefined => {
  if (typeof correctAnswer === 'string') {
    return correctAnswer
  }

  if (typeof correctAnswer === 'object' && !Array.isArray(correctAnswer) && 'summary' in correctAnswer) {
    return (correctAnswer as EvaluationAnswer).summary
  }

  return undefined
}

export const extractQuestions = (correctAnswer: CorrectAnswerInput): string[] => {
  if (Array.isArray(correctAnswer)) {
    return correctAnswer
  }

  if (typeof correctAnswer === 'object' && !Array.isArray(correctAnswer) && 'questions' in correctAnswer) {
    return (correctAnswer as EvaluationAnswer).questions || []
  }
  
  return []
}

