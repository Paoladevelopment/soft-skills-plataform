import { Box, Button, Card, Chip, IconButton, Typography } from '@mui/material'
import { Settings, Share, Group, Delete } from '@mui/icons-material'
import { RoomListItem, RoomStatus } from '../types/room/room.models'
import { getStatusColor, getStatusLabel } from '../utils/roomUtils'

interface RoomCardProps {
  room: RoomListItem
  onJoin?: (roomId: string) => void
  onSettings?: (roomId: string) => void
  onShare?: (roomId: string) => void
  onDelete?: (roomId: string) => void
}

const RoomCard = ({ room, onJoin, onSettings, onShare, onDelete }: RoomCardProps) => {
  const isJoinDisabled = room.status === RoomStatus.FINISHED || room.status === RoomStatus.ARCHIVED

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
          gap: 2, 
          flex: 1 
        }}
      >
        <Box 
          sx={{ 
            flex: 1 
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              mb: 1 
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="white">
              {room.name}
            </Typography>
            <Chip
              label={getStatusLabel(room.status)}
              color={getStatusColor(room.status)}
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
              gap: 0.5 
            }}
          >
            <Group 
              sx={{ 
                fontSize: 20, 
                color: 'white' 
              }} 
            />
            <Typography variant="body2" color="white">
              {room.playersCount}/{room.maxPlayers}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={() => onSettings?.(room.id)}
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

        <IconButton
          onClick={() => onShare?.(room.id)}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <Share />
        </IconButton>

        <IconButton
          onClick={() => onDelete?.(room.id)}
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

        <Button
          variant="contained"
          onClick={() => onJoin?.(room.id)}
          disabled={isJoinDisabled}
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
            '&:disabled': {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
        >
          Join
        </Button>
      </Box>
    </Card>
  )
}

export default RoomCard

