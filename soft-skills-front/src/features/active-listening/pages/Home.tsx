import { Box, Container, Typography, IconButton, Button, Stack } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import backgroundImage from '../assets/code_breakers_main_background.png'

const Home = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate('/')
  }

  const handleGameSessions = () => {
    navigate('/active-listening/game-sessions')
  }

  const handleLeaderboard = () => {
    navigate('/active-listening/leaderboard')
  }

  return (
    <Box
      sx={{
        minHeight: { xs: '100dvh', md: '100vh' },
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <IconButton
        onClick={handleGoBack}
        sx={{
          position: 'absolute',
          top: 30,
          left: 30,
          backgroundColor: '#FDB02D',
          color: 'white',
          '&:hover': {
            backgroundColor: '#FEC04A',
          },
        }}
      >
        <ArrowBack sx={{ fontSize: 32 }} />
      </IconButton>

      <Container
        maxWidth="lg"
        sx={{ 
          px: { xs: 2, sm: 3 }
        }}
      >
        <Stack
          spacing={{ xs: 3, sm: 4 }}        
          sx={{ 
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Box 
            sx={{ 
              textAlign: 'center' 
            }}
          >
            <Typography
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(90deg, #FFA726, #26C6DA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke: '1.5px white',
                letterSpacing: '0.05em',
                textShadow: '0px 2px 6px rgba(0,0,0,0.2)',
                fontSize: { xs: '3rem', sm: '4rem', md: '6rem' },
                lineHeight: 1,
                mb: '-0.2em',
              }}
            >
              Code
            </Typography>
            <Typography
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(90deg, #F9A825, #FFCC80, #4FC3F7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke: '1.5px white',
                letterSpacing: '0.05em',
                textShadow: '0px 2px 6px rgba(0,0,0,0.2)',
                fontSize: { xs: '3rem', sm: '4rem', md: '6rem' },
                lineHeight: 1,
              }}
            >
              Breakers
            </Typography>
          </Box>

          <Stack spacing={2} alignItems="center">
            <Button
              onClick={handleGameSessions}
              sx={{
                width: 200,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'white',
                textTransform: 'none',
                borderRadius: '12px',
                paddingY: 1.2,
                background: 'linear-gradient(180deg, #FFA726 0%, #F57C00 100%)',
                boxShadow: '0px 4px 0px #C96A00',
                '&:hover': {
                  background: 'linear-gradient(180deg, #FFB74D 0%, #FB8C00 100%)',
                  boxShadow: '0px 4px 0px #C96A00',
                },
                '&:active': {
                  transform: 'translateY(2px)',
                  boxShadow: '0px 2px 0px #C96A00',
                },
              }}
            >
              Game Sessions
            </Button>

            <Button
              onClick={handleLeaderboard}
              sx={{
                width: 200,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'white',
                textTransform: 'none',
                borderRadius: '12px',
                paddingY: 1.2,
                background: 'linear-gradient(180deg, #489EC1 0%, #357A99 100%)',
                boxShadow: '0px 4px 0px #2A5F7A',
                '&:hover': {
                  background: 'linear-gradient(180deg, #5AB0D4 0%, #489EC1 100%)',
                  boxShadow: '0px 4px 0px #2A5F7A',
                },
                '&:active': {
                  transform: 'translateY(2px)',
                  boxShadow: '0px 2px 0px #2A5F7A',
                },
              }}
            >
              Leaderboard
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default Home

