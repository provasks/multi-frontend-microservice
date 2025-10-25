import React, { useState, useEffect } from 'react';
import { useIdleTimeout } from 'sharedComponents/ReduxHooks';
import IdleTimeoutDebug from './IdleTimeoutDebug';

/**
 * Idle Timeout Test Component
 * Demonstrates and tests idle timeout functionality
 */
const IdleTimeoutTest = () => {
  const {
    isActive,
    isWarning,
    timeRemaining,
    timeout,
    warningTime,
    isEnabled,
    formattedTimeRemaining,
    setIdleTimeout,
    resetIdleTimeout,
    pauseIdleTimeout,
    resumeIdleTimeout,
    disableIdleTimeout,
    enableIdleTimeout
  } = useIdleTimeout();

  const [testConfig, setTestConfig] = useState({
    timeout: 2, // minutes
    warningTime: 30, // seconds
    isEnabled: true
  });

  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    const logActivity = (event) => {
      setActivityLog(prev => [
        ...prev.slice(-9), // Keep last 10 entries
        {
          timestamp: new Date().toLocaleTimeString(),
          event: event.type,
          target: event.target.tagName || 'Unknown'
        }
      ]);
    };

    // Add activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, logActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, logActivity, true);
      });
    };
  }, []);

  const handleSaveConfig = () => {
    setIdleTimeout({
      timeout: testConfig.timeout * 60 * 1000,
      warningTime: testConfig.warningTime * 1000,
      isEnabled: testConfig.isEnabled
    });
  };

  const handleTestTimeout = () => {
    console.log('🧪 Starting quick test with 10-second timeout');
    setIdleTimeout({
      timeout: 10 * 1000, // 10 seconds
      warningTime: 5 * 1000, // 5 seconds warning
      isEnabled: true
    });
  };

  const handleQuickTest = () => {
    console.log('⚡ Starting ultra-quick test with 5-second timeout');
    setIdleTimeout({
      timeout: 5 * 1000, // 5 seconds
      warningTime: 2 * 1000, // 2 seconds warning
      isEnabled: true
    });
  };

  const handleResetTest = () => {
    setTestConfig({
      timeout: 2,
      warningTime: 30,
      isEnabled: true
    });
    setIdleTimeout({
      timeout: 2 * 60 * 1000,
      warningTime: 30 * 1000,
      isEnabled: true
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-clock me-2"></i>
                Idle Timeout Test & Configuration
              </h3>
            </div>
            <div className="card-body">
              {/* Debug Component */}
              <div className="row mb-4">
                <div className="col-12">
                  <IdleTimeoutDebug />
                </div>
              </div>

              {/* Current Status */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h5 className="card-title">Current Status</h5>
                      <div className="mb-2">
                        <strong>Enabled:</strong> 
                        <span className={`badge ms-2 ${isEnabled ? 'bg-success' : 'bg-danger'}`}>
                          {isEnabled ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="mb-2">
                        <strong>Active:</strong> 
                        <span className={`badge ms-2 ${isActive ? 'bg-success' : 'bg-danger'}`}>
                          {isActive ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="mb-2">
                        <strong>Warning:</strong> 
                        <span className={`badge ms-2 ${isWarning ? 'bg-warning' : 'bg-secondary'}`}>
                          {isWarning ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="mb-2">
                        <strong>Time Remaining:</strong> 
                        <span className="badge bg-info ms-2">
                          {formattedTimeRemaining}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h5 className="card-title">Configuration</h5>
                      <div className="mb-2">
                        <strong>Timeout:</strong> {Math.round(timeout / 1000 / 60)} minutes
                      </div>
                      <div className="mb-2">
                        <strong>Warning Time:</strong> {Math.round(warningTime / 1000)} seconds
                      </div>
                      <div className="mb-2">
                        <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
                      </div>
                      <div className="mb-2">
                        <strong>Last Activity:</strong> {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuration Form */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">Configuration</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="form-group mb-3">
                            <label className="form-label">Timeout (minutes)</label>
                            <input
                              type="number"
                              className="form-control"
                              min="1"
                              max="60"
                              value={testConfig.timeout}
                              onChange={(e) => setTestConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) || 1 }))}
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group mb-3">
                            <label className="form-label">Warning Time (seconds)</label>
                            <input
                              type="number"
                              className="form-control"
                              min="5"
                              max="300"
                              value={testConfig.warningTime}
                              onChange={(e) => setTestConfig(prev => ({ ...prev, warningTime: parseInt(e.target.value) || 30 }))}
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group mb-3">
                            <label className="form-label">Enabled</label>
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={testConfig.isEnabled}
                                onChange={(e) => setTestConfig(prev => ({ ...prev, isEnabled: e.target.checked }))}
                              />
                              <label className="form-check-label">
                                Enable Idle Timeout
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-primary" onClick={handleSaveConfig}>
                          <i className="fas fa-save me-2"></i>
                          Save Configuration
                        </button>
                        <button className="btn btn-warning" onClick={handleTestTimeout}>
                          <i className="fas fa-flask me-2"></i>
                          Test (10s timeout)
                        </button>
                        <button className="btn btn-danger" onClick={handleQuickTest}>
                          <i className="fas fa-bolt me-2"></i>
                          Quick Test (5s timeout)
                        </button>
                        <button className="btn btn-secondary" onClick={handleResetTest}>
                          <i className="fas fa-undo me-2"></i>
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">Controls</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-flex gap-2 flex-wrap">
                        <button className="btn btn-success" onClick={resetIdleTimeout}>
                          <i className="fas fa-refresh me-2"></i>
                          Reset Timer
                        </button>
                        <button className="btn btn-warning" onClick={pauseIdleTimeout}>
                          <i className="fas fa-pause me-2"></i>
                          Pause
                        </button>
                        <button className="btn btn-info" onClick={resumeIdleTimeout}>
                          <i className="fas fa-play me-2"></i>
                          Resume
                        </button>
                        <button className="btn btn-danger" onClick={disableIdleTimeout}>
                          <i className="fas fa-stop me-2"></i>
                          Disable
                        </button>
                        <button className="btn btn-primary" onClick={enableIdleTimeout}>
                          <i className="fas fa-play me-2"></i>
                          Enable
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">Recent Activity</h5>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Time</th>
                              <th>Event</th>
                              <th>Target</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activityLog.map((log, index) => (
                              <tr key={index}>
                                <td>{log.timestamp}</td>
                                <td>
                                  <span className="badge bg-primary">{log.event}</span>
                                </td>
                                <td>{log.target}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {activityLog.length === 0 && (
                        <div className="text-center text-muted">
                          <i className="fas fa-mouse me-2"></i>
                          Move your mouse or click to see activity
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdleTimeoutTest;
