/**
 * Event Type Constants
 * Centralized definition of all event types for type safety and consistency
 * 
 * Usage:
 *   import { EVENT_TYPES } from 'sharedComponents/utils/eventTypes';
 *   eventBus.emit(EVENT_TYPES.TASK_CREATED, { task: {...} });
 */

export const EVENT_TYPES = {
  // ============================================
  // Task Events
  // ============================================
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_DELETED: 'task:deleted',
  TASK_STATUS_CHANGED: 'task:status-changed',
  TASK_PRIORITY_CHANGED: 'task:priority-changed',
  TASK_ASSIGNED: 'task:assigned',
  TASK_UNASSIGNED: 'task:unassigned',
  
  // ============================================
  // User Events
  // ============================================
  USER_LOGGED_IN: 'user:logged-in',
  USER_LOGGED_OUT: 'user:logged-out',
  USER_PROFILE_UPDATED: 'user:profile-updated',
  USER_PREFERENCES_CHANGED: 'user:preferences-changed',
  
  // ============================================
  // Notification Events
  // ============================================
  NOTIFICATION_RECEIVED: 'notification:received',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_DELETED: 'notification:deleted',
  NOTIFICATION_CLEARED: 'notification:cleared',
  
  // ============================================
  // UI Events
  // ============================================
  THEME_CHANGED: 'ui:theme-changed',
  SIDEBAR_TOGGLED: 'ui:sidebar-toggled',
  MODAL_OPENED: 'ui:modal-opened',
  MODAL_CLOSED: 'ui:modal-closed',
  DRAWER_OPENED: 'ui:drawer-opened',
  DRAWER_CLOSED: 'ui:drawer-closed',
  
  // ============================================
  // Navigation Events
  // ============================================
  NAVIGATION_REQUESTED: 'nav:requested',
  ROUTE_CHANGED: 'nav:route-changed',
  ROUTE_BEFORE_CHANGE: 'nav:before-change',
  
  // ============================================
  // Error Events
  // ============================================
  ERROR_OCCURRED: 'error:occurred',
  API_ERROR: 'error:api',
  VALIDATION_ERROR: 'error:validation',
  NETWORK_ERROR: 'error:network',
  
  // ============================================
  // System Events
  // ============================================
  IDLE_TIMEOUT: 'system:idle-timeout',
  IDLE_TIMEOUT_WARNING: 'system:idle-timeout-warning',
  NETWORK_STATUS_CHANGED: 'system:network-status-changed',
  APPLICATION_READY: 'system:application-ready',
  APPLICATION_ERROR: 'system:application-error',
  
  // ============================================
  // Data Sync Events
  // ============================================
  DATA_REFRESH_REQUESTED: 'data:refresh-requested',
  DATA_UPDATED: 'data:updated',
  CACHE_INVALIDATED: 'data:cache-invalidated',
};

/**
 * Event Payload Type Definitions (for documentation and validation)
 * These are not enforced at runtime but serve as documentation
 */
export const EVENT_PAYLOADS = {
  [EVENT_TYPES.TASK_CREATED]: {
    task: 'object', // Task object
    userId: 'string', // User ID who created the task
    timestamp: 'number', // Optional timestamp
  },
  
  [EVENT_TYPES.TASK_UPDATED]: {
    task: 'object', // Updated task object
    changes: 'object', // What changed
    userId: 'string', // User ID who updated
  },
  
  [EVENT_TYPES.USER_LOGGED_IN]: {
    user: 'object', // User object
    token: 'string', // Auth token
  },
  
  [EVENT_TYPES.USER_LOGGED_OUT]: {
    reason: 'string', // Optional: reason for logout
    timestamp: 'number', // Optional timestamp
  },
  
  [EVENT_TYPES.NOTIFICATION_RECEIVED]: {
    type: 'string', // 'success', 'error', 'warning', 'info'
    message: 'string', // Notification message
    duration: 'number', // Optional: display duration
  },
  
  [EVENT_TYPES.NAVIGATION_REQUESTED]: {
    route: 'string', // Route path
    params: 'object', // Optional route params
    replace: 'boolean', // Optional: replace history
  },
  
  [EVENT_TYPES.THEME_CHANGED]: {
    theme: 'string', // 'light' or 'dark'
  },
  
  [EVENT_TYPES.ERROR_OCCURRED]: {
    type: 'string', // Error type
    message: 'string', // Error message
    error: 'object', // Optional: error object
    context: 'object', // Optional: additional context
  },
};

/**
 * Helper function to validate event payload (optional)
 * @param {string} eventType - Event type
 * @param {*} payload - Event payload
 * @returns {boolean} True if payload is valid
 */
export const validateEventPayload = (eventType, payload) => {
  const schema = EVENT_PAYLOADS[eventType];
  if (!schema) {
    console.warn(`No schema defined for event type: ${eventType}`);
    return true; // Allow unknown events
  }
  
  // Basic validation (can be enhanced)
  for (const [key, expectedType] of Object.entries(schema)) {
    if (expectedType === 'object' && typeof payload[key] !== 'object') {
      console.warn(`Event payload validation failed for ${eventType}: ${key} should be ${expectedType}`);
      return false;
    }
    if (expectedType === 'string' && typeof payload[key] !== 'string') {
      console.warn(`Event payload validation failed for ${eventType}: ${key} should be ${expectedType}`);
      return false;
    }
    // Add more type checks as needed
  }
  
  return true;
};

