import { Typography } from '@mui/material'
import TealBorderedCard from './TealBorderedCard'

interface QuestionDisplayProps {
  question: string
}

const QuestionDisplay = ({ question }: QuestionDisplayProps) => {
  return (
    <TealBorderedCard borderLeftColor="#F8B5CB">
      <Typography
        variant="body2"
        sx={{
          mb: 1,
          fontWeight: 600,
        }}
      >
        Question:
      </Typography>
      <Typography
        variant="body1"
      >
        {question}
      </Typography>
    </TealBorderedCard>
  )
}

export default QuestionDisplay

