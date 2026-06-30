import axios, { AxiosHeaders } from 'axios';

import { useAuthStore } from '@/features/auth/authStore';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  const headers = AxiosHeaders.from(config.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  config.headers = headers;

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) {
        useAuthStore.getState().logout();
      }

      if (status === 403) {
        window.location.href = '/sin-acceso';
      }
    }

    return Promise.reject(error);
  },
);
