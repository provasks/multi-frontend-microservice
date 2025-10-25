/**
 * Simple Configuration for Idle Timeout
 * Browser-safe configuration without process.env dependencies
 */

// Default configuration values
const DEFAULT_CONFIG = {
  // Core settings
  enabled: true,
  timeout: 2 * 60 * 1000, // 2 minutes
  warningTime: 30 * 1000, // 30 seconds
  
  // Development settings
  devTimeout: 30 * 1000, // 30 seconds for testing
  devWarning: 10 * 1000, // 10 seconds for testing
  
  // Activity events
  activityEvents: [
    'mousedown',
    'mousemove',
    'mouseup',
    'keypress',
    'keydown',
    'keyup',
    'scroll',
    'touchstart',
    'touchend',
    'touchmove',
    'click',
    'dblclick',
    'focus',
    'blur',
    'input',
    'change',
    'submit',
    'resize'
  ],
  
  // Validation limits
  minTimeout: 1 * 60 * 1000, // 1 minute
  maxTimeout: 60 * 60 * 1000, // 60 minutes
  minWarning: 5 * 1000, // 5 seconds
  maxWarning: 5 * 60 * 1000, // 5 minutes
};

// Environment detection
const getEnvironment = () => {
  // Check if we're in a browser
  if (typeof window !== 'undefined') {
    // Try to get environment from window object
    if (window.NODE_ENV) return window.NODE_ENV;
    if (window.ENV) return window.ENV;
    
    // Detect based on hostname
    if (window.location) {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'development';
      }
      return 'production';
    }
    return 'development';
  }
  
  // Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV || 'development';
  }
  
  return 'development';
};

// Get configuration with environment-specific overrides
const getConfig = () => {
  const env = getEnvironment();
  const config = { ...DEFAULT_CONFIG };
  
  // Environment-specific overrides
  if (env === 'production') {
    config.timeout = 15 * 60 * 1000; // 15 minutes
    config.warningTime = 2 * 60 * 1000; // 2 minutes
  }
  
  // Try to get overrides from window object (browser)
  if (typeof window !== 'undefined') {
    if (window.IDLE_TIMEOUT_ENABLED !== undefined) {
      config.enabled = window.IDLE_TIMEOUT_ENABLED;
    }
    if (window.IDLE_TIMEOUT_DURATION !== undefined) {
      config.timeout = parseInt(window.IDLE_TIMEOUT_DURATION) * 60 * 1000;
    }
    if (window.IDLE_TIMEOUT_WARNING !== undefined) {
      config.warningTime = parseInt(window.IDLE_TIMEOUT_WARNING) * 1000;
    }
  }
  
  // Try to get overrides from process.env (Node.js)
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.IDLE_TIMEOUT_ENABLED !== undefined) {
      config.enabled = process.env.IDLE_TIMEOUT_ENABLED !== 'false';
    }
    if (process.env.IDLE_TIMEOUT_DURATION !== undefined) {
      config.timeout = parseInt(process.env.IDLE_TIMEOUT_DURATION) * 60 * 1000;
    }
    if (process.env.IDLE_TIMEOUT_WARNING !== undefined) {
      config.warningTime = parseInt(process.env.IDLE_TIMEOUT_WARNING) * 1000;
    }
  }
  
  return {
    ...config,
    environment: env,
    isDevelopment: env === 'development',
    isProduction: env === 'production'
  };
};

const config = getConfig();

module.exports = {
  // Core configuration
  DEFAULT_TIMEOUT: config.timeout,
  DEFAULT_WARNING_TIME: config.warningTime,
  ENABLED: config.enabled,
  
  // Activity events
  ACTIVITY_EVENTS: config.activityEvents,
  
  // Validation limits
  MIN_TIMEOUT: config.minTimeout,
  MAX_TIMEOUT: config.maxTimeout,
  MIN_WARNING_TIME: config.minWarning,
  MAX_WARNING_TIME: config.maxWarning,
  
  // Development settings
  DEV: {
    ENABLED: config.enabled,
    LOG_ACTIVITY: false,
    SHORT_TIMEOUT: config.devTimeout,
    SHORT_WARNING: config.devWarning
  },
  
  // Environment info
  ENVIRONMENT: config.environment,
  IS_DEVELOPMENT: config.isDevelopment,
  IS_PRODUCTION: config.isProduction,
  
  // Utility functions
  formatDuration: (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },
  
  formatSeconds: (ms) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  },
  
  isValidDuration: (minutes) => minutes >= 1 && minutes <= 60,
  isValidWarning: (seconds) => seconds >= 5 && seconds <= 300
};
