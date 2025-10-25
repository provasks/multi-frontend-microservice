/**
 * Notification App Configuration (Port 4003)
 * Configuration specific to the notification management microfrontend
 */

// Import shared configuration
const { NOTIFICATION_CONSTANTS, FRONTEND_MESSAGES } = require('sharedComponents/frontendConfig');

// ============================================================================
// NOTIFICATION APP SPECIFIC CONFIGURATION
// ============================================================================

const NOTIFICATION_APP_CONFIG = {
  // Application metadata
  APP: {
    NAME: 'Notification Management',
    VERSION: '1.0.0',
    DESCRIPTION: 'Notification management microfrontend'
  },
  
  // Notification management specific settings
  NOTIFICATION_MANAGEMENT: {
    // Pagination
    PAGINATION: {
      DEFAULT_PAGE_SIZE: 10,
      PAGE_SIZE_OPTIONS: [5, 10, 25, 50]
    },
    
    // Search configuration
    SEARCH: {
      DEBOUNCE_DELAY: 300,
      MIN_SEARCH_LENGTH: 2,
      SEARCH_FIELDS: ['title', 'message', 'type']
    },
    
    // Notification form configuration
    FORM: {
      VALIDATION: {
        TITLE: {
          MIN_LENGTH: 1,
          MAX_LENGTH: 100,
          REQUIRED: true
        },
        MESSAGE: {
          MIN_LENGTH: 1,
          MAX_LENGTH: 500,
          REQUIRED: true
        },
        TYPE: {
          ALLOWED_VALUES: ['info', 'success', 'warning', 'error', 'task_assigned', 'task_completed', 'task_overdue', 'task_comment']
        }
      },
      
      FIELDS: {
        REQUIRED: ['title', 'message', 'type'],
        OPTIONAL: ['recipient', 'scheduledAt']
      }
    },
    
    // Notification list configuration
    LIST: {
      SORTABLE_COLUMNS: ['title', 'type', 'isRead', 'createdAt'],
      DEFAULT_SORT: { field: 'createdAt', direction: 'desc' },
      FILTERABLE_FIELDS: ['type', 'isRead']
    },
    
    // Notification settings
    SETTINGS: {
      AUTO_DISMISS: {
        SUCCESS: 4000,
        INFO: 5000,
        WARNING: 6000,
        ERROR: 8000
      },
      
      BATCH_OPERATIONS: {
        MARK_ALL_READ: true,
        BULK_DELETE: true,
        BULK_MARK_READ: true
      }
    }
  },
  
  // API configuration
  API: {
    ENDPOINTS: {
      NOTIFICATIONS: '/api/notifications',
      MARK_READ: '/api/notifications/mark-read',
      MARK_ALL_READ: '/api/notifications/mark-all-read',
      BULK_DELETE: '/api/notifications/bulk-delete'
    },
    
    TIMEOUTS: {
      DEFAULT: 10000,
      BULK_OPERATIONS: 30000
    }
  }
};

// ============================================================================
// NOTIFICATION APP SPECIFIC MESSAGES
// ============================================================================

const NOTIFICATION_APP_MESSAGES = {
  // Notification-specific error messages
  ERROR: {
    NOTIFICATION_LOAD_FAILED: 'Failed to load notifications',
    NOTIFICATION_CREATE_FAILED: 'Failed to create notification',
    NOTIFICATION_UPDATE_FAILED: 'Failed to update notification',
    NOTIFICATION_DELETE_FAILED: 'Failed to delete notification',
    NOTIFICATION_NOT_FOUND: 'Notification not found',
    INVALID_NOTIFICATION_DATA: 'Invalid notification data provided',
    MARK_READ_FAILED: 'Failed to mark notification as read',
    BULK_OPERATION_FAILED: 'Bulk operation failed'
  },
  
  // Notification-specific success messages
  SUCCESS: {
    NOTIFICATION_CREATED: 'Notification created successfully',
    NOTIFICATION_UPDATED: 'Notification updated successfully',
    NOTIFICATION_DELETED: 'Notification deleted successfully',
    NOTIFICATIONS_LOADED: 'Notifications loaded successfully',
    NOTIFICATION_MARKED_READ: 'Notification marked as read',
    ALL_NOTIFICATIONS_MARKED_READ: 'All notifications marked as read',
    BULK_DELETE_SUCCESS: 'Selected notifications deleted successfully'
  }
};

// ============================================================================
// EXPORT CONFIGURATION
// ============================================================================

module.exports = {
  // Notification app specific configuration
  NOTIFICATION_APP_CONFIG,
  NOTIFICATION_APP_MESSAGES,
  
  // Re-export shared configuration
  NOTIFICATION_CONSTANTS,
  MESSAGES: FRONTEND_MESSAGES
};
