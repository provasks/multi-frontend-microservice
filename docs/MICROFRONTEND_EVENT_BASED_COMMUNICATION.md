# 🎯 Event-Based Communication: Best Practices for Microfrontends

## 📋 Overview

**Yes, event-based communication is considered a best practice** for microfrontend architecture, but it should be used **strategically** alongside other patterns. This document explains when and how to use event-based communication effectively.

---

## ✅ Why Event-Based Communication is Best Practice

### **Key Benefits:**

1. **Loose Coupling**: Microfrontends don't need to know about each other
2. **Decentralized**: No single point of failure
3. **Scalability**: Easy to add new microfrontends without modifying existing ones
4. **Independence**: Each microfrontend can be developed and deployed independently
5. **Flexibility**: Multiple listeners can react to the same event
6. **Testability**: Easy to test in isolation

### **When to Use Event-Based Communication:**

✅ **Use Events For:**
- User actions that affect multiple microfrontends (e.g., "task created", "user logged out")
- Notifications and alerts
- Navigation events
- UI state changes (theme, sidebar toggle)
- Non-critical data synchronization

❌ **Don't Use Events For:**
- Critical shared state (use Redux/Shared Store)
- Authentication data (use Shared Store + Session Storage)
- Real-time data that needs immediate consistency
- Complex state dependencies

---

## 🏗️ Current Implementation Analysis

### **What You Currently Have:**

1. ✅ **PostMessage API** - Event-based (for cross-origin)
2. ⚠️ **Window Global Functions** - Not true events (tight coupling)
3. ✅ **Redux Store** - Shared state (for critical data)
4. ✅ **Session Storage** - Persistence

### **What's Missing:**

❌ **Custom Events** (`window.dispatchEvent`) - True event-based communication
❌ **Event Bus/Event Emitter** - Centralized event management
❌ **Type-safe Event System** - Event contracts and validation

---

## 🚀 Recommended Implementation: Hybrid Approach

### **Best Practice: Use the Right Tool for the Right Job**

```
┌─────────────────────────────────────────────────────────┐
│              Communication Strategy Matrix              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Critical Shared State → Redux Store (Shared Runtime)   │
│  • Authentication                                       │
│  • User Profile                                        │
│  • Global UI State                                      │
│                                                          │
│  Actions/Notifications → Custom Events (Event Bus)      │
│  • Task Created/Updated                                │
│  • User Actions                                         │
│  • Navigation Events                                    │
│                                                          │
│  Cross-Origin → PostMessage API                         │
│  • Iframe Communication                                 │
│  • Different Domains                                    │
│                                                          │
│  Persistence → Session/Local Storage                   │
│  • Tokens                                               │
│  • User Preferences                                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 💻 Implementation: Event Bus System

### **Step 1: Create a Centralized Event Bus**

```javascript
// frontend/shared-components/src/utils/eventBus.js

/**
 * Centralized Event Bus for Microfrontend Communication
 * Provides type-safe, decoupled event communication
 */
class EventBus {
  constructor() {
    this.listeners = new Map();
    this.eventHistory = []; // Optional: for debugging
  }

  /**
   * Subscribe to an event
   * @param {string} eventType - The event type to listen for
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    
    this.listeners.get(eventType).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to an event once
   * @param {string} eventType - The event type to listen for
   * @param {Function} callback - Callback function
   */
  once(eventType, callback) {
    const unsubscribe = this.on(eventType, (...args) => {
      callback(...args);
      unsubscribe();
    });
  }

  /**
   * Emit an event
   * @param {string} eventType - The event type
   * @param {*} payload - Event data
   */
  emit(eventType, payload = {}) {
    // Store in history (optional, for debugging)
    this.eventHistory.push({
      type: eventType,
      payload,
      timestamp: Date.now()
    });

    // Notify all listeners
    const callbacks = this.listeners.get(eventType) || [];
    callbacks.forEach(callback => {
      try {
        callback(payload);
      } catch (error) {
        console.error(`Error in event listener for ${eventType}:`, error);
      }
    });

    // Also dispatch as CustomEvent for native event listeners
    if (typeof window !== 'undefined') {
      const customEvent = new CustomEvent(eventType, {
        detail: payload,
        bubbles: true,
        cancelable: true
      });
      window.dispatchEvent(customEvent);
    }
  }

  /**
   * Remove all listeners for an event type
   * @param {string} eventType - The event type
   */
  off(eventType) {
    this.listeners.delete(eventType);
  }

  /**
   * Remove all listeners
   */
  clear() {
    this.listeners.clear();
  }

  /**
   * Get event history (for debugging)
   */
  getHistory() {
    return [...this.eventHistory];
  }
}

// Create singleton instance
const eventBus = new EventBus();

// Expose globally for microfrontends
if (typeof window !== 'undefined') {
  window.__EVENT_BUS__ = eventBus;
}

