import { useState, useCallback } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));

  const getAuthHeaders = useCallback(() => {
    if (!token) {
      return {
        'Content-Type': 'application/json'
      };
    }
    
    // Get CSRF token from meta tag if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(csrfToken && { 'X-CSRF-Token': csrfToken })
    };
  }, [token]);

  const isAuthenticated = useCallback(() => {
    return !!token;
  }, [token]);

  const login = useCallback((newToken) => {
    setToken(newToken);
    // Store token in sessionStorage only for consistency and security
    sessionStorage.setItem('token', newToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    // Clear token from sessionStorage only
    sessionStorage.removeItem('token');
  }, []);

  const makeAuthenticatedRequest = useCallback(async (url, options = {}) => {
    try {
      const response = await axios({
        url,
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers
        }
      });

      return response;
    } catch (error) {
      // Handle axios-specific errors
      if (error.response?.status === 401) {
        logout();
        throw new Error('Unauthorized');
      }
      
      // Handle different types of network errors
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        if (!navigator.onLine) {
          throw new Error('No internet connection. Please check your network.');
        } else {
          throw new Error('Server is not responding. Please try again later.');
        }
      } else if (error.name === 'ChunkLoadError') {
        throw new Error('Failed to load application resources. Please refresh the page.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request was cancelled.');
      }
      
      // Re-throw other errors
      throw error;
    }
  }, [getAuthHeaders, logout]);

  return {
    token,
    isAuthenticated,
    getAuthHeaders,
    login,
    logout,
    makeAuthenticatedRequest
  };
};
