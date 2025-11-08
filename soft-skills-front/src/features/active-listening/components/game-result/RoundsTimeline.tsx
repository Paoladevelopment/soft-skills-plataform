import { Box, Typography } from '@mui/material'
import { RoundRecap } from '../../types/gameSessionResult'
import RoundCard from './RoundCard'

interface RoundsTimelineProps {
  rounds?: RoundRecap[]
}

const RoundsTimeline = ({ rounds }: RoundsTimelineProps) => {
  const safeRounds = rounds || []
  
  if (safeRounds.length === 0) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="body1">
          No rounds available
        </Typography>
      </Box>
    )
  }

  return (
    <>
      {safeRounds.map((round) => (
        <RoundCard key={round.roundId} round={round} />
      ))}
    </>
  )
}

export default RoundsTimeline