export default eventBus;
```

### **Step 2: Define Event Types (Type Safety)**

```javascript
// frontend/shared-components/src/utils/eventTypes.js

/**
 * Event Type Constants
 * Centralized definition of all event types for type safety
 */
export const EVENT_TYPES = {
  // Task Events
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_DELETED: 'task:deleted',
  TASK_STATUS_CHANGED: 'task:status-changed',
  
  // User Events
  USER_LOGGED_IN: 'user:logged-in',
  USER_LOGGED_OUT: 'user:logged-out',
  USER_PROFILE_UPDATED: 'user:profile-updated',
  
  // Notification Events
  NOTIFICATION_RECEIVED: 'notification:received',
  NOTIFICATION_READ: 'notification:read',
  
  // UI Events
  THEME_CHANGED: 'ui:theme-changed',
  SIDEBAR_TOGGLED: 'ui:sidebar-toggled',
  MODAL_OPENED: 'ui:modal-opened',
  MODAL_CLOSED: 'ui:modal-closed',
  
  // Navigation Events
  NAVIGATION_REQUESTED: 'nav:requested',
  ROUTE_CHANGED: 'nav:route-changed',
  
  // Error Events
  ERROR_OCCURRED: 'error:occurred',
  API_ERROR: 'error:api',
  
  // System Events
  IDLE_TIMEOUT: 'system:idle-timeout',
  NETWORK_STATUS_CHANGED: 'system:network-status-changed',
};

/**
 * Event Payload Schemas (for validation)
 */
export const EVENT_SCHEMAS = {
  [EVENT_TYPES.TASK_CREATED]: {
    task: 'object',
    userId: 'string',
  },
  [EVENT_TYPES.USER_LOGGED_IN]: {
    user: 'object',
    token: 'string',
  },
  [EVENT_TYPES.NAVIGATION_REQUESTED]: {
    route: 'string',
    params: 'object',
  },
};
```

### **Step 3: Create React Hook for Event Bus**

```javascript
// frontend/shared-components/src/hooks/useEventBus.js

import { useEffect, useRef } from 'react';
import eventBus from '../utils/eventBus';
import { EVENT_TYPES } from '../utils/eventTypes';

/**
 * React Hook for Event Bus
 * Automatically cleans up listeners on unmount
 */
export const useEventBus = (eventType, callback, deps = []) => {
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const wrappedCallback = (payload) => {
      callbackRef.current(payload);
    };

    const unsubscribe = eventBus.on(eventType, wrappedCallback);

    return () => {
      unsubscribe();
    };
  }, [eventType, ...deps]);
};

/**
 * Hook to emit events
 */
export const useEmitEvent = () => {
  return (eventType, payload) => {
    eventBus.emit(eventType, payload);
  };
};
```

### **Step 4: Update Shell App to Use Event Bus**

```javascript
// frontend/shell-app/src/components/AuthenticatedApp.jsx

import { useEventBus } from 'sharedComponents/hooks/useEventBus';
import { EVENT_TYPES } from 'sharedComponents/utils/eventTypes';

const AuthenticatedApp = ({ onLogout }) => {
  // Listen for logout events from any microfrontend
  useEventBus(EVENT_TYPES.USER_LOGGED_OUT, () => {
    onLogout();
  });

  // Listen for navigation requests
  useEventBus(EVENT_TYPES.NAVIGATION_REQUESTED, ({ route, params }) => {
    navigate(route, params);
  });

  // Listen for theme changes
  useEventBus(EVENT_TYPES.THEME_CHANGED, ({ theme }) => {
    // Update theme in Redux store
    dispatch(setTheme(theme));
  });

  return (
    // ... rest of component
  );
};
```

### **Step 5: Update Microfrontends to Use Event Bus**

```javascript
// frontend/microfrontends/task-app/src/TaskManagement.jsx

import { useEventBus, useEmitEvent } from 'sharedComponents/hooks/useEventBus';
import { EVENT_TYPES } from 'sharedComponents/utils/eventTypes';

const TaskManagement = () => {
  const emitEvent = useEmitEvent();

  // Listen for task-related events from other microfrontends
  useEventBus(EVENT_TYPES.TASK_CREATED, (payload) => {
    // Refresh task list or update UI
    refreshTasks();
  });

  // Listen for user logout
  useEventBus(EVENT_TYPES.USER_LOGGED_OUT, () => {
    // Clear local state
    setTasks([]);
  });

  const handleCreateTask = async (taskData) => {
    try {
      const response = await taskApi.post('/tasks', taskData);
      
      // Emit event instead of calling window function
      emitEvent(EVENT_TYPES.TASK_CREATED, {
        task: response.data,
        userId: currentUser.id,
        timestamp: Date.now()
      });

      // Also update Redux store (for critical state)
      dispatch(addTask(response.data));

      // Show notification via event
      emitEvent(EVENT_TYPES.NOTIFICATION_RECEIVED, {
        type: 'success',
        message: 'Task created successfully!'
      });

      return response.data;
    } catch (error) {
      emitEvent(EVENT_TYPES.ERROR_OCCURRED, {
        type: 'api',
        message: 'Failed to create task',
        error: error.message
      });
      throw error;
    }
  };

  return (
    // ... component JSX
  );
};
```

---

## 🔄 Migration Strategy: From Window Functions to Events

### **Before (Current - Tight Coupling):**

```javascript
// ❌ Tight coupling - direct function calls
if (window.showSuccess) {
  window.showSuccess('Task created!');
}

