import { Box, Typography, Card, IconButton } from '@mui/material'
import { PlayArrow, Pause } from '@mui/icons-material'
import { useRef, useState, useEffect } from 'react'

interface AudioPlayerResultProps {
  audioUrl: string
}

const AudioPlayerResult = ({ audioUrl }: AudioPlayerResultProps) => {
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
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getProgressValue = (): number => {
    return duration > 0 ? (currentTime / duration) * 100 : 0
  }

  return (
    <Card
      sx={{
        p: 3,
        backgroundColor: '#FFC266',
        borderRadius: 0,
        boxShadow: 'none',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          fontWeight: 'bold',
          mb: 2,
        }}
      >
        🎵 Audio Content
      </Typography>
      <Box 
        sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2 
        }}
      >
        <IconButton
          onClick={togglePlayPause}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mb: 0.5 
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)' 
              }}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              height: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: `${getProgressValue()}%`,
                height: '100%',
                backgroundColor: '#FFFFFF',
                transition: 'width 0.1s linear',
              }}
            />
          </Box>
        </Box>
      </Box>
      <audio ref={audioRef} src={audioUrl} />
    </Card>
  )
}

export default AudioPlayerResult

