# 🔄 Migration Guide: From Window Functions to Event Bus

## 📋 Overview

This guide shows you how to migrate from window global functions to the event-based communication system while maintaining backward compatibility.

---

## 🎯 Migration Strategy

### **Phase 1: Hybrid Approach (Current)**
- Keep window functions for backward compatibility
- Add event bus listeners
- Both methods work simultaneously

### **Phase 2: Gradual Migration**
- Update new code to use events
- Migrate existing code incrementally
- Test each migration

### **Phase 3: Full Event-Based (Future)**
- Remove window functions
- All communication via events

---

## 📝 Migration Examples

### **Example 1: Task Creation Notification**

#### **Before (Window Functions):**

```javascript
// frontend/microfrontends/task-app/src/hooks/useTaskManagement.js

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await apiHelpers.createTask(apiData);
    
    // ❌ Direct window function call
    if (window.showSuccess) {
      window.showSuccess('Task created successfully!');
    }
    
    fetchTasks();
    setShowModal(false);
  } catch (error) {
    // ❌ Direct window function call
    if (window.showError) {
      window.showError(error.response?.data?.error || 'Failed to create task');
    }
  }
};
```

#### **After (Event-Based - Option 1: Using Helper):**

```javascript
// frontend/microfrontends/task-app/src/hooks/useTaskManagement.js

import { showNotification, useEmitEvent, EVENT_TYPES } from 'sharedComponents';

const handleSubmit = async (e) => {
  e.preventDefault();
  const emitEvent = useEmitEvent();
  
  try {
    const response = await apiHelpers.createTask(apiData);
    
    // ✅ Option 1: Using notification helper (easiest migration)
    showNotification.success('Task created successfully!');
    
    // ✅ Option 2: Emit event for other microfrontends to react
    emitEvent(EVENT_TYPES.TASK_CREATED, {
      task: response.data,
      userId: currentUser.id,
      timestamp: Date.now()
    });
    
    fetchTasks();
    setShowModal(false);
  } catch (error) {
    // ✅ Using notification helper
    showNotification.error(
      error.response?.data?.error || 'Failed to create task'
    );
    
    // ✅ Emit error event
    emitEvent(EVENT_TYPES.ERROR_OCCURRED, {
      type: 'api',
      message: error.response?.data?.error || 'Failed to create task',
      error: error.message
    });
  }
};
```

#### **After (Event-Based - Option 2: Direct Event Bus):**

```javascript
// frontend/microfrontends/task-app/src/hooks/useTaskManagement.js

import { eventBus, EVENT_TYPES } from 'sharedComponents';

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await apiHelpers.createTask(apiData);
    
    // ✅ Direct event bus usage
    eventBus.emit(EVENT_TYPES.NOTIFICATION_RECEIVED, {
      type: 'success',
      message: 'Task created successfully!'
    });
    
    // ✅ Emit task created event
    eventBus.emit(EVENT_TYPES.TASK_CREATED, {
      task: response.data,
      userId: currentUser.id,
      timestamp: Date.now()
    });
    
    fetchTasks();
    setShowModal(false);
  } catch (error) {
    eventBus.emit(EVENT_TYPES.ERROR_OCCURRED, {
      type: 'api',
      message: error.response?.data?.error || 'Failed to create task',
      error: error.message
    });
  }
};
```

---

### **Example 2: Listening to Events in Other Microfrontends**

#### **Before (No Communication):**

```javascript
// frontend/microfrontends/notification-app/src/Notifications.jsx

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  
  // ❌ No way to know when tasks are created
  // Must manually refresh or poll
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  return (
    // ... render notifications
  );
};
```

#### **After (Event-Based):**

```javascript
// frontend/microfrontends/notification-app/src/Notifications.jsx

import { useEventBus, EVENT_TYPES } from 'sharedComponents';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  
  // ✅ Listen for task creation events
  useEventBus(EVENT_TYPES.TASK_CREATED, (payload) => {
    // Automatically refresh notifications when task is created
    fetchNotifications();
    
    // Or add a new notification
    const newNotification = {
      type: 'info',
      message: `New task created: ${payload.task.title}`,
      timestamp: Date.now()
    };
    setNotifications(prev => [newNotification, ...prev]);
  });
  
  // ✅ Listen for user logout
  useEventBus(EVENT_TYPES.USER_LOGGED_OUT, () => {
    // Clear notifications on logout
    setNotifications([]);
  });
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  return (
    // ... render notifications
  );
};
```

---

### **Example 3: Navigation Events**

#### **Before (Direct Navigation):**

```javascript
// frontend/microfrontends/task-app/src/TaskManagement.jsx

import { useNavigate } from 'react-router-dom';

const TaskManagement = () => {
  const navigate = useNavigate();
  
  const handleTaskClick = (taskId) => {
    // ❌ Direct navigation (only works within same app)
    navigate(`/tasks/${taskId}`);
  };
  
  return (
    // ... component
  );
};
```

#### **After (Event-Based Navigation):**

```javascript
// frontend/microfrontends/task-app/src/TaskManagement.jsx

import { useEmitEvent, EVENT_TYPES } from 'sharedComponents';

const TaskManagement = () => {
  const emitEvent = useEmitEvent();
  
  const handleTaskClick = (taskId) => {
    // ✅ Request navigation via event (works across microfrontends)
    emitEvent(EVENT_TYPES.NAVIGATION_REQUESTED, {
      route: `/tasks/${taskId}`,
      params: { taskId }
    });
  };
  
  return (
    // ... component
  );
};
```

