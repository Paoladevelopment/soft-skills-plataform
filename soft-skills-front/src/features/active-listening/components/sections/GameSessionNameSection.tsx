import { Box, TextField, Typography, IconButton, InputAdornment } from '@mui/material'
import { Edit, Check, Close } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useGameSessionDraftStore } from '../../store/useGameSessionDraftStore'
import { useGameSessionStore } from '../../store/useGameSessionStore'
import { useState } from 'react'
import { GAME_SESSION_MODE, GameSessionMode } from '../../constants/gameSessionMode'

interface GameSessionNameSectionProps {
  mode?: GameSessionMode
  sessionId?: string
}

interface EditButtonProps {
  onClick: () => void
}

const EditButton = ({ onClick, ariaLabel }: EditButtonProps & { ariaLabel: string }) => (
  <InputAdornment position="end">
    <IconButton
      onClick={onClick}
      size="small"
      aria-label={ariaLabel}
      edge="end"
      sx={{
        color: 'white',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <Edit fontSize="small" />
    </IconButton>
  </InputAdornment>
)

interface ActionButtonsProps {
  onConfirm: () => void
  onCancel: () => void
  confirmAriaLabel: string
  cancelAriaLabel: string
}

const ActionButtons = ({ onConfirm, onCancel, confirmAriaLabel, cancelAriaLabel }: ActionButtonsProps) => (
  <InputAdornment position="end">
    <Box 
      sx={{ 
        display: 'flex', 
        gap: 0.5 
      }}
    >
      <IconButton
        onClick={onConfirm}
        size="small"
        aria-label={confirmAriaLabel}
        sx={{
          backgroundColor: '#FFA726',
          color: 'white',
          '&:hover': {
            backgroundColor: '#FB8C00',
          },
        }}
      >
        <Check fontSize="small" />
      </IconButton>
      <IconButton
        onClick={onCancel}
        size="small"
        aria-label={cancelAriaLabel}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <Close fontSize="small" />
      </IconButton>
    </Box>
  </InputAdornment>
)

const GameSessionNameSection = ({ mode = GAME_SESSION_MODE.CREATE, sessionId }: GameSessionNameSectionProps) => {
  const { t } = useTranslation('game')
  
  const sessionName = useGameSessionDraftStore((state) => state.sessionName)
  const setSessionName = useGameSessionDraftStore((state) => state.setSessionName)
  const updateGameSession = useGameSessionStore((state) => state.updateGameSession)
  const [isLocked, setIsLocked] = useState(mode === GAME_SESSION_MODE.UPDATE)
  const [originalName, setOriginalName] = useState(sessionName)

  const handleEditClick = () => {
    setOriginalName(sessionName)
    setIsLocked(false)
  }

  const handleConfirm = async () => {
    if (mode === GAME_SESSION_MODE.UPDATE && sessionId && sessionName !== originalName) {
      await updateGameSession(sessionId, { name: sessionName })
    }
    
    setIsLocked(true)
    setOriginalName(sessionName)
  }

  const handleCancel = () => {
    setSessionName(originalName)
    setIsLocked(true)
  }

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight="bold" color="white" mb={1}>
        {t('play.sessionForm.sessionName.label')}
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder={t('play.sessionForm.sessionName.placeholder')}
        value={sessionName}
        onChange={(e) => setSessionName(e.target.value)}
        disabled={isLocked}
        slotProps={{
          input: {
            endAdornment: mode === GAME_SESSION_MODE.UPDATE ? (
              isLocked ? (
                <EditButton onClick={handleEditClick} ariaLabel={t('play.sessionForm.sessionName.editAriaLabel')} />
              ) : (
                <ActionButtons 
                  onConfirm={handleConfirm} 
                  onCancel={handleCancel}
                  confirmAriaLabel={t('play.sessionForm.sessionName.confirmAriaLabel')}
                  cancelAriaLabel={t('play.sessionForm.sessionName.cancelAriaLabel')}
                />
              )
            ) : undefined,
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            color: 'white',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-disabled': {
              color: 'white',
              WebkitTextFillColor: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '& .MuiOutlinedInput-input': {
                color: 'white',
                WebkitTextFillColor: 'white',
              },
            },
          },
          '& .MuiOutlinedInput-input': {
            color: 'white',
            '&::placeholder': {
              color: 'rgba(255, 255, 255, 0.5)',
              opacity: 1,
            },
            '&.Mui-disabled': {
              color: 'white',
              WebkitTextFillColor: 'white',
            },
          },
        }}
      />
    </Box>
  )
}

export default GameSessionNameSection

