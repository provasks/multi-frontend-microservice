import axios from 'axios';

// API Configuration - Direct to individual services
export const API_BASE_URLS = {
  auth: 'http://localhost:3001/api',
  users: 'http://localhost:3001/api',
  tasks: 'http://localhost:3002/api',
  notifications: 'http://localhost:3003/api'
};

// Create axios instances for different services
export const authApi = axios.create({
  baseURL: API_BASE_URLS.auth,
  timeout: 30000,
});

export const taskApi = axios.create({
  baseURL: API_BASE_URLS.tasks,
  timeout: 30000,
});

export const notificationApi = axios.create({
  baseURL: API_BASE_URLS.notifications,
  timeout: 30000,
});

export const userApi = axios.create({
  baseURL: API_BASE_URLS.users,
  timeout: 30000,
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
