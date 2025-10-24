/**
 * Shared Backend Constants
 * Centralized constants for all backend services
 */

const BACKEND_CONSTANTS = {
  // Service Configuration
  SERVICES: {
    USER: {
      PORT: 3001,
      URL: 'http://localhost:3001',
      NAME: 'User Service'
    },
    TASK: {
      PORT: 3002,
      URL: 'http://localhost:3002',
      NAME: 'Task Service'
    },
    NOTIFICATION: {
      PORT: 3003,
      URL: 'http://localhost:3003',
      NAME: 'Notification Service'
    },
    API_GATEWAY: {
      PORT: 3000,
      URL: 'http://localhost:3000',
      NAME: 'API Gateway'
    }
  },

  // Database Configuration
  DATABASE: {
    CONNECTION_TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  },

  // JWT Configuration
  JWT: {
    EXPIRES_IN: '24h',
    REFRESH_EXPIRES_IN: '7d',
    ALGORITHM: 'HS256'
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // User Roles
  ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    MODERATOR: 'moderator'
  },

  // Task Status
  TASK_STATUS: {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },

  // Task Priority
  TASK_PRIORITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
  },

  // Notification Types
  NOTIFICATION_TYPES: {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    TASK_ASSIGNED: 'task_assigned',
    TASK_COMPLETED: 'task_completed',
    TASK_OVERDUE: 'task_overdue',
    TASK_COMMENT: 'task_comment'
  },

  // HTTP Status Codes
  HTTP_STATUS: {
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
  },

  // Error Messages
  ERROR_MESSAGES: {
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

  // Success Messages
  SUCCESS_MESSAGES: {
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

  // Validation Rules
  VALIDATION: {
    USERNAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 30,
      PATTERN: /^[a-zA-Z0-9_]+$/
    },
    PASSWORD: {
      MIN_LENGTH: 6,
      MAX_LENGTH: 128
    },
    EMAIL: {
      PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    TASK_TITLE: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 200
    },
    TASK_DESCRIPTION: {
      MAX_LENGTH: 1000
    }
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // limit each IP to 100 requests per windowMs
    LOGIN_MAX_REQUESTS: 5 // limit login attempts
  },

  // File Upload
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    UPLOAD_PATH: './uploads'
  },

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
  }
};

module.exports = BACKEND_CONSTANTS;
