import { Box, Card, Container, Skeleton } from '@mui/material'

const GamePlaySkeleton = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(135deg, #FFF9E6 0%, #FFF0D9 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4, mt: 6 }}>
          <Skeleton
            variant="text"
            width="60%"
            height={60}
            sx={{ margin: '0 auto', mb: 2 }}
          />
          <Skeleton variant="text" width="30%" height={30} sx={{ margin: '0 auto' }} />
        </Box>

        <Card
          sx={{
            p: 3,
            mb: 4,
            borderRadius: '12px',
            background: 'linear-gradient(180deg, #4A8A6F 0%, #3A6F58 100%)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="text" width="20%" height={24} sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <Skeleton variant="text" width="15%" height={24} sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          </Box>
          <Skeleton variant="rectangular" height={10} sx={{ borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
        </Card>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card
            sx={{
              p: 3,
              background: '#FFA726',
              borderRadius: '12px',
              boxShadow: '0px 8px 24px rgba(255, 167, 38, 0.3)',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Skeleton variant="text" width="30%" height={24} sx={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Skeleton variant="circular" width={48} height={48} sx={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
                <Skeleton variant="rectangular" width="40%" height={20} sx={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
                <Skeleton variant="circular" width={48} height={48} sx={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
              </Box>
              <Skeleton variant="rectangular" height={6} sx={{ borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
            </Box>
          </Card>

          <Card
            sx={{
              p: 4,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.97)',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(74, 138, 111, 0.15)',
            }}
          >
            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 3 }} />

            <Skeleton variant="rectangular" height={100} sx={{ mb: 2, borderRadius: '8px' }} />
            <Skeleton variant="rectangular" height={100} sx={{ mb: 2, borderRadius: '8px' }} />
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: '8px' }} />
          </Card>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', pt: 2, pb: 2 }}>
            <Skeleton variant="rectangular" width={200} height={56} sx={{ borderRadius: '10px' }} />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default GamePlaySkeleton

