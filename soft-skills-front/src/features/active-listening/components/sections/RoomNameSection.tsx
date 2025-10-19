import { Box, TextField, Typography } from '@mui/material'
import { useRoomDraftStore } from '../../store/useRoomDraftStore'

const RoomNameSection = () => {
  const roomName = useRoomDraftStore((state) => state.roomName)
  const setField = useRoomDraftStore((state) => state.setField)

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight="bold" color="white" mb={1}>
        Room Name
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Enter room name"
        value={roomName}
        onChange={(e) => setField('roomName', e.target.value)}
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
          '& .MuiOutlinedInput-input::placeholder': {
            color: 'rgba(255, 255, 255, 0.5)',
          },
        }}
      />
    </Box>
  )
}

export default RoomNameSection

