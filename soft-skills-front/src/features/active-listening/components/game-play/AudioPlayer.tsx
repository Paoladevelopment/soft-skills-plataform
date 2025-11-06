import { Box, Card, IconButton, Typography, LinearProgress, Paper } from '@mui/material'
import { PlayArrow, Pause, RotateRight } from '@mui/icons-material'
import { useRef, useState, useEffect } from 'react'

interface AudioPlayerProps {
  audioUrl: string
  maxReplays: number
  replayCount: number
  onReplay: () => void
}

const AudioPlayer = ({ audioUrl, maxReplays, replayCount, onReplay }: AudioPlayerProps) => {
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

  const togglePlayPause = () => {
    // Only allow play if we haven't reached max replays yet
    if (!canReplay && !isPlaying) return
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleReplay = () => {
    if (replayCount < maxReplays) {
      onReplay()
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const canReplay = replayCount < maxReplays

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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          🎵 Audio Content
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={togglePlayPause}
              disabled={!canReplay && !isPlaying}
              sx={{
                backgroundColor: canReplay || isPlaying ? 'rgba(255, 255, 255, 0.2)' : 'rgba(100, 100, 100, 0.3)',
                color: canReplay || isPlaying ? 'white' : 'rgba(150, 150, 150, 0.6)',
                cursor: canReplay || isPlaying ? 'pointer' : 'not-allowed',
                opacity: canReplay || isPlaying ? 1 : 0.5,
                '&:hover': canReplay || isPlaying ? { backgroundColor: 'rgba(255, 255, 255, 0.3)' } : {},
                '&:disabled': {
                  backgroundColor: 'rgba(100, 100, 100, 0.3)',
                  color: 'rgba(150, 150, 150, 0.6)',
                },
              }}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>

            <Box sx={{ minWidth: '100px' }}>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleReplay}
              disabled={!canReplay}
              sx={{
                backgroundColor: canReplay ? 'rgba(255, 255, 255, 0.2)' : 'rgba(100, 100, 100, 0.3)',
                color: canReplay ? 'white' : 'rgba(150, 150, 150, 0.6)',
                cursor: canReplay ? 'pointer' : 'not-allowed',
                opacity: canReplay ? 1 : 0.5,
                '&:hover': canReplay ? { backgroundColor: 'rgba(255, 255, 255, 0.3)' } : {},
                '&:disabled': {
                  backgroundColor: 'rgba(100, 100, 100, 0.3)',
                  color: 'rgba(150, 150, 150, 0.6)',
                },
              }}
            >
              <RotateRight />
            </IconButton>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', minWidth: '80px' }}>
              Replays: {replayCount} / {maxReplays}
            </Typography>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={(currentTime / duration) * 100 || 0}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#FFFFFF',
            },
            borderRadius: '4px',
            height: '6px',
          }}
        />

        {!canReplay && (
          <Paper
            sx={{
              p: 1.5,
              backgroundColor: 'rgba(255, 193, 7, 0.2)',
              border: '1px solid rgba(255, 193, 7, 0.5)',
              borderRadius: '8px',
            }}
          >
            <Typography variant="caption" sx={{ color: '#FFECB3', fontWeight: 'bold' }}>
              ⚠️ Maximum replays reached. Submit your answer now.
            </Typography>
          </Paper>
        )}
      </Box>
    </Card>
  )
}

export default AudioPlayer

