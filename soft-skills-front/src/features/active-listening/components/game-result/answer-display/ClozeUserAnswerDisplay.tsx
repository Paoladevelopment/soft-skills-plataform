import { Typography, Box } from '@mui/material'
import TealBorderedCard from './TealBorderedCard'

interface ClozeUserAnswerDisplayProps {
  blanks: string[]
  userLabel: string
}

const ClozeUserAnswerDisplay = ({ blanks, userLabel }: ClozeUserAnswerDisplayProps) => {
  return (
    <TealBorderedCard>
      <Typography
        variant="body2"
        sx={{
          mb: 1,
          fontWeight: 600,
        }}
      >
        {userLabel}
      </Typography>
      {blanks.map((blank, idx) => (
        <Box 
          key={idx} 
          sx={{ 
            mb: 1 
          }}
        >
           <Typography
             component="span"
             variant="body1"
             sx={{
               fontWeight: 600,
             }}
           >
             Blank {idx + 1}:
           </Typography>
          <Typography
            component="span"
            variant="body1"
            sx={{
              fontWeight: 400,
              ml: 0.5,
            }}
          >
            {blank}
          </Typography>
        </Box>
      ))}
    </TealBorderedCard>
  )
}

export default ClozeUserAnswerDisplay

