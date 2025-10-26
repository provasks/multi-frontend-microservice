# Configuration Documentation - Task Management System

## 🏗️ Overview

The Task Management System uses a hierarchical, centralized configuration system that provides environment-specific settings, port-based configurations, and shared constants across all microfrontends and backend services.

## 📁 Configuration Structure

### **Frontend Configuration Hierarchy**
```
frontend/
├── shared-components/src/config/
│   ├── frontendConfig.js          # Central configuration hub
│   ├── idleTimeout.js            # Idle timeout configuration
│   ├── simpleConfig.js           # Browser-safe configuration
│   └── browserConfig.js          # Browser-specific settings
├── shell-app/src/config/
│   └── shellConfig.js            # Shell app specific config
└── microfrontends/*/src/config/
    ├── userAppConfig.js          # User app configuration
    ├── taskAppConfig.js          # Task app configuration
    └── notificationAppConfig.js  # Notification app configuration
```

### **Backend Configuration Hierarchy**
```
backend/
├── shared/config/
│   └── backendConfig.js          # Central backend configuration
├── shared/constants/
│   └── index.js                  # Shared constants
└── services/*/config/
    └── swagger.js                # Service-specific Swagger config
```

## 🔧 Frontend Configuration

### **Central Configuration Hub**
`frontend/shared-components/src/config/frontendConfig.js`

This is the main configuration file that serves as the central hub for all frontend configurations:

```javascript
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
  
  // API endpoints
  API_ENDPOINTS: {
    AUTH: 'http://localhost:3001/api',
    USERS: 'http://localhost:3001/api',
    TASKS: 'http://localhost:3002/api',
    NOTIFICATIONS: 'http://localhost:3003/api',
    API_GATEWAY: 'http://localhost:3000/api'
  }
};
```

### **Task Management Constants**
```javascript
const TASK_CONSTANTS = {
  PRIORITIES: {
    URGENT: 'urgent',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
  },
  
  STATUSES: {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },
  
  PRIORITY_CONFIG: {
    urgent: {
      label: 'Urgent',
      color: '#dc3545',
      bgClass: 'priority-urgent',
      icon: 'fas fa-exclamation-triangle',
      order: 1
    },
    // ... other priority configurations
  }
};
```

### **Idle Timeout Configuration**
```javascript
const IDLE_TIMEOUT = {
  DEFAULT_TIMEOUT: 2 * 60 * 1000, // 2 minutes
  DEFAULT_WARNING_TIME: 30 * 1000, // 30 seconds
  ENABLED: true,
  
  // Environment-specific overrides
  PRODUCTION: {
    TIMEOUT: 15 * 60 * 1000, // 15 minutes
    WARNING_TIME: 2 * 60 * 1000 // 2 minutes
  },
  
  DEVELOPMENT: {
    TIMEOUT: 2 * 60 * 1000, // 2 minutes
    WARNING_TIME: 30 * 1000 // 30 seconds
  },
  
  // Comprehensive activity detection
  ACTIVITY_EVENTS: [
    'mousedown', 'mousemove', 'mouseup', 'click', 'scroll',
    'keypress', 'keydown', 'keyup',
    'touchstart', 'touchend', 'touchmove',
    'pointerdown', 'pointerup', 'pointermove',
    'wheel', 'focus', 'blur', 'visibilitychange'
  ]
};
```

## 🖥️ Port-Specific Configurations

### **Shell App Configuration**
`frontend/shell-app/src/config/shellConfig.js`

```javascript
const SHELL_CONFIG = {
  APP: {
    NAME: 'Task Management Shell',
    PORT: 4000,
    DESCRIPTION: 'Main shell application orchestrating microfrontends'
  },
  
  NAVIGATION: {
    MAIN_MENU: [
      { path: '/', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
      { path: '/tasks', label: 'Tasks', icon: 'fas fa-tasks' },
      { path: '/users', label: 'Users', icon: 'fas fa-users' },
      { path: '/notifications', label: 'Notifications', icon: 'fas fa-bell' }
    ],
    
    TEST_MENU: [
      { path: '/test/redux', label: 'Redux Test', icon: 'fas fa-cogs' },
      { path: '/test/idle-timeout', label: 'Idle Timeout Test', icon: 'fas fa-clock' },
      { path: '/test/error', label: 'Error Testing', icon: 'fas fa-exclamation-triangle' }
    ],
    
    USER_MENU: [
      { path: '/profile', label: 'Profile', icon: 'fas fa-user' },
      { path: '/settings', label: 'Settings', icon: 'fas fa-cog' }
    ]
  }
};
```

