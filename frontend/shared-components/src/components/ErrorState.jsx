import React from 'react';
import './ErrorState.css';

/**
 * Enhanced error state component with better UX
 */
const ErrorState = ({ 
  type = 'error',
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  action = null,
  onRetry = null,
  showIcon = true,
  fullScreen = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return 'fas fa-exclamation-triangle';
      case 'warning':
        return 'fas fa-exclamation-circle';
      case 'info':
        return 'fas fa-info-circle';
      case 'success':
        return 'fas fa-check-circle';
      case 'network':
        return 'fas fa-wifi';
      case 'not-found':
        return 'fas fa-search';
      default:
        return 'fas fa-exclamation-triangle';
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'error':
        return 'error-danger';
      case 'warning':
        return 'error-warning';
      case 'info':
        return 'error-info';
      case 'success':
        return 'error-success';
      case 'network':
        return 'error-warning';
      case 'not-found':
        return 'error-info';
      default:
        return 'error-danger';
    }
  };

  const containerClass = fullScreen ? 'error-fullscreen' : 'error-container';

  return (
    <div className={`${containerClass} ${getColorClass()}`}>
      <div className="error-content">
        {showIcon && (
          <div className="error-icon">
            <i className={getIcon()}></i>
          </div>
        )}
        
        <div className="error-text">
          <h3 className="error-title">{title}</h3>
          <p className="error-message">{message}</p>
        </div>
        
        {(action || onRetry) && (
          <div className="error-actions">
            {action && (
              <div className="error-custom-action">
                {action}
              </div>
            )}
            
            {onRetry && (
              <button 
                className="btn btn-outline-primary error-retry-btn"
                onClick={onRetry}
              >
                <i className="fas fa-redo me-2"></i>
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Network error state
 */
export const NetworkError = ({ onRetry }) => (
  <ErrorState
    type="network"
    title="Connection Problem"
    message="Unable to connect to the server. Please check your internet connection and try again."
    onRetry={onRetry}
  />
);

/**
 * Not found error state
 */
export const NotFoundError = ({ resource = 'page', onRetry }) => (
  <ErrorState
    type="not-found"
    title={`${resource.charAt(0).toUpperCase() + resource.slice(1)} Not Found`}
    message={`The ${resource} you're looking for doesn't exist or has been moved.`}
    onRetry={onRetry}
  />
);

/**
 * Empty state component
 */
export const EmptyState = ({ 
  title = 'No data available',
  message = 'There are no items to display at the moment.',
  action = null,
  icon = 'fas fa-inbox'
}) => (
  <div className="empty-state">
    <div className="empty-content">
      <div className="empty-icon">
        <i className={icon}></i>
      </div>
      
      <div className="empty-text">
        <h3 className="empty-title">{title}</h3>
        <p className="empty-message">{message}</p>
      </div>
      
      {action && (
        <div className="empty-action">
          {action}
        </div>
      )}
    </div>
  </div>
);

/**
 * Loading error state
 */
export const LoadingError = ({ onRetry }) => (
  <ErrorState
    type="error"
    title="Failed to Load"
    message="Unable to load the data. This might be due to a network issue or server problem."
    onRetry={onRetry}
  />
);

export default ErrorState;
