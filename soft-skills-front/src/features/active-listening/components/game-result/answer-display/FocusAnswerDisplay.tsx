import { Typography, Box } from '@mui/material'
import { Close, CheckCircle } from '@mui/icons-material'

interface FocusAnswerDisplayProps {
  answer: string
  label: string
  isCorrect: boolean
}

const FocusAnswerDisplay = ({ answer, label, isCorrect }: FocusAnswerDisplayProps) => {
  const borderColor = isCorrect ? '#4CAF50' : '#D9534F'
  const backgroundColor = isCorrect ? '#F5F5DC' : '#FFF0F0'
  const iconColor = isCorrect ? '#4CAF50' : '#D9534F'

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="body2"
        sx={{
          mb: 1,
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          backgroundColor,
          p: 1.5,
          borderRadius: '8px',
          border: `1px solid ${borderColor}`,
        }}
      >
        {isCorrect ? (
          <CheckCircle
            sx={{
              color: iconColor,
              fontSize: '20px',
            }}
          />
        ) : (
          <Close
            sx={{
              color: iconColor,
              fontSize: '20px',
            }}
          />
        )}

        <Typography
          variant="body1"
        >
          {answer}
        </Typography>
      </Box>
    </Box>
  )
}

export default FocusAnswerDisplay

