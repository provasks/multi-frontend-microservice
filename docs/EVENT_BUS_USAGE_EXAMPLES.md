# 📚 Event Bus Usage Examples

## 🎯 Quick Reference

### **Basic Usage:**

```javascript
import { 
  eventBus, 
  useEventBus, 
  useEmitEvent, 
  EVENT_TYPES,
  showNotification 
} from 'sharedComponents';
```

---

## 📝 Common Patterns

### **1. Showing Notifications**

#### **Simple Notification:**

```javascript
import { showNotification } from 'sharedComponents';

// Success
showNotification.success('Task created successfully!');

// Error
showNotification.error('Failed to create task');

// Warning
showNotification.warning('Please check your input');

// Info
showNotification.info('Processing your request...');
```

#### **With Event Emission:**

```javascript
import { useEmitEvent, EVENT_TYPES } from 'sharedComponents';

const MyComponent = () => {
  const emitEvent = useEmitEvent();
  
  const handleAction = async () => {
    try {
      const result = await api.createSomething();
      
      // Emit notification event
      emitEvent(EVENT_TYPES.NOTIFICATION_RECEIVED, {
        type: 'success',
        message: 'Action completed successfully!'
      });
      
      // Emit domain event
      emitEvent(EVENT_TYPES.TASK_CREATED, {
        task: result,
        timestamp: Date.now()
      });
    } catch (error) {
      emitEvent(EVENT_TYPES.ERROR_OCCURRED, {
        type: 'api',
        message: error.message
      });
    }
  };
  
  return <button onClick={handleAction}>Do Something</button>;
};
```

---

### **2. Listening to Events**

#### **Using React Hook:**

```javascript
import { useEventBus, EVENT_TYPES } from 'sharedComponents';

const MyComponent = () => {
  // Listen to task creation
  useEventBus(EVENT_TYPES.TASK_CREATED, (payload) => {
    console.log('Task created:', payload.task);
    // Refresh data, update UI, etc.
    refreshData();
  });
  
  // Listen to user logout
  useEventBus(EVENT_TYPES.USER_LOGGED_OUT, () => {
    // Clear local state
    clearData();
    // Redirect to login
    navigate('/login');
  });
  
  // Listen to theme changes
  useEventBus(EVENT_TYPES.THEME_CHANGED, ({ theme }) => {
    // Update theme
    document.body.setAttribute('data-theme', theme);
  });
  
  return <div>My Component</div>;
};
```

#### **With Dependencies:**

```javascript
import { useEventBus, EVENT_TYPES } from 'sharedComponents';
import { useState } from 'react';

const MyComponent = () => {
  const [userId, setUserId] = useState(null);
  
  // Re-subscribe when userId changes
  useEventBus(
    EVENT_TYPES.TASK_CREATED, 
    (payload) => {
      if (payload.userId === userId) {
        // Only react if task belongs to current user
        refreshUserTasks();
      }
    },
    [userId] // Dependencies
  );
  
  return <div>My Component</div>;
};
```

---

### **3. Direct Event Bus Usage (Outside React Components)**

```javascript
import { eventBus, EVENT_TYPES } from 'sharedComponents';

// Subscribe
const unsubscribe = eventBus.on(EVENT_TYPES.TASK_CREATED, (payload) => {
  console.log('Task created:', payload);
});

// Emit
eventBus.emit(EVENT_TYPES.TASK_CREATED, {
  task: { id: 1, title: 'New Task' },
  userId: '123'
});

// Unsubscribe
unsubscribe();

// Subscribe once
eventBus.once(EVENT_TYPES.APPLICATION_READY, () => {
  console.log('Application is ready!');
});
```

---

### **4. Error Handling**

#### **Using Error Helper:**

```javascript
import { showError, showValidationError } from 'sharedComponents';

const handleApiCall = async () => {
  try {
    await api.createTask(data);
  } catch (error) {
    // Automatically extracts error message
    showError(error);
    
    // Or handle validation errors specifically
    if (error.response?.status === 400) {
      showValidationError(error.response.data.errors);
    }
  }
};
```

