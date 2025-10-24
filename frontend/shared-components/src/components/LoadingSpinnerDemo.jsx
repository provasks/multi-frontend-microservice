import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingSpinnerDemo = () => {
  return (
    <div style={{ padding: '2rem', background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container">
        <h1 className="mb-4">🎨 Enhanced Loading Spinner Demo</h1>
        
        <div className="row">
          {/* Size Variants */}
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>📏 Size Variants</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <h6>Small</h6>
                  <LoadingSpinner size="small" text="Small spinner" />
                </div>
                <div className="mb-3">
                  <h6>Default</h6>
                  <LoadingSpinner size="default" text="Default spinner" />
                </div>
                <div className="mb-3">
                  <h6>Large</h6>
                  <LoadingSpinner size="large" text="Large spinner" />
                </div>
              </div>
            </div>
          </div>

          {/* Color Variants */}
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>🎨 Color Variants</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <LoadingSpinner variant="primary" text="Primary" />
                </div>
                <div className="mb-3">
                  <LoadingSpinner variant="success" text="Success" />
                </div>
                <div className="mb-3">
                  <LoadingSpinner variant="warning" text="Warning" />
                </div>
                <div className="mb-3">
                  <LoadingSpinner variant="danger" text="Danger" />
                </div>
                <div className="mb-3">
                  <LoadingSpinner variant="info" text="Info" />
                </div>
                <div className="mb-3">
                  <LoadingSpinner variant="secondary" text="Secondary" />
                </div>
              </div>
            </div>
          </div>

          {/* Special Features */}
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>✨ Special Features</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <h6>No Dots</h6>
                  <LoadingSpinner showDots={false} text="Loading without dots" />
                </div>
                <div className="mb-3">
                  <h6>No Text</h6>
                  <LoadingSpinner text="" />
                </div>
                <div className="mb-3">
                  <h6>Custom Message</h6>
                  <LoadingSpinner text="Processing your request..." />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Screen Demo */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5>🖥️ Full Screen Loading</h5>
              </div>
              <div className="card-body">
                <p>Click the button below to see the full-screen loading overlay:</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    const spinner = document.createElement('div');
                    spinner.innerHTML = `
                      <div class="loading-fullscreen">
                        <div class="loading-spinner">
                          <div class="spinner spinner-md spinner-primary">
                            <div class="spinner-ring"></div>
                            <div class="spinner-ring"></div>
                            <div class="spinner-ring"></div>
                          </div>
                          <div class="loading-text spinner-md">
                            <span class="loading-text-content">Loading amazing content...</span>
                            <div class="loading-dots">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    `;
                    document.body.appendChild(spinner.firstElementChild);
                    
                    setTimeout(() => {
                      document.body.removeChild(spinner.firstElementChild);
                    }, 3000);
                  }}
                >
                  Show Full Screen Loading
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5>💻 Usage Examples</h5>
              </div>
              <div className="card-body">
                <pre className="bg-light p-3 rounded">
{`// Basic usage
<LoadingSpinner />

// With custom text
<LoadingSpinner text="Loading tasks..." />

// Different sizes
<LoadingSpinner size="small" />
<LoadingSpinner size="large" />

// Different colors
<LoadingSpinner variant="success" />
<LoadingSpinner variant="warning" />

// Full screen overlay
<LoadingSpinner fullScreen={true} text="Processing..." />

// No animated dots
<LoadingSpinner showDots={false} text="Loading..." />`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinnerDemo;
