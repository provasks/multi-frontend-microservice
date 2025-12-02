import { useState, useCallback, useEffect, useRef } from 'react';
import { authApi } from '../utils/unifiedApiClient';

// Shared state to prevent multiple simultaneous auth checks
let authCheckPromise = null;
let authCheckCache = {
  timestamp: 0,
  result: null,
  subscribers: new Set()
};
const CACHE_DURATION = 5000; // Cache for 5 seconds

// Shared function to check auth (prevents duplicate API calls)
const performAuthCheck = async () => {
  const now = Date.now();
  
  // If there's a recent cache and it's still valid, return cached result
  if (authCheckCache.result !== null && (now - authCheckCache.timestamp) < CACHE_DURATION) {
    return authCheckCache.result;
  }
  
  // If there's already a pending request, wait for it
  if (authCheckPromise) {
    return authCheckPromise;
  }
  
  // Create new auth check promise
  authCheckPromise = (async () => {
    try {
      const response = await authApi.get('/auth/me');
      const result = {
        isAuthenticated: true,
        user: response.data.user
      };
      
      // Update cache
      authCheckCache = {
        timestamp: Date.now(),
        result,
        subscribers: new Set()
      };
      
      // Notify all subscribers
      authCheckCache.subscribers.forEach(callback => callback(result));
      
      return result;
    } catch (error) {
      const result = {
        isAuthenticated: false,
        user: null
      };
      
      // Only cache 401 errors (expected when not logged in)
      if (error.response?.status === 401) {
        authCheckCache = {
          timestamp: Date.now(),
          result,
          subscribers: new Set()
        };
      } else {
        // For other errors, don't cache
        console.error('Auth check error:', error);
      }
      
      // Notify all subscribers
      authCheckCache.subscribers.forEach(callback => callback(result));
      
      return result;
    } finally {
      authCheckPromise = null;
    }
  })();
  
  return authCheckPromise;
};

export const useAuth = () => {
  // No token state needed - cookie is handled by browser
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasCheckedRef = useRef(false);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use shared auth check to prevent duplicate calls
      const result = await performAuthCheck();
      
      setIsAuthenticated(result.isAuthenticated);
      setUser(result.user);
      
      return result.user;
    } catch (error) {
      console.error('Unexpected error in checkAuth:', error);
      setIsAuthenticated(false);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to auth changes
  useEffect(() => {
    const updateState = (result) => {
      setIsAuthenticated(result.isAuthenticated);
      setUser(result.user);
      setLoading(false);
    };
    
    // Subscribe to cache updates
    authCheckCache.subscribers.add(updateState);
    
    // Check auth on mount (only once per component instance)
    if (!hasCheckedRef.current) {
      hasCheckedRef.current = true;
      checkAuth();
    }
    
    // Check if we have cached data
    if (authCheckCache.result !== null) {
      updateState(authCheckCache.result);
    }
    
    return () => {
      authCheckCache.subscribers.delete(updateState);
    };
  }, [checkAuth]);

  const login = useCallback(async (emailParam, passwordParam) => {
    // Validate parameters before proceeding
    if (!emailParam || !passwordParam) {
      throw new Error('Email and password are required');
    }
    
    try {
      setLoading(true);
      
      // Trim and validate email immediately
      const emailToSend = String(emailParam).trim();
      const passwordToSend = String(passwordParam);
      
      if (!emailToSend) {
        throw new Error('Email cannot be empty');
      }
      
      // Create payload object with captured values
      const loginPayload = {
        email: emailToSend,
        password: passwordToSend
      };
      
      // Make login request - cookie is set automatically by backend
      const response = await authApi.post('/auth/login', loginPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = {
        isAuthenticated: true,
        user: response.data.user
      };
      
      // Update cache with new auth state
      authCheckCache = {
        timestamp: Date.now(),
        result,
        subscribers: new Set()
      };
      
      // Notify all subscribers
      authCheckCache.subscribers.forEach(callback => callback(result));
      
      setIsAuthenticated(true);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      // Make logout request - cookie is cleared by backend
      await authApi.post('/auth/logout', {});
      
      const result = {
        isAuthenticated: false,
        user: null
      };
      
      // Clear cache
      authCheckCache = {
        timestamp: Date.now(),
        result,
        subscribers: new Set()
      };
      
      // Notify all subscribers
      authCheckCache.subscribers.forEach(callback => callback(result));
      
      // Clear local state
      setIsAuthenticated(false);
      setUser(null);
      
      // Clear any sessionStorage data (if any exists)
      if (typeof window !== 'undefined' && window.sessionStorage) {
        try {
          // Only clear auth-related data, not all sessionStorage
          window.sessionStorage.removeItem('token'); // Legacy cleanup
          window.sessionStorage.removeItem('user'); // User data if stored
          window.sessionStorage.removeItem('authToken'); // Just in case
        } catch (error) {
          console.warn('Error clearing sessionStorage:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      const result = {
        isAuthenticated: false,
        user: null
      };
      
      // Clear cache even on error
      authCheckCache = {
        timestamp: Date.now(),
        result,
        subscribers: new Set()
      };
      
      // Notify all subscribers
      authCheckCache.subscribers.forEach(callback => callback(result));
      
      // Even if request fails, clear local state
      setIsAuthenticated(false);
      setUser(null);
      
      // Still try to clear sessionStorage even on error
      if (typeof window !== 'undefined' && window.sessionStorage) {
        try {
          window.sessionStorage.removeItem('token');
          window.sessionStorage.removeItem('user');
          window.sessionStorage.removeItem('authToken');
        } catch (e) {
          // Ignore errors
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth
  };
};
