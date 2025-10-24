import { useEffect, useCallback } from 'react';

export const useGlobalErrorHandler = () => {
  const handleError = useCallback((error, errorInfo = {}) => {
    console.error('Global Error Handler triggered:', error);
    console.error('Error Info:', errorInfo);
    
    // Determine error type and show appropriate message
    let userMessage = 'An unexpected error occurred. Please try again.';
    
    if (error.name === 'ChunkLoadError') {
      userMessage = 'Failed to load application resources. Please refresh the page.';
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      if (!navigator.onLine) {
        userMessage = 'No internet connection. Please check your network.';
      } else {
        userMessage = 'Server is not responding. Please try again later.';
      }
    } else if (error.name === 'AbortError') {
      userMessage = 'Request was cancelled.';
    } else if (error.message.includes('Unauthorized')) {
      userMessage = 'Your session has expired. Please log in again.';
    } else if (error.message.includes('Network')) {
      userMessage = 'Network error. Please check your connection.';
    }
    
    // Show error message to user
    if (window.showError) {
      window.showError(userMessage);
    }
    
    // Log error for debugging
    console.error('Error Details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...errorInfo
    });
  }, []);

  const handleUnhandledRejection = useCallback((event) => {
    console.error('Global Unhandled Rejection Handler triggered:', event.reason);
    
    let userMessage = 'An unexpected error occurred. Please try again.';
    
    if (event.reason && typeof event.reason === 'object') {
      if (event.reason.name === 'ChunkLoadError') {
        userMessage = 'Failed to load application resources. Please refresh the page.';
      } else if (event.reason.message && event.reason.message.includes('fetch')) {
        if (!navigator.onLine) {
          userMessage = 'No internet connection. Please check your network.';
        } else {
          userMessage = 'Server is not responding. Please try again later.';
        }
      }
    }
    
    // Show error message to user
    if (window.showError) {
      window.showError(userMessage);
    }
    
    // Log error for debugging
    console.error('Promise Rejection Details:', {
      reason: event.reason,
      promise: event.promise,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    
    // Prevent the default browser behavior
    event.preventDefault();
  }, []);

  const handleNetworkStatusChange = useCallback(() => {
    if (navigator.onLine) {
      if (window.showSuccess) {
        window.showSuccess('Connection restored!');
      }
    } else {
      if (window.showError) {
        window.showError('No internet connection. Please check your network.');
      }
    }
  }, []);

  useEffect(() => {
    console.log('Setting up global error handlers...');
    
    // Create the error handler function
    const errorHandler = (event) => {
      console.log('Global error event caught:', event);
      handleError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'global_error'
      });
    };

    // Add global error listeners
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Network status listeners
    window.addEventListener('online', handleNetworkStatusChange);
    window.addEventListener('offline', handleNetworkStatusChange);

    console.log('Global error handlers set up successfully');

    // Cleanup function
    return () => {
      console.log('Cleaning up global error handlers...');
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('online', handleNetworkStatusChange);
      window.removeEventListener('offline', handleNetworkStatusChange);
    };
  }, [handleError, handleUnhandledRejection, handleNetworkStatusChange]);

  return {
    handleError,
    handleUnhandledRejection,
    handleNetworkStatusChange
  };
};
