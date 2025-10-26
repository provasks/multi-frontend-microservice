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
    } catch (error) {
      console.log('Error dispatching error event:', error);
    }
  };

  const testChunkLoadError = () => {
    console.log('Triggering chunk load error...');
    console.log('Throwing chunk load error...');
    
    // Simulate a chunk load error
    const chunkError = new Error('Loading chunk failed');
    chunkError.name = 'ChunkLoadError';
    throw chunkError;
  };

  const testAuthError = () => {
    console.log('Triggering auth error...');
    console.log('Throwing auth error...');
    
    // Simulate an auth error
    const authError = new Error('Unauthorized');
    authError.name = 'AuthError';
    throw authError;
  };

  const testNetworkError = async () => {
    console.log('Testing network error...');
    
    try {
      // Try to make a request to a non-existent endpoint
      await axios.get('/api/non-existent-endpoint');
    } catch (error) {
      console.log('Network error caught:', error);
      if (window.showError) {
        window.showError(`Network Error: ${error.message}`);
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

  const [showErrorComponent, setShowErrorComponent] = React.useState(false);
  const [errorBoundaryKey, setErrorBoundaryKey] = React.useState(0);

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
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2>Error Testing Page</h2>
          <p className="text-muted">Test various error scenarios and error handling mechanisms.</p>
          
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Error Testing Controls</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Global Error Handler Tests</h6>
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-primary" 
                      onClick={testGlobalErrorHandler}
                    >
                      Test Global Error Handler
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      onClick={testErrorHandlerSetup}
                    >
                      Test Error Handler Setup
                    </button>
                    <button 
                      className="btn btn-warning" 
                      onClick={testSimpleError}
                    >
                      Test Simple Error
                    </button>
                    <button 
                      className="btn btn-info" 
                      onClick={testDirectError}
                    >
                      Test Direct Error
                    </button>
                    <button 
                      className="btn btn-dark" 
                      onClick={testManualErrorDispatch}
                    >
                      Test Manual Error Dispatch
                    </button>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <h6>Specific Error Types</h6>
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-danger" 
                      onClick={testChunkLoadError}
                    >
                      Test Chunk Load Error
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={testAuthError}
                    >
                      Test Auth Error
                    </button>
                    <button 
                      className="btn btn-warning" 
                      onClick={testNetworkError}
                    >
                      Test Network Error
                    </button>
                    <button 
                      className="btn btn-warning" 
                      onClick={testValidationError}
                    >
                      Test Validation Error
                    </button>
                    <button 
                      className="btn btn-success" 
                      onClick={testSuccessMessage}
                    >
                      Test Success Message
                    </button>
                  </div>
                </div>
              </div>
              
              <hr />
              
              <div className="row">
                <div className="col-12">
                  <h6>React Error Boundary Tests</h6>
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-danger" 
                      onClick={triggerErrorComponent}
                    >
                      Trigger Error Component
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      onClick={resetErrorComponent}
                    >
                      Reset Error Component
                    </button>
                  </div>
                  
                  {showErrorComponent && (
                    <div className="mt-3">
                      <div className="alert alert-warning">
                        <strong>Error Component Below:</strong> This will throw an error and test the Error Boundary.
                      </div>
                      <ErrorComponent key={errorBoundaryKey} />
                    </div>
                  )}
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
