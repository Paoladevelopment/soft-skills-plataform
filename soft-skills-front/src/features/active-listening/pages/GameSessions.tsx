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
import GameSessionCard from '../components/GameSessionCard'
import GameSessionForm from '../components/GameSessionForm'
import GameSessionSettingsModal from '../components/GameSessionSettingsModal'
import { GAME_SESSION_MODE } from '../constants/gameSessionMode'
import backgroundImage from '../assets/background_2.png'
import { useGameSessionStore } from '../store/useGameSessionStore'
import { useGameSessionDraftStore } from '../store/useGameSessionDraftStore'
import { CreateGameSessionRequest } from '../types/game-sessions/gameSession.api'
import { PromptType, GameSessionListItem } from '../types/game-sessions/gameSession.models'
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal'
import { convertAudioEffectsToSnakeCase } from '../utils/audioEffectsUtils'

const GameSessions = () => {
  const navigate = useNavigate()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<GameSessionListItem | null>(null)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<GameSessionListItem | null>(null)
  const [isLoadingSessionData, setIsLoadingSessionData] = useState(false)

  const gameSessions = useGameSessionStore((state) => state.gameSessions)
  const isLoading = useGameSessionStore((state) => state.isLoading)
  const fetchGameSessions = useGameSessionStore((state) => state.fetchGameSessions)
  const createGameSession = useGameSessionStore((state) => state.createGameSession)
  const deleteGameSession = useGameSessionStore((state) => state.deleteGameSession)

  const getSnapshot = useGameSessionDraftStore((state) => state.getSnapshot)
  const resetSessionDraft = useGameSessionDraftStore((state) => state.reset)
  const loadGameSession = useGameSessionDraftStore((state) => state.loadGameSession)
  const getGameSessionById = useGameSessionStore((state) => state.getGameSessionById)

  useEffect(() => {
    fetchGameSessions()
  }, [fetchGameSessions])

  const handleGoBack = () => {
    navigate('/active-listening')
  }

  const handleCreateSession = async () => {
    const draft = getSnapshot()

    const sessionData: CreateGameSessionRequest = {
      name: draft.sessionName,
      config: {
        total_rounds: draft.totalRounds,
        max_replays_per_round: draft.maxReplaysPerRound,
        difficulty: draft.difficulty,
        response_time_limits: draft.responseTimeLimits,
        selected_modes: draft.selectedModes,
        allowed_types: draft.allowedTypes as PromptType[],
        audio_effects: convertAudioEffectsToSnakeCase(draft.audioEffects),
      },
    }

    await createGameSession(sessionData)  
    resetSessionDraft()
  }

  const handlePlaySession = (sessionId: string) => {
    navigate(`/active-listening/session/${sessionId}/play`)
  }

  const handleSettingsSession = async (sessionId: string) => {
    const session = gameSessions.find((s) => s.gameSessionId === sessionId)
    if (!session) return

    setSelectedSession(session)
    setSettingsModalOpen(true)
    setIsLoadingSessionData(true)
    
    try {
      await getGameSessionById(sessionId)
      
      const fullSession = useGameSessionStore.getState().selectedGameSession
      
        if (fullSession) {
          loadGameSession({
            sessionName: fullSession.name,
            totalRounds: fullSession.config.totalRounds,
            maxReplaysPerRound: fullSession.config.maxReplaysPerRound,
            difficulty: fullSession.config.difficulty,
            responseTimeLimits: fullSession.config.responseTimeLimits,
            selectedModes: fullSession.config.selectedModes,
            allowedTypes: fullSession.config.allowedTypes,
            audioEffects: fullSession.config.audioEffects,
          })
        }
    } finally {
      setIsLoadingSessionData(false)
    }
  }

  const handleOpenDeleteModal = (sessionId: string) => {
    const session = gameSessions.find((s) => s.gameSessionId === sessionId)
    if (session) {
      setSessionToDelete(session)
      setDeleteModalOpen(true)
    }
  }

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
    setSessionToDelete(null)
  }

  const handleConfirmDelete = async () => {
    setDeleteModalOpen(false)

    if (!sessionToDelete) return
    await deleteGameSession(sessionToDelete.gameSessionId)

    setSessionToDelete(null)
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
              Sessions
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
              Create New Session
            </Typography>
            <Typography variant="body2" color="white">
              Configure and create your own game session
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <GameSessionForm mode={GAME_SESSION_MODE.CREATE} onSubmit={handleCreateSession} />
          </AccordionDetails>
        </Accordion>

        {isLoading && gameSessions.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        )}

        <Stack spacing={2}>
          {gameSessions.map((session) => (
            <GameSessionCard
              key={session.gameSessionId}
              session={session}
              onPlay={handlePlaySession}
              onSettings={handleSettingsSession}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </Stack>
      </Container>

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Session"
        message={`Are you sure you want to delete "${sessionToDelete?.name}"? This action cannot be undone.`}
      />

      {selectedSession && (
        <GameSessionSettingsModal
          open={settingsModalOpen}
          onClose={() => {
            setSettingsModalOpen(false)
            setIsLoadingSessionData(false)
          }}
          sessionId={selectedSession.gameSessionId}
          sessionName={selectedSession.name}
          isLoading={isLoadingSessionData}
        />
      )}
    </Box>
  )
}

export default GameSessions