```javascript
// frontend/shell-app/src/components/AuthenticatedApp.jsx

import { useEventBus, EVENT_TYPES } from 'sharedComponents';
import { useNavigate } from 'react-router-dom';

const AuthenticatedApp = ({ onLogout }) => {
  const navigate = useNavigate();
  
  // ✅ Listen for navigation requests from any microfrontend
  useEventBus(EVENT_TYPES.NAVIGATION_REQUESTED, ({ route, params, replace }) => {
    if (replace) {
      navigate(route, { replace: true, state: params });
    } else {
      navigate(route, { state: params });
    }
  });
  
  return (
    // ... component
  );
};
```

---

### **Example 4: Theme Changes**

#### **Before (No Theme Sync):**

```javascript
// frontend/microfrontends/user-app/src/UserSettings.jsx

const UserSettings = () => {
  const [theme, setTheme] = useState('light');
  
  const handleThemeChange = (newTheme) => {
    // ❌ Only updates local state
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  return (
    // ... component
  );
};
```

#### **After (Event-Based Theme Sync):**

```javascript
// frontend/microfrontends/user-app/src/UserSettings.jsx

import { useEmitEvent, useEventBus, EVENT_TYPES } from 'sharedComponents';
import { useDispatch } from 'react-redux';
import { setTheme } from 'sharedComponents/store/slices/uiSlice';

const UserSettings = () => {
  const emitEvent = useEmitEvent();
  const dispatch = useDispatch();
  
  // ✅ Listen for theme changes from other microfrontends
  useEventBus(EVENT_TYPES.THEME_CHANGED, ({ theme }) => {
    setTheme(theme);
    dispatch(setTheme(theme));
    localStorage.setItem('theme', theme);
  });
  
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    dispatch(setTheme(newTheme));
    localStorage.setItem('theme', newTheme);
    
    // ✅ Emit theme change event (all microfrontends will update)
    emitEvent(EVENT_TYPES.THEME_CHANGED, {
      theme: newTheme,
      source: 'user-settings'
    });
  };
  
  return (
    // ... component
  );
};
```

---

## 🔧 Helper Functions for Easy Migration

### **Using Notification Helper (Recommended for Quick Migration):**

```javascript
import { showNotification } from 'sharedComponents';

// Instead of:
if (window.showSuccess) {
  window.showSuccess('Task created!');
}

// Use:
showNotification.success('Task created!');
showNotification.error('Failed to create task');
showNotification.warning('Please check your input');
showNotification.info('Task is being processed');
```

### **Using Error Helper:**

```javascript
import { showError, showValidationError } from 'sharedComponents';

// Instead of:
if (window.showError) {
  window.showError(error.message);
}

// Use:
showError(error); // Automatically extracts error message
showValidationError(validationErrors); // Handles validation errors
```

---

## ✅ Migration Checklist

### **Step 1: Update Shell App**
- [x] FloatingMessageManager listens to events
- [ ] AuthenticatedApp listens to navigation events
- [ ] Add event listeners for theme changes
- [ ] Add event listeners for logout events

### **Step 2: Update Task App**
- [ ] Replace `window.showSuccess` with `showNotification.success`
- [ ] Replace `window.showError` with `showNotification.error`
- [ ] Emit `TASK_CREATED` event after task creation
- [ ] Emit `TASK_UPDATED` event after task update
- [ ] Emit `TASK_DELETED` event after task deletion
- [ ] Listen to `USER_LOGGED_OUT` event

### **Step 3: Update User App**
- [ ] Replace window functions with notification helper
- [ ] Emit `USER_PROFILE_UPDATED` event
- [ ] Emit `THEME_CHANGED` event
- [ ] Listen to relevant events

### **Step 4: Update Notification App**
- [ ] Listen to `TASK_CREATED` event
- [ ] Listen to `USER_LOGGED_OUT` event
- [ ] Emit notification events

### **Step 5: Testing**
- [ ] Test all notification flows
- [ ] Test cross-microfrontend communication
- [ ] Test event history in dev tools
- [ ] Verify backward compatibility

---

## 🚀 Quick Start Migration

### **1. Import Helpers:**

```javascript
import { 
  showNotification, 
  useEmitEvent, 
  useEventBus, 
  EVENT_TYPES 
} from 'sharedComponents';
```

### **2. Replace Window Functions:**

```javascript
// Old
if (window.showSuccess) {
  window.showSuccess('Success!');
}

// New
showNotification.success('Success!');
```

### **3. Emit Events for Cross-Microfrontend Communication:**

```javascript
const emitEvent = useEmitEvent();

emitEvent(EVENT_TYPES.TASK_CREATED, {
  task: newTask,
  userId: currentUser.id
});
```

### **4. Listen to Events:**

```javascript
useEventBus(EVENT_TYPES.TASK_CREATED, (payload) => {
  // React to task creation
  refreshData();
});
```

---

## 📊 Benefits After Migration

1. **Loose Coupling**: Microfrontends don't depend on each other
2. **Better Debugging**: Event history shows all communications
3. **Scalability**: Easy to add new microfrontends
4. **Type Safety**: Event types are centralized
5. **Testability**: Easy to mock events in tests
6. **Flexibility**: Multiple listeners can react to same event

---

## 🔍 Debugging Events

### **In Development:**

```javascript
// Access event bus in browser console
window.__EVENT_BUS__.getHistory(); // See all events
window.__EVENT_BUS__.getEventTypes(); // See all registered event types
window.__EVENT_BUS__.getListenerCount('task:created'); // See listener count

// Or use debug helper
window.__EVENT_BUS_DEBUG__.getHistory();
```

---

## 📚 Next Steps

1. Start with notification helper (easiest migration)
2. Gradually add event emissions for important actions
3. Add event listeners where cross-microfrontend communication is needed
4. Test thoroughly
5. Remove window functions once all code is migrated

---

This migration can be done incrementally without breaking existing functionality!

