import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Button,
  Card,
  Typography,
  CircularProgress,
  Alert,
  LinearProgress,
  IconButton,
} from '@mui/material'
import { ArrowBack, CheckCircle, Cancel } from '@mui/icons-material'
import { useGamePlayStore } from '../store/useGamePlayStore'
import { PlayMode } from '../types/game-sessions/gameSession.models'
import { FocusModePayload, ClozeModePayload, TextModePayload } from '../types/game-sessions/gamePlay.models'
import { SubmitAttemptPayloadAPI } from '../types/game-sessions/gamePlay.api'
import AudioPlayer from '../components/game-play/AudioPlayer'
import FocusMode from '../components/game-play/FocusMode'
import ClozeMode from '../components/game-play/ClozeMode'
import TextAreaMode from '../components/game-play/TextAreaMode'
import { useGameSessionStore } from '../store/useGameSessionStore'
import backgroundImage from '../assets/background_2.png'

const GamePlay = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const gamePlayStore = useGamePlayStore()
  const { selectedGameSession } = useGameSessionStore()

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [filledBlanks, setFilledBlanks] = useState<string[]>([])
  const [textResponse, setTextResponse] = useState<string>('')

  const [attemptFeedback, setAttemptFeedback] = useState<{
    isCorrect: boolean
    feedbackShort: string
    canAdvance: boolean
  } | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

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
    setSelectedIndex(null)
    setFilledBlanks([])
    setTextResponse('')
  }, [gamePlayStore.currentRound?.roundId])

  const handleSubmitAttempt = useCallback(async () => {
    if (!sessionId || !gamePlayStore.currentRound) return

    const playMode = gamePlayStore.currentRound.playMode
    const modePayload = gamePlayStore.currentRound.modePayload

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let answerPayload: any = {}

    switch (playMode) {
      case PlayMode.FOCUS: {
        if (selectedIndex === null) {
          alert('Please select an answer')
          return
        }
        answerPayload = { selected_index: selectedIndex }
        break
      }

      case PlayMode.CLOZE: {
        const modeData = modePayload as ClozeModePayload
        const blankCount = modeData.blanks?.length || 0
        if (filledBlanks.length < blankCount || filledBlanks.some(b => !b.trim())) {
          alert('Please fill in all the blanks')
          return
        }
        answerPayload = { blanks: filledBlanks }
        break
      }

      case PlayMode.PARAPHRASE:
        if (!textResponse.trim()) {
          alert('Please provide a paraphrase')
          return
        }
        answerPayload = { paraphrase: textResponse }
        break

      case PlayMode.SUMMARIZE:
        if (!textResponse.trim()) {
          alert('Please provide a summary')
          return
        }
        answerPayload = { summary: textResponse }
        break

      case PlayMode.CLARIFY:
        if (!textResponse.trim()) {
          alert('Please ask a clarifying question')
          return
        }
        answerPayload = { questions: [textResponse] }
        break

      default:
        break
    }

    const idempotencyKey = `${sessionId}-${gamePlayStore.currentRound?.roundId}-${Date.now()}`

    const payload: SubmitAttemptPayloadAPI = {
      answer_payload: answerPayload,
      client_elapsed_ms: gamePlayStore.elapsedTime,
      idempotency_key: idempotencyKey,
    }

    const feedback = await gamePlayStore.submitAttempt(sessionId, payload)
    setAttemptFeedback(feedback)
    setShowFeedback(true)
  }, [
    sessionId,
    gamePlayStore,
    selectedIndex,
    filledBlanks,
    textResponse,
  ])

  const handleAdvanceRound = useCallback(async () => {
    if (!sessionId) return

    try {
      await gamePlayStore.advanceRound(sessionId)
    } catch (error) {
      console.error('Error advancing round:', error)
    }
  }, [sessionId, gamePlayStore])

  const handleGoBack = () => {
    navigate(`/active-listening/game-sessions`)
  }

  if (gamePlayStore.isLoading && !gamePlayStore.currentRound) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (!gamePlayStore.currentRound) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load game round. Please try again.
        </Alert>
        <Button onClick={handleGoBack} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    )
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
        {/* Header Title */}
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

        {/* Progress Bar */}
        <Card
          sx={{
            p: 3,
            mb: 4,
            borderRadius: '12px',
            background: 'linear-gradient(180deg, #4A8A6F 0%, #3A6F58 100%)',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                fontSize: '1rem',
              }}
            >
              Progress
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#FFCC80',
                fontWeight: '600',
                fontSize: '0.95rem',
              }}
            >
              Round {currentRound.currentRound} / {selectedGameSession?.totalRounds}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(currentRound.currentRound / (selectedGameSession?.totalRounds || 1)) * 100}
            sx={{
              height: '10px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'linear-gradient(90deg, #FFA726, #26C6DA)',
                borderRadius: '6px',
              },
            }}
          />
        </Card>

        {/* Main Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Audio Player */}
          <AudioPlayer
            audioUrl={currentRound.audioUrl}
            maxReplays={currentRound.config.maxReplaysPerRound}
            replayCount={gamePlayStore.replayCount}
            onReplay={() => gamePlayStore.incrementReplayCount()}
          />

          {/* Mode-specific Content */}
          <Card
            sx={{
              p: 4,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.97)',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(74, 138, 111, 0.15)',
            }}
          >
            {currentRound.playMode === PlayMode.FOCUS && (
              <FocusMode
                modePayload={currentRound.modePayload as FocusModePayload}
                selectedIndex={selectedIndex}
                onAnswerChange={setSelectedIndex}
              />
            )}

            {currentRound.playMode === PlayMode.CLOZE && (
              <ClozeMode
                modePayload={currentRound.modePayload as ClozeModePayload}
                filledBlanks={filledBlanks}
                onBlankChange={(index, value) => {
                  const newBlanks = [...filledBlanks]
                  newBlanks[index] = value
                  setFilledBlanks(newBlanks)
                }}
              />
            )}

            {(currentRound.playMode === PlayMode.PARAPHRASE ||
              currentRound.playMode === PlayMode.SUMMARIZE ||
              currentRound.playMode === PlayMode.CLARIFY) && (
              <TextAreaMode
                playMode={currentRound.playMode}
                modePayload={currentRound.modePayload as TextModePayload}
                textResponse={textResponse}
                onTextChange={setTextResponse}
              />
            )}
          </Card>

          {/* Feedback Section */}
          {showFeedback && attemptFeedback && (
            <Card
              sx={{
                p: 3,
                borderRadius: '12px',
                backgroundColor: attemptFeedback.isCorrect ? '#E8F5E9' : '#FFEBEE',
                borderLeft: `5px solid ${attemptFeedback.isCorrect ? '#4CAF50' : '#F44336'}`,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {attemptFeedback.isCorrect ? (
                  <CheckCircle sx={{ color: '#4CAF50', mt: 0.5 }} />
                ) : (
                  <Cancel sx={{ color: '#F44336', mt: 0.5 }} />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: attemptFeedback.isCorrect ? '#2E7D32' : '#C62828',
                    }}
                  >
                    {attemptFeedback.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: '#333' }}>
                    {attemptFeedback.feedbackShort}
                  </Typography>
                </Box>
              </Box>
            </Card>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', pt: 2, pb: 2 }}>
            {!showFeedback ? (
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmitAttempt}
                disabled={gamePlayStore.isSubmitting}
                sx={{
                  background: 'linear-gradient(135deg, #FFA726 0%, #26C6DA 100%)',
                  color: 'white',
                  px: 6,
                  py: 1.8,
                  fontWeight: 'bold',
                  fontSize: '1.05rem',
                  borderRadius: '10px',
                  boxShadow: '0px 4px 15px rgba(255, 167, 38, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0px 6px 20px rgba(255, 167, 38, 0.6)',
                  },
                  '&:disabled': {
                    backgroundColor: '#BDBDBD',
                    boxShadow: 'none',
                  },
                }}
              >
                {gamePlayStore.isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit Answer'}
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    setAttemptFeedback(null)
                    setShowFeedback(false)
                    setSelectedIndex(null)
                    setFilledBlanks([])
                    setTextResponse('')
                  }}
                  sx={{
                    backgroundColor: '#4A8A6F',
                    color: 'white',
                    px: 4,
                    py: 1.8,
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 15px rgba(74, 138, 111, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#3A6F58',
                      transform: 'translateY(-2px)',
                      boxShadow: '0px 6px 20px rgba(74, 138, 111, 0.4)',
                    },
                  }}
                >
                  Try Again
                </Button>

                {attemptFeedback?.canAdvance && (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleAdvanceRound}
                    disabled={gamePlayStore.isLoading}
                    sx={{
                      background: 'linear-gradient(135deg, #FFA726 0%, #26C6DA 100%)',
                      color: 'white',
                      px: 4,
                      py: 1.8,
                      fontWeight: 'bold',
                      borderRadius: '10px',
                      boxShadow: '0px 4px 15px rgba(255, 167, 38, 0.4)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0px 6px 20px rgba(255, 167, 38, 0.6)',
                      },
                    }}
                  >
                    {gamePlayStore.isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Next Round →'}
                  </Button>
                )}
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default GamePlay

