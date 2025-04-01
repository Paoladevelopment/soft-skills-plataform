import { Button, Container, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" fontWeight="bold" color="text.secondary">
        404
      </Typography>

      <Typography variant="h5" mt={2} fontWeight="medium">
        Sorry, we couldn't find this page.
      </Typography>

      <Typography variant="body1" mt={1} color="text.secondary">
        But don't worry, you can find plenty of other things on our homepage.
      </Typography>

      <Button
        onClick={handleGoHome}
        variant="contained"
        color="secondary"
        sx={{ mt: 4, px: 4, py: 1 }}
      >
        Back to homepage
      </Button>
    </Container>
  )
}

export default NotFound
