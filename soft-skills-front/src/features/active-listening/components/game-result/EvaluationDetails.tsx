import { Box, Typography } from '@mui/material'
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

const recapLabels: Record<string, RecapLabels> = {
  focus: {
    sectionTitle: 'Question Asked',
    userLabel: 'Your answer:',
    correctLabel: 'Correct answer:',
  },
  cloze: {
    sectionTitle: 'Filled Blanks',
    userLabel: 'Your responses:',
    correctLabel: 'Correct responses:',
  },
  paraphrase: {
    sectionTitle: 'Your Paraphrase',
    userLabel: 'Your wording:',
    correctLabel: 'Reference paraphrase:',
  },
  summarize: {
    sectionTitle: 'Summary',
    userLabel: 'Your summary:',
    correctLabel: 'Reference summary:',
  },
  clarify: {
    sectionTitle: 'Clarifying Questions',
    userLabel: 'Questions you asked:',
    correctLabel: 'Reference questions:',
  },
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
  if (!evaluation || !playMode) {
    return null
  }

  const labels = recapLabels[playMode.toLowerCase()]
  
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
