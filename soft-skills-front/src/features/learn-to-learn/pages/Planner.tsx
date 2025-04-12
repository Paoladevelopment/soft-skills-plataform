import { Box, Typography } from '@mui/material'
import GoalsSection from '../components/planner/GoalsSection'

function Planner() {
  return (
    <Box
      sx={{
        maxWidth: '900px',
        mx: 'auto',
        pt: 4,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: 'column',
          gap: 0.5,
          mb: 6,
        }}
      >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Self-regulated learning
          </Typography>
          <Typography variant="subtitle1" component="p">
            Organize your learning goals, objectives, and tasks as part of your self-regulated learning journey.
          </Typography>
      </Box>

      <GoalsSection/>
    </Box>
  )
}

export default Planner

