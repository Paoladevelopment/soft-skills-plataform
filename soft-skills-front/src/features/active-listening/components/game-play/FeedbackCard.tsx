import { Box, Card, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { PlayMode } from '../../types/game-sessions/gameSession.models'

interface FeedbackCardProps {
  isCorrect: boolean
  feedbackShort: string
  score?: number
  maxScore?: number
  correctAnswer?: string
  playMode?: PlayMode
}

const FeedbackCard = ({ isCorrect, feedbackShort, score, maxScore, correctAnswer, playMode }: FeedbackCardProps) => {
  const { t } = useTranslation('game')
  
  const renderScoreSection = () => {
    if (score === undefined && maxScore === undefined) return null

    return (
      <Box 
        sx={{ 
          mt: 2, 
          pt: 2, 
          borderTop: '1px solid #ccc' 
          }}
        >
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#333' 
          }}
        >
          {t('play.score')}: {score ?? 0} / {maxScore ?? 0}
        </Typography>
      </Box>
    )
  }

  const getAnswerLabel = () => {
    switch (playMode) {
      case PlayMode.CLOZE:
      case PlayMode.FOCUS:
        return t('play.correctAnswer')
      case PlayMode.PARAPHRASE:
        return t('play.possibleAnswer')
      case PlayMode.SUMMARIZE:
        return t('play.possibleAnswer')
      case PlayMode.CLARIFY:
        return t('play.possibleQuestions')
      default:
        return t('play.answer')
    }
  }

  const renderCorrectAnswerSection = () => {
    if (!correctAnswer) return null

    return (
      <Box 
        sx={{ 
          mt: 2 
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#333' 
          }}
        >
          {getAnswerLabel()}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 0.5,
            p: 1,
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            color: '#333',
            fontStyle: 'italic'
          }}
        >
          {correctAnswer}
        </Typography>
      </Box>
    )
  }

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: '12px',
        backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE',
        borderLeft: `5px solid ${isCorrect ? '#4CAF50' : '#F44336'}`,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: 2 
        }}
      >
        {isCorrect ? (
          <CheckCircle 
            sx={{ 
              color: '#4CAF50', 
              mt: 0.5 
            }} 
          />
        ) : (
          <Cancel 
            sx={{ 
              color: '#F44336', 
              mt: 0.5 
            }} 
          />
        )}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: isCorrect ? '#2E7D32' : '#C62828',
            }}
          >
            {isCorrect ? t('play.correct') : t('play.incorrect')}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: '#333' }}>
            {feedbackShort}
          </Typography>

          {renderScoreSection()}
          {renderCorrectAnswerSection()}
        </Box>
      </Box>
    </Card>
  )
}

export default FeedbackCard

