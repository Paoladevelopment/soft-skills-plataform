import { Box, Typography, Chip } from '@mui/material'

interface ReplaysInfoProps {
  used: number
  left: number
  max: number
}

const ReplaysInfo = ({ used, left, max }: ReplaysInfoProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      <Typography variant="body2" color="#666">
        Replays:
      </Typography>
      <Chip
        label={`${used} / ${max}`}
        size="small"
        sx={{
          backgroundColor: left === 0 ? '#FFE0E0' : '#E8F5E9',
          color: left === 0 ? '#C62828' : '#2E7D32',
          fontWeight: 'bold',
        }}
      />
      {left > 0 && (
        <Typography variant="caption" color="#666">
          ({left} remaining)
        </Typography>
      )}
    </Box>
  )
}

export default ReplaysInfo

