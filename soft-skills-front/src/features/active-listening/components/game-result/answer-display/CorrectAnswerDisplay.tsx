import { EvaluationAnswer, FocusModePayload, ModePayload } from '../../../types/game-sessions/gamePlay.models'
import { PlayMode } from '../../../types/game-sessions/gameSession.models'
import { extractBlanks, extractParaphrase, extractQuestions, extractSelectedIndex, extractSummary } from '../../../utils/extractCorrectAnswer'
import ClarifyCorrectAnswerDisplay from './ClarifyCorrectAnswerDisplay'
import ClozeCorrectAnswerDisplay from './ClozeCorrectAnswerDisplay'
import FocusAnswerDisplay from './FocusAnswerDisplay'
import TextCorrectAnswerDisplay from './TextCorrectAnswerDisplay'

interface CorrectAnswerDisplayProps {
  correctAnswer: string | string[] | EvaluationAnswer
  modePayload: ModePayload | null
  playMode?: PlayMode
  correctLabel: string
  isCorrect?: boolean
}

const CorrectAnswerDisplay = ({
  correctAnswer,
  modePayload,
  playMode,
  correctLabel,
  isCorrect,
}: CorrectAnswerDisplayProps) => {
  if (!correctAnswer) return null

  switch (playMode) {
    case PlayMode.FOCUS: {
      if (isCorrect) {
        return null
      }

      let answerText: string | undefined

      if (typeof correctAnswer === 'string') {
        answerText = correctAnswer
      }

      if (!answerText) {
        const selectedIndex = extractSelectedIndex(correctAnswer)
        const modePayloadTyped = modePayload as FocusModePayload | null
        
        if (selectedIndex !== undefined && modePayloadTyped?.answerChoices) {
          answerText = modePayloadTyped.answerChoices[selectedIndex]
        }
      }

      if (!answerText) {
        return null
      }

      return (
        <FocusAnswerDisplay
          answer={answerText}
          label={correctLabel}
          isCorrect={true}
        />
      )
    }
    
    case PlayMode.CLOZE: {
      const blanks = extractBlanks(correctAnswer)
      
      if (blanks.length > 0) {
        return (
          <ClozeCorrectAnswerDisplay 
            blanks={blanks} 
            correctLabel={correctLabel} 
          />
        )
      }

      return null
    }

    case PlayMode.PARAPHRASE: {
      const text = extractParaphrase(correctAnswer)
      
      if (text) {
        return (
          <TextCorrectAnswerDisplay 
            text={text} 
            correctLabel={correctLabel} 
          />
        )
      }

      return null
    }

    case PlayMode.SUMMARIZE: {
      const text = extractSummary(correctAnswer)
      
      if (text) {
        return (
          <TextCorrectAnswerDisplay 
            text={text} 
            correctLabel={correctLabel} 
          />
        )
      }

      return null
    }

    case PlayMode.CLARIFY: {
      const questions = extractQuestions(correctAnswer)
      
      if (questions.length > 0) {
        return (
          <ClarifyCorrectAnswerDisplay 
            questions={questions} 
            correctLabel={correctLabel} 
          />
        )
      }

      return null
    }

    default:
      return null
  }
}

export default CorrectAnswerDisplay

