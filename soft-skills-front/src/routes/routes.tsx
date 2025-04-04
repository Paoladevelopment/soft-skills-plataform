import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from '../features/authentication/pages/Login';
import Home from '../Home';
import { ProtectedRoutes } from './privateRouter';
import { PublicRoutes } from './PublicRoute';
import NotFound from '../pages/NotFound';
import MainLayout from '../layouts/MainLayout';
import Register from '../features/authentication/pages/Register';
import PublicLayout from '../layouts/PublicLayout';
import LearnLayout from '../layouts/LearnModuleLayout';


export const RoutesConfiguration = () => {
  return (
    <Router>
      <Routes>
        <Route path='*' element={<NotFound/>}></Route>

        <Route element={<PublicRoutes />}>
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoutes/>}>
          <Route element={<MainLayout/>}>
            <Route path='/' element={<Home/>}></Route>
          </Route>
        </Route>

        <Route element={<ProtectedRoutes/>}>
          <Route element={<LearnLayout/>}>
            <Route path='/learn' element={<Home/>}></Route>
          </Route>
        </Route>
        
      </Routes>
    </Router>
  )
}