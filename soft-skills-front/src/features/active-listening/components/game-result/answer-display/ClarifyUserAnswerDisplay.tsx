import { Typography } from '@mui/material'
import TealBorderedCard from './TealBorderedCard'

interface ClarifyUserAnswerDisplayProps {
  questions: string[]
  userLabel: string
}

const ClarifyUserAnswerDisplay = ({ questions, userLabel }: ClarifyUserAnswerDisplayProps) => {
  return (
    <TealBorderedCard>
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            fontWeight: 600,
            display: 'inline-block',
          }}
        >
          {userLabel}
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

export default ClarifyUserAnswerDisplay

