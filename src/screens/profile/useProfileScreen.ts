import { useAuthStore } from '@/store/useAuthStore';

export const useProfileScreen = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return {
    user,
    handleLogout,
  };
};

export default useProfileScreen;
