import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import LoginForm from './components/LoginForm';
import AuthenticatedApp from './components/AuthenticatedApp';
import FloatingMessageManager from './components/FloatingMessageManager';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import idle timeout components
let IdleTimeoutWarning, IdleTimeoutConfig, IdleTimeoutDebug;
try {
  IdleTimeoutWarning = require('sharedComponents/IdleTimeoutWarning').default;
  IdleTimeoutConfig = require('sharedComponents/IdleTimeoutConfig').default;
  IdleTimeoutDebug = require('sharedComponents/IdleTimeoutDebug').default;
  // Idle timeout components loaded successfully
} catch (error) {
  console.warn('Idle timeout components not available:', error.message);
}
// import PerformanceMonitor from 'sharedComponents/PerformanceMonitor';
// import { useGlobalErrorHandler } from 'sharedComponents/useGlobalErrorHandler';

// Import Redux store from shared components
let store, ReduxHooks;
try {
  const ReduxStore = require('sharedComponents/ReduxStore');
  store = ReduxStore.store;
  ReduxHooks = require('sharedComponents/ReduxHooks');
  // Redux store and hooks loaded successfully
} catch (error) {
  console.warn('Redux store not available, falling back to local state management:', error.message);
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Global error handling for non-React errors (network, async, etc.)
  useEffect(() => {
    // Setting up global error handlers
    
    // Handle idle timeout logout messages
    const handleIdleTimeoutLogout = (event) => {
      if (event.data && event.data.type === 'IDLE_TIMEOUT_LOGOUT') {
        // Idle timeout logout message received
        handleLogout();
      }
    };
    
    // Add message listener for idle timeout
    window.addEventListener('message', handleIdleTimeoutLogout);
    
    const handleGlobalError = (event) => {
      // Global error handler triggered
      
      // Check if this is a React component error - let ErrorBoundary handle it
      if (event.error && event.error.message && event.error.message.includes('Component Error')) {
        // Ignoring React component error - ErrorBoundary should handle this
        return; // Don't interfere with ErrorBoundary
      }
      
      // Don't handle login form errors - let the form handle them
      if (event.error && event.error.message && event.error.message.includes('Login')) {
        // Ignoring login form error - form should handle this
        return;
      }
      
      // Handle other types of errors
      let userMessage = 'An unexpected error occurred. Please try again.';
      
      if (event.error) {
        if (event.error.name === 'ChunkLoadError') {
          userMessage = 'Failed to load application resources. Please refresh the page.';
        } else if (event.error.message && event.error.message.includes('fetch')) {
          if (!navigator.onLine) {
            userMessage = 'No internet connection. Please check your network.';
          } else {
            userMessage = 'Server is not responding. Please try again later.';
          }
        } else if (event.error.message && event.error.message.includes('Unauthorized')) {
          userMessage = 'Your session has expired. Please log in again.';
        }
      }
      
      if (window.showError) {
        window.showError(userMessage);
      }
    };

    const handleUnhandledRejection = (event) => {
      // Unhandled rejection handler triggered
      
      // Don't handle login form rejections - let the form handle them
      if (event.reason && event.reason.message && event.reason.message.includes('Login')) {
        // Ignoring login form rejection - form should handle this
        return;
      }
      
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
      
      if (window.showError) {
        window.showError(userMessage);
      }
      
      event.preventDefault();
    };

    // Add event listeners
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Network status listeners
    window.addEventListener('online', () => {
      // Network: Online
      if (window.showSuccess) {
        window.showSuccess('Connection restored!');
      }
    });

    window.addEventListener('offline', () => {
      // Network: Offline
      if (window.showError) {
        window.showError('No internet connection. Please check your network.');
      }
    });

    // Global error handlers set up successfully

    return () => {
      // Cleaning up global error handlers
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('online', () => {});
      window.removeEventListener('offline', () => {});
      window.removeEventListener('message', handleIdleTimeoutLogout);
    };
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token) => {
    // Store token in sessionStorage only for consistency and security
    sessionStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Clear token from sessionStorage only
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Render with Redux Provider if available
  const AppContent = () => (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <FloatingMessageManager />
        {/* <PerformanceMonitor enabled={process.env.NODE_ENV === 'development'} /> */}
        
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <LoginForm onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/*" 
            element={
              isAuthenticated ? 
                <AuthenticatedApp onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );

  // Idle Timeout Components - only show when authenticated and Redux is available
  const IdleTimeoutComponents = () => {
    if (!isAuthenticated || !IdleTimeoutWarning || !IdleTimeoutConfig) return null;
    
    return (
      <>
        <IdleTimeoutWarning />
        <IdleTimeoutConfig />
        {IdleTimeoutDebug && <IdleTimeoutDebug />}
      </>
    );
  };

  // Wrap with Redux Provider if store is available
  if (store) {
    return (
      <Provider store={store}>
        <AppContent />
        <IdleTimeoutComponents />
      </Provider>
    );
  }

  // Fallback to regular app without Redux
  return <AppContent />;
};

export default App;
