/**
 * Backend Central Configuration
 * Service-specific configuration for all backend microservices
 */

// ============================================================================
// BACKEND APPLICATION CONFIGURATION
// ============================================================================

const BACKEND_CONFIG = {
  // Application metadata
  APP: {
    NAME: 'Task Management System Backend',
    VERSION: '1.0.0',
    DESCRIPTION: 'Microservices-based backend for task management'
  },
  
  // Service-specific configurations
  SERVICES: {
    API_GATEWAY: {
      PORT: 3000,
      URL: 'http://localhost:3000',
      NAME: 'API Gateway'
    },
    USER_SERVICE: {
      PORT: 3001,
      URL: 'http://localhost:3001',
      NAME: 'User Service'
    },
    TASK_SERVICE: {
      PORT: 3002,
      URL: 'http://localhost:3002',
      NAME: 'Task Service'
    },
    NOTIFICATION_SERVICE: {
      PORT: 3003,
      URL: 'http://localhost:3003',
      NAME: 'Notification Service'
    }
  }
};

// ============================================================================
// DATABASE CONFIGURATION
// ============================================================================

const DATABASE_CONFIG = {
  // Connection settings
  CONNECTION: {
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  },
  
  // MongoDB specific
  MONGODB: {
    DEFAULT_CONNECTION_STRING: 'mongodb://localhost:27017',
    DATABASE_NAME: 'task_management',
    COLLECTIONS: {
      USERS: 'users',
      TASKS: 'tasks',
      NOTIFICATIONS: 'notifications'
    }
  }
};

// ============================================================================
// AUTHENTICATION & SECURITY CONFIGURATION
// ============================================================================

const AUTH_CONFIG = {
  // JWT Configuration
  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES_IN: '24h',
    REFRESH_EXPIRES_IN: '7d',
    ALGORITHM: 'HS256'
  },
  
  // Password hashing
  PASSWORD: {
    SALT_ROUNDS: 12,
    MIN_LENGTH: 6,
    MAX_LENGTH: 128
  },
  
  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: process.env.NODE_ENV === 'development' ? 5 * 60 * 1000 : 15 * 60 * 1000,
    MAX_REQUESTS: process.env.NODE_ENV === 'development' ? 500 : 100,
    LOGIN_MAX_REQUESTS: process.env.NODE_ENV === 'development' ? 20 : 5
  },
  
  // Security headers
  SECURITY_HEADERS: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'"
  }
};

// ============================================================================
// API GATEWAY CONFIGURATION (Port 3000)
// ============================================================================

const API_GATEWAY_CONFIG = {
  // CORS Configuration
  CORS: {
    ORIGINS: [
      'http://localhost:3000',
      'http://localhost:4000',
      'http://localhost:4001',
      'http://localhost:4002',
      'http://localhost:4003',
      'http://localhost:4004'
    ],
    METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With']
  },
  
  // Request routing
  ROUTES: {
    AUTH: '/api/auth',
    USERS: '/api/users',
    TASKS: '/api/tasks',
    NOTIFICATIONS: '/api/notifications'
  },
  
  // Load balancing
  LOAD_BALANCER: {
    STRATEGY: 'round-robin',
    HEALTH_CHECK_INTERVAL: 30000
  }
};

// ============================================================================
// USER SERVICE CONFIGURATION (Port 3001)
// ============================================================================

const USER_SERVICE_CONFIG = {
  // User roles
  ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    MODERATOR: 'moderator'
  },
  
  // Role permissions
  ROLE_PERMISSIONS: {
    admin: ['all'],
    moderator: ['read', 'write', 'moderate'],
    user: ['read', 'write']
  },
  
  // User validation
  VALIDATION: {
    USERNAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 30,
      PATTERN: /^[a-zA-Z0-9_]+$/
    },
    EMAIL: {
      PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 50
    }
  },
  
  // Default user settings
  DEFAULT_SETTINGS: {
    ROLE: 'user',
    IS_ACTIVE: true,
    EMAIL_VERIFIED: false
  }
};

// ============================================================================
// TASK SERVICE CONFIGURATION (Port 3002)
// ============================================================================

const TASK_SERVICE_CONFIG = {
  // Task priorities
  PRIORITIES: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
  },
  
  // Task statuses
  STATUSES: {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },
  
  // Task validation
  VALIDATION: {
    TITLE: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 200
    },
    DESCRIPTION: {
      MAX_LENGTH: 1000
    }
  },
  
  // Task lifecycle
  LIFECYCLE: {
    AUTO_ARCHIVE_DAYS: 30,
    OVERDUE_CHECK_INTERVAL: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// ============================================================================
// NOTIFICATION SERVICE CONFIGURATION (Port 3003)
// ============================================================================

const NOTIFICATION_SERVICE_CONFIG = {
  // Notification types
  TYPES: {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    TASK_ASSIGNED: 'task_assigned',
    TASK_COMPLETED: 'task_completed',
    TASK_OVERDUE: 'task_overdue',
    TASK_COMMENT: 'task_comment'
  },
  
  // Notification validation
  VALIDATION: {
    TITLE: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 100
    },
    MESSAGE: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 500
    }
  },
  
  // Notification settings
  SETTINGS: {
    AUTO_DISMISS: {
      SUCCESS: 4000,
      INFO: 5000,
      WARNING: 6000,
      ERROR: 8000
    },
    BATCH_SIZE: 100,
    PROCESSING_INTERVAL: 60000 // 1 minute
  }
};

