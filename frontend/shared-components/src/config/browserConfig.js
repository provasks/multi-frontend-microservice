/**
 * Browser Configuration for Idle Timeout
 * This file provides browser-safe configuration without process.env
 */

// Default configuration values
const DEFAULT_CONFIG = {
  // Development defaults
  development: {
    enabled: true,
    duration: 2, // minutes
    warning: 30, // seconds
    testDuration: 30, // seconds
    testWarning: 10, // seconds
    logActivity: false
  },
  
  // Production defaults
  production: {
    enabled: true,
    duration: 15, // minutes
    warning: 120, // seconds (2 minutes)
    testDuration: 30, // seconds
    testWarning: 10, // seconds
    logActivity: false
  }
};

// Browser-safe environment detection
const getEnvironment = () => {
  if (typeof window === 'undefined') return 'development';
  
  // Check for explicit environment setting
  if (window.ENV) return window.ENV;
  if (window.NODE_ENV) return window.NODE_ENV;
  
  // Detect based on hostname
  if (window.location) {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }
    return 'production';
  }
  
  return 'development';
};

// Get configuration with fallbacks
const getConfig = () => {
  const env = getEnvironment();
  const defaults = DEFAULT_CONFIG[env] || DEFAULT_CONFIG.development;
  
  // Try to get overrides from window object
  const overrides = {};
  if (typeof window !== 'undefined') {
    overrides.enabled = window.IDLE_TIMEOUT_ENABLED;
    overrides.duration = window.IDLE_TIMEOUT_DURATION;
    overrides.warning = window.IDLE_TIMEOUT_WARNING;
    overrides.testDuration = window.IDLE_TIMEOUT_TEST_DURATION;
    overrides.testWarning = window.IDLE_TIMEOUT_TEST_WARNING;
    overrides.logActivity = window.IDLE_TIMEOUT_LOG_ACTIVITY;
  }
  
  // Merge defaults with overrides
  const config = { ...defaults };
  Object.keys(overrides).forEach(key => {
    if (overrides[key] !== undefined && overrides[key] !== null) {
      config[key] = overrides[key];
    }
  });
  
  return {
    ...config,
    environment: env,
    isDevelopment: env === 'development',
    isProduction: env === 'production'
  };
};

const config = getConfig();

module.exports = {
  ...config,
  
  // Helper methods
  getTimeout: () => config.duration * 60 * 1000,
  getWarningTime: () => config.warning * 1000,
  getTestTimeout: () => config.testDuration * 1000,
  getTestWarning: () => config.testWarning * 1000,
  
  // Validation
  isValidDuration: (minutes) => minutes >= 1 && minutes <= 60,
  isValidWarning: (seconds) => seconds >= 5 && seconds <= 300,
  
  // Display helpers
  formatDuration: (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },
  
  formatSeconds: (ms) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  }
};
