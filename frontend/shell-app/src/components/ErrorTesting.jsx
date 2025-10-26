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
    } catch (error) {
      console.log('Caught error in try-catch:', error);
    }
    
    // Also test with a promise rejection
    Promise.reject(new Error('Promise rejection test')).catch(error => {
      console.log('Promise rejection caught:', error);
    });
    
    // Test direct error throwing (should be caught by global handler)
    setTimeout(() => {
      console.log('Testing direct error throw...');
      throw new Error('Direct error test');
    }, 150);
  };

  const testSimpleError = () => {
    console.log('Testing simple error...');
    console.log('🌐 Global error handler available:', typeof window.onerror);
    
    // Test with a simple setTimeout error
    setTimeout(() => {
      console.log('About to throw simple error...');
      console.log('🌐 Throwing error in setTimeout - should be caught by global handler');
      throw new Error('Simple test error');
    }, 200);
  };

  const testDirectError = () => {
    console.log('🌐 Testing global error handler...');
    console.log('🌐 This should be caught by global error handler');
    
    setTimeout(() => {
      console.log('About to throw direct error...');
      throw new Error('Direct test error from setTimeout');
    }, 300);
  };

  const testManualErrorDispatch = () => {
    console.log('Testing manual error dispatch...');
    
    // Try to manually dispatch an error event
    try {
      const errorEvent = new ErrorEvent('error', {
        message: 'Manual error event',
        filename: 'ErrorTesting.jsx',
        lineno: 1,
        colno: 1,
        error: new Error('Manual error event')
      });
      
      window.dispatchEvent(errorEvent);
      console.log('Error event dispatched successfully');
    } catch (error) {
      console.log('Error dispatching error event:', error);
    }
    
    // Also test with a custom event
    try {
      const customErrorEvent = new CustomEvent('customError', {
        detail: { error: new Error('Custom error event') }
      });
      window.dispatchEvent(customErrorEvent);
      console.log('Custom error event dispatched');
    } catch (error) {
      console.log('Error dispatching custom error event:', error);
    }
  };

  const testChunkLoadError = () => {
    console.log('Triggering chunk load error...');
    console.log('Throwing chunk load error...');
    console.log('window.showError available:', typeof window.showError);
    
    // First try to show a custom message
    if (window.showError) {
      window.showError('Chunk Load Error: Failed to load application resources. Please refresh the page.');
      console.log('Custom chunk load error message shown');
    } else {
      console.error('window.showError is not available!');
      alert('Chunk Load Error: Failed to load application resources. Please refresh the page.');
    }
    
    // Then throw the error to test global handler
    const chunkError = new Error('Loading chunk failed');
    chunkError.name = 'ChunkLoadError';
    throw chunkError;
  };

  const testAuthError = () => {
    console.log('Triggering auth error...');
    console.log('Throwing auth error...');
    console.log('window.showError available:', typeof window.showError);
    
    // First try to show a custom message
    if (window.showError) {
      window.showError('Authentication Error: Your session has expired. Please log in again.');
      console.log('Custom auth error message shown');
    } else {
      console.error('window.showError is not available!');
      alert('Authentication Error: Your session has expired. Please log in again.');
    }
    
    // Then throw the error to test global handler
    const authError = new Error('Unauthorized');
    authError.name = 'AuthError';
    throw authError;
  };

  const testNetworkError = async () => {
    console.log('Testing network error...');
    console.log('window.showError available:', typeof window.showError);
    
    try {
      // Try to make a request to a non-existent endpoint
      await axios.get('/api/non-existent-endpoint');
    } catch (error) {
      console.log('Network error caught:', error);
      console.log('About to call window.showError with:', `Network Error: ${error.message}`);
      if (window.showError) {
        window.showError(`Network Error: ${error.message}`);
        console.log('window.showError called successfully');
      } else {
        console.error('window.showError is not available!');
        alert(`Network Error: ${error.message}`);
      }
    }
    
    // Also test with a timeout
    try {
      await axios.get('/api/timeout-test', { timeout: 1000 });
    } catch (error) {
      console.log('Timeout error caught:', error);
      console.log('About to call window.showError with:', `Timeout Error: ${error.message}`);
      if (window.showError) {
        window.showError(`Timeout Error: ${error.message}`);
        console.log('window.showError called successfully');
      } else {
        console.error('window.showError is not available!');
        alert(`Timeout Error: ${error.message}`);
      }
    }
  };

  const testValidationError = () => {
    console.log('Testing validation error...');
    
    if (window.showError) {
      window.showError('Validation Error: This is a test validation error message');
    }
  };

  const testSuccessMessage = () => {
    console.log('Testing success message...');
    
    if (window.showSuccess) {
      window.showSuccess('Success! This is a test success message');
    }
  };

  const testAsyncError = async () => {
    console.log('Testing async error...');
    
    try {
      // Simulate an async operation that fails
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Async operation failed'));
        }, 100);
      });
    } catch (error) {
      console.log('Async error caught:', error);
      if (window.showError) {
        window.showError(`Async Error: ${error.message}`);
      }
    }
  };

  const testUnhandledRejection = () => {
    console.log('Testing unhandled promise rejection...');
    
    // Create an unhandled promise rejection
    Promise.reject(new Error('Unhandled promise rejection test'));
  };

  const testTypeError = () => {
    console.log('Testing type error...');
    
    try {
      // This will cause a TypeError
      const obj = null;
      obj.someProperty.nestedProperty;
    } catch (error) {
      console.log('Type error caught:', error);
      if (window.showError) {
        window.showError(`Type Error: ${error.message}`);
      }
    }
  };

  const testReferenceError = () => {
    console.log('Testing reference error...');
    
    try {
      // This will cause a ReferenceError
      console.log(undefinedVariable);
    } catch (error) {
      console.log('Reference error caught:', error);
      if (window.showError) {
        window.showError(`Reference Error: ${error.message}`);
      }
    }
  };

  const testDirectGlobalError = () => {
    console.log('Testing direct global error handler...');
    
    // This should trigger the global error handler directly
    try {
      throw new Error('Direct global error test');
    } catch (error) {
      // Re-throw to trigger global handler
      setTimeout(() => {
        throw error;
      }, 0);
    }
  };

  const testWindowOnError = () => {
    console.log('Testing window.onerror handler...');
    console.log('window.onerror available:', typeof window.onerror);
    
    // This should trigger window.onerror
    setTimeout(() => {
      console.log('Throwing error to test window.onerror...');
      throw new Error('Window.onerror test error');
    }, 100);
  };

  const [showErrorComponent, setShowErrorComponent] = React.useState(false);
  const [errorBoundaryKey, setErrorBoundaryKey] = React.useState(0);
  const [errorHandlersStatus, setErrorHandlersStatus] = React.useState({});

  // Check error handler availability
  React.useEffect(() => {
    setErrorHandlersStatus({
      showError: typeof window.showError === 'function',
      showSuccess: typeof window.showSuccess === 'function',
      onError: typeof window.onerror === 'function',
      addEventListener: typeof window.addEventListener === 'function',
      ErrorEvent: typeof ErrorEvent === 'function',
      CustomEvent: typeof CustomEvent === 'function'
    });
  }, []);

  const triggerErrorComponent = () => {
    console.log('Triggering error component...');
    setShowErrorComponent(true);
  };

  const resetErrorComponent = () => {
    console.log('Resetting error component...');
    setShowErrorComponent(false);
    setErrorBoundaryKey(prev => prev + 1);
  };

  console.log('🧪 ErrorTesting render called, showErrorComponent:', showErrorComponent, 'errorBoundaryKey:', errorBoundaryKey);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center mb-4">
            <div className="me-3">
              <i className="fas fa-bug fa-2x text-danger"></i>
            </div>
            <div>
              <h2 className="mb-1">Error Testing Laboratory</h2>
              <p className="text-muted mb-0">Comprehensive testing suite for error handling mechanisms</p>
            </div>
          </div>
          
          {/* Status Overview Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-gradient bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Error Handler Status
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary mb-3">
                    <i className="fas fa-globe me-2"></i>Global Handlers
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-medium">showError</span>
                      <span className={`badge ${errorHandlersStatus.showError ? 'bg-success' : 'bg-danger'}`}>
                        {errorHandlersStatus.showError ? 'Available' : 'Missing'}
                      </span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-medium">showSuccess</span>
                      <span className={`badge ${errorHandlersStatus.showSuccess ? 'bg-success' : 'bg-danger'}`}>
                        {errorHandlersStatus.showSuccess ? 'Available' : 'Missing'}
                      </span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-medium">onError</span>
                      <span className={`badge ${errorHandlersStatus.onError ? 'bg-success' : 'bg-danger'}`}>
                        {errorHandlersStatus.onError ? 'Available' : 'Missing'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <h6 className="text-primary mb-3">
                    <i className="fas fa-cogs me-2"></i>Event System
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-medium">addEventListener</span>
                      <span className={`badge ${errorHandlersStatus.addEventListener ? 'bg-success' : 'bg-danger'}`}>
                        {errorHandlersStatus.addEventListener ? 'Available' : 'Missing'}
                      </span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-medium">ErrorEvent</span>
                      <span className={`badge ${errorHandlersStatus.ErrorEvent ? 'bg-success' : 'bg-danger'}`}>
                        {errorHandlersStatus.ErrorEvent ? 'Available' : 'Missing'}
                      </span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-medium">CustomEvent</span>
                      <span className={`badge ${errorHandlersStatus.CustomEvent ? 'bg-success' : 'bg-danger'}`}>
                        {errorHandlersStatus.CustomEvent ? 'Available' : 'Missing'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Error Testing Sections */}
          <div className="row">
            {/* Global Error Handler Tests */}
            <div className="col-lg-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-gradient bg-info text-white">
                  <h6 className="mb-0">
                    <i className="fas fa-globe me-2"></i>
                    Global Error Handler Tests
                  </h6>
                </div>
                <div className="card-body">
                  <p className="text-muted small mb-3">Test global error handling mechanisms and event listeners</p>
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-primary" 
                      onClick={testGlobalErrorHandler}
                    >
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Test Global Error Handler
                    </button>
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={testErrorHandlerSetup}
                    >
                      <i className="fas fa-cog me-2"></i>
                      Test Error Handler Setup
                    </button>
                    <button 
                      className="btn btn-outline-warning" 
                      onClick={testSimpleError}
                    >
                      <i className="fas fa-bolt me-2"></i>
                      Test Simple Error
                    </button>
                    <button 
                      className="btn btn-outline-info" 
                      onClick={testDirectError}
                    >
                      <i className="fas fa-bullseye me-2"></i>
                      Test Direct Error
                    </button>
                    <button 
                      className="btn btn-outline-dark" 
                      onClick={testManualErrorDispatch}
                    >
                      <i className="fas fa-hand-paper me-2"></i>
                      Test Manual Error Dispatch
                    </button>
                    <button 
                      className="btn btn-outline-primary" 
                      onClick={testDirectGlobalError}
                    >
                      <i className="fas fa-bullseye me-2"></i>
                      Test Direct Global Error
                    </button>
                    <button 
                      className="btn btn-outline-success" 
                      onClick={testWindowOnError}
                    >
                      <i className="fas fa-window-maximize me-2"></i>
                      Test Window.onerror
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Specific Error Types */}
            <div className="col-lg-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-gradient bg-warning text-dark">
                  <h6 className="mb-0">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    Specific Error Types
                  </h6>
                </div>
                <div className="card-body">
                  <p className="text-muted small mb-3">Test specific error scenarios and application errors</p>
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-danger" 
                      onClick={testChunkLoadError}
                    >
                      <i className="fas fa-cube me-2"></i>
                      Test Chunk Load Error
                    </button>
                    <button 
                      className="btn btn-outline-danger" 
                      onClick={testAuthError}
                    >
                      <i className="fas fa-lock me-2"></i>
                      Test Auth Error
                    </button>
                    <button 
                      className="btn btn-outline-warning" 
                      onClick={testNetworkError}
                    >
                      <i className="fas fa-wifi me-2"></i>
                      Test Network Error
                    </button>
                    <button 
                      className="btn btn-outline-warning" 
                      onClick={testValidationError}
                    >
                      <i className="fas fa-check-circle me-2"></i>
                      Test Validation Error
                    </button>
                    <button 
                      className="btn btn-outline-success" 
                      onClick={testSuccessMessage}
                    >
                      <i className="fas fa-check me-2"></i>
                      Test Success Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* JavaScript Error Types and React Error Boundary */}
          <div className="row">
            {/* JavaScript Error Types */}
            <div className="col-lg-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-gradient bg-danger text-white">
                  <h6 className="mb-0">
                    <i className="fab fa-js-square me-2"></i>
                    JavaScript Error Types
                  </h6>
                </div>
                <div className="card-body">
                  <p className="text-muted small mb-3">Test native JavaScript error types and async operations</p>
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-warning" 
                      onClick={testTypeError}
                    >
                      <i className="fas fa-exclamation me-2"></i>
                      Test TypeError
                    </button>
                    <button 
                      className="btn btn-outline-warning" 
                      onClick={testReferenceError}
                    >
                      <i className="fas fa-question-circle me-2"></i>
                      Test ReferenceError
                    </button>
                    <button 
                      className="btn btn-outline-info" 
                      onClick={testAsyncError}
                    >
                      <i className="fas fa-clock me-2"></i>
                      Test Async Error
                    </button>
                    <button 
                      className="btn btn-outline-danger" 
                      onClick={testUnhandledRejection}
                    >
                      <i className="fas fa-times-circle me-2"></i>
                      Test Unhandled Rejection
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* React Error Boundary Tests */}
            <div className="col-lg-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-gradient bg-secondary text-white">
                  <h6 className="mb-0">
                    <i className="fab fa-react me-2"></i>
                    React Error Boundary Tests
                  </h6>
                </div>
                <div className="card-body">
                  <p className="text-muted small mb-3">Test React Error Boundary and component error handling</p>
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-danger" 
                      onClick={triggerErrorComponent}
                    >
                      <i className="fas fa-play me-2"></i>
                      Trigger Error Component
                    </button>
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={resetErrorComponent}
                    >
                      <i className="fas fa-undo me-2"></i>
                      Reset Error Component
                    </button>
                  </div>
                  
                  {showErrorComponent && (
                    <div className="mt-3">
                      <div className="alert alert-warning border-0">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          <div>
                            <strong>Error Component Below:</strong><br/>
                            <small>This will throw an error and test the Error Boundary.</small>
                          </div>
                        </div>
                      </div>
                      <div className="border rounded p-3 bg-light">
                        <ErrorComponent key={errorBoundaryKey} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Information */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card border-0 bg-light">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-2">
                    <i className="fas fa-info-circle me-2"></i>
                    Error Testing Information
                  </h6>
                  <p className="text-muted small mb-0">
                    This testing suite helps verify that all error handling mechanisms are working correctly. 
                    Check the browser console for detailed error logs and ensure error notifications appear as expected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorTesting;
