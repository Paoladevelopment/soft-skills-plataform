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
import Planner from '../features/learn-to-learn/pages/Planner';
import Dashboard from '../features/learn-to-learn/pages/Dashboard';
import Explore from '../features/learn-to-learn/pages/Explore';
import LearningReport from '../features/learn-to-learn/pages/LearningReport';
import Roadmap from '../features/learn-to-learn/pages/Roadmap';
import Help from '../features/learn-to-learn/pages/Help';


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
          <Route path='/learn' element={<LearnLayout/>}>
            <Route path='planner' element={<Planner/>}></Route>
            <Route path='dashboard' element={<Dashboard/>}></Route>
            <Route path='explore' element={<Explore/>}></Route>
            <Route path='reports' element={<LearningReport/>}></Route>
            <Route path='roadmaps' element={<Roadmap/>}></Route>
            <Route path='help' element={<Help/>}></Route>
          </Route>
        </Route>
        
      </Routes>
    </Router>
  )
}