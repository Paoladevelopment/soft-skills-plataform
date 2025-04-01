import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Auth from '../features/authentication/pages/Auth';
import Home from '../Home';
import { ProtectedRoutes } from './privateRouter';
import { PublicRoute } from './PublicRoute';
import NotFound from '../pages/NotFound';
import ProtectedLayout from '../layouts/ProtectedLayout';


export const RoutesConfiguration = () => {
    return (
        <Router>
            <Routes>
                <Route path='*' element={<NotFound/>}></Route>
                <Route 
                    path='/login' 
                    element={
                        <PublicRoute>
                            <Auth defaultMode="login"/>
                        </PublicRoute>
                    }>
                </Route>
                <Route element={<ProtectedRoutes/>}>
                    <Route element={<ProtectedLayout/>}>
                        <Route path='/' element={<Home/>}></Route>
                    </Route>
                </Route>
            </Routes>
        </Router>
    )
}