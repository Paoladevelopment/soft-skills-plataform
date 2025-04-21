import { Box } from '@mui/material'
import {
  CheckCircle,
  CalendarMonth,
  Explore,
  Dashboard,
  BarChart,
  Home,
  Help
} from '@mui/icons-material'
import UserMenu from './UserMenu'
import SidebarIcon from './SideBarIcon'

const LearnSidebar = () => {
  return (
  <Box
    sx={{
      width: '64px',
      height: '100vh',
      display: 'flex',
      position: 'fixed',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0.5,
      py: 2,
      borderRight: '1px solid #e0e0e0',
      backgroundColor: '#F9F9F9',
    }}
  >
    <UserMenu />

    <SidebarIcon icon={<Dashboard />} label="Dashboard" to="/learn/dashboard" />
    <SidebarIcon icon={<CheckCircle />} label="Planner" to="/learn/planner" />
    <SidebarIcon icon={<Explore />} label="Explore" to="/learn/explore" />
    <SidebarIcon icon={<BarChart />} label="Learning Reports" to="/learn/reports" />
    <SidebarIcon icon={<CalendarMonth />} label="Calendar" to="/learn/calendar" />

    <Box sx={{ flexGrow: 1 }} />

    <SidebarIcon icon={<Home />} label="App Home" to="/" />
    <SidebarIcon icon={<Help />} label="Help" to="/learn/help" />
  </Box>
  )
}

export default LearnSidebar
