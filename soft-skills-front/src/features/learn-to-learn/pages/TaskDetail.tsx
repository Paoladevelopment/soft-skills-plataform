import { Box, Typography } from '@mui/material'

const TaskDetail = () => {
  return (
    <Box
      sx={{
        maxWidth: '900px',
        mx: 'auto',
        px: 2,
        py: 4,
      }}
    >
      <Typography variant="h5" fontWeight={600}>
        task view
      </Typography>
    </Box>
  )
}

export default TaskDetail


