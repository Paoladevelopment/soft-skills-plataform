import {
  Box,
  Container,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  CircularProgress,
} from '@mui/material'
import { ExpandMore, ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import RoomCard from '../components/RoomCard'
import RoomForm from '../components/RoomForm'
import backgroundImage from '../assets/background_2.png'
import { useRoomStore } from '../store/useRoomStore'
import { useRoomDraftStore } from '../store/useRoomDraftStore'
import { CreateRoomRequest } from '../types/room/room.api'
import { AllowedType, RoomListItem } from '../types/room/room.models'
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal'

const Rooms = () => {
  const navigate = useNavigate()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<RoomListItem | null>(null)

  const rooms = useRoomStore((state) => state.rooms)
  const isLoading = useRoomStore((state) => state.isLoading)
  const fetchRooms = useRoomStore((state) => state.fetchRooms)
  const createRoom = useRoomStore((state) => state.createRoom)
  const deleteRoom = useRoomStore((state) => state.deleteRoom)

  const getSnapshot = useRoomDraftStore((state) => state.getSnapshot)
  const resetRoomDraft = useRoomDraftStore((state) => state.reset)

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const handleGoBack = () => {
    navigate('/active-listening')
  }

  const handleCreateRoom = async () => {
    const draft = getSnapshot()

    const roomData: CreateRoomRequest = {
      name: draft.roomName,
      config: {
        rounds_total: draft.totalRounds,
        round_time_limit_sec: draft.roundTimeLimit,
        listener_max_playbacks: draft.maxPlaybacks,
        allowed_types: draft.allowedTypes as AllowedType[],
        difficulty: draft.difficulty,
        audio_effects: {
          reverb: draft.reverb > 0 ? draft.reverb : null,
          echo: draft.echo > 0 ? draft.echo : null,
          noise: draft.noise > 0 ? draft.noise : null,
          speed_var: draft.speedVar > 0 ? draft.speedVar : null,
        },
        team_assignment_mode: draft.teamAssignmentMode,
        team_size: draft.teamSize,
      },
    }

    await createRoom(roomData)  
    resetRoomDraft()
  }

  const handleJoinRoom = (roomId: string) => {
    console.log('Join room:', roomId)
  }

  const handleSettingsRoom = (roomId: string) => {
    console.log('Settings room:', roomId)
  }

  const handleShareRoom = (roomId: string) => {
    console.log('Share room:', roomId)
  }

  const handleOpenDeleteModal = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId)
    if (room) {
      setRoomToDelete(room)
      setDeleteModalOpen(true)
    }
  }

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
    setRoomToDelete(null)
  }

  const handleConfirmDelete = async () => {
    setDeleteModalOpen(false)

    if (!roomToDelete) return
    await deleteRoom(roomToDelete.id)

    setRoomToDelete(null)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        py: 4,
      }}
    >
      <IconButton
        onClick={handleGoBack}
        sx={{
          position: 'absolute',
          top: 30,
          left: 30,
          backgroundColor: '#FDB02D',
          color: 'white',
          '&:hover': {
            backgroundColor: '#FEC04A',
          },
        }}
      >
        <ArrowBack sx={{ fontSize: 32 }} />
      </IconButton>

      <Container maxWidth="lg">

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box>
            <Typography
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(90deg, #FFA726, #26C6DA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke: '1.5px white',
                letterSpacing: '0.05em',
                textShadow: '0px 2px 6px rgba(0,0,0,0.2)',
                fontSize: { xs: '2rem', sm: '3rem', md: '5rem' },
                lineHeight: 1,
                mb: '-0.2em',
              }}
            >
              Your Game
            </Typography>
            <Typography
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(90deg, #F9A825, #FFCC80, #4FC3F7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke: '1.5px white',
                letterSpacing: '0.05em',
                textShadow: '0px 2px 6px rgba(0,0,0,0.2)',
                fontSize: { xs: '2rem', sm: '3rem', md: '5rem' },
                lineHeight: 1,
              }}
            >
              Rooms
            </Typography>
          </Box>
        </Box>

        <Accordion
          sx={{
            background: 'linear-gradient(180deg, #4A8A6F 0%, #3A6F58 100%)',
            borderRadius: '12px',
            boxShadow: '0px 4px 0px #2F5A47',
            color: 'white',
            mb: 3,
            '&:before': {
              display: 'none',
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore sx={{ color: 'white' }} />}
            sx={{
              '& .MuiAccordionSummary-content': {
                display: 'flex',
                flexDirection: 'column',
              },
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Create New Room
            </Typography>
            <Typography variant="body2" color="white">
              Configure and create your own game room
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RoomForm mode="create" onSubmit={handleCreateRoom} />
          </AccordionDetails>
        </Accordion>

        {isLoading && rooms.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        )}

        <Stack spacing={2}>
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onJoin={handleJoinRoom}
              onSettings={handleSettingsRoom}
              onShare={handleShareRoom}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </Stack>
      </Container>

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Room"
        message={`Are you sure you want to delete "${roomToDelete?.name}"? This action cannot be undone.`}
      />
    </Box>
  )
}

export default Rooms

