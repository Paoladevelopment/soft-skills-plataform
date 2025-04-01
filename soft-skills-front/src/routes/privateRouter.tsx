import {Outlet, Navigate} from 'react-router-dom'
import useAuthStore from '../features/authentication/store/useAuthStore'

export const ProtectedRoutes = () => {
    const isLoggedIn = useAuthStore(state => state.isLoggedIn())
    return isLoggedIn? <Outlet /> : <Navigate to='/login' />
}