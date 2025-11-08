import { Box, Typography } from '@mui/material'

interface RoundCardHeaderProps {
  roundNumber: number
}

const RoundCardHeader = ({ roundNumber }: RoundCardHeaderProps) => {
  return (
    <Box
      sx={{
        backgroundColor: '#48ADA3',
        p: 2,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: '#FFC266',
          borderRadius: '20px',
          px: 2,
          py: 0.5,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            color: 'white',
          }}
        >
          Round {roundNumber}
        </Typography>
      </Box>
    </Box>
  )
}

export default RoundCardHeader