// ============================================================================
// HTTP STATUS CODES
// ============================================================================

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// ============================================================================
// BACKEND-SPECIFIC MESSAGES
// ============================================================================

const BACKEND_MESSAGES = {
  // Error messages
  ERROR: {
    VALIDATION_FAILED: 'Validation failed',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    CONFLICT: 'Resource already exists',
    INTERNAL_ERROR: 'Internal server error',
    SERVICE_UNAVAILABLE: 'Service unavailable',
    INVALID_TOKEN: 'Invalid token',
    TOKEN_EXPIRED: 'Token expired',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_NOT_FOUND: 'User not found',
    TASK_NOT_FOUND: 'Task not found',
    NOTIFICATION_NOT_FOUND: 'Notification not found'
  },
  
  // Success messages
  SUCCESS: {
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    TASK_CREATED: 'Task created successfully',
    TASK_UPDATED: 'Task updated successfully',
    TASK_DELETED: 'Task deleted successfully',
    NOTIFICATION_CREATED: 'Notification created successfully',
    NOTIFICATION_UPDATED: 'Notification updated successfully',
    NOTIFICATION_DELETED: 'Notification deleted successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful'
  },
  
  // Validation messages
  VALIDATION: {
    // Username validation messages
    USERNAME_ALPHANUM: 'Username must contain only alphanumeric characters',
    USERNAME_MIN_LENGTH: 'Username must be at least 3 characters long',
    USERNAME_MAX_LENGTH: 'Username cannot exceed 30 characters',
    USERNAME_REQUIRED: 'Username is required',
    
    // Email validation messages
    EMAIL_INVALID: 'Please provide a valid email address',
    EMAIL_REQUIRED: 'Email is required',
    
    // Password validation messages
    PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters long',
    PASSWORD_MAX_LENGTH: 'Password cannot exceed 128 characters',
    PASSWORD_REQUIRED: 'Password is required',
    
    // Name validation messages
    FIRST_NAME_REQUIRED: 'First name is required',
    FIRST_NAME_MAX_LENGTH: 'First name cannot exceed 50 characters',
    LAST_NAME_REQUIRED: 'Last name is required',
    LAST_NAME_MAX_LENGTH: 'Last name cannot exceed 50 characters',
    
    // Task validation messages
    TASK_TITLE_REQUIRED: 'Task title is required',
    TASK_TITLE_MAX_LENGTH: 'Task title cannot exceed 200 characters',
    TASK_DESCRIPTION_MAX_LENGTH: 'Task description cannot exceed 1000 characters',
    TASK_PRIORITY_INVALID: 'Priority must be low, medium, high, or urgent',
    TASK_STATUS_INVALID: 'Status must be pending, in-progress, completed, or cancelled',
    
    // Notification validation messages
    NOTIFICATION_TITLE_REQUIRED: 'Notification title is required',
    NOTIFICATION_TITLE_MAX_LENGTH: 'Notification title cannot exceed 100 characters',
    NOTIFICATION_MESSAGE_REQUIRED: 'Notification message is required',
    NOTIFICATION_TYPE_INVALID: 'Type must be info, success, warning, or error',
    
    // ID validation messages
    USER_ID_INVALID: 'Invalid user ID format',
    USER_ID_REQUIRED: 'User ID is required',
    TASK_ID_INVALID: 'Invalid task ID format',
    TASK_ID_REQUIRED: 'Task ID is required',
    NOTIFICATION_ID_INVALID: 'Invalid notification ID format',
    NOTIFICATION_ID_REQUIRED: 'Notification ID is required',
    
    // Query validation messages
    PAGE_INVALID: 'Page must be a positive integer',
    LIMIT_INVALID: 'Limit must be between 1 and 100',
    SEARCH_MAX_LENGTH: 'Search term cannot exceed 100 characters',
    
    // Role validation messages
    ROLE_INVALID: 'Role must be user, admin, or moderator',
    
    // General validation messages
    FIELD_REQUIRED: 'This field is required',
    FIELD_INVALID: 'Invalid field value',
    FIELD_TOO_LONG: 'Field value is too long',
    FIELD_TOO_SHORT: 'Field value is too short'
  }
};

// ============================================================================
// FILE UPLOAD CONFIGURATION
// ============================================================================

const FILE_UPLOAD_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  UPLOAD_PATH: './uploads',
  TEMP_PATH: './temp'
};

// ============================================================================
// LOGGING CONFIGURATION
// ============================================================================

const LOGGING_CONFIG = {
  LEVEL: process.env.LOG_LEVEL || 'info',
  FORMAT: 'combined',
  DIRECTORY: './logs',
  MAX_SIZE: '10m',
  MAX_FILES: 5,
  DATE_PATTERN: 'YYYY-MM-DD'
};

// ============================================================================
// EXPORT CONFIGURATION
// ============================================================================

module.exports = {
  // Main configuration object
  BACKEND_CONFIG,
  
  // Service-specific configurations
  DATABASE_CONFIG,
  AUTH_CONFIG,
  API_GATEWAY_CONFIG,
  USER_SERVICE_CONFIG,
  TASK_SERVICE_CONFIG,
  NOTIFICATION_SERVICE_CONFIG,
  
  // HTTP and messages
  HTTP_STATUS,
  BACKEND_MESSAGES,
  
  // Additional configurations
  FILE_UPLOAD_CONFIG,
  LOGGING_CONFIG
};
