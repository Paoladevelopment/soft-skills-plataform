import { Box, Container, Typography } from '@mui/material'

const GameSessionResult = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Result View
        </Typography>
      </Container>
    </Box>
  )
}

export default GameSessionResult

