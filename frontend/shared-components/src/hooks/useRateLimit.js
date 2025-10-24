import { useState, useCallback, useRef } from 'react';
import { globalRateLimiter } from '../utils/security';

/**
 * Custom hook for rate limiting API requests
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {object} Rate limiting utilities
 */
export const useRateLimit = (maxRequests = 5, windowMs = 60000) => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(maxRequests);
  const [timeUntilReset, setTimeUntilReset] = useState(0);
  const rateLimiterRef = useRef(new globalRateLimiter.constructor(maxRequests, windowMs));

  const checkRateLimit = useCallback(() => {
    const canMakeRequest = rateLimiterRef.current.canMakeRequest();
    const remaining = rateLimiterRef.current.getRemainingRequests();
    const timeUntilReset = rateLimiterRef.current.getTimeUntilReset();
    
    setIsRateLimited(!canMakeRequest);
    setRemainingRequests(remaining);
    setTimeUntilReset(timeUntilReset);
    
    return canMakeRequest;
  }, []);

  const recordRequest = useCallback(() => {
    rateLimiterRef.current.recordRequest();
    checkRateLimit();
  }, [checkRateLimit]);

  const makeRateLimitedRequest = useCallback(async (requestFn) => {
    if (!checkRateLimit()) {
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(timeUntilReset / 1000)} seconds.`);
    }
    
    try {
      const result = await requestFn();
      recordRequest();
      return result;
    } catch (error) {
      // Don't record failed requests against rate limit
      throw error;
    }
  }, [checkRateLimit, recordRequest, timeUntilReset]);

  return {
    isRateLimited,
    remainingRequests,
    timeUntilReset,
    checkRateLimit,
    recordRequest,
    makeRateLimitedRequest
  };
};

/**
 * Global rate limiting hook using the global rate limiter
 */
export const useGlobalRateLimit = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(globalRateLimiter.maxRequests);
  const [timeUntilReset, setTimeUntilReset] = useState(0);

  const checkRateLimit = useCallback(() => {
    const canMakeRequest = globalRateLimiter.canMakeRequest();
    const remaining = globalRateLimiter.getRemainingRequests();
    const timeUntilReset = globalRateLimiter.getTimeUntilReset();
    
    setIsRateLimited(!canMakeRequest);
    setRemainingRequests(remaining);
    setTimeUntilReset(timeUntilReset);
    
    return canMakeRequest;
  }, []);

  const recordRequest = useCallback(() => {
    globalRateLimiter.recordRequest();
    checkRateLimit();
  }, [checkRateLimit]);

  const makeRateLimitedRequest = useCallback(async (requestFn) => {
    if (!checkRateLimit()) {
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(timeUntilReset / 1000)} seconds.`);
    }
    
    try {
      const result = await requestFn();
      recordRequest();
      return result;
    } catch (error) {
      // Don't record failed requests against rate limit
      throw error;
    }
  }, [checkRateLimit, recordRequest, timeUntilReset]);

  return {
    isRateLimited,
    remainingRequests,
    timeUntilReset,
    checkRateLimit,
    recordRequest,
    makeRateLimitedRequest
  };
};
