/**
 * Shared Frontend Configuration (Port 4004 - Shared Components)
 * Common configurations used across all frontend microfrontends
 * This is the central configuration hub for all frontend services
 */

// ============================================================================
// FRONTEND APPLICATION CONFIGURATION
// ============================================================================

const FRONTEND_CONFIG = {
  // Application metadata
  APP: {
    NAME: 'Task Management System',
    VERSION: '1.0.0',
    DESCRIPTION: 'Microservices-based task management application'
  },
  
  // Port-specific configurations
  PORTS: {
    SHELL_APP: 4000,
    USER_APP: 4001,
    TASK_APP: 4002,
    NOTIFICATION_APP: 4003,
    SHARED_COMPONENTS: 4004
  },
  
  // Microfrontend remote entries
  REMOTES: {
    USER_APP: 'userApp@http://localhost:4001/remoteEntry.js',
    TASK_APP: 'taskApp@http://localhost:4002/remoteEntry.js',
    NOTIFICATION_APP: 'notificationApp@http://localhost:4003/remoteEntry.js',
    SHARED_COMPONENTS: 'sharedComponents@http://localhost:4004/remoteEntry.js'
  },
  
  // API endpoints (backend services)
  API_ENDPOINTS: {
    AUTH: 'http://localhost:3001/api',
    USERS: 'http://localhost:3001/api',
    TASKS: 'http://localhost:3002/api',
    NOTIFICATIONS: 'http://localhost:3003/api',
    API_GATEWAY: 'http://localhost:3000/api'
  }
};

// ============================================================================
// TASK MANAGEMENT CONSTANTS (Port 4002 - Task App)
// ============================================================================

const TASK_CONSTANTS = {
  // Task priorities
  PRIORITIES: {
    URGENT: 'urgent',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
  },
  
  // Task statuses
  STATUSES: {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },
  
  // Priority display configuration
  PRIORITY_CONFIG: {
    urgent: {
      label: 'Urgent',
      color: '#dc3545',
      bgClass: 'priority-urgent',
      icon: 'fas fa-exclamation-triangle',
      order: 1
    },
    high: {
      label: 'High',
      color: '#ffc107',
      bgClass: 'priority-high',
      icon: 'fas fa-arrow-up',
      order: 2
    },
    medium: {
      label: 'Medium',
      color: '#0dcaf0',
      bgClass: 'priority-medium',
      icon: 'fas fa-minus',
      order: 3
    },
    low: {
      label: 'Low',
      color: '#198754',
      bgClass: 'priority-low',
      icon: 'fas fa-arrow-down',
      order: 4
    }
  },
  
  // Status display configuration
  STATUS_CONFIG: {
    pending: {
      label: 'Pending',
      color: '#6c757d',
      bgClass: 'status-pending',
      icon: 'fas fa-clock',
      order: 1
    },
    in_progress: {
      label: 'In Progress',
      color: '#0d6efd',
      bgClass: 'status-in-progress',
      icon: 'fas fa-spinner',
      order: 2
    },
    completed: {
      label: 'Completed',
      color: '#198754',
      bgClass: 'status-completed',
      icon: 'fas fa-check',
      order: 3
    },
    cancelled: {
      label: 'Cancelled',
      color: '#dc3545',
      bgClass: 'status-cancelled',
      icon: 'fas fa-times',
      order: 4
    }
  },
  
  // Default form values
  DEFAULT_FORM: {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: '',
    dueDate: null
  },
  
  // Validation rules
  VALIDATION: {
    TITLE: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 200,
      REQUIRED: true
    },
    DESCRIPTION: {
      MAX_LENGTH: 1000,
      REQUIRED: false
    }
  }
};

// ============================================================================
// USER MANAGEMENT CONSTANTS (Port 4001 - User App)
// ============================================================================

const USER_CONSTANTS = {
  // User roles
  ROLES: {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    USER: 'user'
  },
  
  // Role display configuration
  ROLE_CONFIG: {
    admin: {
      label: 'Administrator',
      color: '#dc3545',
      bgClass: 'bg-danger',
      icon: 'fas fa-crown',
      permissions: ['all']
    },
    moderator: {
      label: 'Moderator',
      color: '#ffc107',
      bgClass: 'bg-warning text-dark',
      icon: 'fas fa-shield-alt',
      permissions: ['read', 'write', 'moderate']
    },
    user: {
      label: 'User',
      color: '#6c757d',
      bgClass: 'bg-secondary',
      icon: 'fas fa-user',
      permissions: ['read', 'write']
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
  },
  
  // Validation rules
  VALIDATION: {
    USERNAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 30,
      PATTERN: /^[a-zA-Z0-9_]+$/,
      REQUIRED: true
    },
    PASSWORD: {
      MIN_LENGTH: 6,
      MAX_LENGTH: 128,
      REQUIRED: true
    },
    EMAIL: {
      PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      REQUIRED: true
    },
    NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 50,
      REQUIRED: true
    }
  }
};

