import { useEffect, useCallback, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  IconButton,
  Alert,
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useGamePlayStore } from '../store/useGamePlayStore'
import { useGamePlayAnswerStore } from '../store/useGamePlayAnswerStore'
import { PlayMode } from '../types/game-sessions/gameSession.models'
import { ClozeModePayload } from '../types/game-sessions/gamePlay.models'
import { SubmitAttemptPayloadAPI } from '../types/game-sessions/gamePlay.api'
import AudioPlayer from '../components/game-play/AudioPlayer'
import GamePlaySkeleton from '../components/game-play/GamePlaySkeleton'
import GamePlayError from '../components/game-play/GamePlayError'
import ProgressCard from '../components/game-play/ProgressCard'
import GameModeContent from '../components/game-play/GameModeContent'
import FeedbackCard from '../components/game-play/FeedbackCard'
import GamePlayActions from '../components/game-play/GamePlayActions'
import { useGameSessionStore } from '../store/useGameSessionStore'
import backgroundImage from '../assets/background_2.png'
import { validateGamePlayAnswer } from '../utils/validateGamePlayAnswer'
import { buildAnswerPayload } from '../utils/buildAnswerPayload'

const GamePlay = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const gamePlayStore = useGamePlayStore()
  const { selectedGameSession } = useGameSessionStore()
  const answerStore = useGamePlayAnswerStore()

  const [attemptFeedback, setAttemptFeedback] = useState<{
    isCorrect: boolean
    feedbackShort: string
    canAdvance: boolean
  } | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) return

    gamePlayStore.fetchCurrentRound(sessionId)

    return () => {
      gamePlayStore.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  useEffect(() => {
    setAttemptFeedback(null)
    setShowFeedback(false)
    answerStore.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePlayStore.currentRound?.roundId])

  const handleSubmitAttempt = useCallback(async () => {
    if (!sessionId || !gamePlayStore.currentRound) return

    const playMode = gamePlayStore.currentRound.playMode
    const modePayload = gamePlayStore.currentRound.modePayload
    const answers = answerStore.getSnapshot()

    const blankCount = playMode === PlayMode.CLOZE 
      ? (modePayload as ClozeModePayload).blanks?.length || 0 
      : 0

    const validation = validateGamePlayAnswer({
      playMode,
      selectedIndex: answers.selectedIndex,
      filledBlanks: answers.filledBlanks,
      textResponse: answers.textResponse,
      blankCount,
      clarifyQuestions: answers.clarifyQuestions,
    })

    if (!validation.isValid) {
      setValidationError(validation.error || 'Validation failed')
      return
    }

    setValidationError(null)

    const answerPayload = buildAnswerPayload({
      playMode,
      selectedIndex: answers.selectedIndex,
      filledBlanks: answers.filledBlanks,
      textResponse: answers.textResponse,
      clarifyQuestions: answers.clarifyQuestions,
    })

    const idempotencyKey = `${sessionId}-${gamePlayStore.currentRound?.roundId}-${Date.now()}`

    const payload: SubmitAttemptPayloadAPI = {
      answer_payload: answerPayload,
      client_elapsed_ms: gamePlayStore.elapsedTime,
      idempotency_key: idempotencyKey,
    }

    const feedback = await gamePlayStore.submitAttempt(sessionId, payload)
    setAttemptFeedback(feedback)
    setShowFeedback(true)
  }, [sessionId, gamePlayStore, answerStore])

  const handleAdvanceRound = useCallback(async () => {
    if (!sessionId) return

    try {
      await gamePlayStore.advanceRound(sessionId)
    } catch (error) {
      console.error('Error advancing round:', error)
    }
  }, [sessionId, gamePlayStore])

  const handleTryAgain = () => {
    setAttemptFeedback(null)
    setShowFeedback(false)
    answerStore.reset()
  }

  const handleGoBack = () => {
    navigate(`/active-listening/game-sessions`)
  }

  if (gamePlayStore.isLoading && !gamePlayStore.currentRound) {
    return <GamePlaySkeleton />
  }

  if (gamePlayStore.error) {
    return <GamePlayError onGoBack={handleGoBack} />
  }

  if (!gamePlayStore.currentRound) {
    return <GamePlaySkeleton />
  }

  const currentRound = gamePlayStore.currentRound

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
        <Box sx={{ textAlign: 'center', mb: 4, mt: 6 }}>
          <Typography
            fontWeight="bold"
            sx={{
                background: 'linear-gradient(90deg, #4A8A6F, #26C6DA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke: '1.5px white',
                letterSpacing: '0.05em',
                textShadow: '0px 2px 6px rgba(0,0,0,0.2)',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
                lineHeight: 1,
            }}
          >
            {selectedGameSession?.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
                color: '#4A8A6F',
                fontWeight: '600',
                mt: 1,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            }}
          >
            Round {currentRound.currentRound} / {selectedGameSession?.totalRounds}
          </Typography>
        </Box>

        <ProgressCard
          currentRound={currentRound.currentRound}
          totalRounds={selectedGameSession?.totalRounds}
        />

        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 3 
            }}
        >
          <AudioPlayer
            audioUrl={currentRound.audioUrl}
            maxReplays={currentRound.config.maxReplaysPerRound}
            replayCount={gamePlayStore.replayCount}
            onReplay={() => gamePlayStore.incrementReplayCount()}
          />

          {validationError && (
            <Alert severity="error" onClose={() => setValidationError(null)}>
              {validationError}
            </Alert>
          )}

          <GameModeContent
            playMode={currentRound.playMode}
            modePayload={currentRound.modePayload}
          />

          {showFeedback && attemptFeedback && (
            <FeedbackCard
              isCorrect={attemptFeedback.isCorrect}
              feedbackShort={attemptFeedback.feedbackShort}
            />
          )}


          <GamePlayActions
            showFeedback={showFeedback}
            hasError={showFeedback && !attemptFeedback}
            canAdvance={attemptFeedback?.canAdvance ?? false}
            onSubmit={handleSubmitAttempt}
            onTryAgain={handleTryAgain}
            onAdvance={handleAdvanceRound}
          />
        </Box>
      </Container>
    </Box>
  )
}

export default GamePlay

