# 🔄 Microfrontend Communication Architecture

## 📋 Overview

The Task Management System uses **multiple communication patterns** to enable seamless interaction between the shell app and microfrontends. This document explains all the communication mechanisms used in the system.

---

## 🏗️ Communication Patterns

### **1. Webpack Module Federation (Primary Mechanism)**

**Purpose:** Load and integrate microfrontends dynamically

**How it works:**
- The shell app (host) loads remote microfrontends via Module Federation
- Each microfrontend exposes its components through `remoteEntry.js`
- Components are lazy-loaded using `React.lazy()` and `import()`

**Implementation:**

```javascript
// Shell App (frontend/shell-app/src/components/AuthenticatedApp.jsx)
const UserManagement = React.lazy(() => 
  import('userApp/UserManagement').catch(() => ({ 
    default: () => <div>Failed to load User Management</div> 
  }))
);

const TaskManagement = React.lazy(() => 
  import('taskApp/TaskManagement').catch(() => ({ 
    default: () => <div>Failed to load Task Management</div> 
  }))
);

const Notifications = React.lazy(() => 
  import('notificationApp/Notifications').catch(() => ({ 
    default: () => <div>Failed to load Notifications</div> 
  }))
);
```

**Webpack Configuration:**

```javascript
// Shell App Webpack Config
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    userApp: 'userApp@http://localhost:4001/remoteEntry.js',
    taskApp: 'taskApp@http://localhost:4002/remoteEntry.js',
    notificationApp: 'notificationApp@http://localhost:4003/remoteEntry.js',
    sharedComponents: 'sharedComponents@http://localhost:4004/remoteEntry.js',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^19.2.0' },
    'react-dom': { singleton: true, requiredVersion: '^19.2.0' },
    'react-router-dom': { singleton: true, requiredVersion: '^6.8.0' },
    'react-redux': { singleton: true, requiredVersion: '^9.0.4' },
  },
})
```

**Benefits:**
- ✅ Independent deployment of each microfrontend
- ✅ Shared dependencies (React, Redux) loaded once
- ✅ Runtime integration (no build-time coupling)
- ✅ Hot reloading support

---

### **2. Shared Redux Store (State Management)**

**Purpose:** Share global state across all microfrontends

**How it works:**
- Redux store is created in `shared-components` package
- Store is exposed via Module Federation
- All microfrontends access the same store instance
- State is persisted using `redux-persist`

**Implementation:**

```javascript
// Shared Components Store (frontend/shared-components/src/store/index.js)
export const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: tasksSlice,
    notifications: notificationsSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Expose store globally for microfrontends
if (typeof window !== 'undefined') {
  window.__REDUX_STORE__ = store;
  window.__REDUX_PERSISTOR__ = persistor;
}
```

**Usage in Microfrontends:**

```javascript
// Task App using Redux
const TaskManagementRedux = () => {
  try {
    const ReduxHooks = require('sharedComponents/store/hooks');
    const useTasks = ReduxHooks.useTasks;
    const useAuth = ReduxHooks.useAuth;
    
    // Use shared Redux state
    const tasks = useTasks();
    const auth = useAuth();
    
    console.log('✅ Using Redux for state management');
  } catch (error) {
    // Fallback to local state if Redux not available
    console.warn('Redux not available, falling back to local state');
  }
};
```

**State Slices:**
- `authSlice`: Authentication state (user, token, isAuthenticated)
- `tasksSlice`: Task data and operations
- `notificationsSlice`: Notification data
- `uiSlice`: UI state (theme, sidebar, etc.)

---

### **3. Window Global Functions (Event-Based Communication)**

**Purpose:** Cross-microfrontend messaging and notifications

**How it works:**
- Shell app creates global functions on `window` object
- All microfrontends can call these functions
- Used for showing messages, handling errors, and triggering actions

**Implementation:**

```javascript
// Shell App (frontend/shell-app/src/components/FloatingMessageManager.jsx)
useEffect(() => {
  // Create global message functions
  window.showSuccess = (message) => {
    addMessage(message, 'success');
  };

  window.showError = (message) => {
    addMessage(message, 'danger');
  };

  window.showWarning = (message) => {
    addMessage(message, 'warning');
  };

  window.showInfo = (message) => {
    addMessage(message, 'info');
  };

  return () => {
    // Cleanup on unmount
    delete window.showSuccess;
    delete window.showError;
    delete window.showWarning;
    delete window.showInfo;
  };
}, []);
```