// ============================================================================
// NOTIFICATION CONSTANTS (Port 4003 - Notification App)
// ============================================================================

const NOTIFICATION_CONSTANTS = {
  // Notification types
  TYPES: {
    SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    TASK_ASSIGNED: 'task_assigned',
    TASK_COMPLETED: 'task_completed',
    TASK_OVERDUE: 'task_overdue',
    TASK_COMMENT: 'task_comment'
  },
  
  // Type display configuration
  TYPE_CONFIG: {
    success: {
      label: 'Success',
      color: '#198754',
      bgClass: 'bg-success',
      icon: 'fas fa-check-circle',
      autoDismiss: 4000
    },
    info: {
      label: 'Info',
      color: '#0dcaf0',
      bgClass: 'bg-info',
      icon: 'fas fa-info-circle',
      autoDismiss: 5000
    },
    warning: {
      label: 'Warning',
      color: '#ffc107',
      bgClass: 'bg-warning',
      icon: 'fas fa-exclamation-triangle',
      autoDismiss: 6000
    },
    error: {
      label: 'Error',
      color: '#dc3545',
      bgClass: 'bg-danger',
      icon: 'fas fa-times-circle',
      autoDismiss: 8000
    },
    task_assigned: {
      label: 'Task Assigned',
      color: '#0d6efd',
      bgClass: 'bg-primary',
      icon: 'fas fa-user-plus',
      autoDismiss: 0
    },
    task_completed: {
      label: 'Task Completed',
      color: '#198754',
      bgClass: 'bg-success',
      icon: 'fas fa-check',
      autoDismiss: 0
    },
    task_overdue: {
      label: 'Task Overdue',
      color: '#dc3545',
      bgClass: 'bg-danger',
      icon: 'fas fa-exclamation',
      autoDismiss: 0
    },
    task_comment: {
      label: 'Task Comment',
      color: '#6c757d',
      bgClass: 'bg-secondary',
      icon: 'fas fa-comment',
      autoDismiss: 0
    }
  },
  
  // Auto-dismiss timing
  AUTO_DISMISS: {
    SUCCESS: 4000,
    INFO: 5000,
    WARNING: 6000,
    ERROR: 8000,
    TASK_ASSIGNED: 0,
    TASK_COMPLETED: 0,
    TASK_OVERDUE: 0,
    TASK_COMMENT: 0
  },
  
  // Validation rules
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
    }
  }
};

// ============================================================================
// SHARED COMPONENTS CONFIGURATION (Port 4004 - Shared Components)
// ============================================================================

