import { Box, Button, Card, Container, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ErrorOutline } from '@mui/icons-material'
import backgroundImage from '../../assets/background_2.png'

interface GamePlayErrorProps {
  message?: string
  onGoBack: () => void
}

const GamePlayError = ({ message, onGoBack }: GamePlayErrorProps) => {
  const { t } = useTranslation('game')
  const defaultMessage = t('play.error.loadFailed')
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        py: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            p: 4,
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.98)',
            boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(244, 67, 54, 0.2)',
            textAlign: 'center',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <ErrorOutline
              sx={{
                fontSize: 64,
                color: '#F44336',
                opacity: 0.8,
              }}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#D32F2F',
              mb: 2,
            }}
          >
            {t('play.error.title')}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#666',
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            {message || defaultMessage}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={onGoBack}
              sx={{
                backgroundColor: '#4A8A6F',
                color: 'white',
                px: 4,
                py: 1.2,
                fontWeight: 'bold',
                borderRadius: '10px',
                boxShadow: '0px 4px 15px rgba(74, 138, 111, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#3A6F58',
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 6px 20px rgba(74, 138, 111, 0.4)',
                },
              }}
            >
              {t('play.error.goBack')}
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  )
}

export default GamePlayError

