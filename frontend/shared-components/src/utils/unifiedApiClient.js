import axios from 'axios';
import { API_CONFIG } from '../constants';

/**
 * Unified API Client for consistent API usage across all microfrontends
 * Provides centralized configuration, error handling, and authentication
 */

// API Configuration - Using centralized constants
export const API_BASE_URLS = API_CONFIG.BASE_URLS;

// Create axios instances for different services
export const authApi = axios.create({
  baseURL: API_BASE_URLS.AUTH,
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const taskApi = axios.create({
  baseURL: API_BASE_URLS.TASKS,
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const notificationApi = axios.create({
  baseURL: API_BASE_URLS.NOTIFICATIONS,
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const userApi = axios.create({
  baseURL: API_BASE_URLS.USERS,
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Add authentication and error handling to all API instances
 * @param {AxiosInstance} apiInstance - Axios instance to configure
 */
const configureApiInstance = (apiInstance) => {
  // Request interceptor - Add auth token and CSRF token
  apiInstance.interceptors.request.use(
    (config) => {
      // Add authentication token
      const token = sessionStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add CSRF token if available
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
      
      // Add request timestamp for debugging
      config.metadata = { startTime: new Date() };
      
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors and logging
  apiInstance.interceptors.response.use(
    (response) => {
      // Log successful requests in development
      if (process.env.NODE_ENV === 'development') {
        const duration = new Date() - response.config.metadata.startTime;
        console.log(`✅ API ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`);
      }
      
      return response;
    },
    (error) => {
      // Log errors
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });

      // Handle specific error cases
      if (error.response?.status === 401) {
        // Don't redirect if we're already on the login page
        if (!window.location.pathname.includes('/login')) {
          // Clear token from sessionStorage
          sessionStorage.removeItem('token');
          window.location.href = '/login';
        }
      } else if (error.response?.status === 403) {
        if (window.showError) {
          window.showError('Access denied. You do not have permission to perform this action.');
        }
      } else if (error.response?.status === 404) {
        if (window.showError) {
          window.showError('Resource not found. Please check your request.');
        }
      } else if (error.response?.status >= 500) {
        if (window.showError) {
          window.showError('Server error. Please try again later.');
        }
      } else if (error.code === 'ECONNABORTED') {
        if (window.showError) {
          window.showError('Request timeout. Please try again.');
        }
      } else if (!navigator.onLine) {
        if (window.showError) {
          window.showError('No internet connection. Please check your network.');
        }
      } else {
        // Generic error message
        if (window.showError) {
          window.showError('An error occurred. Please try again.');
        }
      }

      return Promise.reject(error);
    }
  );
};

// Configure all API instances
configureApiInstance(authApi);
configureApiInstance(taskApi);
configureApiInstance(notificationApi);
configureApiInstance(userApi);

/**
 * Unified API client with common methods
 */
export const apiClient = {
  // GET request
  get: async (url, config = {}) => {
    const response = await taskApi.get(url, config);
    return response.data;
  },

  // POST request
  post: async (url, data, config = {}) => {
    const response = await taskApi.post(url, data, config);
    return response.data;
  },

  // PUT request
  put: async (url, data, config = {}) => {
    const response = await taskApi.put(url, data, config);
    return response.data;
  },

  // PATCH request
  patch: async (url, data, config = {}) => {
    const response = await taskApi.patch(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async (url, config = {}) => {
    const response = await taskApi.delete(url, config);
    return response.data;
  }
};

/**
 * Service-specific API clients
 */
export const apiClients = {
  auth: authApi,
  tasks: taskApi,
  notifications: notificationApi,
  users: userApi
};

/**
 * Helper function to get the appropriate API client for a service
 * @param {string} service - Service name (auth, tasks, notifications, users)
 * @returns {AxiosInstance} Configured axios instance
 */
export const getApiClient = (service) => {
  const clients = {
    auth: authApi,
    tasks: taskApi,
    notifications: notificationApi,
    users: userApi
  };
  
  return clients[service] || taskApi; // Default to taskApi
};

/**
 * Helper function for common API operations
 */
export const apiHelpers = {
  // Fetch tasks
  fetchTasks: async () => {
    const response = await taskApi.get('/tasks');
    return response.data;
  },

  // Create task
  createTask: async (taskData) => {
    const response = await taskApi.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    const response = await taskApi.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId) => {
    const response = await taskApi.delete(`/tasks/${taskId}`);
    return response.data;
  },

  // Fetch users
  fetchUsers: async () => {
    const response = await userApi.get('/users');
    return response.data;
  },

  // Create user
  createUser: async (userData) => {
    const response = await userApi.post('/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await userApi.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await userApi.delete(`/users/${userId}`);
    return response.data;
  },

  // Fetch notifications
  fetchNotifications: async () => {
    const response = await notificationApi.get('/notifications');
    return response.data;
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    const response = await notificationApi.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await notificationApi.delete(`/notifications/${notificationId}`);
    return response.data;
  }
};

export default {
  authApi,
  taskApi,
  notificationApi,
  userApi,
  apiClient,
  apiClients,
  getApiClient,
  apiHelpers,
  API_BASE_URLS
};
