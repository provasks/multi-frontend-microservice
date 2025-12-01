/**
 * Notification Helper
 * Provides a unified API for showing notifications via events
 * This bridges the gap between window functions and event-based communication
 * 
 * Usage:
 *   import { showNotification } from 'sharedComponents/utils/notificationHelper';
 *   import { EVENT_TYPES } from 'sharedComponents/utils/eventTypes';
 * 
 *   // Show success notification
 *   showNotification.success('Task created!');
 * 
 *   // Show error notification
 *   showNotification.error('Failed to create task');
 */

import eventBus from './eventBus';
import { EVENT_TYPES } from './eventTypes';

/**
 * Show notification via event bus (preferred method)
 */
const showNotificationViaEvent = (type, message, duration) => {
  if (eventBus) {
    eventBus.emit(EVENT_TYPES.NOTIFICATION_RECEIVED, {
      type,
      message,
      duration,
      timestamp: Date.now()
    });
  }
};

/**
 * Show notification via window function (fallback for backward compatibility)
 */
const showNotificationViaWindow = (type, message) => {
  const windowFunction = {
    success: window.showSuccess,
    error: window.showError,
    warning: window.showWarning,
    info: window.showInfo,
  }[type];

  if (windowFunction && typeof windowFunction === 'function') {
    windowFunction(message);
  } else {
    // Fallback to console if window functions not available
    console[type === 'error' ? 'error' : 'log'](`[${type.toUpperCase()}] ${message}`);
  }
};

/**
 * Unified notification API
 * Tries event bus first, falls back to window functions
 */
export const showNotification = {
  success: (message, duration) => {
    showNotificationViaEvent('success', message, duration);
    // Also call window function for backward compatibility during migration
    if (window.showSuccess) {
      showNotificationViaWindow('success', message);
    }
  },

  error: (message, duration) => {
    showNotificationViaEvent('error', message, duration);
    if (window.showError) {
      showNotificationViaWindow('error', message);
    }
  },

  warning: (message, duration) => {
    showNotificationViaEvent('warning', message, duration);
    if (window.showWarning) {
      showNotificationViaWindow('warning', message);
    }
  },

  info: (message, duration) => {
    showNotificationViaEvent('info', message, duration);
    if (window.showInfo) {
      showNotificationViaWindow('info', message);
    }
  },
};

/**
 * Show error via event bus (for API errors, validation errors, etc.)
 */
export const showError = (error, context = {}) => {
  const errorMessage = error?.message || error?.response?.data?.error || String(error);
  
  if (eventBus) {
    eventBus.emit(EVENT_TYPES.ERROR_OCCURRED, {
      type: 'api',
      message: errorMessage,
      error: error,
      context,
      timestamp: Date.now()
    });
  }
  
  // Also show as notification
  showNotification.error(errorMessage);
};

/**
 * Show validation error
 */
export const showValidationError = (errors) => {
  const errorMessage = Array.isArray(errors) 
    ? errors.map(err => err.msg || err.message || err).join(', ')
    : errors;
  
  if (eventBus) {
    eventBus.emit(EVENT_TYPES.ERROR_OCCURRED, {
      type: 'validation',
      message: errorMessage,
      errors,
      timestamp: Date.now()
    });
  }
  
  showNotification.error(`Validation Error: ${errorMessage}`);
};

export default showNotification;

