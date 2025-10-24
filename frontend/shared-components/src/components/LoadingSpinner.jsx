import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = React.memo(({ 
  size = 'default', 
  text = 'Loading...', 
  variant = 'primary',
  showDots = true,
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'spinner-sm',
    default: 'spinner-md',
    large: 'spinner-lg'
  };

  const variantClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    success: 'spinner-success',
    warning: 'spinner-warning',
    danger: 'spinner-danger',
    info: 'spinner-info'
  };

  const containerClass = fullScreen ? 'loading-fullscreen' : 'loading-container';

  return (
    <div className={containerClass}>
      <div className="loading-spinner">
        <div className={`spinner ${sizeClasses[size]} ${variantClasses[variant]}`}>
          <div className="spinner-ring"></div>
        </div>
        
        {text && (
          <div className={`loading-text ${sizeClasses[size]}`}>
            <span className="loading-text-content">{text}</span>
            {showDots && (
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
