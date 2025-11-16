import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ModePayload, Evaluation, FocusModePayload } from '../../types/game-sessions/gamePlay.models'
import { PlayMode } from '../../types/game-sessions/gameSession.models'
import UserAnswerDisplay from './answer-display/UserAnswerDisplay'
import CorrectAnswerDisplay from './answer-display/CorrectAnswerDisplay'
import QuestionDisplay from './answer-display/QuestionDisplay'

interface RecapLabels {
  sectionTitle: string
  userLabel: string
  correctLabel: string
}

interface EvaluationDetailsProps {
  evaluation: Evaluation | null
  modePayload: ModePayload | null
  playMode?: PlayMode
}

const EvaluationDetails = ({
  evaluation,
  modePayload,
  playMode,
}: EvaluationDetailsProps) => {
  const { t } = useTranslation('game')
  
  if (!evaluation || !playMode) {
    return null
  }

  const getLabels = (mode: string): RecapLabels | null => {
    switch (mode.toLowerCase()) {
      case 'focus':
        return {
          sectionTitle: t('result.evaluation.questionAsked'),
          userLabel: t('result.evaluation.yourAnswer'),
          correctLabel: t('result.evaluation.correctAnswer'),
        }
      case 'cloze':
        return {
          sectionTitle: t('result.evaluation.filledBlanks'),
          userLabel: t('result.evaluation.yourResponses'),
          correctLabel: t('result.evaluation.correctResponses'),
        }
      case 'paraphrase':
        return {
          sectionTitle: t('result.evaluation.yourParaphrase'),
          userLabel: t('result.evaluation.yourWording'),
          correctLabel: t('result.evaluation.referenceParaphrase'),
        }
      case 'summarize':
        return {
          sectionTitle: t('result.evaluation.summary'),
          userLabel: t('result.evaluation.yourSummary'),
          correctLabel: t('result.evaluation.referenceSummary'),
        }
      case 'clarify':
        return {
          sectionTitle: t('result.evaluation.clarifyingQuestions'),
          userLabel: t('result.evaluation.questionsYouAsked'),
          correctLabel: t('result.evaluation.referenceQuestions'),
        }
      default:
        return null
    }
  }

  const labels = getLabels(playMode.toLowerCase())
  
  if (!labels) {
    return null
  }

  const isCorrect = evaluation.isCorrect

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: isCorrect ? '#E8F9EE' : '#FDECEC',
        borderRadius: 0,
        boxShadow: 'none',
      }}
    >
      <Typography 
        variant="h6" 
        fontWeight="bold" 
        sx={{ 
          mb: 2, 
          color: '#333' 
        }}
      >
        {labels.sectionTitle}:
      </Typography>

      {playMode === PlayMode.FOCUS && modePayload && (modePayload as FocusModePayload).question && (
        <QuestionDisplay 
          question={(modePayload as FocusModePayload).question} 
        />
      )}

      {evaluation.answerPayload && (
        <UserAnswerDisplay
          answerPayload={evaluation.answerPayload}
          modePayload={modePayload}
          playMode={playMode}
          userLabel={labels.userLabel}
          isCorrect={isCorrect}
        />
      )}

      {evaluation.correctAnswer && (
        <CorrectAnswerDisplay
          correctAnswer={evaluation.correctAnswer}
          modePayload={modePayload}
          playMode={playMode}
          correctLabel={labels.correctLabel}
          isCorrect={isCorrect}
        />
      )}

    </Box>
  )
}

export default EvaluationDetails
