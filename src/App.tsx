import 'antd/dist/antd.css';
import Navigator from './components/navigation/Navigation';
import { AuthProvider } from './context/useAuth';

function App() {
  return(
    <AuthProvider>
        <Navigator />
    </AuthProvider>
  )
}

export default App
