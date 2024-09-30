// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userSchema from '../../../shared/schemas/userSchema';

interface AuthContextProps {
  user: typeof userSchema | null;
  login: (user: typeof userSchema) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Custom hook to access the AuthContext easily
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface ChildrenType {
  children: React.ReactNode; // Use ReactNode for any valid React child type
}

// AuthProvider component to wrap the app and provide the AuthContext
export const AuthProvider: React.FC<ChildrenType> = ({ children }) => {
  const [user, setUser] = useState<typeof userSchema | null>(null);
  const navigate = useNavigate();

  // Check localStorage for user info on initial load (or sessionStorage if preferred)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function to set the user and store in localStorage
  const login = (userData: typeof userSchema) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/home'); // Redirect to home after login
  };

  // Logout function to clear user data and redirect to login
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
