import { Box, Stack, TextField, Typography } from '@mui/material'
import { useRoomDraftStore } from '../../store/useRoomDraftStore'

const GameSettingsSection = () => {
  const totalRounds = useRoomDraftStore((state) => state.totalRounds)
  const roundTimeLimit = useRoomDraftStore((state) => state.roundTimeLimit)
  const maxPlaybacks = useRoomDraftStore((state) => state.maxPlaybacks)
  const setField = useRoomDraftStore((state) => state.setField)

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
            Total Rounds (1-8)
          </Typography>
          <TextField
            type="number"
            size="small"
            value={totalRounds}
            onChange={(e) => setField('totalRounds', Number(e.target.value))}
            inputProps={{ min: 1, max: 8 }}
            fullWidth
            sx={fieldStyles}
          />
        </Box>
        <Box flex={1}>
          <Typography variant="body2" color="white" mb={1}>
            Round Time Limit (60-300s, multiple of 5)
          </Typography>
          <TextField
            type="number"
            size="small"
            value={roundTimeLimit}
            onChange={(e) => setField('roundTimeLimit', Number(e.target.value))}
            inputProps={{ min: 60, max: 300, step: 5 }}
            fullWidth
            sx={fieldStyles}
          />
        </Box>
        <Box flex={1}>
          <Typography variant="body2" color="white" mb={1}>
            Max Playbacks (1-3)
          </Typography>
          <TextField
            type="number"
            size="small"
            value={maxPlaybacks}
            onChange={(e) => setField('maxPlaybacks', Number(e.target.value))}
            inputProps={{ min: 1, max: 3 }}
            fullWidth
            sx={fieldStyles}
          />
        </Box>
      </Stack>
    </Box>
  )
}

export default GameSettingsSection

