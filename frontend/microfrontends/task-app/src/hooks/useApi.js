import { useState, useEffect, useCallback } from 'react';
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
  const [cache, setCache] = useState(new Map());

  const getCachedData = useCallback((key) => {
    if (!enableCache) return null;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < cacheTimeout) {
      return cached.data;
    }
    return null;
  }, [cache, enableCache, cacheTimeout]);

  const setCachedData = useCallback((key, data) => {
    if (!enableCache) return;
    setCache(prev => new Map(prev).set(key, {
      data,
      timestamp: Date.now()
    }));
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
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
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
  }, [url, options, getCachedData, setCachedData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const clearCache = useCallback(() => {
    setCache(new Map());
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
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
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
