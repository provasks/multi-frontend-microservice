/**
 * User App Configuration (Port 4001)
 * Configuration specific to the user management microfrontend
 */

// Import shared configuration
const { USER_CONSTANTS, FRONTEND_MESSAGES } = require('sharedComponents/frontendConfig');

// ============================================================================
// USER APP SPECIFIC CONFIGURATION
// ============================================================================

const USER_APP_CONFIG = {
  // Application metadata
  APP: {
    NAME: 'User Management',
    VERSION: '1.0.0',
    DESCRIPTION: 'User management microfrontend'
  },
  
  // User management specific settings
  USER_MANAGEMENT: {
    // Pagination
    PAGINATION: {
      DEFAULT_PAGE_SIZE: 10,
      PAGE_SIZE_OPTIONS: [5, 10, 25, 50]
    },
    
    // Search configuration
    SEARCH: {
      DEBOUNCE_DELAY: 300,
      MIN_SEARCH_LENGTH: 2,
      SEARCH_FIELDS: ['username', 'email', 'firstName', 'lastName']
    },
    
    // User form configuration
    FORM: {
      VALIDATION: {
        USERNAME: {
          MIN_LENGTH: 3,
          MAX_LENGTH: 30,
          PATTERN: /^[a-zA-Z0-9_]+$/
        },
        EMAIL: {
          PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        PASSWORD: {
          MIN_LENGTH: 6,
          MAX_LENGTH: 128
        }
      },
      
      FIELDS: {
        REQUIRED: ['username', 'email', 'firstName', 'lastName', 'password'],
        OPTIONAL: ['role', 'isActive']
      }
    },
    
    // User list configuration
    LIST: {
      SORTABLE_COLUMNS: ['username', 'email', 'firstName', 'lastName', 'role', 'createdAt'],
      DEFAULT_SORT: { field: 'createdAt', direction: 'desc' },
      FILTERABLE_FIELDS: ['role', 'isActive']
    }
  },
  
  // API configuration
  API: {
    ENDPOINTS: {
      USERS: '/api/users',
      USER_PROFILE: '/api/users/profile',
      USER_ROLES: '/api/users/roles'
    },
    
    TIMEOUTS: {
      DEFAULT: 10000,
      UPLOAD: 30000
    }
  }
};

// ============================================================================
// USER APP SPECIFIC MESSAGES
// ============================================================================

const USER_APP_MESSAGES = {
  // User-specific error messages
  ERROR: {
    USER_LOAD_FAILED: 'Failed to load users',
    USER_CREATE_FAILED: 'Failed to create user',
    USER_UPDATE_FAILED: 'Failed to update user',
    USER_DELETE_FAILED: 'Failed to delete user',
    USER_NOT_FOUND: 'User not found',
    INVALID_USER_DATA: 'Invalid user data provided'
  },
  
  // User-specific success messages
  SUCCESS: {
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    USERS_LOADED: 'Users loaded successfully'
  }
};

// ============================================================================
// EXPORT CONFIGURATION
// ============================================================================

module.exports = {
  // User app specific configuration
  USER_APP_CONFIG,
  USER_APP_MESSAGES,
  
  // Re-export shared configuration
  USER_CONSTANTS,
  MESSAGES: FRONTEND_MESSAGES
};