if (window.showError) {
  window.showError('Failed to create task');
}
```

### **After (Event-Based - Loose Coupling):**

```javascript
// ✅ Loose coupling - event-based
import eventBus from 'sharedComponents/utils/eventBus';
import { EVENT_TYPES } from 'sharedComponents/utils/eventTypes';

// Emit event
eventBus.emit(EVENT_TYPES.NOTIFICATION_RECEIVED, {
  type: 'success',
  message: 'Task created!'
});

// Shell app listens and shows notification
useEventBus(EVENT_TYPES.NOTIFICATION_RECEIVED, ({ type, message }) => {
  if (type === 'success') {
    window.showSuccess?.(message);
  } else if (type === 'error') {
    window.showError?.(message);
  }
});
```

---

## 📊 Comparison: Event-Based vs Other Approaches

| Aspect          | Event-Based       | Redux Store      | Window Functions     | PostMessage |
|-----------------|-------------------|------------------|----------------------|-------------|
| **Coupling**    | ✅ Loose         | ⚠️ Medium        | ❌ Tight             | ✅ Loose |
| **Scalability** | ✅ Excellent     | ⚠️ Good          | ❌ Poor              | ✅ Excellent |
| **Type Safety** | ✅ Can be added  | ✅ Yes           | ❌ No                | ⚠️ Manual |
| **Debugging**   | ✅ Event history | ✅ DevTools      | ❌ Difficult         | ⚠️ Medium |
| **Performance** | ✅ Good          | ⚠️ Can be heavy  | ✅ Excellent         | ✅ Good |
| **Use Case**    | Actions/Events   | Critical State    | Simple Notifications | Cross-Origin |

---

## 🎯 Recommended Architecture

### **Hybrid Approach (Best of All Worlds):**

```javascript
┌─────────────────────────────────────────────────────────┐
│                    Shell App (Host)                     │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Event Bus (Custom Events)                       │  │
│  │  - Actions, Notifications, UI Events            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Redux Store (Shared State)                      │  │
│  │  - Auth, User Profile, Critical Data            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Session Storage                                  │  │
│  │  - Tokens, Persistence                           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            │ Module Federation
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  User App    │   │  Task App    │   │ Notification │
│              │   │              │   │  App          │
│  • Emits     │   │  • Emits     │   │  • Emits      │
│    Events    │   │    Events    │   │    Events     │
│  • Listens   │   │  • Listens   │   │  • Listens    │
│    Events    │   │    Events    │   │    Events     │
│  • Uses      │   │  • Uses      │   │  • Uses       │
│    Redux     │   │    Redux     │   │    Redux      │
└──────────────┘   └──────────────┘   └──────────────┘
```

---

## ✅ Best Practices Summary

1. **Use Events for Actions/Notifications** ✅
   - Task created/updated/deleted
   - User actions
   - UI state changes
   - Navigation requests

2. **Use Redux for Critical Shared State** ✅
   - Authentication
   - User profile
   - Global UI state
   - Data that needs immediate consistency

3. **Use PostMessage for Cross-Origin** ✅
   - Different domains
   - Iframe communication

4. **Use Storage for Persistence** ✅
   - Tokens
   - User preferences
   - Temporary data

5. **Avoid Direct Function Calls** ❌
   - Don't use `window.showSuccess()` directly
   - Use events instead

---

## 🚀 Next Steps

1. **Implement Event Bus** in shared-components
2. **Define Event Types** for type safety
3. **Create React Hooks** for easy usage
4. **Migrate Window Functions** to events
5. **Keep Redux** for critical state
6. **Add Event History** for debugging

---

## 📚 Conclusion

**Yes, event-based communication is a best practice**, but it should be used **strategically**:

- ✅ **Use Events** for: Actions, notifications, UI events, loose coupling
- ✅ **Use Redux** for: Critical shared state, authentication, data consistency
- ✅ **Use Both** for: Maximum flexibility and maintainability

The **hybrid approach** gives you the benefits of both:
- **Loose coupling** from events
- **Data consistency** from Redux
- **Scalability** from both

This is the **recommended architecture** for production microfrontend applications.

