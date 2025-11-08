import { EvaluationAnswer, FocusModePayload, ModePayload } from '../../../types/game-sessions/gamePlay.models'
import { PlayMode } from '../../../types/game-sessions/gameSession.models'
import ClarifyUserAnswerDisplay from './ClarifyUserAnswerDisplay'
import ClozeUserAnswerDisplay from './ClozeUserAnswerDisplay'
import FocusAnswerDisplay from './FocusAnswerDisplay'
import TextAnswerDisplay from './TextAnswerDisplay'

interface UserAnswerDisplayProps {
  answerPayload: EvaluationAnswer
  modePayload: ModePayload | null
  playMode?: PlayMode
  userLabel: string
  isCorrect?: boolean
}

const UserAnswerDisplay = ({
  answerPayload,
  modePayload,
  playMode,
  userLabel,
  isCorrect,
}: UserAnswerDisplayProps) => {
  if (!answerPayload) return null

  switch (playMode) {
    case PlayMode.FOCUS: {
      const selectedIndex = answerPayload.selectedIndex
      const modePayloadTyped = modePayload as FocusModePayload | null

      if (selectedIndex !== undefined && modePayloadTyped?.answerChoices) {
        return (
          <FocusAnswerDisplay
            answer={modePayloadTyped.answerChoices[selectedIndex]}
            label={userLabel}
            isCorrect={isCorrect ?? false}
          />
        )
      }

      return null
    }

    case PlayMode.CLOZE: {
      const blanks = answerPayload.blanks
      
      if (blanks && blanks.length > 0) {
        return (
          <ClozeUserAnswerDisplay 
            blanks={blanks} 
            userLabel={userLabel} 
          />
        )
      }
      
      return null
    }

    case PlayMode.PARAPHRASE: {
      const text = answerPayload.paraphrase
      if (text) {
        return (
          <TextAnswerDisplay 
            text={text} 
            userLabel={userLabel} 
          />
        )
      }

      return null
    }

    case PlayMode.SUMMARIZE: {
      const text = answerPayload.summary
      if (text) {
        return (
          <TextAnswerDisplay 
            text={text} 
            userLabel={userLabel} 
          />
        )
      }

      return null
    }

    case PlayMode.CLARIFY: {
      const questions = answerPayload.questions
      if (questions && questions.length > 0) {
        return (
          <ClarifyUserAnswerDisplay 
            questions={questions} 
            userLabel={userLabel} 
          />
        )
      }
      
      return null
    }

    default:
      return null
  }
}

export default UserAnswerDisplay

