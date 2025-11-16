import { Typography, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import TealBorderedCard from './TealBorderedCard'

interface ClozeCorrectAnswerDisplayProps {
  blanks: string[]
  correctLabel: string
}

const ClozeCorrectAnswerDisplay = ({ blanks, correctLabel }: ClozeCorrectAnswerDisplayProps) => {
  const { t } = useTranslation('game')
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
            {t('result.blank')} {idx + 1}:
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

export default ClozeCorrectAnswerDisplay

