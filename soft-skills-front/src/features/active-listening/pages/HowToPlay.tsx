import { Box, Container, Typography, IconButton, Paper, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import backgroundImage from '../assets/code_breakers_main_background.png'

const HowToPlay = () => {
  const { t } = useTranslation('game')
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate('/active-listening')
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
        py: 4,
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
        maxWidth="md"
        sx={{ 
          px: { xs: 2, sm: 3 }
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Stack spacing={3}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(90deg, #FFA726, #26C6DA)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  WebkitTextStroke: '1px #333',
                  letterSpacing: '0.05em',
                  mb: 1,
                }}
              >
                {t('howToPlay.title')}
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {t('howToPlay.subtitle')}
              </Typography>
            </Box>

            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {t('howToPlay.objective.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {t('howToPlay.objective.description')}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {t('howToPlay.howToPlay.title')}
                </Typography>
                <Stack spacing={2} component="ol" sx={{ pl: 3, m: 0 }}>
                  {[1, 2, 3, 4, 5].map((num) => {
                    const stepText = t(`howToPlay.howToPlay.step${num}`)
                    const colonIndex = stepText.indexOf(':')
                    const boldPart = colonIndex !== -1 ? stepText.substring(0, colonIndex + 1) : stepText
                    const normalPart = colonIndex !== -1 ? stepText.substring(colonIndex + 1).trim() : ''
                    
                    return (
                      <Typography key={num} component="li" variant="body1" color="text.secondary" paragraph>
                        <Box component="span" fontWeight="bold">
                          {boldPart}
                        </Box>
                        {normalPart && ` ${normalPart}`}
                      </Typography>
                    )
                  })}
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                >
                  {t('howToPlay.gameModes.title')}
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {t('howToPlay.gameModes.focus.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('howToPlay.gameModes.focus.description')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {t('howToPlay.gameModes.cloze.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('howToPlay.gameModes.cloze.description')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {t('howToPlay.gameModes.paraphrase.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('howToPlay.gameModes.paraphrase.description')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {t('howToPlay.gameModes.summarize.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('howToPlay.gameModes.summarize.description')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {t('howToPlay.gameModes.clarify.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('howToPlay.gameModes.clarify.description')}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                >
                  {t('howToPlay.tips.title')}
                </Typography>
                <Stack spacing={1} component="ul" sx={{ pl: 3, m: 0 }}>
                  {[1, 2, 3, 4, 5].map((num) => {
                    const tipText = t(`howToPlay.tips.tip${num}`)
                    const colonIndex = tipText.indexOf(':')
                    const boldPart = colonIndex !== -1 ? tipText.substring(0, colonIndex + 1) : tipText
                    const normalPart = colonIndex !== -1 ? tipText.substring(colonIndex + 1).trim() : ''
                    
                    return (
                      <Typography key={num} component="li" variant="body2" color="text.secondary">
                        <Box component="span" fontWeight="bold">
                          {boldPart}
                        </Box>
                        {normalPart && ` ${normalPart}`}
                      </Typography>
                    )
                  })}
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default HowToPlay

