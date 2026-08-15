import axios from 'axios';
import { APP_CONFIG } from '../constants/config';

export const apiClient = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for attaching auth tokens when backend API is live
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('mailpilot_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
