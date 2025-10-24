# Constants Management Documentation

## Overview

This document outlines the centralized constants management system implemented across the microfrontend architecture. The system provides a single source of truth for all static values, configuration settings, and constants used throughout the application.

## Table of Contents

1. [Architecture](#architecture)
2. [Constants Structure](#constants-structure)
3. [Usage Examples](#usage-examples)
4. [Best Practices](#best-practices)
5. [Migration Guide](#migration-guide)
6. [Maintenance](#maintenance)

## Architecture

### Centralized Constants System

```
frontend/shared-components/src/constants/
├── index.js                    # Main constants file
└── (future: specialized files) # Domain-specific constants
```

### Module Federation Integration

The constants are exposed through Webpack Module Federation, making them available to all microfrontends:

```javascript
// webpack.config.js
exposes: {
  './constants': './src/constants'
}
```

### Import Pattern

```javascript
// In any microfrontend
import { 
  TASK_CONSTANTS, 
  USER_CONSTANTS, 
  API_CONFIG 
} from 'sharedComponents/constants';
```

## Constants Structure

### 1. API Configuration (`API_CONFIG`)

```javascript
export const API_CONFIG = {
  BASE_URLS: {
    AUTH: 'http://localhost:3001/api',
    USERS: 'http://localhost:3001/api', 
    TASKS: 'http://localhost:3002/api',
    NOTIFICATIONS: 'http://localhost:3003/api'
  },
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
```

**Usage:**
```javascript
// Before
const response = await fetch('http://localhost:3002/api/tasks', {
  timeout: 30000
});

// After
const response = await fetch(`${API_CONFIG.BASE_URLS.TASKS}/tasks`, {
  timeout: API_CONFIG.TIMEOUTS.DEFAULT
});
```

### 2. Task Constants (`TASK_CONSTANTS`)

```javascript
export const TASK_CONSTANTS = {
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
    [PRIORITIES.URGENT]: {
      label: 'Urgent',
      color: '#dc3545',
      bgClass: 'priority-urgent',
      icon: 'fas fa-exclamation-triangle'
    },
    // ... other priorities
  },
  DEFAULT_FORM: {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: ''
  }
};
```

**Usage:**
```javascript
// Before
const [formData, setFormData] = useState({
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
  assignedTo: ''
});

// After
const [formData, setFormData] = useState(TASK_CONSTANTS.DEFAULT_FORM);
```

### 3. User Constants (`USER_CONSTANTS`)

```javascript
export const USER_CONSTANTS = {
  ROLES: {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    USER: 'user'
  },
  ROLE_CONFIG: {
    [ROLES.ADMIN]: {
      label: 'Administrator',
      color: '#dc3545',
      bgClass: 'bg-danger',
      icon: 'fas fa-crown'
    },
    // ... other roles
  },
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
```

### 4. Notification Constants (`NOTIFICATION_CONSTANTS`)

```javascript
export const NOTIFICATION_CONSTANTS = {
  TYPES: {
    SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error'
  },
  TYPE_CONFIG: {
    [TYPES.SUCCESS]: {
      label: 'Success',
      color: '#198754',
      bgClass: 'bg-success',
      icon: 'fas fa-check-circle'
    },
    // ... other types
  },
  AUTO_DISMISS: {
    SUCCESS: 4000,
    INFO: 5000,
    WARNING: 6000,
    ERROR: 8000
  }
};
```

### 5. UI Constants (`UI_CONSTANTS`)

```javascript
export const UI_CONSTANTS = {
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  DEBOUNCE: {
    SEARCH: 300,
    INPUT: 500,
    API_CALL: 1000
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100]
  },
  TEXT_TRUNCATION: {
    TITLE_LINES: 2,
    DESCRIPTION_LINES: 2,
    SINGLE_LINE: 1
  }
};
```

### 6. Error Messages (`ERROR_MESSAGES`)

```javascript
export const ERROR_MESSAGES = {
  AUTH: {
    LOGIN_REQUIRED: 'Please log in to access this feature',
    SESSION_EXPIRED: 'Your session has expired. Please log in again',
    INVALID_CREDENTIALS: 'Invalid username or password'
  },
  API: {
    NETWORK_ERROR: 'Network error. Please check your connection',
    SERVER_ERROR: 'Server error. Please try again later',
    TIMEOUT: 'Request timeout. Please try again'
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long'
  }
};
```

## Usage Examples

### 1. Component Implementation

```javascript
// TaskItem.jsx
import { TASK_CONSTANTS } from 'sharedComponents/constants';

const TaskItem = ({ task }) => {
  return (
    <span className={`badge rounded-pill priority-badge ${
      TASK_CONSTANTS.PRIORITY_CONFIG[task.priority]?.bgClass || 'priority-low'
    }`}>
      {TASK_CONSTANTS.PRIORITY_CONFIG[task.priority]?.label || task.priority}
    </span>
  );
};
```

### 2. Hook Implementation

```javascript
// useTaskManagement.js
import { TASK_CONSTANTS } from 'sharedComponents/constants';

export const useTaskManagement = () => {
  const [formData, setFormData] = useState(TASK_CONSTANTS.DEFAULT_FORM);
  
  const resetForm = () => {
    setFormData(TASK_CONSTANTS.DEFAULT_FORM);
  };
  
  // ... rest of hook
};
```

### 3. API Client Implementation

```javascript
// unifiedApiClient.js
import { API_CONFIG } from '../constants';

export const taskApi = axios.create({
  baseURL: API_CONFIG.BASE_URLS.TASKS,
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### 4. Error Handling

```javascript
// ErrorHandler.js
import { ERROR_MESSAGES } from 'sharedComponents/constants';

const handleApiError = (error) => {
  if (error.code === 'NETWORK_ERROR') {
    showError(ERROR_MESSAGES.API.NETWORK_ERROR);
  } else if (error.response?.status === 401) {
    showError(ERROR_MESSAGES.AUTH.SESSION_EXPIRED);
  }
};
```

## Best Practices

### 1. Naming Conventions

- **Constants**: Use `SCREAMING_SNAKE_CASE`
- **Objects**: Use `PascalCase` for main objects
- **Properties**: Use `camelCase` for object properties

```javascript
// ✅ Good
export const TASK_CONSTANTS = {
  PRIORITIES: {
    URGENT: 'urgent'
  },
  priorityConfig: {
    urgent: { label: 'Urgent' }
  }
};

// ❌ Bad
export const taskConstants = {
  priorities: {
    urgent: 'urgent'
  }
};
```

### 2. Organization

- Group related constants together
- Use descriptive names
- Provide fallback values
- Include configuration objects for UI elements

```javascript
// ✅ Good - Complete configuration
PRIORITY_CONFIG: {
  [PRIORITIES.URGENT]: {
    label: 'Urgent',
    color: '#dc3545',
    bgClass: 'priority-urgent',
    icon: 'fas fa-exclamation-triangle'
  }
}

// ❌ Bad - Just values
PRIORITIES: ['urgent', 'high', 'medium', 'low']
```

### 3. Type Safety

```javascript
// Use TypeScript for better type safety
export interface PriorityConfig {
  label: string;
  color: string;
  bgClass: string;
  icon: string;
}

export const PRIORITY_CONFIG: Record<string, PriorityConfig> = {
  // ... configuration
};
```

### 4. Environment-Specific Values

```javascript
// Use environment variables for different deployments
export const API_CONFIG = {
  BASE_URLS: {
    AUTH: process.env.REACT_APP_AUTH_URL || 'http://localhost:3001/api',
    TASKS: process.env.REACT_APP_TASKS_URL || 'http://localhost:3002/api'
  }
};
```

## Migration Guide

### Step 1: Identify Hardcoded Values

Search for hardcoded values in your codebase:

```bash
# Search for hardcoded URLs
grep -r "localhost:300" src/

# Search for hardcoded strings
grep -r "pending\|completed\|urgent\|high" src/

# Search for hardcoded timeouts
grep -r "timeout.*[0-9]" src/
```

### Step 2: Replace with Constants

```javascript
// Before
const response = await fetch('http://localhost:3002/api/tasks');

// After
import { API_CONFIG } from 'sharedComponents/constants';
const response = await fetch(`${API_CONFIG.BASE_URLS.TASKS}/tasks`);
```

### Step 3: Update Components

```javascript
// Before
<span className={`badge ${task.priority === 'urgent' ? 'bg-danger' : 'bg-secondary'}`}>
  {task.priority}
</span>

// After
<span className={`badge ${TASK_CONSTANTS.PRIORITY_CONFIG[task.priority]?.bgClass || 'bg-secondary'}`}>
  {TASK_CONSTANTS.PRIORITY_CONFIG[task.priority]?.label || task.priority}
</span>
```

### Step 4: Test Changes

- Verify all imports work correctly
- Test component rendering with different values
- Ensure fallback values work as expected
- Check that constants are properly exposed through module federation

## Maintenance

### Adding New Constants

1. **Identify the category** (API, UI, Business Logic, etc.)
2. **Add to appropriate section** in `constants/index.js`
3. **Update webpack configuration** if needed
4. **Rebuild shared-components**
5. **Update documentation**

### Updating Existing Constants

1. **Update the constant value** in `constants/index.js`
2. **Rebuild shared-components**
3. **Test all consuming components**
4. **Update documentation**

### Removing Constants

1. **Find all usages** across microfrontends
2. **Replace with new constants** or remove if no longer needed
3. **Remove from constants file**
4. **Rebuild and test**

### Version Control

- **Commit constants changes** with descriptive messages
- **Use semantic versioning** for breaking changes
- **Document changes** in CHANGELOG.md
- **Test across all microfrontends** before merging

## Benefits

### 1. Consistency
- **Single source of truth** for all static values
- **Consistent naming** across the application
- **Unified configuration** for similar features

### 2. Maintainability
- **Easy to update** values in one place
- **Clear organization** of related constants
- **Reduced duplication** of hardcoded values

### 3. Developer Experience
- **IntelliSense support** for constant values
- **Type safety** with TypeScript
- **Clear documentation** of available constants

### 4. Performance
- **Tree shaking** removes unused constants
- **Module federation** enables efficient sharing
- **Build optimization** through webpack

## Future Enhancements

### 1. TypeScript Migration
```typescript
export interface TaskConstants {
  priorities: Record<string, PriorityConfig>;
  statuses: Record<string, StatusConfig>;
  defaultForm: TaskFormData;
}
```

### 2. Environment-Specific Constants
```javascript
export const getConstants = (env) => ({
  API_CONFIG: env === 'production' ? PROD_API_CONFIG : DEV_API_CONFIG
});
```

### 3. Dynamic Constants
```javascript
export const getThemeConstants = (theme) => ({
  colors: theme === 'dark' ? DARK_COLORS : LIGHT_COLORS
});
```

### 4. Validation
```javascript
export const validateConstants = (constants) => {
  // Validate that all required constants are present
  // Validate that values are within expected ranges
  // Validate that configurations are complete
};
```

This constants management system provides a robust foundation for maintaining consistency and reducing technical debt across the microfrontend architecture.
