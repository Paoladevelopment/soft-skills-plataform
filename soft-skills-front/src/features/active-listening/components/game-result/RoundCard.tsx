import { Box } from '@mui/material'
import { RoundRecap } from '../../types/gameSessionResult'
import { PlayMode } from '../../types/game-sessions/gameSession.models'
import EvaluationDetails from './EvaluationDetails'
import AudioPlayerResult from './AudioPlayerResult'
import RoundCardHeader from './RoundCardHeader'
import ScoreFeedback from './ScoreFeedback'

interface RoundCardProps {
  round: RoundRecap
}

const RoundCard = ({ round }: RoundCardProps) => {
  const isCorrect = round.evaluation?.isCorrect ?? false
  const playMode = round.playMode as PlayMode | null

  const shouldShowScoreFeedback = (): boolean => {
    return !!round.evaluation && round.score !== null
  }

  return (
    <Box
      sx={{
        mb: 3,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
      }}
    >
      <RoundCardHeader roundNumber={round.roundNumber} />

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
        }}
      >
        {round.audioUrl && <AudioPlayerResult audioUrl={round.audioUrl} />}

        {shouldShowScoreFeedback() && (
          <ScoreFeedback
            isCorrect={isCorrect}
            score={round.score!}
            maxScore={round.maxScore}
          />
        )}

        {round.evaluation && playMode && (
          <EvaluationDetails
            evaluation={round.evaluation}
            modePayload={round.modePayload}
            playMode={playMode}
          />
        )}
      </Box>
    </Box>
  )
}

export default RoundCard
