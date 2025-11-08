import { Typography } from '@mui/material'
import TealBorderedCard from './TealBorderedCard'

interface TextAnswerDisplayProps {
  text: string
  userLabel: string
}

const TextAnswerDisplay = ({ text, userLabel }: TextAnswerDisplayProps) => {
  return (
    <TealBorderedCard>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 1, 
          fontWeight: 600 
        }}
      >
        {userLabel}
      </Typography>
      <Typography 
        variant="body1" 
      >
        {text}
      </Typography>
    </TealBorderedCard>
  )
}

export default TextAnswerDisplay

