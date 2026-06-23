import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  location?: string;
  token?: string;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
  user: User | null;
  login: (email: string, token: string, userDetails?: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  isRestoring: true,
  user: null,

  login: async (email, token, userDetails) => {
    const user: User = {
      id: `usr_${Date.now()}`,
      email,
      name: email.split('@')[0],
      location: 'Dubai',
      profilePicture: undefined,
      ...userDetails,
    };
    try {
      await AsyncStorage.setItem('auth-token', token);
      await AsyncStorage.setItem('auth-user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true });
    } catch (error) {
      console.error('Failed to save auth state', error);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('auth-token');
      await AsyncStorage.removeItem('auth-user');
      set({ token: null, user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Failed to clear auth state', error);
    }
  },

  restoreSession: async () => {
    set({ isRestoring: true });
    try {
      const token = await AsyncStorage.getItem('auth-token');
      const userStr = await AsyncStorage.getItem('auth-user');
      if (token && userStr) {
        set({
          token,
          user: JSON.parse(userStr),
          isAuthenticated: true,
        });
      } else {
        set({ token: null, user: null, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Failed to restore session', error);
    } finally {
      // Small artificial delay to show a loading state cleanly on launch
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 800));
      set({ isRestoring: false });
    }
  },
}));
