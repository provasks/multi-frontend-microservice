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
    // Always allow requests - rate limiting disabled
    setIsRateLimited(false);
    setRemainingRequests(maxRequests);
    setTimeUntilReset(0);
    return true;
  }, [maxRequests]);

  const recordRequest = useCallback(() => {
    rateLimiterRef.current.recordRequest();
    checkRateLimit();
  }, [checkRateLimit]);

  const makeRateLimitedRequest = useCallback(async (requestFn) => {
    // Rate limiting disabled - always execute request
    return await requestFn();
  }, []);

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
    // Always allow requests - rate limiting disabled
    setIsRateLimited(false);
    setRemainingRequests(globalRateLimiter.maxRequests);
    setTimeUntilReset(0);
    return true;
  }, []);

  const recordRequest = useCallback(() => {
    globalRateLimiter.recordRequest();
    checkRateLimit();
  }, [checkRateLimit]);

  const makeRateLimitedRequest = useCallback(async (requestFn) => {
    // Rate limiting disabled - always execute request
    return await requestFn();
  }, []);

  return {
    isRateLimited,
    remainingRequests,
    timeUntilReset,
    checkRateLimit,
    recordRequest,
    makeRateLimitedRequest
  };
};