### **Microfrontend Configurations**

#### **User App Configuration**
`frontend/microfrontends/user-app/src/config/userAppConfig.js`

```javascript
const USER_APP_CONFIG = {
  APP: {
    NAME: 'User Management',
    PORT: 4001,
    DESCRIPTION: 'User management microfrontend'
  },
  
  FEATURES: {
    USER_REGISTRATION: true,
    USER_PROFILE_EDITING: true,
    USER_DEACTIVATION: true,
    PASSWORD_RESET: true
  },
  
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 8,
    USERNAME_MIN_LENGTH: 3,
    EMAIL_VALIDATION: true
  }
};
```

#### **Task App Configuration**
`frontend/microfrontends/task-app/src/config/taskAppConfig.js`

```javascript
const TASK_APP_CONFIG = {
  APP: {
    NAME: 'Task Management',
    PORT: 4002,
    DESCRIPTION: 'Task management microfrontend'
  },
  
  FEATURES: {
    TASK_CREATION: true,
    TASK_EDITING: true,
    TASK_DELETION: true,
    TASK_FILTERING: true,
    TASK_SEARCH: true,
    TASK_PRIORITY: true,
    TASK_STATUS: true
  },
  
  UI: {
    ITEMS_PER_PAGE: 10,
    SEARCH_DEBOUNCE: 300,
    AUTO_REFRESH_INTERVAL: 30000
  }
};
```

## 🔧 Backend Configuration

### **Central Backend Configuration**
`backend/shared/config/backendConfig.js`

```javascript
const BACKEND_CONFIG = {
  // Application metadata
  APP: {
    NAME: 'Task Management System Backend',
    VERSION: '1.0.0',
    DESCRIPTION: 'Microservices backend for task management'
  },
  
  // Service ports
  PORTS: {
    API_GATEWAY: 3000,
    USER_SERVICE: 3001,
    TASK_SERVICE: 3002,
    NOTIFICATION_SERVICE: 3003
  },
  
  // Database configuration
  DATABASE: {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/tms',
    CONNECTION_OPTIONS: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    }
  },
  
  // Security configuration
  SECURITY: {
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRES_IN: '24h',
    BCRYPT_ROUNDS: 12,
    RATE_LIMIT: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX_REQUESTS: 100,
      LOGIN_MAX_REQUESTS: 5
    }
  }
};
```

### **Shared Constants**
`backend/shared/constants/index.js`

```javascript
const BACKEND_CONSTANTS = {
  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
  },
  
  // Validation Messages
  VALIDATION: {
    REQUIRED: 'This field is required',
    EMAIL_INVALID: 'Please provide a valid email address',
    PASSWORD_WEAK: 'Password must be at least 8 characters long',
    USERNAME_EXISTS: 'Username already exists',
    EMAIL_EXISTS: 'Email already exists'
  },
  
  // Task Constants
  TASK: {
    PRIORITIES: ['urgent', 'high', 'medium', 'low'],
    STATUSES: ['pending', 'in_progress', 'completed', 'cancelled'],
    MAX_TITLE_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 1000
  }
};
```

## 🌍 Environment Configuration

### **Environment Detection**
The system automatically detects the environment and applies appropriate configurations:

```javascript
// Environment detection utility
const getEnvironment = () => {
  if (typeof window !== 'undefined') {
    if (window.IDLE_TIMEOUT_TESTING === 'true') return 'testing';
    if (window.NODE_ENV) return window.NODE_ENV;
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
};
```

### **Environment-Specific Overrides**

#### **Development Environment**
- **Rate Limiting**: Disabled or very lenient
- **Logging**: Verbose console logging
- **CORS**: Permissive for localhost
- **Timeouts**: Shorter for faster development

#### **Production Environment**
- **Rate Limiting**: Strict limits enabled
- **Logging**: Structured logging to files
- **CORS**: Restricted to specific domains
- **Timeouts**: Longer for stability

#### **Testing Environment**
- **Rate Limiting**: Disabled
- **Logging**: Minimal logging
- **Mock Data**: Use mock data for testing
- **Timeouts**: Very short for quick tests

## 🔄 Configuration Loading

### **Frontend Configuration Loading**
```javascript
// Browser-safe configuration loading
const loadConfig = () => {
  try {
    // Try to load from shared components
    const sharedConfig = require('sharedComponents/frontendConfig');
    return sharedConfig;
  } catch (error) {
    // Fallback to local configuration
    return require('./localConfig');
  }
};
```

