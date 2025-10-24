/**
 * Centralized Constants Management
 * 
 * This file contains all static values used across the microfrontend architecture.
 * It provides a single source of truth for configuration, API endpoints, UI constants,
 * and other static values to ensure consistency and maintainability.
 */

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
  // Base URLs for different services
  BASE_URLS: {
    AUTH: 'http://localhost:3001/api',
    USERS: 'http://localhost:3001/api', 
    TASKS: 'http://localhost:3002/api',
    NOTIFICATIONS: 'http://localhost:3003/api'
  },
  
  // Request timeouts
  TIMEOUTS: {
    DEFAULT: 30000,
    UPLOAD: 60000,
    DOWNLOAD: 120000
  },
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000,
    BACKOFF_MULTIPLIER: 2
  }
};

// ============================================================================
// MICROFRONTEND CONFIGURATION
// ============================================================================

export const MICROFRONTEND_CONFIG = {
  // Ports for different applications
  PORTS: {
    SHELL: 4000,
    USER_APP: 4001,
    TASK_APP: 4002,
    NOTIFICATION_APP: 4003,
    SHARED_COMPONENTS: 4004
  },
  
  // Remote entry URLs
  REMOTES: {
    USER_APP: 'userApp@http://localhost:4001/remoteEntry.js',
    TASK_APP: 'taskApp@http://localhost:4002/remoteEntry.js',
    NOTIFICATION_APP: 'notificationApp@http://localhost:4003/remoteEntry.js',
    SHARED_COMPONENTS: 'sharedComponents@http://localhost:4004/remoteEntry.js'
  }
};

// ============================================================================
// TASK MANAGEMENT CONSTANTS
// ============================================================================

// Task priorities
const TASK_PRIORITIES = {
  URGENT: 'urgent',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// Task statuses
const TASK_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const TASK_CONSTANTS = {
  // Task priorities
  PRIORITIES: TASK_PRIORITIES,
  
  // Task statuses
  STATUSES: TASK_STATUSES,
  
  // Priority display configuration
  PRIORITY_CONFIG: {
    [TASK_PRIORITIES.URGENT]: {
      label: 'Urgent',
      color: '#dc3545',
      bgClass: 'priority-urgent',
      icon: 'fas fa-exclamation-triangle'
    },
    [TASK_PRIORITIES.HIGH]: {
      label: 'High',
      color: '#ffc107',
      bgClass: 'priority-high',
      icon: 'fas fa-arrow-up'
    },
    [TASK_PRIORITIES.MEDIUM]: {
      label: 'Medium',
      color: '#0dcaf0',
      bgClass: 'priority-medium',
      icon: 'fas fa-minus'
    },
    [TASK_PRIORITIES.LOW]: {
      label: 'Low',
      color: '#198754',
      bgClass: 'priority-low',
      icon: 'fas fa-arrow-down'
    }
  },
  
  // Status display configuration
  STATUS_CONFIG: {
    [TASK_STATUSES.PENDING]: {
      label: 'Pending',
      color: '#6c757d',
      bgClass: 'status-pending',
      icon: 'fas fa-clock'
    },
    [TASK_STATUSES.IN_PROGRESS]: {
      label: 'In Progress',
      color: '#0d6efd',
      bgClass: 'status-in-progress',
      icon: 'fas fa-spinner'
    },
    [TASK_STATUSES.COMPLETED]: {
      label: 'Completed',
      color: '#198754',
      bgClass: 'status-completed',
      icon: 'fas fa-check'
    },
    [TASK_STATUSES.CANCELLED]: {
      label: 'Cancelled',
      color: '#dc3545',
      bgClass: 'status-cancelled',
      icon: 'fas fa-times'
    }
  },
  
  // Default form values
  DEFAULT_FORM: {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: ''
  }
};

// ============================================================================
// USER MANAGEMENT CONSTANTS
// ============================================================================

// User roles
const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user'
};

export const USER_CONSTANTS = {
  // User roles
  ROLES: USER_ROLES,
  
  // Role display configuration
  ROLE_CONFIG: {
    [USER_ROLES.ADMIN]: {
      label: 'Administrator',
      color: '#dc3545',
      bgClass: 'bg-danger',
      icon: 'fas fa-crown'
    },
    [USER_ROLES.MODERATOR]: {
      label: 'Moderator',
      color: '#ffc107',
      bgClass: 'bg-warning text-dark',
      icon: 'fas fa-shield-alt'
    },
    [USER_ROLES.USER]: {
      label: 'User',
      color: '#6c757d',
      bgClass: 'bg-secondary',
      icon: 'fas fa-user'
    }
  },
  
  // User status
  STATUS: {
    ACTIVE: true,
    INACTIVE: false
  },
  
  // Default form values
  DEFAULT_FORM: {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'user',
    isActive: true
  }
};

// ============================================================================
// NOTIFICATION CONSTANTS
// ============================================================================

// Notification types
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error'
};

