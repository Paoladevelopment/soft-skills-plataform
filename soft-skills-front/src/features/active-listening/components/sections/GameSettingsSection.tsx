import { Box, Stack, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useGameSessionDraftStore } from '../../store/useGameSessionDraftStore'

const GameSettingsSection = () => {
  const { t } = useTranslation('game')
  
  const totalRounds = useGameSessionDraftStore((state) => state.totalRounds)
  const maxReplaysPerRound = useGameSessionDraftStore((state) => state.maxReplaysPerRound)
  const reuseExistingChallenges = useGameSessionDraftStore((state) => state.reuseExistingChallenges)
  const setTotalRounds = useGameSessionDraftStore((state) => state.setTotalRounds)
  const setMaxReplaysPerRound = useGameSessionDraftStore((state) => state.setMaxReplaysPerRound)
  const setReuseExistingChallenges = useGameSessionDraftStore((state) => state.setReuseExistingChallenges)

  const fieldStyles = {
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
    },
  }

  return (
    <Box>
      <Typography 
        variant="h6" 
        fontWeight="bold" 
        color="white" 
        mb={2}
      >
        {t('play.sessionForm.gameSettings.title')}
      </Typography>
      <Stack spacing={2}>
        <Stack 
          direction="row" 
          spacing={2}
        >
          <Box flex={1}>
            <Typography 
              variant="body2" 
              color="white" 
              mb={1}
            >
              {t('play.sessionForm.gameSettings.totalRounds')}
            </Typography>
            <TextField
              type="number"
              size="small"
              value={totalRounds}
              onChange={(e) => setTotalRounds(Number(e.target.value))}
              slotProps={{ 
                htmlInput: { min: 1, max: 10 } 
              }}
              fullWidth
              sx={fieldStyles}
            />
          </Box>
          <Box flex={1}>
            <Typography 
              variant="body2" 
              color="white" 
              mb={1}
            >
              {t('play.sessionForm.gameSettings.maxReplaysPerRound')}
            </Typography>
            <TextField
              type="number"
              size="small"
              value={maxReplaysPerRound}
              onChange={(e) => setMaxReplaysPerRound(Number(e.target.value))}
              slotProps={{ 
                htmlInput: { min: 0, max: 5 } 
              }}
              fullWidth
              sx={fieldStyles}
            />
          </Box>
        </Stack>

        <FormControlLabel
          control={
            <Checkbox
              checked={reuseExistingChallenges}
              onChange={(e) => setReuseExistingChallenges(e.target.checked)}
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-checked': {
                  color: '#FFA726',
                },
              }}
            />
          }
          label={
            <Typography 
              variant="body2" 
              color="white"
            >
              {t('play.sessionForm.gameSettings.reuseExistingChallenges')}
            </Typography>
          }
        />
      </Stack>
    </Box>
  )
}

export default GameSettingsSection

