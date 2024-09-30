// src/routes/AppRoutes.jsx
import { createBrowserRouter } from 'react-router-dom';
import Root from '../layouts/Root';
import Home from '../pages/Home';
import LoginPage from '@/pages/LoginPage';

const router = createBrowserRouter([
  {
    element: <Root />, // A layout component wrapping your content (header, footer, etc.)
    children: [{ index: true, element: <LoginPage /> }],
  },
]);

export default router;
