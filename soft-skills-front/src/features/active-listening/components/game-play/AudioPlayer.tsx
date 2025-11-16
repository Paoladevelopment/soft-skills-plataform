import { Box, Card, IconButton, Typography, LinearProgress, Paper, Tooltip, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { PlayArrow, Pause, RotateRight } from '@mui/icons-material'
import { useRef, useState, useEffect } from 'react'
import { ReplayAudioResult } from '../../types/game-sessions/gamePlay.api'

interface AudioPlayerProps {
  audioUrl: string
  replaysUsed: number
  replaysLeft: number
  maxReplaysPerRound: number
  isReplaying: boolean
  onReplay: (sessionId: string, roundNumber: number) => Promise<ReplayAudioResult>
  sessionId: string
  roundNumber: number
}

const AudioPlayer = ({ 
  audioUrl, 
  replaysUsed, 
  replaysLeft, 
  maxReplaysPerRound, 
  isReplaying,
  onReplay,
  sessionId,
  roundNumber
}: AudioPlayerProps) => {
  const { t } = useTranslation('game')
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const hasAudioEnded = currentTime >= duration && duration > 0

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    if (hasAudioEnded) return

    if (replaysLeft === 0 && currentTime === 0) return

    audioRef.current.play()
    setIsPlaying(true)
  }

  const startAudio = () => {
    if (!audioRef.current) return
    
    audioRef.current.currentTime = 0
    audioRef.current.play()
    setIsPlaying(true)
  }

  const handleReplay = async () => {
    if (replaysLeft === 0 || isReplaying) return

    const result = await onReplay(sessionId, roundNumber)
    
    if (!result.requestAccepted) return

    startAudio()
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getReplayTooltipTitle = (): string => {
    if (replaysLeft === 0) return t('play.noReplaysLeft')
    return t('play.replayAudio')
  }

  const getProgressValue = (): number => {
    return (currentTime / duration) * 100 || 0
  }

  const getIconButtonStyles = (enabled: boolean) => ({
    backgroundColor: enabled ? 'rgba(255, 255, 255, 0.2)' : 'rgba(100, 100, 100, 0.3)',
    color: enabled ? 'white' : 'rgba(150, 150, 150, 0.6)',
    cursor: enabled ? 'pointer' : 'not-allowed',
    opacity: enabled ? 1 : 0.5,
    '&:hover': enabled ? { backgroundColor: 'rgba(255, 255, 255, 0.3)' } : {},
    '&:disabled': {
      backgroundColor: 'rgba(100, 100, 100, 0.3)',
      color: 'rgba(150, 150, 150, 0.6)',
    },
  })

  const canReplay = replaysLeft > 0 && !isReplaying
  const canPlay = isPlaying || (replaysLeft > 0 && !hasAudioEnded) || (replaysLeft === 0 && currentTime > 0 && !hasAudioEnded)

  return (
    <Card
      sx={{
        p: 3,
        background: '#FFA726',
        borderRadius: '12px',
        boxShadow: '0px 8px 24px rgba(255, 167, 38, 0.3)',
      }}
    >
      <audio ref={audioRef} src={audioUrl} />

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2 
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white', 
            fontWeight: 'bold' 
            }}
        >
          🎵 {t('play.audioContent')}
        </Typography>

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}
          >
            <IconButton
              onClick={togglePlayPause}
              disabled={!canPlay}
              aria-disabled={!canPlay}
              sx={getIconButtonStyles(canPlay)}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>

            <Box sx={{ minWidth: '100px' }}>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Typography>
            </Box>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}
          >
            <Tooltip title={getReplayTooltipTitle()}>
              <span>
                <IconButton
                  onClick={handleReplay}
                  disabled={!canReplay}
                  aria-disabled={!canReplay}
                  sx={getIconButtonStyles(canReplay)}
                >
                  {isReplaying ? (
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                  ) : (
                    <RotateRight />
                  )}
                </IconButton>
              </span>
            </Tooltip>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                minWidth: '80px' 
              }}
            >
              {t('play.replays')}: {replaysUsed} / {maxReplaysPerRound}
            </Typography>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={getProgressValue()}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#FFFFFF',
            },
            borderRadius: '4px',
            height: '6px',
          }}
        />

        {replaysLeft === 0 && (
          <Paper
            sx={{
              p: 1.5,
              backgroundColor: 'rgba(255, 193, 7, 0.2)',
              border: '1px solid rgba(255, 193, 7, 0.5)',
              borderRadius: '8px',
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#FFECB3', 
                fontWeight: 'bold' 
              }}
            >
              {t('play.maxReplaysReached')}
            </Typography>
          </Paper>
        )}
      </Box>
    </Card>
  )
}

export default AudioPlayer

