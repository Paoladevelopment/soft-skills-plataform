import { Box, Button, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useGamePlayStore } from '../../store/useGamePlayStore'

interface GamePlayActionsProps {
  showFeedback: boolean
  hasError: boolean
  canAdvance: boolean
  isLastRound: boolean
  isAttempted: boolean
  onSubmit: () => void
  onTryAgain: () => void
  onAdvance: () => void
  onFinishSession: () => void
}

const GamePlayActions = ({
  showFeedback,
  hasError,
  canAdvance,
  isLastRound,
  isAttempted,
  onSubmit,
  onTryAgain,
  onAdvance,
  onFinishSession,
}: GamePlayActionsProps) => {
  const { t } = useTranslation('game')
  const { isSubmitting, isLoading } = useGamePlayStore()

  const getGradientButtonStyles = (gradientColors: string, shadowColor: string) => ({
    background: `linear-gradient(135deg, ${gradientColors})`,
    color: 'white',
    px: 4,
    py: 1.8,
    fontWeight: 'bold',
    borderRadius: '10px',
    boxShadow: `0px 4px 15px ${shadowColor}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0px 6px 20px ${shadowColor}`,
    },
  })

  const getSolidButtonStyles = (backgroundColor: string, hoverColor: string, shadowColor: string) => ({
    backgroundColor,
    color: 'white',
    px: 4,
    py: 1.8,
    fontWeight: 'bold',
    borderRadius: '10px',
    boxShadow: `0px 4px 15px ${shadowColor}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: hoverColor,
      transform: 'translateY(-2px)',
      boxShadow: `0px 6px 20px ${shadowColor}`,
    },
  })

  const renderLoadingSpinner = () => (
    <CircularProgress size={24} sx={{ color: 'white' }} />
  )

  const renderSubmitButton = () => (
    <Button
      variant="contained"
      size="large"
      onClick={onSubmit}
      disabled={isSubmitting}
      sx={{
        ...getGradientButtonStyles('#FFA726 0%, #26C6DA 100%', 'rgba(255, 167, 38, 0.4)'),
        px: 6,
        fontSize: '1.05rem',
        '&:disabled': {
          backgroundColor: '#BDBDBD',
          boxShadow: 'none',
        },
      }}
    >
      {isSubmitting ? renderLoadingSpinner() : t('play.submitAnswer')}
    </Button>
  )

  const renderTryAgainButton = () => (
    <Button
      variant="contained"
      size="large"
      onClick={onTryAgain}
      sx={getSolidButtonStyles(
        '#4A8A6F',
        '#3A6F58',
        'rgba(74, 138, 111, 0.3)'
      )}
    >
      {t('play.tryAgain')}
    </Button>
  )

  const renderFinishSessionButton = () => (
    <Button
      variant="contained"
      size="large"
      onClick={onFinishSession}
      disabled={isLoading}
      sx={getGradientButtonStyles(
        '#FFA726 0%, #26C6DA 100%',
        'rgba(255, 167, 38, 0.4)'
      )}
    >
      {isLoading ? renderLoadingSpinner() : t('play.finishSession')}
    </Button>
  )

  const renderNextRoundButton = () => (
    <Button
      variant="contained"
      size="large"
      onClick={onAdvance}
      disabled={isLoading}
      sx={getGradientButtonStyles(
        '#FFA726 0%, #26C6DA 100%',
        'rgba(255, 167, 38, 0.4)'
      )}
    >
      {isLoading ? renderLoadingSpinner() : t('play.nextRound')}
    </Button>
  )

  const shouldShowFinishSession = isLastRound && isAttempted

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        gap: 2, 
        justifyContent: 'center', 
        pt: 2, 
        pb: 2 
      }}
    >
      {!showFeedback ? (
        renderSubmitButton()
      ) : (
        <>
          {hasError && renderTryAgainButton()}
          {shouldShowFinishSession ? renderFinishSessionButton() : canAdvance && renderNextRoundButton()}
        </>
      )}
    </Box>
  )
}

export default GamePlayActions

