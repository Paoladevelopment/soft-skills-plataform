import { Box, Card, Typography } from '@mui/material'
import { CheckCircle, Cancel } from '@mui/icons-material'

interface FeedbackCardProps {
  isCorrect: boolean
  feedbackShort: string
}

const FeedbackCard = ({ isCorrect, feedbackShort }: FeedbackCardProps) => {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: '12px',
        backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE',
        borderLeft: `5px solid ${isCorrect ? '#4CAF50' : '#F44336'}`,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: 2 
        }}
      >
        {isCorrect ? (
          <CheckCircle 
            sx={{ 
              color: '#4CAF50', 
              mt: 0.5 
            }} 
          />
        ) : (
          <Cancel 
            sx={{ 
              color: '#F44336', 
              mt: 0.5 
            }} 
          />
        )}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: isCorrect ? '#2E7D32' : '#C62828',
            }}
          >
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: '#333' }}>
            {feedbackShort}
          </Typography>
        </Box>
      </Box>
    </Card>
  )
}

export default FeedbackCard

