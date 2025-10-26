import { Box, Stack, TextField, Typography } from '@mui/material'
import { useGameSessionDraftStore } from '../../store/useGameSessionDraftStore'

const GameSettingsSection = () => {
  const totalRounds = useGameSessionDraftStore((state) => state.totalRounds)
  const maxReplaysPerRound = useGameSessionDraftStore((state) => state.maxReplaysPerRound)
  const setTotalRounds = useGameSessionDraftStore((state) => state.setTotalRounds)
  const setMaxReplaysPerRound = useGameSessionDraftStore((state) => state.setMaxReplaysPerRound)

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
      <Typography variant="h6" fontWeight="bold" color="white" mb={2}>
        Game Settings
      </Typography>
      <Stack direction="row" spacing={2}>
        <Box flex={1}>
          <Typography variant="body2" color="white" mb={1}>
            Total Rounds (1-10)
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
          <Typography variant="body2" color="white" mb={1}>
            Max Replays Per Round (0-5)
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
    </Box>
  )
}

export default GameSettingsSection

