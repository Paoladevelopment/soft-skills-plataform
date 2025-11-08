import { Typography } from '@mui/material'
import TealBorderedCard from './TealBorderedCard'

interface TextCorrectAnswerDisplayProps {
  text: string
  correctLabel: string
}

const TextCorrectAnswerDisplay = ({ text, correctLabel }: TextCorrectAnswerDisplayProps) => {
  return (
    <TealBorderedCard borderLeftColor="#4CAF50">
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#4CAF50',
          mb: 1, 
          fontWeight: 600 
        }}
      >
        {correctLabel}
      </Typography>
      <Typography 
        variant="body1" 
      >
        {text}
      </Typography>
    </TealBorderedCard>
  )
}

export default TextCorrectAnswerDisplay

