import { Outlet } from 'react-router-dom'
import LearnSidebar from '../components/LearnSidebar'

const LearnLayout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <LearnSidebar />
      <main style={{ flex: 1, marginLeft: '64px' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default LearnLayout
