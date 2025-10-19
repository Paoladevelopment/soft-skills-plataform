import { Box, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useRoomDraftStore } from '../../store/useRoomDraftStore'
import { TeamAssignmentMode } from '../../types/room/room.models'

const TeamSettingsSection = () => {
  const teamAssignmentMode = useRoomDraftStore((state) => state.teamAssignmentMode)
  const teamSize = useRoomDraftStore((state) => state.teamSize)
  const setField = useRoomDraftStore((state) => state.setField)

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" color="white" mb={2}>
        Team Settings
      </Typography>
      <Box mb={2}>
        <Typography variant="body2" color="white" mb={1}>
          Team Assignment Mode
        </Typography>
        <Select
          value={teamAssignmentMode}
          onChange={(e) => setField('teamAssignmentMode', e.target.value as TeamAssignmentMode)}
          size="small"
          fullWidth
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            color: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '& .MuiSvgIcon-root': {
              color: 'white',
            },
          }}
        >
          <MenuItem value={TeamAssignmentMode.MANUAL}>Manual - Players choose their team</MenuItem>
          <MenuItem value={TeamAssignmentMode.RANDOM}>Random</MenuItem>
        </Select>
      </Box>

      <Box>
        <Typography variant="body2" color="white" mb={1}>
          Team Size (2-4)
        </Typography>
        <TextField
          type="number"
          size="small"
          value={teamSize}
          onChange={(e) => setField('teamSize', Number(e.target.value))}
          inputProps={{ min: 2, max: 4 }}
          fullWidth
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
            },
          }}
        />
      </Box>
    </Box>
  )
}

export default TeamSettingsSection

