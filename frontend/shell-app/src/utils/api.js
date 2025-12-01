import axios from 'axios';
import { API_CONFIG } from 'sharedComponents/constants';

// API Configuration - Using centralized constants
export const API_BASE_URLS = API_CONFIG.BASE_URLS;

// Create axios instances for different services
export const authApi = axios.create({
  baseURL: API_BASE_URLS.AUTH,
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  withCredentials: true,  // CRITICAL: Send cookies with requests
});

export const taskApi = axios.create({
  baseURL: API_BASE_URLS.TASKS,
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  withCredentials: true,  // CRITICAL: Send cookies with requests
});

export const notificationApi = axios.create({
  baseURL: API_BASE_URLS.NOTIFICATIONS,
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  withCredentials: true,  // CRITICAL: Send cookies with requests
});

export const userApi = axios.create({
  baseURL: API_BASE_URLS.USERS,
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  withCredentials: true,  // CRITICAL: Send cookies with requests
});

// Configure API instances - cookies are sent automatically
const configureApiInstance = (apiInstance) => {
  apiInstance.interceptors.request.use((config) => {
    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    // NO TOKEN MANAGEMENT - Browser handles HttpOnly cookies automatically!
    
    return config;
  });
  
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Don't redirect if we're already on the login page
        if (!window.location.pathname.includes('/login')) {
          // Cookie is already cleared by backend, just redirect
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
};

// Apply interceptors to all APIs
configureApiInstance(authApi);
configureApiInstance(taskApi);
configureApiInstance(notificationApi);
configureApiInstance(userApi);
