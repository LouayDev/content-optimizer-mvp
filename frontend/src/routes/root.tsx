// src/routes/AppRoutes.jsx
import { createBrowserRouter } from 'react-router-dom';
import Root from '../layouts/Root';
import Home from '../pages/Home';
import LoginPage from '@/pages/LoginPage';
import { ProtectedRoute } from '@/components/routes/protectedRoutes';
import SignupPage from '@/pages/SignupPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'Signup',
    element: <SignupPage />,
  },
]);

export default router;
