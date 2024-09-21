import { RouterProvider } from 'react-router-dom';
import router from './routes/root.tsx'; // Import the router config

function App() {
  return <RouterProvider router={router} />;
}

export default App;
