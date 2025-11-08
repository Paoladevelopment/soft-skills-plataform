import { Box, Skeleton, Card } from '@mui/material'

const RoundsTimelineSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((index) => (
        <Box
          key={index}
          sx={{
            mb: 3,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'white',
          }}
        >
          <Box
            sx={{
              backgroundColor: '#48ADA3',
              p: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Skeleton
              variant="rectangular"
              width={120}
              height={36}
              sx={{
                borderRadius: '20px',
                backgroundColor: '#FFC266',
              }}
            />
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column' 
            }}
          >
            <Card
              sx={{
                p: 3,
                backgroundColor: '#FFC266',
                borderRadius: 0,
                boxShadow: 'none',
              }}
            >
              <Skeleton
                variant="text"
                width={150}
                height={28}
                sx={{ 
                  mb: 2, 
                  backgroundColor: 'rgba(255, 255, 255, 0.3)' 
                }}
              />
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2 
                }}
              >
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width={80}
                    height={16}
                    sx={{ 
                      mb: 0.5, 
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={6}
                    sx={{ 
                      borderRadius: '4px', 
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    }}
                  />
                </Box>
              </Box>
            </Card>

            <Card
              sx={{
                p: 3,
                backgroundColor: '#E8F9EE',
                borderRadius: 0,
                boxShadow: 'none',
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  mb: 1,
                }}
              >
                <Skeleton
                  variant="circular"
                  width={24}
                  height={24}
                />
                <Skeleton variant="text" width={100} height={24} />
              </Box>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 1.5,
                }}
              >
                <Box 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    flexShrink: 0,
                  }}
                />
                <Skeleton variant="text" width={120} height={20} />
              </Box>
            </Card>

            <Box
              sx={{
                p: 3,
                backgroundColor: '#E8F9EE',
                borderRadius: 0,
              }}
            >
              <Skeleton 
                variant="text" 
                width={200} 
                height={28} 
                sx={{ 
                  mb: 2,
                }}
              />
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={100} 
                sx={{ 
                  borderRadius: '8px', 
                  mb: 2,
                }}
              />
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={100} 
                sx={{ 
                  borderRadius: '8px',
                }}
              />
            </Box>
          </Box>
        </Box>
      ))}
    </>
  )
}

export default RoundsTimelineSkeleton

