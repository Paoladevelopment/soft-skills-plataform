import { Box, TextField, Typography, IconButton, InputAdornment } from '@mui/material'
import { Edit, Check, Close } from '@mui/icons-material'
import { useRoomDraftStore } from '../../store/useRoomDraftStore'
import { useRoomStore } from '../../store/useRoomStore'
import { useState } from 'react'
import { ROOM_MODE, RoomMode } from '../../constants/roomMode'

interface RoomNameSectionProps {
  mode?: RoomMode
  roomId?: string
}

interface EditButtonProps {
  onClick: () => void
}

const EditButton = ({ onClick }: EditButtonProps) => (
  <InputAdornment position="end">
    <IconButton
      onClick={onClick}
      size="small"
      aria-label="Edit room name"
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
}

const ActionButtons = ({ onConfirm, onCancel }: ActionButtonsProps) => (
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
        aria-label="Confirm room name change"
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
        aria-label="Cancel room name change"
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

const RoomNameSection = ({ mode = ROOM_MODE.CREATE, roomId }: RoomNameSectionProps) => {
  const roomName = useRoomDraftStore((state) => state.roomName)
  const setField = useRoomDraftStore((state) => state.setField)
  const updateRoom = useRoomStore((state) => state.updateRoom)
  const [isLocked, setIsLocked] = useState(mode === ROOM_MODE.UPDATE)
  const [originalName, setOriginalName] = useState(roomName)

  const handleEditClick = () => {
    setOriginalName(roomName)
    setIsLocked(false)
  }

  const handleConfirm = async () => {
    if (mode === ROOM_MODE.UPDATE && roomId && roomName !== originalName) {
      await updateRoom(roomId, { name: roomName })
    }
    
    setIsLocked(true)
    setOriginalName(roomName)
  }

  const handleCancel = () => {
    setField('roomName', originalName)
    setIsLocked(true)
  }

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
        disabled={isLocked}
        slotProps={{
          input: {
            endAdornment: mode === ROOM_MODE.UPDATE ? (
              isLocked ? (
                <EditButton onClick={handleEditClick} />
              ) : (
                <ActionButtons onConfirm={handleConfirm} onCancel={handleCancel} />
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

export default RoomNameSection

