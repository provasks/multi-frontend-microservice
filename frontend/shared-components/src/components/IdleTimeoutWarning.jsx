import React from 'react';
import { useIdleTimeout } from '../store/simpleHooks';
import './IdleTimeoutWarning.css';

/**
 * Idle Timeout Warning Component
 * Shows warning when user is about to be logged out due to inactivity
 */
const IdleTimeoutWarning = () => {
  const {
    isWarning,
    timeRemaining,
    formattedTimeRemaining,
    resetIdleTimeout,
    pauseIdleTimeout
  } = useIdleTimeout();

  if (!isWarning) return null;

  return (
    <div className="idle-timeout-warning">
      <div className="idle-timeout-warning__overlay" />
      <div className="idle-timeout-warning__modal">
        <div className="idle-timeout-warning__icon">
          <i className="fas fa-clock"></i>
        </div>
        <div className="idle-timeout-warning__content">
          <h3>Session Timeout Warning</h3>
          <p>
            You will be automatically logged out due to inactivity in{' '}
            <strong>{formattedTimeRemaining}</strong>
          </p>
          <div className="idle-timeout-warning__actions">
            <button
              className="btn btn-primary"
              onClick={resetIdleTimeout}
            >
              <i className="fas fa-refresh me-2"></i>
              Stay Logged In
            </button>
            <button
              className="btn btn-secondary"
              onClick={pauseIdleTimeout}
            >
              <i className="fas fa-pause me-2"></i>
              Pause Timeout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdleTimeoutWarning;
