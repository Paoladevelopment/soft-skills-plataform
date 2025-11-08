import { Box, Skeleton } from '@mui/material'

const ScoreSummarySkeleton = () => {
  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        borderRadius: '12px',
        background: 'white',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 3 }}>
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '8px' }} />
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '8px' }} />
      </Box>
      <Box>
        <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={10} sx={{ borderRadius: '5px' }} />
      </Box>
    </Box>
  )
}

export default ScoreSummarySkeleton

