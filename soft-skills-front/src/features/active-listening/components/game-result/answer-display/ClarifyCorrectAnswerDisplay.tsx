import { Typography } from '@mui/material'
import TealBorderedCard from './TealBorderedCard'

interface ClarifyCorrectAnswerDisplayProps {
  questions: string[]
  correctLabel: string
}

const ClarifyCorrectAnswerDisplay = ({ questions, correctLabel }: ClarifyCorrectAnswerDisplayProps) => {
  return (
    <TealBorderedCard borderLeftColor="#4CAF50">
      <Typography
        variant="body2"
        sx={{
          color: '#4CAF50',
          mb: 1,
          fontWeight: 600,
        }}
      >
        {correctLabel}
      </Typography>
      {questions.map((q, idx) => (
        <Typography
          key={idx}
          variant="body1"
          sx={{
            mb: 0.5,
          }}
        >
          • {q}
        </Typography>
      ))}
    </TealBorderedCard>
  )
}

export default ClarifyCorrectAnswerDisplay

