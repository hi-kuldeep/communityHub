import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

export const useAuthStore = create<IAuthState>((set, get) => ({
  token: null,
  isAuthenticated: false,
  isRestoring: true,
  user: null,
  expiresAt: null,

  login: async ({ token, expiresAt, user }) => {
    const normalizedUser: IUser = {
      ...user,
      profilePicture: user.profilePicture || user.avatar,
      avatar: user.avatar || user.profilePicture,
    };
    try {
      await Keychain.setGenericPassword('auth-token', token);
      await AsyncStorage.setItem('auth-user', JSON.stringify(normalizedUser));
      await AsyncStorage.setItem('auth-expires-at', expiresAt.toString());
      set({ token, user: normalizedUser, expiresAt, isAuthenticated: true });
    } catch (error) {
      console.error('Failed to save auth state', error);
    }
  },

  logout: async () => {
    try {
      await Keychain.resetGenericPassword();
      await AsyncStorage.removeItem('auth-user');
      await AsyncStorage.removeItem('auth-expires-at');
      set({ token: null, user: null, expiresAt: null, isAuthenticated: false });
    } catch (error) {
      console.error('Failed to clear auth state', error);
    }
  },

  restoreSession: async () => {
    set({ isRestoring: true });
    try {
      const credentials = await Keychain.getGenericPassword();
      const userStr = await AsyncStorage.getItem('auth-user');
      const expiresAtStr = await AsyncStorage.getItem('auth-expires-at');

      if (credentials && userStr && expiresAtStr) {
        const token = credentials.password;
        const expiresAt = parseInt(expiresAtStr, 10);

        // Enforce session timeout on launch if token has expired
        if (Date.now() > expiresAt) {
          console.log('[Auth] Restored session has expired. Logging out...');
          const logoutFn = get().logout;
          await logoutFn();
        } else {
          set({
            token,
            user: JSON.parse(userStr),
            expiresAt,
            isAuthenticated: true,
          });
        }
      } else {
        set({ token: null, user: null, expiresAt: null, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Failed to restore session', error);
    } finally {
      // Small artificial delay to show a loading state cleanly on launch
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 800));
      set({ isRestoring: false });
    }
  },

  updateUser: async (updatedFields) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const normalizedUser: IUser = {
      ...currentUser,
      ...updatedFields,
      profilePicture: updatedFields.profilePicture || updatedFields.avatar || currentUser.profilePicture || currentUser.avatar,
      avatar: updatedFields.avatar || updatedFields.profilePicture || currentUser.avatar || currentUser.profilePicture,
    };
    try {
      await AsyncStorage.setItem('auth-user', JSON.stringify(normalizedUser));
      set({ user: normalizedUser });
    } catch (error) {
      console.error('Failed to update user in store', error);
    }
  },
}));
