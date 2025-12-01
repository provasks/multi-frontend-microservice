import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

/**
 * Custom hook for API calls with caching and error handling
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @param {boolean} enableCache - Whether to enable caching (default: true)
 * @param {number} cacheTimeout - Cache timeout in milliseconds (default: 5 minutes)
 */
export const useApi = (url, options = {}, enableCache = true, cacheTimeout = 300000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map());

  const getCachedData = useCallback((key) => {
    if (!enableCache) return null;
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.timestamp < cacheTimeout) {
      return cached.data;
    }
    return null;
  }, [enableCache, cacheTimeout]);

  const setCachedData = useCallback((key, data) => {
    if (!enableCache) return;
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now()
    });
  }, [enableCache]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check cache first
      const cacheKey = `${url}-${JSON.stringify(options)}`;
      const cachedData = getCachedData(cacheKey);
      
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }
      
      const response = await axios({
        url,
        withCredentials: true,  // CRITICAL: Send cookies with requests
        headers: {
          'Content-Type': 'application/json'
        },
        ...options
      });
      
      const result = response.data;
      setData(result);
      setCachedData(cacheKey, result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, (() => {
    try {
      return JSON.stringify(options);
    } catch (error) {
      // Handle circular references by returning a stable string
      return 'circular-reference';
    }
  })(), getCachedData, setCachedData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return { 
    data, 
    loading, 
    error, 
    refetch, 
    clearCache 
  };
};

/**
 * Custom hook for API mutations (POST, PUT, DELETE)
 * @param {string} url - API endpoint URL
 * @param {object} defaultOptions - Default fetch options
 */
export const useApiMutation = (url, defaultOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (data, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios({
        url,
        method: 'POST',
        withCredentials: true,  // CRITICAL: Send cookies with requests
        headers: {
          'Content-Type': 'application/json'
        },
        data,
        ...defaultOptions,
        ...options
      });
      
      const result = response.data;
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, defaultOptions]);

  return { 
    mutate, 
    loading, 
    error 
  };
};
