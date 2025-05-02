import './App.css'
import GlobalToastManager from './components/GlobalToastManger';
import { RoutesConfiguration } from './routes/routes'

const App = () => {
  return (
    <>
      <RoutesConfiguration />
      <GlobalToastManager />
    </>
  );
}

export default App