### **Backend Configuration Loading**
```javascript
// Backend configuration loading with environment variables
const loadBackendConfig = () => {
  const config = require('./backendConfig');
  
  // Override with environment variables
  if (process.env.MONGODB_URI) {
    config.DATABASE.MONGODB_URI = process.env.MONGODB_URI;
  }
  
  if (process.env.JWT_SECRET) {
    config.SECURITY.JWT_SECRET = process.env.JWT_SECRET;
  }
  
  return config;
};
```

## 🛠️ Configuration Management

### **Adding New Configuration**
1. **Identify Scope**: Determine if it's frontend, backend, or shared
2. **Choose Location**: Add to appropriate configuration file
3. **Environment Override**: Add environment-specific overrides if needed
4. **Documentation**: Update this documentation
5. **Testing**: Test in all environments

### **Modifying Existing Configuration**
1. **Backward Compatibility**: Ensure changes don't break existing functionality
2. **Environment Testing**: Test in development, production, and testing
3. **Documentation Update**: Update relevant documentation
4. **Migration Guide**: Provide migration instructions if needed

### **Configuration Validation**
```javascript
// Configuration validation utility
const validateConfig = (config) => {
  const required = ['APP', 'PORTS', 'API_ENDPOINTS'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }
  
  return true;
};
```

## 📊 Configuration Monitoring

### **Configuration Health Check**
```javascript
// Health check endpoint for configuration
app.get('/config/health', (req, res) => {
  const config = loadConfig();
  const health = {
    status: 'healthy',
    environment: getEnvironment(),
    configLoaded: !!config,
    timestamp: new Date().toISOString()
  };
  
  res.json(health);
});
```

### **Configuration Logging**
```javascript
// Log configuration on startup
const logConfiguration = (config) => {
  console.log('Configuration loaded:', {
    environment: getEnvironment(),
    appName: config.APP.NAME,
    version: config.APP.VERSION,
    ports: config.PORTS,
    timestamp: new Date().toISOString()
  });
};
```

## 🚀 Best Practices

### **Configuration Design**
- **Centralized**: Keep common configurations in shared files
- **Environment-aware**: Different settings for different environments
- **Type-safe**: Use TypeScript for configuration interfaces
- **Validated**: Validate configuration on startup
- **Documented**: Document all configuration options

### **Security Considerations**
- **Sensitive Data**: Never commit sensitive data to version control
- **Environment Variables**: Use environment variables for secrets
- **Validation**: Validate all configuration inputs
- **Access Control**: Restrict access to configuration endpoints

### **Performance Optimization**
- **Lazy Loading**: Load configurations only when needed
- **Caching**: Cache frequently accessed configurations
- **Minimal Overhead**: Keep configuration loading lightweight
- **Efficient Lookups**: Use efficient data structures for lookups

## 🔧 Troubleshooting

### **Common Issues**

#### **1. Configuration Not Loading**
**Symptoms**: Application fails to start or uses default values
**Solutions**:
- Check file paths and imports
- Verify environment variables
- Check for syntax errors in configuration files

#### **2. Environment Detection Issues**
**Symptoms**: Wrong environment detected, incorrect settings applied
**Solutions**:
- Check NODE_ENV environment variable
- Verify hostname detection logic
- Test environment detection function

#### **3. Configuration Conflicts**
**Symptoms**: Conflicting settings between different configuration files
**Solutions**:
- Review configuration hierarchy
- Check for duplicate settings
- Ensure proper override order

### **Debug Commands**
```bash
# Check environment variables
echo $NODE_ENV

# Check configuration loading
node -e "console.log(require('./config/frontendConfig'))"

# Test environment detection
node -e "console.log(require('./utils/envConfig').getEnvironment())"
```

## 📈 Future Enhancements

### **Planned Features**
- **Dynamic Configuration**: Runtime configuration updates
- **Configuration UI**: Web interface for configuration management
- **Configuration Versioning**: Track configuration changes
- **Hot Reloading**: Reload configuration without restart
- **Configuration Templates**: Pre-built configuration templates

### **Advanced Features**
- **Configuration Encryption**: Encrypt sensitive configuration data
- **Configuration Backup**: Automatic configuration backup
- **Configuration Sync**: Sync configuration across services
- **Configuration Analytics**: Track configuration usage patterns
