// import { useNavigate } from 'react-router-dom';

import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import userSchema from '../../../../shared/schemas/userSchema';

// export function ProtectedRoute({ children }: { children: JSX.Element }) {
//   const navigate = useNavigate();

//   const user = localStorage.getItem('user'); // Check if the user exists in localStorage

//   if (!user) {
//     // If no user found, redirect to the login page
//     return navigate('/login');
//   }

//   return children; // If user exists, allow access to the page
// }

// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';

// interface ProtectedRouteProps {
//   children: JSX.Element;
// }

// // Component to wrap around protected routes
// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const { user } = useAuth();

//   // If no user is logged in, redirect to login page
//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   // If user exists, allow access to the route
//   return children;
// };

type PrivatePageProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: PrivatePageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Getting user from localStorage
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    // Parsing the user and checking if the object is valid
    const parsedUser = JSON.parse(user);
    const userParseResult = userSchema.safeParse(parsedUser);
    if (!userParseResult.success) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]); // Ensure `navigate` is a dependency

  return children;
}
