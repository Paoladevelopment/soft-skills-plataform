import { Box, Button, Card, Chip, IconButton, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Settings, PlayArrow, Delete, Visibility } from '@mui/icons-material'
import { GameSessionListItem, GameSessionStatus } from '../types/game-sessions/gameSession.models'
import { getStatusColor, getStatusLabel } from '../utils/gameSessionsUtils'

interface GameSessionCardProps {
  session: GameSessionListItem
  onPlay?: (sessionId: string) => void
  onSettings?: (sessionId: string) => void
  onDelete?: (sessionId: string) => void
  onStart?: (sessionId: string) => void
  onView?: (sessionId: string) => void
}

const GameSessionCard = ({ session, onPlay, onSettings, onDelete, onStart, onView }: GameSessionCardProps) => {
  const { t } = useTranslation('game')
  const isSessionEnded = session.status === GameSessionStatus.COMPLETED || session.status === GameSessionStatus.CANCELLED
  const isPaused = session.status === GameSessionStatus.PAUSED
  const isPending = session.status === GameSessionStatus.PENDING
  const isCompleted = session.status === GameSessionStatus.COMPLETED

  const handleSessionAction = () => {
    if (isPending) {
      return onStart?.(session.gameSessionId)
    }
    
    onPlay?.(session.gameSessionId)
  }


  return (
    <Card
      sx={{
        p: 3,
        background: 'linear-gradient(180deg, #FFA726 0%, #F57C00 100%)',
        borderRadius: '12px',
        boxShadow: '0px 4px 0px #C96A00',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, 
          flex: 1 
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="white">
          {session.name}
        </Typography>
        <Chip
          label={getStatusLabel(session.status)}
          color={getStatusColor(session.status)}
          size="small"
          sx={{ 
            fontWeight: 'bold' 
          }}
        />
      </Box>

      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}
      >
        {isCompleted && (
          <IconButton
            onClick={() => onView?.(session.gameSessionId)}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <Visibility />
          </IconButton>
        )}

        {!isSessionEnded && (
          <IconButton
            onClick={() => onSettings?.(session.gameSessionId)}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <Settings />
          </IconButton>
        )}

        <IconButton
          onClick={() => onDelete?.(session.gameSessionId)}
          sx={{
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 0, 0, 0.7)',
            },
          }}
        >
          <Delete />
        </IconButton>

        {!isSessionEnded && (
          <Button
            variant="contained"
            onClick={handleSessionAction}
            startIcon={<PlayArrow />}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            {isPending ? t('sessions.actions.start') : isPaused ? t('sessions.actions.continuePlaying') : t('sessions.actions.play')}
          </Button>
        )}
      </Box>
    </Card>
  )
}

export default GameSessionCard

