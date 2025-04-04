import { Box, IconButton, Tooltip } from '@mui/material'
import {
  CheckCircle,
  CalendarMonth,
  Explore,
  Dashboard,
  BarChart,
  Home,
  Help
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import UserMenu from './UserMenu'

const LearnSidebar = () => {
  const navigate = useNavigate()
  return (
  <Box
    sx={{
      width: '64px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0.5,
      py: 2,
      borderRight: '1px solid #e0e0e0',
      backgroundColor: '#F9F9F9',
    }}
  >
    <UserMenu />

    <Tooltip title="Dashboard">
      <IconButton>
        <Dashboard />
      </IconButton>
    </Tooltip>

    <Tooltip title="Planner">
      <IconButton color="secondary">
        <CheckCircle />
      </IconButton>
    </Tooltip>

    <Tooltip title="Explore">
      <IconButton>
        <Explore />
      </IconButton>
    </Tooltip>

    <Tooltip title="Learning Report">
      <IconButton>
        <BarChart />
      </IconButton>
    </Tooltip>

    <Tooltip title="Calendar">
      <IconButton>
        <CalendarMonth />
      </IconButton>
    </Tooltip>

    <Box sx={{ flexGrow: 1 }} />

    <Tooltip title="App Home">
      <IconButton onClick={() => navigate("/")}>
        <Home />
      </IconButton>
    </Tooltip>

    <Tooltip title="Help">
      <IconButton>
        <Help />
      </IconButton>
    </Tooltip>
  </Box>
  )
}

export default LearnSidebar
