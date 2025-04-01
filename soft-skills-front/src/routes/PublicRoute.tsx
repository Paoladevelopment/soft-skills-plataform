import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'
import useAuthStore from '../features/authentication/store/useAuthStore'

interface Props {
  children: ReactNode
}

export const PublicRoute = ({ children }: Props) => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn())
  return isLoggedIn ? <Navigate to="/" replace /> : children
}