**Usage in Microfrontends:**

```javascript
// Task App using global functions
if (window.showSuccess) {
  window.showSuccess('Task created successfully!');
}

if (window.showError) {
  window.showError('Failed to create task');
}
```

---

### **4. Window PostMessage API (Cross-Origin Communication)**

**Purpose:** Send messages between different origins/windows

**How it works:**
- Uses browser's `postMessage` API
- Sends structured data between microfrontends
- Listens for specific message types

**Implementation:**

```javascript
// Shell App listening for idle timeout logout
useEffect(() => {
  const handleIdleTimeoutLogout = (event) => {
    if (event.data && event.data.type === 'IDLE_TIMEOUT_LOGOUT') {
      handleLogout();
    }
  };
  
  window.addEventListener('message', handleIdleTimeoutLogout);
  
  return () => {
    window.removeEventListener('message', handleIdleTimeoutLogout);
  };
}, []);

// Shared Components sending message
window.parent.postMessage({
  type: 'IDLE_TIMEOUT_LOGOUT',
  timestamp: Date.now()
}, '*');
```

**Message Types:**
- `IDLE_TIMEOUT_LOGOUT`: Triggered when idle timeout expires
- Custom events for specific cross-microfrontend communication

---

### **5. Shared Components Library (Component Sharing)**

**Purpose:** Share UI components and utilities across microfrontends

**How it works:**
- Shared components are exposed via Module Federation
- All microfrontends import from `sharedComponents` namespace
- Provides consistent UI and functionality

**Exposed Components:**

```javascript
// Shared Components (frontend/shared-components/src/index.js)
export { default as LoadingSpinner } from './components/LoadingSpinner';
export { default as ErrorState } from './components/ErrorState';
export { default as Modal } from './components/Modal';
export { default as Button } from './components/Button';
export { useAuth } from './hooks/useAuth';
export { useGlobalErrorHandler } from './hooks/useGlobalErrorHandler';
```

**Usage:**

```javascript
// Any microfrontend can use shared components
import { LoadingSpinner, useAuth } from 'sharedComponents';

const MyComponent = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div>
      <LoadingSpinner />
      {/* ... */}
    </div>
  );
};
```

---

### **6. Shared API Clients (Data Fetching)**

**Purpose:** Consistent API communication across microfrontends

**How it works:**
- API clients are defined in shared components
- All microfrontends use the same API configuration
- Centralized error handling and authentication

**Implementation:**

```javascript
// Shared API Client (frontend/shared-components/src/utils/unifiedApiClient.js)
export const apiHelpers = {
  fetchTasks: async (page = 1, limit = 10) => {
    const response = await taskApi.get(`/tasks?page=${page}&limit=${limit}`);
    return response.data;
  },
  fetchUsers: async () => {
    const response = await userApi.get('/users');
    return response.data;
  },
  fetchNotifications: async () => {
    const response = await notificationApi.get('/notifications');
    return response.data;
  },
};
```

**Usage:**

```javascript
// Dashboard using shared API
import { apiHelpers } from 'sharedComponents/unifiedApiClient';

const Dashboard = () => {
  useEffect(() => {
    const loadData = async () => {
      const [tasks, users, notifications] = await Promise.all([
        apiHelpers.fetchTasks(1, 1000),
        apiHelpers.fetchUsers(),
        apiHelpers.fetchNotifications(),
      ]);
      // Process data...
    };
    loadData();
  }, []);
};
```

---

### **7. Session Storage (Shared Data Persistence)**

**Purpose:** Share authentication token and temporary data

**How it works:**
- Shell app stores authentication token in `sessionStorage`
- All microfrontends read from the same `sessionStorage`
- API interceptors automatically add token to requests

**Implementation:**

