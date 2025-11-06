import { Box, Button, CircularProgress } from '@mui/material'
import { useGamePlayStore } from '../../store/useGamePlayStore'

interface GamePlayActionsProps {
  showFeedback: boolean
  hasError: boolean
  canAdvance: boolean
  onSubmit: () => void
  onTryAgain: () => void
  onAdvance: () => void
}

const GamePlayActions = ({
  showFeedback,
  hasError,
  canAdvance,
  onSubmit,
  onTryAgain,
  onAdvance,
}: GamePlayActionsProps) => {
  const { isSubmitting, isLoading } = useGamePlayStore()
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
        <Button
          variant="contained"
          size="large"
          onClick={onSubmit}
          disabled={isSubmitting}
          sx={{
            background: 'linear-gradient(135deg, #FFA726 0%, #26C6DA 100%)',
            color: 'white',
            px: 6,
            py: 1.8,
            fontWeight: 'bold',
            fontSize: '1.05rem',
            borderRadius: '10px',
            boxShadow: '0px 4px 15px rgba(255, 167, 38, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0px 6px 20px rgba(255, 167, 38, 0.6)',
            },
            '&:disabled': {
              backgroundColor: '#BDBDBD',
              boxShadow: 'none',
            },
          }}
        >
          {isSubmitting ? 
            <CircularProgress 
              size={24} 
              sx={{ color: 'white' }} 
            /> : 
            'Submit Answer'
          }
        </Button>
      ) : (
        <>
          {hasError && (
            <Button
              variant="contained"
              size="large"
              onClick={onTryAgain}
              sx={{
                backgroundColor: '#4A8A6F',
                color: 'white',
                px: 4,
                py: 1.8,
                fontWeight: 'bold',
                borderRadius: '10px',
                boxShadow: '0px 4px 15px rgba(74, 138, 111, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#3A6F58',
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 6px 20px rgba(74, 138, 111, 0.4)',
                },
              }}
            >
              Try Again
            </Button>
          )}

          {canAdvance && (
            <Button
              variant="contained"
              size="large"
              onClick={onAdvance}
              disabled={isLoading}
              sx={{
                background: 'linear-gradient(135deg, #FFA726 0%, #26C6DA 100%)',
                color: 'white',
                px: 4,
                py: 1.8,
                fontWeight: 'bold',
                borderRadius: '10px',
                boxShadow: '0px 4px 15px rgba(255, 167, 38, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 6px 20px rgba(255, 167, 38, 0.6)',
                },
              }}
            >
              {isLoading ? 
                <CircularProgress 
                  size={24} 
                  sx={{ color: 'white' }} 
                  /> : 
                'Next Round →'
              }
            </Button>
          )}
        </>
      )}
    </Box>
  )
}

export default GamePlayActions

