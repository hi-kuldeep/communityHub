import axios from 'axios';

import { showModal } from '@/components/modalProvider/ModalProvider';
import i18n from '@/localization';

const baseURL = '';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(config => {
  config.headers['Accept-Language'] = i18n.language;
  // Add Authorization header if token exists
  const token = '';
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
  // Helper to get user token from AuthContext
  // You need to implement getUserToken in AuthContext to return the current user's token
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

    if (
      err?.response?.status === 401 &&
      err?.response?.config?.url !== '/users/login'
    ) {
      // Handle logout here
    }

    showModal({
      type: 'error',
      message: err?.response?.data?.message || 'Something went wrong!',
    });
    throw err;
  },
);
export default axiosInstance;
