import axios from 'axios';
import { Platform } from 'react-native';

import { showModal } from '@/components/modalProvider/ModalProvider';
import i18n from '@/localization';

import { useAuthStore } from '@/store/useAuthStore';

// Resolve mock server port in dev mode, staging/prod URL in release mode
const baseURL = __DEV__
  ? Platform.select({
      ios: 'http://localhost:3000',
      android: 'http://10.0.2.2:3000',
      default: 'http://localhost:3000',
    })
  : '';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(config => {
  config.headers['Accept-Language'] = i18n.language;
  
  // Resolve current authenticated user state dynamically from Zustand
  const authState = useAuthStore.getState();
  const token = authState.token;
  const userId = authState.user?.id;
  const expiresAt = authState.expiresAt;

  // Intercept requests and auto-logout on client side if the token has expired
  if (expiresAt && Date.now() > expiresAt) {
    authState.logout();
    return Promise.reject(new Error('Session expired. Please log in again.'));
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (userId) {
    config.headers['x-user-id'] = userId;
  }

  return config;
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  res => {
    if ([200, 201].includes(res.status)) {
      return res;
    } else {
      throw Error;
    }
  },
  err => {
    console.log('err', err?.response);

    // Auto logout on 401 Unauthorized errors (except for the login request itself)
    if (
      err?.response?.status === 401 &&
      err?.response?.config?.url !== '/users/login'
    ) {
      useAuthStore.getState().logout();
    }

    if (
      err?.response?.config?.url !== '/users/login' &&
      !err?.response?.config?.url?.endsWith('/users/login')
    ) {
      showModal({
        type: 'error',
        message: err?.response?.data?.message || err?.message || 'Something went wrong!',
      });
    }
    throw err;
  },
);
export default axiosInstance;