#### **Manual Error Events:**

```javascript
import { useEmitEvent, EVENT_TYPES } from 'sharedComponents';

const handleApiCall = async () => {
  const emitEvent = useEmitEvent();
  
  try {
    await api.createTask(data);
  } catch (error) {
    emitEvent(EVENT_TYPES.ERROR_OCCURRED, {
      type: 'api',
      message: error.response?.data?.error || error.message,
      error: error,
      context: {
        endpoint: '/api/tasks',
        method: 'POST',
        data
      }
    });
  }
};
```

---

### **5. Navigation Events**

#### **Requesting Navigation:**

```javascript
import { useEmitEvent, EVENT_TYPES } from 'sharedComponents';

const TaskCard = ({ task }) => {
  const emitEvent = useEmitEvent();
  
  const handleClick = () => {
    // Request navigation (shell app will handle it)
    emitEvent(EVENT_TYPES.NAVIGATION_REQUESTED, {
      route: `/tasks/${task.id}`,
      params: { taskId: task.id },
      replace: false
    });
  };
  
  return <div onClick={handleClick}>{task.title}</div>;
};
```

#### **Handling Navigation Requests:**

```javascript
import { useEventBus, EVENT_TYPES } from 'sharedComponents';
import { useNavigate } from 'react-router-dom';

const ShellApp = () => {
  const navigate = useNavigate();
  
  useEventBus(EVENT_TYPES.NAVIGATION_REQUESTED, ({ route, params, replace }) => {
    if (replace) {
      navigate(route, { replace: true, state: params });
    } else {
      navigate(route, { state: params });
    }
  });
  
  return <div>Shell App</div>;
};
```

---

### **6. Data Synchronization**

#### **Emitting Data Updates:**

```javascript
import { useEmitEvent, EVENT_TYPES } from 'sharedComponents';

const TaskManagement = () => {
  const emitEvent = useEmitEvent();
  
  const handleCreateTask = async (taskData) => {
    const task = await api.createTask(taskData);
    
    // Emit event so other microfrontends can update
    emitEvent(EVENT_TYPES.TASK_CREATED, {
      task,
      userId: currentUser.id,
      timestamp: Date.now()
    });
    
    // Also update Redux store (for critical state)
    dispatch(addTask(task));
  };
  
  return <div>Task Management</div>;
};
```

#### **Reacting to Data Updates:**

```javascript
import { useEventBus, EVENT_TYPES } from 'sharedComponents';

const Dashboard = () => {
  const [taskCount, setTaskCount] = useState(0);
  
  // Listen to task creation
  useEventBus(EVENT_TYPES.TASK_CREATED, () => {
    // Refresh task count
    refreshTaskCount();
  });
  
  // Listen to task deletion
  useEventBus(EVENT_TYPES.TASK_DELETED, () => {
    // Refresh task count
    refreshTaskCount();
  });
  
  return <div>Total Tasks: {taskCount}</div>;
};
```

---

### **7. Theme Management**

#### **Changing Theme:**

```javascript
import { useEmitEvent, EVENT_TYPES } from 'sharedComponents';
import { useDispatch } from 'react-redux';
import { setTheme } from 'sharedComponents/store/slices/uiSlice';

const ThemeSelector = () => {
  const emitEvent = useEmitEvent();
  const dispatch = useDispatch();
  
  const handleThemeChange = (theme) => {
    // Update Redux store
    dispatch(setTheme(theme));
    
    // Emit event so all microfrontends update
    emitEvent(EVENT_TYPES.THEME_CHANGED, {
      theme,
      source: 'theme-selector',
      timestamp: Date.now()
    });
  };
  
  return (
    <select onChange={(e) => handleThemeChange(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
};
```

#### **Reacting to Theme Changes:**

```javascript
import { useEventBus, EVENT_TYPES } from 'sharedComponents';
import { useEffect } from 'react';

const ThemedComponent = () => {
  const [theme, setTheme] = useState('light');
  
  useEventBus(EVENT_TYPES.THEME_CHANGED, ({ theme: newTheme }) => {
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
  });
  
  return (
    <div className={`component ${theme}`}>
      Themed Content
    </div>
  );
};
```

