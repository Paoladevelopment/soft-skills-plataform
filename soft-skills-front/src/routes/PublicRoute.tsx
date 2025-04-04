import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../features/authentication/store/useAuthStore'

export const PublicRoutes = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn())
  return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />
}
