import { AuthProvider } from '@/contexts/AuthContext';
import { Outlet } from 'react-router-dom';

const Root = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default Root;
