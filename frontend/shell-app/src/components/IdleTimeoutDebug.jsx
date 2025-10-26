import React, { useEffect } from 'react';
import { useIdleTimeout } from 'sharedComponents/ReduxHooks';

/**
 * Idle Timeout Debug Component
 * Shows real-time idle timeout status for debugging
 */
const IdleTimeoutDebug = () => {
  const {
    isActive,
    isWarning,
    timeRemaining,
    timeout,
    warningTime,
    isEnabled,
    formattedTimeRemaining,
    lastActivity
  } = useIdleTimeout();

  useEffect(() => {
    // IdleTimeoutDebug current state monitoring
  }, [isActive, isWarning, timeRemaining, timeout, warningTime, isEnabled, lastActivity]);

  return (
    <div className="card bg-info text-white" style={{ color: '#ffffff !important' }}>
      <div className="card-header" style={{ backgroundColor: '#0dcaf0', color: '#000000' }}>
        <h5 className="card-title mb-0" style={{ color: '#000000' }}>
          <i className="fas fa-bug me-2"></i>
          Idle Timeout Debug
        </h5>
      </div>
      <div className="card-body" style={{ backgroundColor: '#0dcaf0', color: '#000000' }}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-2" style={{ color: '#000000' }}>
              <strong style={{ color: '#000000' }}>Status:</strong> 
              <span className={`badge ms-2 ${isActive ? 'bg-success' : 'bg-danger'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="mb-2" style={{ color: '#000000' }}>
              <strong style={{ color: '#000000' }}>Warning:</strong> 
              <span className={`badge ms-2 ${isWarning ? 'bg-warning' : 'bg-secondary'}`}>
                {isWarning ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="mb-2" style={{ color: '#000000' }}>
              <strong style={{ color: '#000000' }}>Enabled:</strong> 
              <span className={`badge ms-2 ${isEnabled ? 'bg-success' : 'bg-danger'}`}>
                {isEnabled ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-2" style={{ color: '#000000' }}>
              <strong style={{ color: '#000000' }}>Time Remaining:</strong> 
              <span className="badge bg-primary ms-2">
                {formattedTimeRemaining}
              </span>
            </div>
            <div className="mb-2" style={{ color: '#000000' }}>
              <strong style={{ color: '#000000' }}>Timeout:</strong> {Math.round(timeout / 1000)}s
            </div>
            <div className="mb-2" style={{ color: '#000000' }}>
              <strong style={{ color: '#000000' }}>Warning Time:</strong> {Math.round(warningTime / 1000)}s
            </div>
            <div className="mb-2" style={{ color: '#000000' }}>
              <strong style={{ color: '#000000' }}>Last Activity:</strong> {new Date(lastActivity).toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="progress">
            <div 
              className={`progress-bar ${isWarning ? 'bg-warning' : 'bg-success'}`}
              style={{ 
                width: `${Math.max(0, Math.min(100, (timeRemaining / timeout) * 100))}%` 
              }}
            >
              {Math.round((timeRemaining / timeout) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdleTimeoutDebug;
