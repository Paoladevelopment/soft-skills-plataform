import { Box } from '@mui/material'
import {
  CheckCircle,
  Timeline,
  Explore,
  BarChart,
  Home,
  Help
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import UserMenu from './UserMenu'
import SidebarIcon from './SideBarIcon'

const LearnSidebar = () => {
  const { t } = useTranslation('common')
  
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

    <SidebarIcon icon={<CheckCircle />} label={t('sidebar.planner')} to="/learn/planner" />
    <SidebarIcon icon={<Explore />} label={t('sidebar.explore')} to="/learn/explore" />
    <SidebarIcon icon={<BarChart />} label={t('sidebar.learningReports')} to="/learn/reports" />
    <SidebarIcon icon={<Timeline />} label={t('sidebar.learningRoadmaps')} to="/learn/roadmaps" />

    <Box sx={{ flexGrow: 1 }} />

    <SidebarIcon icon={<Home />} label={t('sidebar.appHome')} to="/" />
    <SidebarIcon icon={<Help />} label={t('sidebar.help')} to="/learn/help" />
  </Box>
  )
}

export default LearnSidebar
