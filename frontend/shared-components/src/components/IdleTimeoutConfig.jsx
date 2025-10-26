import React, { useState, useEffect } from 'react';
import { useIdleTimeout } from '../store/simpleHooks';
import './IdleTimeoutConfig.css';

/**
 * Idle Timeout Configuration Component
 * Allows users to configure idle timeout settings
 */
const IdleTimeoutConfig = () => {
  const {
    timeout,
    warningTime,
    isEnabled,
    isActive,
    timeRemaining,
    formattedTimeRemaining,
    setIdleTimeout,
    enableIdleTimeout,
    disableIdleTimeout,
    resetIdleTimeout
  } = useIdleTimeout();

  // IdleTimeoutConfig current values

  // Force countdown to start if enabled but not active
  useEffect(() => {
    if (isEnabled && !isActive) {
      // Forcing idle timeout to start
      // This will be handled by the useIdleTimeout hook
    }
  }, [isEnabled, isActive]);

  const [config, setConfig] = useState({
    timeout: timeout / 1000 / 60, // Convert to minutes
    warningTime: warningTime / 1000, // Convert to seconds
    isEnabled
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setConfig({
      timeout: timeout / 1000 / 60,
      warningTime: warningTime / 1000,
      isEnabled
    });
  }, [timeout, warningTime, isEnabled]);

  const handleSave = () => {
    setIdleTimeout({
      timeout: config.timeout * 60 * 1000, // Convert to milliseconds
      warningTime: config.warningTime * 1000, // Convert to milliseconds
      isEnabled: config.isEnabled
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    resetIdleTimeout();
  };

  const handleToggle = () => {
    if (config.isEnabled) {
      disableIdleTimeout();
    } else {
      enableIdleTimeout();
    }
    setConfig(prev => ({ ...prev, isEnabled: !prev.isEnabled }));
  };

  const presets = [
    { label: '1 minute', value: 1 },
    { label: '2 minutes', value: 2 },
    { label: '5 minutes', value: 5 },
    { label: '10 minutes', value: 10 },
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 }
  ];

  return (
    <div className="idle-timeout-config">
      <button
        className="idle-timeout-config__trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Configure Idle Timeout"
      >
        <i className="fas fa-clock"></i>
        {isEnabled && (
          <span className="idle-timeout-config__indicator">
            {(() => {
              const seconds = Math.round(timeRemaining / 1000);
              const minutes = Math.floor(seconds / 60);
              const remainingSeconds = seconds % 60;
              const display = minutes > 0 ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}` : `${seconds}s`;
              // Button countdown display
              return display;
            })()}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="idle-timeout-config__modal">
          <div className="idle-timeout-config__header">
            <h3>Idle Timeout Settings</h3>
            <button
              className="idle-timeout-config__close"
              onClick={() => setIsOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="idle-timeout-config__content">
            <div className="idle-timeout-config__section">
              <label className="idle-timeout-config__label">
                <input
                  type="checkbox"
                  checked={config.isEnabled}
                  onChange={handleToggle}
                />
                <span>Enable Idle Timeout</span>
              </label>
            </div>

            {config.isEnabled && (
              <>
                <div className="idle-timeout-config__section">
                  <label className="idle-timeout-config__label">
                    Timeout Duration (minutes)
                  </label>
                  <div className="idle-timeout-config__presets">
                    {presets.map(preset => (
                      <button
                        key={preset.value}
                        className={`idle-timeout-config__preset ${
                          config.timeout === preset.value ? 'active' : ''
                        }`}
                        onClick={() => setConfig(prev => ({ ...prev, timeout: preset.value }))}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={config.timeout}
                    onChange={(e) => setConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) || 1 }))}
                    className="idle-timeout-config__input"
                  />
                </div>

                <div className="idle-timeout-config__section">
                  <label className="idle-timeout-config__label">
                    Warning Time (seconds)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={config.warningTime}
                    onChange={(e) => setConfig(prev => ({ ...prev, warningTime: parseInt(e.target.value) || 30 }))}
                    className="idle-timeout-config__input"
                  />
                </div>

                <div className="idle-timeout-config__section">
                  <div className="idle-timeout-config__status">
                    <strong>Time Remaining:</strong> {formattedTimeRemaining || '0s'}
                  </div>
                  <div className="idle-timeout-config__status" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    <strong>Debug:</strong> {Math.round(timeRemaining / 1000)}s / {Math.round(timeout / 1000)}s
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="idle-timeout-config__actions">
            <button
              className="btn btn-secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
            >
              Save Settings
            </button>
            <button
              className="btn btn-warning"
              onClick={handleReset}
            >
              Reset Timer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdleTimeoutConfig;
