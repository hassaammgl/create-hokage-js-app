import { router } from './routes/router';
import './styles/App.css';
import './styles/Login.css';
import { RouterProvider } from 'react-router';

function App() {
  return (
    <RouterProvider router={router} />
  )
}


export default App;