const SHARED_COMPONENTS_CONFIG = {
  // Idle timeout configuration
  IDLE_TIMEOUT: {
    DEFAULT_TIMEOUT: 2 * 60 * 1000, // 2 minutes
    DEFAULT_WARNING_TIME: 30 * 1000, // 30 seconds
    ENABLED: true,
    
    // Environment-specific overrides
    PRODUCTION: {
      TIMEOUT: 15 * 60 * 1000, // 15 minutes
      WARNING_TIME: 1 * 60 * 1000 // 2 minutes
    },
    
    DEVELOPMENT: {
      TIMEOUT: 5 * 60 * 1000, // 2 minutes (same as default)
      WARNING_TIME: 30 * 1000 // 30 seconds (same as default)
    },
    
    // For testing purposes, you can override with shorter times:
    // TESTING: {
    //   TIMEOUT: 30 * 1000, // 30 seconds for testing
    //   WARNING_TIME: 10 * 1000 // 10 seconds for testing
    // },
    
    // Activity events - Comprehensive detection for all input methods
    ACTIVITY_EVENTS: [
      // Mouse events
      'mousedown', 'mousemove', 'mouseup', 'mouseenter', 'mouseleave',
      'mouseover', 'mouseout', 'mouseenter', 'mouseleave',
      
      // Keyboard events
      'keypress', 'keydown', 'keyup',
      
      // Touch events (mobile/touchpad)
      'touchstart', 'touchend', 'touchmove', 'touchcancel',
      
      // Touchpad-specific events (laptop) - Comprehensive pointer events
      'pointerdown', 'pointerup', 'pointermove', 'pointerenter', 'pointerleave',
      'pointerover', 'pointerout', 'pointercancel', 'gotpointercapture', 'lostpointercapture',
      
      // Wheel events (scroll wheel, touchpad scroll)
      'wheel', 'scroll',
      
      // Click events
      'click', 'dblclick', 'contextmenu',
      
      // Focus events
      'focus', 'blur', 'focusin', 'focusout',
      
      // Form events
      'input', 'change', 'submit', 'reset',
      
      // Window events
      'resize', 'orientationchange',
      
      // Drag events (touchpad gestures)
      'dragstart', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'drop',
      
      // Additional touchpad gesture events
      'gesturestart', 'gesturechange', 'gestureend', 'gesturecancel',
      
      // Selection events
      'select', 'selectstart', 'selectend',
      
      // Media events (video/audio interaction)
      'play', 'pause', 'seeked', 'volumechange',
      
      // Custom events for better detection
      'visibilitychange', 'pageshow', 'pagehide'
    ],
    
    // Validation limits
    MIN_TIMEOUT: 1 * 60 * 1000, // 1 minute
    MAX_TIMEOUT: 60 * 60 * 1000, // 60 minutes
    MIN_WARNING_TIME: 5 * 1000, // 5 seconds
    MAX_WARNING_TIME: 5 * 60 * 1000, // 5 minutes
    
    // Preset configurations
    PRESETS: [
      { label: '1 minute', value: 1, timeout: 1 * 60 * 1000 },
      { label: '2 minutes', value: 2, timeout: 2 * 60 * 1000 },
      { label: '5 minutes', value: 5, timeout: 5 * 60 * 1000 },
      { label: '10 minutes', value: 10, timeout: 10 * 60 * 1000 },
      { label: '15 minutes', value: 15, timeout: 15 * 60 * 1000 },
      { label: '30 minutes', value: 30, timeout: 30 * 60 * 1000 }
    ],
    
    // Warning message templates
    MESSAGES: {
      WARNING: 'You will be automatically logged out due to inactivity in {time}',
      TIMEOUT: 'Your session has expired due to inactivity. Please log in again.',
      RESET: 'Session timeout reset. You are now active.',
      PAUSED: 'Session timeout paused. You will not be logged out automatically.',
      RESUMED: 'Session timeout resumed. You will be logged out after {time} of inactivity.'
    },
    
    // Storage keys
    STORAGE_KEYS: {
      TIMEOUT: 'idleTimeout_timeout',
      WARNING_TIME: 'idleTimeout_warningTime',
      ENABLED: 'idleTimeout_enabled'
    }
  },
  
  // UI constants
  UI: {
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
    },
    
    // Loading states
    LOADING: {
      GLOBAL: 'global',
      TASKS: 'tasks',
      NOTIFICATIONS: 'notifications',
      USERS: 'users'
    }
  },
  
  // Theme constants
  THEME: {
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
  }
};

// ============================================================================
// FRONTEND-SPECIFIC MESSAGES
// ============================================================================

const FRONTEND_MESSAGES = {
  // Error messages
  ERROR: {
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
      PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
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
  },
  
  // Success messages
  SUCCESS: {
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
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const UTILITY_FUNCTIONS = {
  // Format duration
  formatDuration: (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },
  
  // Format seconds
  formatSeconds: (ms) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  },
  
  // Validate duration
  isValidDuration: (minutes) => minutes >= 1 && minutes <= 60,
  
  // Validate warning time
  isValidWarning: (seconds) => seconds >= 5 && seconds <= 300,
  
  // Get environment
  getEnvironment: () => {
    // Check for testing mode override
    if (typeof window !== 'undefined') {
      if (window.IDLE_TIMEOUT_TESTING === 'true') return 'testing';
      if (window.NODE_ENV) return window.NODE_ENV;
      if (window.ENV) return window.ENV;
      if (window.location) {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return 'development';
        }
        return 'production';
      }
      return 'development';
    }
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.IDLE_TIMEOUT_TESTING === 'true') return 'testing';
      return process.env.NODE_ENV || 'development';
    }
    return 'development';
  }
};

// ============================================================================
// EXPORT CONFIGURATION
// ============================================================================

module.exports = {
  // Main configuration object
  FRONTEND_CONFIG,
  
  // Port-specific configurations
  TASK_CONSTANTS,
  USER_CONSTANTS,
  NOTIFICATION_CONSTANTS,
  SHARED_COMPONENTS_CONFIG,
  
  // Messages
  FRONTEND_MESSAGES,
  
  // Utilities
  UTILITY_FUNCTIONS
};