export const NOTIFICATION_CONSTANTS = {
  // Notification types
  TYPES: NOTIFICATION_TYPES,
  
  // Type display configuration
  TYPE_CONFIG: {
    [NOTIFICATION_TYPES.SUCCESS]: {
      label: 'Success',
      color: '#198754',
      bgClass: 'bg-success',
      icon: 'fas fa-check-circle'
    },
    [NOTIFICATION_TYPES.INFO]: {
      label: 'Info',
      color: '#0dcaf0',
      bgClass: 'bg-info',
      icon: 'fas fa-info-circle'
    },
    [NOTIFICATION_TYPES.WARNING]: {
      label: 'Warning',
      color: '#ffc107',
      bgClass: 'bg-warning',
      icon: 'fas fa-exclamation-triangle'
    },
    [NOTIFICATION_TYPES.ERROR]: {
      label: 'Error',
      color: '#dc3545',
      bgClass: 'bg-danger',
      icon: 'fas fa-times-circle'
    }
  },
  
  // Auto-dismiss timing
  AUTO_DISMISS: {
    SUCCESS: 4000,
    INFO: 5000,
    WARNING: 6000,
    ERROR: 8000
  }
};

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const UI_CONSTANTS = {
  // Animation durations
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  
  // Debounce delays
  DEBOUNCE: {
    SEARCH: 300,
    INPUT: 500,
    API_CALL: 1000
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100]
  },
  
  // Text truncation
  TEXT_TRUNCATION: {
    TITLE_LINES: 2,
    DESCRIPTION_LINES: 2,
    SINGLE_LINE: 1
  },
  
  // Modal sizes
  MODAL_SIZES: {
    SMALL: 'sm',
    MEDIUM: 'md',
    LARGE: 'lg',
    EXTRA_LARGE: 'xl'
  }
};

// ============================================================================
// SECURITY CONSTANTS
// ============================================================================

export const SECURITY_CONSTANTS = {
  // Content Security Policy
  CSP: {
    DEFAULT_SRC: "'self'",
    SCRIPT_SRC: "'self' 'unsafe-inline' 'unsafe-eval' http://localhost:4000 http://localhost:4001 http://localhost:4002 http://localhost:4003",
    STYLE_SRC: "'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
    FONT_SRC: "'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
    IMG_SRC: "'self' data: https:",
    CONNECT_SRC: "'self' http://localhost:* ws://localhost:* https://cdn.jsdelivr.net",
    FRAME_ANCESTORS: "'none'"
  },
  
  // Security headers
  HEADERS: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block'
  }
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  // Authentication errors
  AUTH: {
    LOGIN_REQUIRED: 'Please log in to access this feature',
    SESSION_EXPIRED: 'Your session has expired. Please log in again',
    INVALID_CREDENTIALS: 'Invalid username or password',
    ACCESS_DENIED: 'You do not have permission to perform this action'
  },
  
  // API errors
  API: {
    NETWORK_ERROR: 'Network error. Please check your connection',
    SERVER_ERROR: 'Server error. Please try again later',
    TIMEOUT: 'Request timeout. Please try again',
    NOT_FOUND: 'The requested resource was not found',
    UNAUTHORIZED: 'You are not authorized to perform this action'
  },
  
  // Validation errors
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
    USERNAME_TAKEN: 'This username is already taken',
    EMAIL_TAKEN: 'This email is already registered'
  },
  
  // General errors
  GENERAL: {
    UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again',
    LOADING_FAILED: 'Failed to load data. Please refresh the page',
    SAVE_FAILED: 'Failed to save changes. Please try again',
    DELETE_FAILED: 'Failed to delete item. Please try again'
  }
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  // Authentication
  AUTH: {
    LOGIN_SUCCESS: 'Successfully logged in',
    LOGOUT_SUCCESS: 'Successfully logged out',
    REGISTRATION_SUCCESS: 'Account created successfully'
  },
  
  // CRUD operations
  CRUD: {
    CREATE_SUCCESS: 'Item created successfully',
    UPDATE_SUCCESS: 'Changes saved successfully',
    DELETE_SUCCESS: 'Item deleted successfully',
    BULK_DELETE_SUCCESS: 'Selected items deleted successfully'
  },
  
  // Notifications
  NOTIFICATIONS: {
    MARKED_READ: 'Notification marked as read',
    MARKED_UNREAD: 'Notification marked as unread',
    BULK_READ: 'All notifications marked as read'
  }
};

// ============================================================================
// THEME CONSTANTS
// ============================================================================

export const THEME_CONSTANTS = {
  // Color palette
  COLORS: {
    PRIMARY: '#0d6efd',
    SECONDARY: '#6c757d',
    SUCCESS: '#198754',
    DANGER: '#dc3545',
    WARNING: '#ffc107',
    INFO: '#0dcaf0',
    LIGHT: '#f8f9fa',
    DARK: '#212529'
  },
  
  // Breakpoints
  BREAKPOINTS: {
    XS: '576px',
    SM: '768px',
    MD: '992px',
    LG: '1200px',
    XL: '1400px'
  },
  
  // Spacing
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '3rem'
  }
};

// ============================================================================
// EXPORT ALL CONSTANTS
// ============================================================================

// Re-export all constants for easy importing
export default {
  API_CONFIG,
  MICROFRONTEND_CONFIG,
  TASK_CONSTANTS,
  USER_CONSTANTS,
  NOTIFICATION_CONSTANTS,
  UI_CONSTANTS,
  SECURITY_CONSTANTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  THEME_CONSTANTS
};
