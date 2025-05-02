import { Box, Typography } from '@mui/material'
import GoalsSection from '../components/planner/GoalsSection'

const Planner = () => {
  return (
    <Box
      sx={{
        maxWidth: '900px',
        mx: 'auto',
        px: 2,
        py: 4,
        gap: 4,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Self-regulated learning
          </Typography>
          <Typography variant="subtitle1" component="p">
            Organize your learning goals, objectives, and tasks as part of your self-regulated learning journey.
          </Typography>
      </Box>
    
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <GoalsSection />
      </Box>
    </Box>
  )
}

export default Planner

