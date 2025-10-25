/**
 * Environment Configuration Utility
 * Provides environment-based configuration for idle timeout
 */

// Browser-safe environment detection
const getEnvironmentConfig = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Get environment from various sources
  let env = 'development';
  if (isBrowser) {
    // Try to get environment from window object or URL
    env = window.ENV || window.NODE_ENV || 
          (window.location.hostname === 'localhost' ? 'development' : 'production');
  } else {
    // Node.js environment
    env = process.env.NODE_ENV || 'development';
  }
  
  // Get configuration from environment variables or defaults
  const getEnvVar = (key, defaultValue) => {
    if (isBrowser) {
      // In browser, try to get from window object or use defaults
      return window[`IDLE_TIMEOUT_${key}`] || defaultValue;
    } else {
      // In Node.js, use process.env
      return process.env[`IDLE_TIMEOUT_${key}`] || defaultValue;
    }
  };
  
  const config = {
    // Core settings
    enabled: getEnvVar('ENABLED', 'true') !== 'false',
    duration: parseInt(getEnvVar('DURATION', env === 'production' ? '15' : '2')),
    warning: parseInt(getEnvVar('WARNING', env === 'production' ? '120' : '30')),
    
    // Development/testing settings
    testDuration: parseInt(getEnvVar('TEST_DURATION', '30')),
    testWarning: parseInt(getEnvVar('TEST_WARNING', '10')),
    logActivity: getEnvVar('LOG_ACTIVITY', 'false') === 'true',
    
    // Environment info
    environment: env,
    isDevelopment: env === 'development',
    isProduction: env === 'production',
    isBrowser: isBrowser
  };
  
  return config;
};

const envConfig = getEnvironmentConfig();

module.exports = {
  ...envConfig,
  
  // Helper methods
  getTimeout: () => envConfig.duration * 60 * 1000,
  getWarningTime: () => envConfig.warning * 1000,
  getTestTimeout: () => envConfig.testDuration * 1000,
  getTestWarning: () => envConfig.testWarning * 1000,
  
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
