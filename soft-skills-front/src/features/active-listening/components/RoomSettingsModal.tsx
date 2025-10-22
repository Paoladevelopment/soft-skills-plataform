import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { useState } from 'react'
import RoomForm from './RoomForm'
import { ROOM_MODE } from '../constants/roomMode'
import { useRoomStore } from '../store/useRoomStore'
import { AllowedType, RoomDifficulty, TeamAssignmentMode } from '../types/room/room.models'

interface RoomSettingsModalProps {
  open: boolean
  onClose: () => void
  roomId: string
  roomName: string
  isLoading?: boolean
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`room-settings-tabpanel-${index}`}
  >
    {value === index && <Box>{children}</Box>}
  </div>
)

const RoomSettingsModal = ({ open, onClose, roomId, roomName, isLoading = false }: RoomSettingsModalProps) => {
  const [tabValue, setTabValue] = useState(0)
  const updateRoomConfig = useRoomStore((state) => state.updateRoomConfig)
  const selectedRoom = useRoomStore((state) => state.selectedRoom)
  
  const displayRoomName = selectedRoom?.name || roomName
  const invitationsCount = 2

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleUpdateRoom = async (data: {
    roomName: string
    totalRounds: number
    roundTimeLimit: number
    maxPlaybacks: number
    allowedTypes: AllowedType[]
    difficulty: RoomDifficulty
    reverb: number
    echo: number
    noise: number
    speedVar: number
    teamAssignmentMode: TeamAssignmentMode
    teamSize: number
  }) => {
    await updateRoomConfig(roomId, {
      config: {
        rounds_total: data.totalRounds,
        round_time_limit_sec: data.roundTimeLimit,
        listener_max_playbacks: data.maxPlaybacks,
        allowed_types: data.allowedTypes,
        difficulty: data.difficulty,
        audio_effects: {
          reverb: data.reverb > 0 ? data.reverb : null,
          echo: data.echo > 0 ? data.echo : null,
          noise: data.noise > 0 ? data.noise : null,
          speed_var: data.speedVar > 0 ? data.speedVar : null,
        },
        team_assignment_mode: data.teamAssignmentMode,
        team_size: data.teamSize,
      },
    })
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            background: 'linear-gradient(180deg, #4A8A6F 0%, #3A6F58 100%)',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0px 4px 0px #2F5A47',
            maxHeight: '90vh',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Room Settings - {displayRoomName}
          </Typography>
          <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
            Manage room configuration and invitations
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          px: 3,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          slotProps={{
            indicator: {
              sx: {
                backgroundColor: '#FFB74D',
                height: 3,
              },
            },
          }}
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.6)',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              minHeight: 48,
              padding: '0.75rem 1.5rem',
              minWidth: 'auto',
              '&.Mui-selected': {
                color: 'white',
              },
            },
            '& .MuiTabs-flexContainer': {
              gap: 3,
            },
          }}
        >
          <Tab label="Configuration" />
          <Tab
            label={
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <span>Invitations</span>
                <Box
                  component="span"
                  sx={{
                    backgroundColor: '#FFB74D',
                    color: 'white',
                    borderRadius: '10px',
                    minWidth: '20px',
                    height: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    padding: '0 0.375rem',
                  }}
                >
                  {invitationsCount}
                </Box>
              </Box>
            }
          />
        </Tabs>
      </Box>

      <DialogContent 
        sx={{ 
          pt: 3 
        }}
      >
        <TabPanel value={tabValue} index={0}>
          {isLoading ? (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                py: 8 
              }}
            >
              <CircularProgress sx={{ color: 'white' }} size={48} />
            </Box>
          ) : (
            <RoomForm mode={ROOM_MODE.UPDATE} roomId={roomId} onSubmit={handleUpdateRoom} />
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="rgba(255, 255, 255, 0.6)">
              Invitations feature coming soon...
            </Typography>
          </Box>
        </TabPanel>
      </DialogContent>
    </Dialog>
  )
}

export default RoomSettingsModal
