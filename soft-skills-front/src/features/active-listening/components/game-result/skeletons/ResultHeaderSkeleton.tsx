import { Box, Skeleton, Divider } from '@mui/material'

const ResultHeaderSkeleton = () => {
  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        borderRadius: '16px',
        backgroundColor: '#FFFDF5',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 3 
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5 
          }}
        >
          <Skeleton
            variant="circular"
            width={48}
            height={48}
            sx={{ 
              bgcolor: '#FFF8DE' 
            }}
          />
          <Box>
            <Skeleton variant="text" width={60} height={20} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width={120} height={24} />
          </Box>
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderColor: '#E0E0E0',
            borderWidth: '1px',
            height: '50px',
          }}
        />

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5 
          }}
        >
          <Skeleton
            variant="circular"
            width={48}
            height={48}
            sx={{ bgcolor: '#FFF8DE' }}
          />
          <Box>
            <Skeleton variant="text" width={60} height={20} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width={120} height={24} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ResultHeaderSkeleton

