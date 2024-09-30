import { baseApi } from '@/service/fetchApi';
import { useNavigate } from 'react-router-dom';

export const useLogout = (): (() => void) => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await baseApi.post('/auth/logout');
      // Remove user info from localStorage
      localStorage.removeItem('user');
      // Redirect to login page after logout
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return logout;
};
