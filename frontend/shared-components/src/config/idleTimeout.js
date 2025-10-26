/**
 * Idle Timeout Configuration
 * Re-exports configuration from central config
 */

// Import from shared frontend configuration
const { SHARED_COMPONENTS_CONFIG, UTILITY_FUNCTIONS } = require('./frontendConfig');

// Get environment-specific configuration
const getEnvironmentConfig = () => {
  const env = UTILITY_FUNCTIONS.getEnvironment();
  
  // Environment detected for idle timeout configuration
  
  if (env === 'production') {
    return {
      ...SHARED_COMPONENTS_CONFIG.IDLE_TIMEOUT,
      DEFAULT_TIMEOUT: SHARED_COMPONENTS_CONFIG.IDLE_TIMEOUT.PRODUCTION.TIMEOUT,
      DEFAULT_WARNING_TIME: SHARED_COMPONENTS_CONFIG.IDLE_TIMEOUT.PRODUCTION.WARNING_TIME
    };
  } else if (env === 'development') {
    return {
      ...SHARED_COMPONENTS_CONFIG.IDLE_TIMEOUT,
      DEFAULT_TIMEOUT: SHARED_COMPONENTS_CONFIG.IDLE_TIMEOUT.DEVELOPMENT.TIMEOUT,
      DEFAULT_WARNING_TIME: SHARED_COMPONENTS_CONFIG.IDLE_TIMEOUT.DEVELOPMENT.WARNING_TIME
    };
  } else if (env === 'testing') {
    // Use shorter times for testing
    return {
      ...SHARED_COMPONENTS_CONFIG.IDLE_TIMEOUT,
      DEFAULT_TIMEOUT: 30 * 1000, // 30 seconds for testing
      DEFAULT_WARNING_TIME: 10 * 1000 // 10 seconds for testing
    };
  }
  
  return SHARED_COMPONENTS_CONFIG.IDLE_TIMEOUT;
};

// Export environment-specific configuration
module.exports = getEnvironmentConfig();
