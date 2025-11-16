import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { RoundRecap } from '../../types/gameSessionResult'
import RoundCard from './RoundCard'

interface RoundsTimelineProps {
  rounds?: RoundRecap[]
}

const RoundsTimeline = ({ rounds }: RoundsTimelineProps) => {
  const { t } = useTranslation('game')
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
          {t('result.noRounds')}
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

