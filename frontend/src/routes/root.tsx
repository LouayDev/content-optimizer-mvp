// src/routes/AppRoutes.jsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '../layouts/Root';
import LoginPage from '@/pages/LoginPage';
import { ProtectedRoute } from '@/components/routes/protectedRoutes';
import SignupPage from '@/pages/SignupPage';
import Home from '@/pages/HomePage';

const router = createBrowserRouter([
  {
    path: 'home',
    element: (
      // <ProtectedRoute>
      <Home />
      // </ProtectedRoute>
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
