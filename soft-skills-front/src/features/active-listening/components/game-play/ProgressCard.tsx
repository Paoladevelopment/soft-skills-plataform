import { Box, Card, LinearProgress, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface ProgressCardProps {
  currentRound: number
  totalRounds?: number
}

const ProgressCard = ({ currentRound, totalRounds = 5 }: ProgressCardProps) => {
  const { t } = useTranslation('game')
  return (
    <Card
      sx={{
        p: 3,
        mb: 4,
        borderRadius: '12px',
        background: 'linear-gradient(180deg, #4A8A6F 0%, #3A6F58 100%)',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)',
      }}
    >
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 2 
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '1rem',
                }}
                >
                {t('play.progress')}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                }}
                >
                {t('play.round')} {currentRound} / {totalRounds}
            </Typography>
        </Box>
      <LinearProgress
        variant="determinate"
        value={(currentRound / totalRounds) * 100}
        sx={{
          height: '10px',
          borderRadius: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          '& .MuiLinearProgress-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
          },
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#1DB584',
            borderRadius: '6px',
          },
        }}
      />
    </Card>
  )
}

export default ProgressCard