---

### **8. User Authentication Events**

#### **Emitting Logout:**

```javascript
import { useEmitEvent, EVENT_TYPES } from 'sharedComponents';

const LogoutButton = () => {
  const emitEvent = useEmitEvent();
  
  const handleLogout = () => {
    // Clear session
    sessionStorage.removeItem('token');
    
    // Emit logout event
    emitEvent(EVENT_TYPES.USER_LOGGED_OUT, {
      reason: 'user-initiated',
      timestamp: Date.now()
    });
    
    // Also update Redux
    dispatch(logout());
  };
  
  return <button onClick={handleLogout}>Logout</button>;
};
```

#### **Reacting to Logout:**

```javascript
import { useEventBus, EVENT_TYPES } from 'sharedComponents';

const ProtectedComponent = () => {
  const navigate = useNavigate();
  
  useEventBus(EVENT_TYPES.USER_LOGGED_OUT, () => {
    // Clear local state
    clearData();
    
    // Redirect to login
    navigate('/login');
  });
  
  return <div>Protected Content</div>;
};
```

---

### **9. System Events**

#### **Idle Timeout:**

```javascript
import { useEmitEvent, EVENT_TYPES } from 'sharedComponents';

const IdleTimeoutHandler = () => {
  const emitEvent = useEmitEvent();
  
  useEffect(() => {
    const handleIdleTimeout = () => {
      emitEvent(EVENT_TYPES.IDLE_TIMEOUT, {
        timestamp: Date.now(),
        duration: 1200000 // 20 minutes
      });
      
      // Also emit logout
      emitEvent(EVENT_TYPES.USER_LOGGED_OUT, {
        reason: 'idle-timeout'
      });
    };
    
    // Setup idle timeout detection
    // ... idle timeout logic
    
    return () => {
      // Cleanup
    };
  }, []);
  
  return null;
};
```

#### **Network Status:**

```javascript
import { useEmitEvent, EVENT_TYPES } from 'sharedComponents';

const NetworkMonitor = () => {
  const emitEvent = useEmitEvent();
  
  useEffect(() => {
    const handleOnline = () => {
      emitEvent(EVENT_TYPES.NETWORK_STATUS_CHANGED, {
        status: 'online',
        timestamp: Date.now()
      });
    };
    
    const handleOffline = () => {
      emitEvent(EVENT_TYPES.NETWORK_STATUS_CHANGED, {
        status: 'offline',
        timestamp: Date.now()
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return null;
};
```

---

### **10. Debugging Events**

```javascript
// In browser console (development mode)

// View event history
window.__EVENT_BUS_DEBUG__.getHistory();

// View all registered event types
window.__EVENT_BUS_DEBUG__.getEventTypes();

// View listener count for specific event
window.__EVENT_BUS_DEBUG__.getListenerCount('task:created');

// Clear event history
window.__EVENT_BUS_DEBUG__.clear();

// Direct access to event bus
window.__EVENT_BUS__.emit('custom:event', { data: 'test' });
```

---

## 🎯 Best Practices

1. **Use Helper Functions**: Prefer `showNotification` over direct event emission for simple notifications
2. **Emit Domain Events**: Emit events for important domain actions (task created, user updated, etc.)
3. **Listen Selectively**: Only listen to events you actually need
4. **Clean Up**: React hooks automatically clean up, but manual subscriptions need cleanup
5. **Type Safety**: Always use `EVENT_TYPES` constants instead of string literals
6. **Error Handling**: Wrap event listeners in try-catch if they might throw
7. **Performance**: Use dependencies array in `useEventBus` to avoid unnecessary re-subscriptions

---

## 📚 Related Documentation

- [Event-Based Communication Guide](./MICROFRONTEND_EVENT_BASED_COMMUNICATION.md)
- [Migration Guide](./MIGRATION_GUIDE_EVENT_BUS.md)
- [Microfrontend Communication](./MICROFRONTEND_COMMUNICATION.md)

