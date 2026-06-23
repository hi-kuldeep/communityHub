import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export const useMainScreen = () => {
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    handleLogout,
  };
};

export default useMainScreen;
