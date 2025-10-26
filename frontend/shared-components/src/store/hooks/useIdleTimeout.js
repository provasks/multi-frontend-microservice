const { useDispatch, useSelector } = require('react-redux');
const { useEffect, useRef, useCallback } = require('react');
const IdleTimeout = require('../../utils/idleTimeout');
const { performIdleTimeoutLogout } = require('../../utils/logout');

/**
 * Custom hook for idle timeout management
 * Handles automatic logout after user inactivity
 */
const useIdleTimeout = () => {
  const dispatch = useDispatch();
  const idleTimeoutRef = useRef(null);
  
  const {
    isActive,
    isWarning,
    timeRemaining,
    timeout,
    warningTime,
    isEnabled,
    lastActivity
  } = useSelector(state => state.idleTimeout);
  
  // Get auth state to check if user is authenticated
  const { isAuthenticated } = useSelector(state => state.auth || { isAuthenticated: false });

  // Actions
  const setIdleTimeout = useCallback((config) => {
    dispatch({ type: 'idleTimeout/setIdleTimeout', payload: config });
  }, [dispatch]);

  const resetIdleTimeout = useCallback(() => {
    dispatch({ type: 'idleTimeout/resetIdleTimeout' });
  }, [dispatch]);

  const pauseIdleTimeout = useCallback(() => {
    dispatch({ type: 'idleTimeout/pauseIdleTimeout' });
  }, [dispatch]);

  const resumeIdleTimeout = useCallback(() => {
    dispatch({ type: 'idleTimeout/resumeIdleTimeout' });
  }, [dispatch]);

  const disableIdleTimeout = useCallback(() => {
    dispatch({ type: 'idleTimeout/disableIdleTimeout' });
  }, [dispatch]);

  const enableIdleTimeout = useCallback(() => {
    dispatch({ type: 'idleTimeout/enableIdleTimeout' });
  }, [dispatch]);

  // Handle timeout
  const handleTimeout = useCallback(() => {
    // Idle timeout reached - logging out user
    
    // Dispatch logout action first
    dispatch({ type: 'auth/logout' });
    
    // Use the dedicated idle timeout logout function
    performIdleTimeoutLogout();
  }, [dispatch]);

  // Handle warning
  const handleWarning = useCallback(() => {
    // Idle timeout warning - user will be logged out soon
    dispatch({ type: 'idleTimeout/setWarning', payload: true });
  }, [dispatch]);

  // Handle reset
  const handleReset = useCallback(() => {
    // Resetting idle timeout due to user activity
    dispatch({ type: 'idleTimeout/setWarning', payload: false });
    dispatch({ type: 'idleTimeout/updateLastActivity' });
    dispatch({ type: 'idleTimeout/setTimeRemaining', payload: timeout }); // Reset to full timeout
  }, [dispatch, timeout]);

  // Initialize idle timeout
  useEffect(() => {
    // Initializing idle timeout
    
    // Start idle timeout if enabled (even if not authenticated for testing)
    if (!isEnabled) {
      // Idle timeout disabled
      return;
    }

    // Clean up existing timeout
    if (idleTimeoutRef.current) {
      idleTimeoutRef.current.destroy();
    }

    // Create new idle timeout
    idleTimeoutRef.current = new IdleTimeout({
      timeout,
      warningTime,
      onTimeout: handleTimeout,
      onWarning: handleWarning,
      onReset: handleReset
    });

    // Idle timeout initialized

    // Force activate the idle timeout
    dispatch({ type: 'idleTimeout/setActive', payload: true });

    return () => {
      if (idleTimeoutRef.current) {
        idleTimeoutRef.current.destroy();
      }
    };
  }, [timeout, warningTime, isEnabled, isAuthenticated, handleTimeout, handleWarning, handleReset, dispatch]);

  // Update time remaining
  useEffect(() => {
    if (!isActive || !isEnabled) {
      // Time remaining update paused
      return;
    }

    // Starting time remaining update interval
    
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivity;
      const remaining = Math.max(0, timeout - elapsed);
      
      // Time remaining update
      
      dispatch({ type: 'idleTimeout/setTimeRemaining', payload: remaining });
      
      // If time is up, trigger timeout
      if (remaining <= 0) {
        // Time remaining reached zero - triggering timeout
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      // Clearing time remaining update interval
      clearInterval(interval);
    };
  }, [isActive, isEnabled, timeout, lastActivity, dispatch, formatTimeRemaining]);

  // Format time remaining
  const formatTimeRemaining = useCallback((ms) => {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  }, []);

  return {
    // State
    isActive,
    isWarning,
    timeRemaining,
    timeout,
    warningTime,
    isEnabled,
    lastActivity,
    formattedTimeRemaining: formatTimeRemaining(timeRemaining),
    
    // Actions
    setIdleTimeout,
    resetIdleTimeout,
    pauseIdleTimeout,
    resumeIdleTimeout,
    disableIdleTimeout,
    enableIdleTimeout,
    
    // Utilities
    formatTimeRemaining
  };
};

module.exports = useIdleTimeout;
