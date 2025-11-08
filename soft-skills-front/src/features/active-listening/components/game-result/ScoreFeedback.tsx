import { Box, Typography, Card } from '@mui/material'
import { CheckCircle, Cancel } from '@mui/icons-material'

interface ScoreFeedbackProps {
  isCorrect: boolean
  score: number
  maxScore: number
}

const ScoreFeedback = ({ isCorrect, score, maxScore }: ScoreFeedbackProps) => {
  return (
    <Card
      sx={{
        p: 3,
        backgroundColor: isCorrect ? '#E8F9EE' : '#FDECEC',
        borderRadius: 0,
        boxShadow: 'none',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, 
          mb: 1
        }}
      >
        {isCorrect ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: '2px solid #21C45D',
              backgroundColor: '#21C45D',
            }}
          >
            <CheckCircle sx={{ color: 'white', fontSize: 22 }} />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: '2px solid #EF4444',
              backgroundColor: '#EF4444',
            }}
          >
            <Cancel sx={{ color: 'white', fontSize: 22 }} />
          </Box>
        )}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            color: '#2C3E50',
            fontSize: '1.125rem',
          }}
        >
          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
        </Typography>
      </Box>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: 1.5 
        }}
      >
        <Box 
          sx={{ 
            width: 24, 
            height: 24, 
            flexShrink: 0 
          }} 
        />
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666',
              fontSize: '0.9375rem',
              fontWeight: 600,
            }}
          >
            Score: {score} / {maxScore}
          </Typography>
      </Box>
    </Card>
  )
}

export default ScoreFeedback

