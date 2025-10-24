import React from 'react';
import axios from 'axios';

// Simple component that throws an error for testing Error Boundary
const ErrorComponent = () => {
  console.log('🧪 ErrorComponent render called - about to throw an error...');
  throw new Error('Component Error: This is a test error from a React component');
};

const ErrorTesting = () => {
  const testGlobalErrorHandler = () => {
    console.log('Testing if global error handler is working...');
    console.log('window.showError available:', typeof window.showError);
    console.log('window.showSuccess available:', typeof window.showSuccess);
    
    if (window.showError) {
      window.showError('Global error handler is working! This is a test message.');
    } else {
      alert('Global error handler not available!');
    }
  };

  const testErrorHandlerSetup = () => {
    console.log('Testing error handler setup...');
    console.log('Error listeners count:', window.addEventListener.toString().includes('error'));
    
    // Test if we can manually trigger an error event using a simpler approach
    try {
      // Create a simple error and throw it in a setTimeout to test the global handler
      setTimeout(() => {
        console.log('Throwing test error for handler verification...');
        throw new Error('Test error for handler verification');
      }, 100);
      console.log('Test error scheduled successfully');
    } catch (e) {
      console.error('Error scheduling test error:', e);
    }
  };

  const testSimpleError = () => {
    console.log('Testing simple error...');
    console.log('🌐 Global error handler available:', typeof window.showError);
    
    // Test if global error handler is working by showing a message first
    if (window.showError) {
      window.showError('Testing global error handler - this should work!');
    }
    
    // This should be caught by the global error handler
    setTimeout(() => {
      console.log('About to throw simple error...');
      console.log('🌐 Throwing error in setTimeout - should be caught by global handler');
      throw new Error('Simple test error');
    }, 200);
  };

  const testErrorHandlerStatus = () => {
    console.log('🔍 Testing error handler status...');
    console.log('window.showError available:', typeof window.showError);
    console.log('window.showSuccess available:', typeof window.showSuccess);
    
    // Check if error handlers are set up by looking at the event listeners
    console.log('Checking if error handlers are set up...');
    
    // Test if we can show a message
    if (window.showError) {
      console.log('✅ Calling window.showError...');
      window.showError('Error handler status test - this should work!');
      console.log('✅ window.showError called successfully');
    } else {
      console.error('❌ window.showError is not available!');
    }
    
    // Also test other message types
    if (window.showSuccess) {
      console.log('✅ Calling window.showSuccess...');
      window.showSuccess('Success message test!');
    }
    
    if (window.showWarning) {
      console.log('✅ Calling window.showWarning...');
      window.showWarning('Warning message test!');
    }
    
    if (window.showInfo) {
      console.log('✅ Calling window.showInfo...');
      window.showInfo('Info message test!');
    }
  };

  const testDirectErrorBoundary = () => {
    console.log('🧪 Testing direct ErrorBoundary...');
    console.log('🧪 Global error handler completely disabled - only ErrorBoundary should handle this');
    console.log('🧪 About to trigger ErrorComponent...');
    setShowErrorComponent(true);
  };

  const testDirectError = () => {
    console.log('🌐 Testing global error handler...');
    console.log('🌐 This should be caught by global error handler');
    // This should be caught by the global error handler
    setTimeout(() => {
      console.log('About to throw direct error...');
      throw new Error('Direct test error from setTimeout');
    }, 500);
  };

  const testManualError = () => {
    console.log('Testing manual error dispatch...');
    // Manually dispatch an error event
    const errorEvent = new ErrorEvent('error', {
      message: 'Manual test error',
      filename: 'test.js',
      lineno: 1,
      colno: 1,
      error: new Error('Manual test error from button click')
    });
    window.dispatchEvent(errorEvent);
  };

  const testDirectGlobalError = () => {
    console.log('🌐 Testing direct global error...');
    console.log('🌐 This should definitely be caught by global error handler');
    
    // Test the global error handler directly
    if (window.showError) {
      window.showError('Direct global error test - this should work!');
    }
    
    // Create an error and throw it directly (not in setTimeout)
    console.log('🌐 About to throw direct error...');
    throw new Error('Direct global error test');
  };

  const [showErrorComponent, setShowErrorComponent] = React.useState(false);
  const [errorBoundaryKey, setErrorBoundaryKey] = React.useState(0);

  const triggerComponentError = () => {
    console.log('🧪 Triggering component error...');
    console.log('🧪 Current showErrorComponent state:', showErrorComponent);
    console.log('🧪 About to set showErrorComponent to true...');
    
    // Reset error state first
    setErrorBoundaryKey(prev => prev + 1);
    
    // This will be caught by Error Boundary
    setShowErrorComponent(true);
    console.log('🧪 showErrorComponent set to true');
  };

  const resetErrorComponent = () => {
    console.log('Resetting error component...');
    setShowErrorComponent(false);
    setErrorBoundaryKey(prev => prev + 1); // Force re-render of ErrorBoundary
  };

  const triggerAsyncError = () => {
    // This will be caught by Global Error Handler
    console.log('🌐 Testing async error...');
    console.log('🌐 This should be caught by global error handler');
    setTimeout(() => {
      console.log('Throwing async error...');
      throw new Error('Async Error: This is a test error from an async operation');
    }, 1000);
  };

  const triggerPromiseRejection = () => {
    // This will be caught by Global Error Handler
    console.log('🌐 Testing promise rejection...');
    console.log('🌐 This should be caught by global error handler');
    // Create a promise that rejects without a catch handler
    const promise = Promise.reject(new Error('Promise Rejection: This is a test unhandled promise rejection'));
    // Don't add .catch() to make it truly unhandled
    console.log('Promise created, it will reject and be caught by global handler');
  };

  const triggerNetworkError = () => {
    // This will be caught by Global Error Handler
    console.log('🌐 Testing network error...');
    console.log('🌐 This should be caught by global error handler');
    axios.get('http://nonexistent-url-that-will-fail.com/api/test')
      .then(response => {
        console.log('Response:', response.data);
      })
      .catch(error => {
        // This catch block handles it, but if it didn't exist, Global Error Handler would catch it
        console.error('Network error:', error);
        if (window.showError) {
          window.showError('Network error: ' + error.message);
        }
      });
  };

  const triggerChunkLoadError = () => {
    // Simulate a chunk load error - use setTimeout to avoid black screen
    console.log('Triggering chunk load error...');
    setTimeout(() => {
      console.log('Throwing chunk load error...');
      const error = new Error('Loading chunk failed');
      error.name = 'ChunkLoadError';
      throw error;
    }, 100);
  };

  const triggerAuthError = () => {
    // Simulate an authentication error - use setTimeout to avoid black screen
    console.log('Triggering auth error...');
    setTimeout(() => {
      console.log('Throwing auth error...');
      const error = new Error('Unauthorized');
      error.name = 'AuthError';
      throw error;
    }, 100);
  };

  // Clean ErrorBoundary implementation from scratch
  class CleanErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      console.log('✅ CleanErrorBoundary caught error:', error);
      console.log('✅ ErrorBoundary is working - should show green box');
    }

    render() {
      console.log('🧪 CleanErrorBoundary render called, hasError:', this.state.hasError);
      
      if (this.state.hasError) {
        console.log('✅ CleanErrorBoundary rendering error state - green box should appear');
        return (
          <div className="alert alert-success">
            <h6>✅ ErrorBoundary Working!</h6>
            <p>Error was caught successfully!</p>
            <button 
              className="btn btn-sm btn-success"
              onClick={() => this.setState({ hasError: false })}
            >
              Reset
            </button>
          </div>
        );
      }

      console.log('🧪 CleanErrorBoundary rendering children');
      return this.props.children;
    }
  }

  console.log('🧪 ErrorTesting render called, showErrorComponent:', showErrorComponent, 'errorBoundaryKey:', errorBoundaryKey);

  return (
    <div className="container mt-4">
      {/* Error Component for testing with clean ErrorBoundary */}
      <CleanErrorBoundary>
        {showErrorComponent && <ErrorComponent />}
      </CleanErrorBoundary>
      
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-bug me-2"></i>
                Error Handling Test Panel
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-4">
                Click the buttons below to test different error handling scenarios.
                Each button triggers a different type of error to verify our error handling system.
              </p>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="card border-danger">
                    <div className="card-header bg-danger text-white">
                      <h6 className="mb-0">Error Boundary Tests</h6>
                    </div>
                    <div className="card-body">
                      <button 
                        className="btn btn-outline-danger btn-sm me-2 mb-2"
                        onClick={triggerComponentError}
                      >
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        Component Error
                      </button>
                      <button 
                        className="btn btn-outline-secondary btn-sm me-2 mb-2"
                        onClick={resetErrorComponent}
                      >
                        <i className="fas fa-undo me-1"></i>
                        Reset
                      </button>
                      <small className="text-muted d-block">
                        Tests Error Boundary - should show retry options
                      </small>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="card border-warning">
                    <div className="card-header bg-warning text-dark">
                      <h6 className="mb-0">Global Error Handler Tests</h6>
                    </div>
                    <div className="card-body">
                      <button 
                        className="btn btn-outline-info btn-sm me-2 mb-2"
                        onClick={testGlobalErrorHandler}
                      >
                        <i className="fas fa-check me-1"></i>
                        Test Global Handler
                      </button>
                      <button 
                        className="btn btn-outline-info btn-sm me-2 mb-2"
                        onClick={testErrorHandlerSetup}
                      >
                        <i className="fas fa-cog me-1"></i>
                        Test Handler Setup
                      </button>
                      <button 
                        className="btn btn-outline-info btn-sm me-2 mb-2"
                        onClick={testSimpleError}
                      >
                        <i className="fas fa-exclamation-circle me-1"></i>
                        Test Simple Error
                      </button>
                      <button 
                        className="btn btn-outline-info btn-sm me-2 mb-2"
                        onClick={testErrorHandlerStatus}
                      >
                        <i className="fas fa-info-circle me-1"></i>
                        Test Handler Status
                      </button>
                      <button 
                        className="btn btn-outline-info btn-sm me-2 mb-2"
                        onClick={testDirectErrorBoundary}
                      >
                        <i className="fas fa-shield-alt me-1"></i>
                        Test Direct ErrorBoundary
                      </button>
                      <button 
                        className="btn btn-outline-info btn-sm me-2 mb-2"
                        onClick={testDirectError}
                      >
                        <i className="fas fa-bug me-1"></i>
                        Test Direct Error
                      </button>
                      <button 
                        className="btn btn-outline-info btn-sm me-2 mb-2"
                        onClick={testManualError}
                      >
                        <i className="fas fa-hand-pointer me-1"></i>
                        Test Manual Error
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm me-2 mb-2"
                        onClick={testDirectGlobalError}
                      >
                        <i className="fas fa-bolt me-1"></i>
                        Test Direct Global Error
                      </button>
                      <button 
                        className="btn btn-outline-warning btn-sm me-2 mb-2"
                        onClick={triggerAsyncError}
                      >
                        <i className="fas fa-clock me-1"></i>
                        Async Error
                      </button>
                      <button 
                        className="btn btn-outline-warning btn-sm me-2 mb-2"
                        onClick={triggerPromiseRejection}
                      >
                        <i className="fas fa-times-circle me-1"></i>
                        Promise Rejection
                      </button>
                      <button 
                        className="btn btn-outline-warning btn-sm me-2 mb-2"
                        onClick={triggerNetworkError}
                      >
                        <i className="fas fa-wifi me-1"></i>
                        Network Error
                      </button>
                      <button 
                        className="btn btn-outline-warning btn-sm me-2 mb-2"
                        onClick={triggerChunkLoadError}
                      >
                        <i className="fas fa-file-code me-1"></i>
                        Chunk Load Error
                      </button>
                      <button 
                        className="btn btn-outline-warning btn-sm me-2 mb-2"
                        onClick={triggerAuthError}
                      >
                        <i className="fas fa-lock me-1"></i>
                        Auth Error
                      </button>
                      <small className="text-muted d-block">
                        Tests Global Error Handler - should show floating messages
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="alert alert-info">
                <h6><i className="fas fa-info-circle me-2"></i>Testing Instructions:</h6>
                <ol className="mb-0">
                  <li><strong>Component Error:</strong> Should trigger Error Boundary with retry options</li>
                  <li><strong>Async Error:</strong> Should show floating error message after 1 second</li>
                  <li><strong>Promise Rejection:</strong> Should show floating error message immediately</li>
                  <li><strong>Network Error:</strong> Should show network error message</li>
                  <li><strong>Chunk Load Error:</strong> Should show resource loading error message</li>
                  <li><strong>Auth Error:</strong> Should show authentication error message</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorTesting;
