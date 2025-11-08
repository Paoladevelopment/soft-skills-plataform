import { Box, Typography } from '@mui/material'
import { RoundRecap } from '../../types/gameSessionResult'

interface ScoreSummaryProps {
  finalScore: number
  finalMaxScore: number
  totalRounds: number
  rounds?: RoundRecap[]
}

const ScoreSummary = ({ finalScore, finalMaxScore, totalRounds, rounds }: ScoreSummaryProps) => {
  const safeRounds = rounds || []
  
  const correctCount = safeRounds.filter(
    (round) => round.score !== null && round.maxScore > 0 && round.score === round.maxScore
  ).length

  const incorrectCount = safeRounds.filter(
    (round) => round.score !== null && round.maxScore > 0 && round.score < round.maxScore
  ).length

  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        borderRadius: '12px',
        background: 'white',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography 
        variant="h6" 
        fontWeight="bold" 
        sx={{ 
            mb: 2, 
            color: '#333' 
        }}
      >
        Overall Performance
      </Typography>
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)' 
          }, 
          gap: 2, 
          mb: 3 
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: '8px',
            backgroundColor: '#ECF6F5',
            textAlign: 'center',
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            sx={{ 
              color: '#48ADA3', 
              mb: 0.5 
            }}
          >
            {totalRounds}
          </Typography>
          <Typography variant="body2" color="#666">
            Total Rounds
          </Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            borderRadius: '8px',
            backgroundColor: '#FEF7F9',
            textAlign: 'center',
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            sx={{ 
              color: '#8B0E38', 
              mb: 0.5 
            }}
          >
            {finalScore} / {finalMaxScore}
          </Typography>
          <Typography variant="body2" color="#666">
            Total Score
          </Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            borderRadius: '8px',
            backgroundColor: '#E8F9EE',
            textAlign: 'center',
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            sx={{ 
              color: '#21C45D', 
              mb: 0.5 
            }}
          >
            {correctCount}
          </Typography>
          <Typography variant="body2" color="#666">
            Correct
          </Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            borderRadius: '8px',
            backgroundColor: '#FDECEC',
            textAlign: 'center',
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            sx={{ 
              color: '#EF4444', 
              mb: 0.5 
            }}
          >
            {incorrectCount}
          </Typography>
          <Typography variant="body2" color="#666">
            Incorrect
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default ScoreSummary

