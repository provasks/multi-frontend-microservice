/**
 * Centralized Constants Management
 * 
 * This file re-exports values from the central configuration file
 * for backward compatibility and easy access.
 */

// Import from shared frontend configuration
const {
  FRONTEND_CONFIG,
  TASK_CONSTANTS,
  USER_CONSTANTS,
  NOTIFICATION_CONSTANTS,
  SHARED_COMPONENTS_CONFIG,
  FRONTEND_MESSAGES,
  UTILITY_FUNCTIONS
} = require('../config/frontendConfig');

// Create API_CONFIG for backward compatibility
const API_CONFIG = {
  BASE_URLS: FRONTEND_CONFIG.API_ENDPOINTS,
  TIMEOUTS: {
    DEFAULT: 30000,
    UPLOAD: 60000,
    DOWNLOAD: 120000
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000,
    BACKOFF_MULTIPLIER: 2
  }
};

// Re-export from shared frontend configuration
module.exports = {
  // Main configuration object
  FRONTEND_CONFIG,
  
  // Backward compatibility exports
  API_CONFIG,
  
  // Individual configurations for backward compatibility
  TASK_CONSTANTS,
  USER_CONSTANTS,
  NOTIFICATION_CONSTANTS,
  SHARED_COMPONENTS_CONFIG,
  FRONTEND_MESSAGES,
  UTILITY_FUNCTIONS
};

