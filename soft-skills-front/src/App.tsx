import './App.css'
import GlobalToastManager from './components/GlobalToastManger';
import { RoutesConfiguration } from './routes/routes'
import { useSSE } from './hooks/useSSE'

const App = () => {
  useSSE()

  return (
    <>
      <RoutesConfiguration />
      <GlobalToastManager />
    </>
  );
}

export default App