```javascript
// Shell App storing token
const handleLogin = (token) => {
  sessionStorage.setItem('token', token);
  setIsAuthenticated(true);
};

// API interceptor reading token
apiInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🔄 Communication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Shell App (Host)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  FloatingMessageManager                               │   │
│  │  - window.showSuccess()                               │   │
│  │  - window.showError()                                │   │
│  │  - window.showWarning()                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Redux Provider                                       │   │
│  │  - Shared Store                                       │   │
│  │  - window.__REDUX_STORE__                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Message Listener                                    │   │
│  │  - window.addEventListener('message')                 │   │
│  │  - Handles IDLE_TIMEOUT_LOGOUT                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Module Federation
                            │ Redux Store
                            │ Window Functions
                            │ PostMessage
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  User App    │   │  Task App    │   │ Notification │
│  (Port 4001) │   │  (Port 4002) │   │  App (4003)  │
│              │   │              │   │              │
│  - Uses      │   │  - Uses      │   │  - Uses      │
│    Redux     │   │    Redux     │   │    Redux     │
│  - Calls     │   │  - Calls     │   │  - Calls     │
│    window.*  │   │    window.*  │   │    window.*  │
│  - Imports   │   │  - Imports   │   │  - Imports   │
│    shared    │   │    shared    │   │    shared    │
│    components│   │    components│   │    components│
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │  Shared Components    │
                │  (Port 4004)          │
                │                       │
                │  - Redux Store        │
                │  - UI Components      │
                │  - API Clients        │
                │  - Hooks              │
                └───────────────────────┘
```

---

## 📝 Communication Examples

### **Example 1: Task App Notifying Shell App**

```javascript
// Task App creates a task
const createTask = async (taskData) => {
  try {
    const response = await taskApi.post('/tasks', taskData);
    
    // Notify shell app via global function
    if (window.showSuccess) {
      window.showSuccess('Task created successfully!');
    }
    
    // Update Redux store
    dispatch(addTask(response.data));
    
    return response.data;
  } catch (error) {
    if (window.showError) {
      window.showError('Failed to create task');
    }
    throw error;
  }
};
```

### **Example 2: Shell App Triggering Logout**

```javascript
// Shared Components detects idle timeout
const handleIdleTimeout = () => {
  // Send message to shell app
  window.parent.postMessage({
    type: 'IDLE_TIMEOUT_LOGOUT',
    timestamp: Date.now()
  }, '*');
  
  // Clear Redux state
  dispatch(logout());
  
  // Clear session storage
  sessionStorage.removeItem('token');
};
```

### **Example 3: Dashboard Fetching Data from Multiple Sources**

```javascript
// Dashboard in Shell App
const Dashboard = () => {
  const { tasks } = useSelector(state => state.tasks);
  const { notifications } = useSelector(state => state.notifications);
  
  useEffect(() => {
    // Fetch from multiple APIs
    const loadData = async () => {
      const [tasksData, usersData, notificationsData] = await Promise.all([
        apiHelpers.fetchTasks(1, 1000),
        apiHelpers.fetchUsers(),
        apiHelpers.fetchNotifications(),
      ]);
      
      // Update Redux store (all microfrontends see the update)
      dispatch(setTasks(tasksData.tasks));
      dispatch(setNotifications(notificationsData.notifications));
    };
    
    loadData();
  }, []);
  
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Tasks: {tasks.length}</p>
      <p>Notifications: {notifications.length}</p>
    </div>
  );
};
```

---

## 🎯 Best Practices

1. **Use Redux for Shared State**: Authentication, user data, global UI state
2. **Use Window Functions for Notifications**: Success/error messages
3. **Use PostMessage for Cross-Origin**: When microfrontends are on different domains
4. **Use Session Storage for Tokens**: Secure, temporary data
5. **Use Shared Components**: Consistent UI and functionality
6. **Handle Failures Gracefully**: Always check if functions exist before calling

---

## 🔒 Security Considerations

1. **Token Storage**: Uses `sessionStorage` (more secure than `localStorage`)
2. **CSRF Protection**: CSRF tokens added to API requests
3. **Origin Validation**: PostMessage should validate origin in production
4. **Error Boundaries**: Each microfrontend has error boundaries
5. **Input Sanitization**: All user inputs are sanitized before API calls

---

## 📚 Related Documentation

- [State Management Documentation](./frontend/docs/STATE_MANAGEMENT_DOCUMENTATION.md)
- [Frontend Documentation](./frontend/docs/FRONTEND_DOCUMENTATION.md)
- [Architecture Diagram](./docs/ARCHITECTURE_DIAGRAM.md)

---

This architecture ensures **loose coupling** between microfrontends while maintaining **seamless communication** and **consistent user experience**.

