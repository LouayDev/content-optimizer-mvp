import { useAuth } from '@/contexts/AuthContext';
import { baseApi } from '@/service/fetchApi';
import { useNavigate } from 'react-router-dom';

export const useLogout = (): (() => void) => {
  const navigate = useNavigate();
  const { logout: logoutFromContext } = useAuth();
  const logout = async () => {
    try {
      await baseApi.post('/auth/logout');
      logoutFromContext();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return logout;
};
