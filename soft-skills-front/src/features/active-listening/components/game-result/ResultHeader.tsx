import { Box, Typography, Divider } from '@mui/material'
import { CalendarToday, AccessTime } from '@mui/icons-material'
import { formatDate } from '../../../../utils/timeUtils'

interface ResultHeaderProps {
  startedAt: string
  finishedAt: string
}

const ResultHeader = ({
  startedAt,
  finishedAt,
}: ResultHeaderProps) => {
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString)
    return formatDate(date)
  }

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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: '#FFF8DE',
            }}
          >
            <CalendarToday sx={{ color: '#4ECDC4', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: '#5C6F7F',
                fontSize: '0.875rem',
                fontWeight: 400,
                mb: 0.5,
              }}
            >
              Started
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#2C3E50',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {formatDateTime(startedAt)}
            </Typography>
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: '#FFF8DE',
            }}
          >
            <AccessTime sx={{ color: '#FF6B6B', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: '#5C6F7F',
                fontSize: '0.875rem',
                fontWeight: 400,
                mb: 0.5,
              }}
            >
              Finished
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#2C3E50',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {formatDateTime(finishedAt)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ResultHeader

