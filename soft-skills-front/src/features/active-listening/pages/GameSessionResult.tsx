import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Alert, Button, IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useGamePlayStore } from '../store/useGamePlayStore'
import ResultHeader from '../components/game-result/ResultHeader'
import ScoreSummary from '../components/game-result/ScoreSummary'
import RoundsTimeline from '../components/game-result/RoundsTimeline'
import ResultHeaderSkeleton from '../components/game-result/skeletons/ResultHeaderSkeleton'
import ScoreSummarySkeleton from '../components/game-result/skeletons/ScoreSummarySkeleton'
import RoundsTimelineSkeleton from '../components/game-result/skeletons/RoundsTimelineSkeleton'

const GameSessionResult = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { result, isLoading, error, fetchSessionResult } = useGamePlayStore()

  useEffect(() => {
    if (sessionId) {
      fetchSessionResult(sessionId)
    }
  }, [sessionId, fetchSessionResult])

  const handleRetry = () => {
    if (sessionId) {
      fetchSessionResult(sessionId)
    }
  }

  const shouldShowError = (): boolean => {
    return !!error && !isLoading
  }

  const shouldShowResult = (): boolean => {
    return !isLoading && !error && !!result
  }

  const handleGoBack = () => {
    navigate('/active-listening/game-sessions')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#FFF8DB',
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
        {result && (
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 4,
              color: '#48ADA3',
            }}
          >
            {result.name}
          </Typography>
        )}

        {isLoading && (
          <>
            <ResultHeaderSkeleton />
            <ScoreSummarySkeleton />
            <RoundsTimelineSkeleton />
          </>
        )}

        {shouldShowError() && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                Retry
              </Button>
            }
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {shouldShowResult() && result && (
          <>
            <ResultHeader
              startedAt={result.startedAt}
              finishedAt={result.finishedAt}
            />
            <ScoreSummary
              finalScore={result.finalScore}
              finalMaxScore={result.finalMaxScore}
              totalRounds={result.totalRounds}
              rounds={result.rounds}
            />
            
            <RoundsTimeline rounds={result.rounds} />
          </>
        )}
      </Container>
    </Box>
  )
}

export default GameSessionResult

