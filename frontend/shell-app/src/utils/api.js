import axios from 'axios';
import { API_CONFIG } from 'sharedComponents/constants';

// API Configuration - Using centralized constants
export const API_BASE_URLS = API_CONFIG.BASE_URLS;

// Create axios instances for different services
export const authApi = axios.create({
  baseURL: API_BASE_URLS.AUTH,
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
});

export const taskApi = axios.create({
  baseURL: API_BASE_URLS.TASKS,
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
});

export const notificationApi = axios.create({
  baseURL: API_BASE_URLS.NOTIFICATIONS,
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
});

export const userApi = axios.create({
  baseURL: API_BASE_URLS.USERS,
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
});

// Add auth token to all API instances
const addAuthToken = (apiInstance) => {
  apiInstance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    return config;
  });
  
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Don't redirect if we're already on the login page
        if (!window.location.pathname.includes('/login')) {
          // Clear token from sessionStorage only
          sessionStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
};

// Apply auth interceptors to all APIs
addAuthToken(authApi);
addAuthToken(taskApi);
addAuthToken(notificationApi);
addAuthToken(userApi);
