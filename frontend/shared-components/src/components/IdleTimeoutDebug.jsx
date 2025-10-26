import React, { useState, useEffect } from 'react';
import { useIdleTimeout } from '../store/simpleHooks';

/**
 * Idle Timeout Debug Component
 * Shows real-time idle timeout status and activity monitoring
 */
const IdleTimeoutDebug = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activityLog, setActivityLog] = useState([]);
  const [lastActivity, setLastActivity] = useState(null);
  
  const {
    isActive,
    isWarning,
    timeRemaining,
    timeRemainingFormatted
  } = useIdleTimeout();

  useEffect(() => {
    // Listen for activity events to log them
    const logActivity = (event) => {
      const now = new Date();
      const activity = {
        timestamp: now.toLocaleTimeString(),
        event: event.type,
        target: event.target?.tagName || 'unknown'
      };
      
      setActivityLog(prev => [activity, ...prev.slice(0, 9)]); // Keep last 10 activities
      setLastActivity(now);
    };

    // Add event listeners for common activity events
    const events = ['mousedown', 'mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, logActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, logActivity, true);
      });
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        className="btn btn-sm btn-outline-info position-fixed"
        style={{ bottom: '20px', right: '20px', zIndex: 9999 }}
        onClick={() => setIsVisible(true)}
        title="Show Idle Timeout Debug"
      >
        <i className="fas fa-bug"></i>
      </button>
    );
  }

  return (
    <div 
      className="position-fixed bg-light border rounded shadow p-3"
      style={{ 
        bottom: '20px', 
        right: '20px', 
        width: '300px', 
        maxHeight: '400px', 
        zIndex: 9999,
        fontSize: '0.8rem'
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">Idle Timeout Debug</h6>
        <button 
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setIsVisible(false)}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="mb-2">
        <div className="d-flex justify-content-between">
          <span>Status:</span>
          <span className={`badge ${isActive ? 'bg-success' : 'bg-danger'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Warning:</span>
          <span className={`badge ${isWarning ? 'bg-warning' : 'bg-secondary'}`}>
            {isWarning ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Time Remaining:</span>
          <span className="fw-bold">{timeRemainingFormatted || '0:00'}</span>
        </div>
      </div>

      <div className="mb-2">
        <small className="text-muted">Last Activity: {lastActivity?.toLocaleTimeString() || 'None'}</small>
      </div>

      <div>
        <small className="text-muted">Recent Activity:</small>
        <div 
          className="border rounded p-2 mt-1"
          style={{ maxHeight: '150px', overflowY: 'auto' }}
        >
          {activityLog.length === 0 ? (
            <div className="text-muted">No activity detected</div>
          ) : (
            activityLog.map((activity, index) => (
              <div key={index} className="d-flex justify-content-between">
                <span>{activity.event}</span>
                <span className="text-muted">{activity.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IdleTimeoutDebug;
