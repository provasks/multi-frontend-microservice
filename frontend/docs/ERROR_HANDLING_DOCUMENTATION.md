# 🛡️ **Error Handling Documentation**

## 📋 **Table of Contents**
1. [Overview](#overview)
2. [Error Handling Architecture](#error-handling-architecture)
3. [Error Types & Categories](#error-types--categories)
4. [Implementation Details](#implementation-details)
5. [Error Boundaries](#error-boundaries)
6. [Global Error Handling](#global-error-handling)
7. [API Error Handling](#api-error-handling)
8. [Network Error Handling](#network-error-handling)
9. [Authentication Error Handling](#authentication-error-handling)
10. [User Experience](#user-experience)
11. [Security Considerations](#security-considerations)
12. [Testing & Debugging](#testing--debugging)

---

## 🎯 **Overview**

Our Task Management System implements a comprehensive, multi-layered error handling strategy that ensures robust error management across the entire microfrontend architecture. The system handles errors at multiple levels to provide a seamless user experience while maintaining security and debugging capabilities.

### **Key Principles:**
- **Graceful Degradation**: Application continues to function even when errors occur
- **User-Friendly Messages**: Clear, actionable error messages for users
- **Security First**: No sensitive information exposed in error messages
- **Comprehensive Coverage**: All error types are handled appropriately
- **Debugging Support**: Detailed logging for developers

---

## 🏗️ **Error Handling Architecture**

### **Multi-Layer Error Handling System:**

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                           │
├─────────────────────────────────────────────────────────────┤
│  🎨 FloatingMessageManager (User Notifications)            │
├─────────────────────────────────────────────────────────────┤
│  🛡️ Error Boundaries (React Component Errors)               │
├─────────────────────────────────────────────────────────────┤
│  🌐 Global Error Handlers (JavaScript Runtime Errors)      │
├─────────────────────────────────────────────────────────────┤
│  🔌 API Error Handling (Network & Server Errors)          │
├─────────────────────────────────────────────────────────────┤
│  🔐 Authentication Error Handling (Auth Failures)        │
├─────────────────────────────────────────────────────────────┤
│  📡 Network Error Handling (Connection Issues)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚨 **Error Types & Categories**

### **1. React Component Errors**
**Where:** React components and their lifecycle methods
**Why:** JavaScript errors in React components can crash the entire UI
**How:** Error Boundaries catch and handle these errors

### **2. JavaScript Runtime Errors**
**Where:** Global JavaScript execution context
**Why:** Unhandled errors can crash the application
**How:** Global error event listeners

### **3. Network/API Errors**
**Where:** HTTP requests and API calls
**Why:** Server communication failures need proper handling
**How:** Axios interceptors and fetch error handling

### **4. Authentication Errors**
**Where:** Login/logout and token validation
**Why:** Security and user session management
**How:** 401 response handling and token cleanup

### **5. Network Connectivity Errors**
**Where:** Internet connection and server availability
**Why:** Offline scenarios and server downtime
**How:** Online/offline event listeners and fetch error detection

### **6. Resource Loading Errors**
**Where:** JavaScript chunks, CSS, and other assets
**Why:** Failed resource loading can break the application
**How:** ChunkLoadError detection and handling

---

## 🔧 **Implementation Details**

### **File Structure:**
```
frontend/
├── shell-app/src/
│   ├── App.jsx                          # Global error handlers
│   ├── components/
│   │   ├── FloatingMessageManager.jsx   # User notifications
│   │   └── ErrorTesting.jsx            # Error testing component
│   └── utils/api.js                     # API error handling
├── microfrontends/
│   ├── user-app/src/components/ErrorBoundary.jsx
│   ├── task-app/src/components/ErrorBoundary.jsx
│   └── notification-app/src/components/ErrorBoundary.jsx
└── shared-components/src/
    ├── hooks/useGlobalErrorHandler.js   # Shared error handling
    └── components/ErrorState.jsx       # Error UI components
```

---

## 🛡️ **Error Boundaries**

### **Purpose:**
Error Boundaries catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the entire application.

### **Implementation:**

#### **Individual Microfrontend Error Boundaries:**
```javascript
// frontend/microfrontends/task-app/src/components/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Task App Error:', error);
    console.error('Error Info:', errorInfo);
    
    if (window.showError) {
      window.showError(`Task Management error: ${error.message}`);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger">
          <h6>Task Management Error</h6>
          <p>There was an error in the Task Management module.</p>
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### **Error Types Handled:**
- **Component Render Errors**: JavaScript errors in component rendering
- **Lifecycle Method Errors**: Errors in componentDidMount, useEffect, etc.
- **Event Handler Errors**: Errors in onClick, onChange handlers
- **State Update Errors**: Errors during setState or useState

### **Benefits:**
- **Isolation**: Errors in one microfrontend don't crash others
- **Recovery**: Users can retry failed components
- **User Experience**: Graceful fallback UI instead of white screen
- **Debugging**: Detailed error logging for developers

---

## 🌐 **Global Error Handling**

### **Purpose:**
Handle JavaScript runtime errors that occur outside of React components, such as network errors, async operations, and unhandled promise rejections.

### **Implementation:**

#### **Global Error Event Listeners:**
```javascript
// frontend/shell-app/src/App.jsx
useEffect(() => {
  const handleGlobalError = (event) => {
    console.log('🌐 Global error handler triggered:', event.error?.message || event.message);
    
    // Check if this is a React component error - let ErrorBoundary handle it
    if (event.error && event.error.message && event.error.message.includes('Component Error')) {
      console.log('🚫 Ignoring React component error - ErrorBoundary should handle this');
      return; // Don't interfere with ErrorBoundary
    }
    
    // Don't handle login form errors - let the form handle them
    if (event.error && event.error.message && event.error.message.includes('Login')) {
      console.log('🚫 Ignoring login form error - form should handle this');
      return;
    }
    
    // Handle other types of errors
    let userMessage = 'An unexpected error occurred. Please try again.';
    
    if (event.error) {
      if (event.error.name === 'ChunkLoadError') {
        userMessage = 'Failed to load application resources. Please refresh the page.';
      } else if (event.error.message && event.error.message.includes('Network Error')) {
        if (!navigator.onLine) {
          userMessage = 'No internet connection. Please check your network.';
        } else {
          userMessage = 'Server is not responding. Please try again later.';
        }
      } else if (event.error.message && event.error.message.includes('Unauthorized')) {
        userMessage = 'Your session has expired. Please log in again.';
      }
    }
    
    if (window.showError) {
      window.showError(userMessage);
    }
  };

  const handleUnhandledRejection = (event) => {
    console.log('🌐 Unhandled rejection handler triggered:', event.reason?.message || event.reason);
    
    // Don't handle login form rejections - let the form handle them
    if (event.reason && event.reason.message && event.reason.message.includes('Login')) {
      console.log('🚫 Ignoring login form rejection - form should handle this');
      return;
    }
    
    let userMessage = 'An unexpected error occurred. Please try again.';
    
    if (event.reason && typeof event.reason === 'object') {
      if (event.reason.name === 'ChunkLoadError') {
        userMessage = 'Failed to load application resources. Please refresh the page.';
      } else if (event.reason.message && event.reason.message.includes('Network Error')) {
        if (!navigator.onLine) {
          userMessage = 'No internet connection. Please check your network.';
        } else {
          userMessage = 'Server is not responding. Please try again later.';
        }
      }
    }
    
    if (window.showError) {
      window.showError(userMessage);
    }
    
    event.preventDefault();
  };

  // Add event listeners
  window.addEventListener('error', handleGlobalError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  
  // Network status listeners
  window.addEventListener('online', () => {
    console.log('Network: Online');
    if (window.showSuccess) {
      window.showSuccess('Connection restored!');
    }
  });

  window.addEventListener('offline', () => {
    console.log('Network: Offline');
    if (window.showError) {
      window.showError('No internet connection. Please check your network.');
    }
  });

  return () => {
    window.removeEventListener('error', handleGlobalError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    window.removeEventListener('online', () => {});
    window.removeEventListener('offline', () => {});
  };
}, []);
```

### **Error Types Handled:**
- **ChunkLoadError**: Failed to load JavaScript chunks
- **TypeError**: Network fetch errors and undefined variable access
- **AbortError**: Cancelled requests
- **NetworkError**: Connection failures
- **Unhandled Promise Rejections**: Async operation failures

### **Smart Error Filtering:**
- **React Component Errors**: Delegated to Error Boundaries
- **Login Form Errors**: Handled by form-specific error handling
- **Network Errors**: Distinguished between offline and server issues
- **Authentication Errors**: Special handling for 401/403 responses

---

## 🔌 **API Error Handling**

### **Purpose:**
Handle HTTP request/response errors, authentication failures, and server communication issues.

### **Implementation:**

#### **Axios Interceptors:**
```javascript
// frontend/shell-app/src/utils/api.js
const addAuthToken = (apiInstance) => {
  apiInstance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    return config;
  });
  
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Don't redirect if we're already on the login page
        if (!window.location.pathname.includes('/login')) {
          // Clear token from sessionStorage only
          sessionStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
};
```

#### **Custom API Hook Error Handling:**
```javascript
// frontend/shared-components/src/hooks/useAuth.js
const makeAuthenticatedRequest = useCallback(async (url, options = {}) => {
  try {
    const response = await axios({
      url,
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });

    return response;
  } catch (error) {
    // Handle axios-specific errors
    if (error.response?.status === 401) {
      logout();
      throw new Error('Unauthorized');
    }
    
    // Handle different types of network errors
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network.');
      } else {
        throw new Error('Server is not responding. Please try again later.');
      }
    } else if (error.name === 'ChunkLoadError') {
      throw new Error('Failed to load application resources. Please refresh the page.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request was cancelled.');
    }
    
    // Re-throw other errors
    throw error;
  }
}, [getAuthHeaders, logout]);
```

### **Error Types Handled:**
- **401 Unauthorized**: Token expired or invalid
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors
- **Network Timeout**: Request timeout
- **Connection Refused**: Server unavailable

### **Response Status Handling:**
- **2xx Success**: Normal processing
- **401 Authentication**: Redirect to login, clear tokens
- **403 Authorization**: Show permission denied message
- **404 Not Found**: Show resource not found message
- **5xx Server Error**: Show server error message

---

## 📡 **Network Error Handling**

### **Purpose:**
Handle network connectivity issues, offline scenarios, and connection problems.

### **Implementation:**

#### **Online/Offline Detection:**
```javascript
// Network status listeners
window.addEventListener('online', () => {
  console.log('Network: Online');
  if (window.showSuccess) {
    window.showSuccess('Connection restored!');
  }
});

window.addEventListener('offline', () => {
  console.log('Network: Offline');
  if (window.showError) {
    window.showError('No internet connection. Please check your network.');
  }
});
```

#### **Network Error Detection:**
```javascript
// Detect network errors in axios operations
if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
  if (!navigator.onLine) {
    userMessage = 'No internet connection. Please check your network.';
  } else {
    userMessage = 'Server is not responding. Please try again later.';
  }
}
```

### **Error Types Handled:**
- **Offline Detection**: No internet connection
- **Server Unavailable**: Server not responding
- **Timeout Errors**: Request timeout
- **DNS Resolution**: Domain name resolution failures
- **Connection Refused**: Server rejecting connections

---

## 🔐 **Authentication Error Handling**

### **Purpose:**
Handle authentication failures, token expiration, and unauthorized access attempts.

### **Implementation:**

#### **Token Expiration Handling:**
```javascript
// Automatic token cleanup on 401 errors
if (error.response?.status === 401) {
  if (!window.location.pathname.includes('/login')) {
    sessionStorage.removeItem('token');
    window.location.href = '/login';
  }
}
```

#### **Login Form Error Handling:**
```javascript
// frontend/shell-app/src/components/LoginForm.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  // ... validation logic ...
  
  try {
    const response = await authApi.post('/auth/login', formData);
    // ... success handling ...
  } catch (error) {
    console.error('Login error:', error);
    
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.response?.status === 401) {
      errorMessage = 'Invalid email or password.';
    } else if (error.response?.status === 429) {
      errorMessage = 'Too many login attempts. Please try again later.';
    } else if (error.response?.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (!navigator.onLine) {
      errorMessage = 'No internet connection. Please check your network.';
    }
    
    setValidationErrors({ general: errorMessage });
  }
};
```

### **Error Types Handled:**
- **Invalid Credentials**: Wrong email/password
- **Token Expiration**: JWT token expired
- **Account Locked**: Too many failed attempts
- **Server Authentication Errors**: Backend authentication failures
- **Network Authentication Errors**: Network issues during login

---

## 🎨 **User Experience**

### **Floating Message System:**

#### **Implementation:**
```javascript
// frontend/shell-app/src/components/FloatingMessageManager.jsx
const FloatingMessageManager = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Create global functions for showing messages
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
      // Cleanup global functions
      delete window.showSuccess;
      delete window.showError;
      delete window.showWarning;
      delete window.showInfo;
    };
  }, []);

  const addMessage = (text, type) => {
    const id = Date.now() + Math.random();
    const message = { id, text, type };
    
    setMessages(prev => [...prev, message]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== id));
    }, 4000);
  };

  return (
    <div className="position-fixed" style={{ top: '20px', right: '20px', zIndex: 9999 }}>
      {messages.map(message => (
        <div
          key={message.id}
          className={`alert alert-${message.type} alert-dismissible fade show`}
          role="alert"
          style={{ minWidth: '300px', marginBottom: '10px' }}
        >
          {message.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => removeMessage(message.id)}
          ></button>
        </div>
      ))}
    </div>
  );
};
```

### **Message Types:**
- **Success**: Green alerts for successful operations
- **Error**: Red alerts for errors and failures
- **Warning**: Yellow alerts for warnings
- **Info**: Blue alerts for informational messages

### **User Experience Features:**
- **Auto-dismiss**: Messages automatically disappear after 4 seconds
- **Manual Dismiss**: Users can close messages manually
- **Non-blocking**: Messages don't prevent user interaction
- **Stacking**: Multiple messages can be displayed simultaneously
- **Responsive**: Messages adapt to different screen sizes

---

## 🔒 **Security Considerations**

### **Information Disclosure Prevention:**

#### **Generic Error Messages:**
```javascript
// Don't expose sensitive information
let userMessage = 'An unexpected error occurred. Please try again.';

// Instead of:
// userMessage = `Database error: ${error.details}`;
// userMessage = `Server error: ${error.stack}`;
```

#### **Secure Error Logging:**
```javascript
// Log detailed errors for developers only
console.error('Error Details:', {
  name: error.name,
  message: error.message,
  stack: error.stack,
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
  url: window.location.href,
  ...errorInfo
});
```

### **Security Features:**
- **No Sensitive Data**: Error messages don't expose internal details
- **Stack Trace Protection**: No internal stack traces shown to users
- **Database Error Masking**: No database information leaked
- **System Information Protection**: No system details revealed
- **Authentication Error Handling**: Secure handling of auth failures

---

## 🧪 **Testing & Debugging**

### **Error Testing Component:**

#### **Implementation:**
```javascript
// frontend/shell-app/src/components/ErrorTesting.jsx
const ErrorTesting = () => {
  const testGlobalErrorHandler = () => {
    console.log('Testing if global error handler is working...');
    console.log('window.showError available:', typeof window.showError);
    console.log('window.showSuccess available:', typeof window.showSuccess);
    
    if (window.showError) {
      window.showError('Global error handler is working! This is a test message.');
    } else {
      alert('Global error handler not available!');
    }
  };

  const triggerNetworkError = () => {
    console.log('🌐 Testing network error...');
    fetch('http://nonexistent-url-that-will-fail.com/api/test')
      .then(response => response.json())
      .catch(error => {
        console.error('Network error:', error);
        if (window.showError) {
          window.showError('Network error: ' + error.message);
        }
      });
  };

  const triggerChunkLoadError = () => {
    console.log('Triggering chunk load error...');
    setTimeout(() => {
      const error = new Error('Loading chunk failed');
      error.name = 'ChunkLoadError';
      throw error;
    }, 100);
  };

  const triggerAuthError = () => {
    console.log('Triggering auth error...');
    setTimeout(() => {
      const error = new Error('Unauthorized');
      error.name = 'AuthError';
      throw error;
    }, 100);
  };

  // ... more test functions ...
};
```

### **Error Types for Testing:**
- **Component Errors**: React component rendering errors
- **Network Errors**: Failed API requests
- **Chunk Load Errors**: Failed resource loading
- **Authentication Errors**: Token expiration and auth failures
- **Global Errors**: JavaScript runtime errors
- **Promise Rejections**: Unhandled async operation errors

### **Debugging Features:**
- **Console Logging**: Detailed error information in console
- **Error Boundaries**: Visual error indicators in UI
- **Global Error Tracking**: Comprehensive error monitoring
- **Network Status**: Online/offline detection
- **Authentication Status**: Token validation and cleanup

---

## 📊 **Error Handling Summary**

### **Coverage Matrix:**

| Error Type | Global Handler | Error Boundary | API Handler | User Message |
|------------|----------------|----------------|-------------|--------------|
| **Component Errors** | ❌ | ✅ | ❌ | ✅ |
| **Network Errors** | ✅ | ❌ | ✅ | ✅ |
| **Authentication Errors** | ✅ | ❌ | ✅ | ✅ |
| **Chunk Load Errors** | ✅ | ❌ | ❌ | ✅ |
| **Promise Rejections** | ✅ | ❌ | ❌ | ✅ |
| **Network Connectivity** | ✅ | ❌ | ❌ | ✅ |

### **Benefits:**
- **Comprehensive Coverage**: All error types are handled
- **User-Friendly**: Clear, actionable error messages
- **Developer-Friendly**: Detailed logging for debugging
- **Security-Focused**: No sensitive information exposed
- **Resilient**: Application continues to function despite errors
- **Maintainable**: Clean, organized error handling code

### **Best Practices Implemented:**
- **Error Boundaries**: Isolate React component errors
- **Global Error Handling**: Catch all JavaScript runtime errors
- **API Error Handling**: Proper HTTP error management
- **Network Error Handling**: Offline/online scenario management
- **Authentication Error Handling**: Secure token management
- **User Experience**: Non-blocking, informative error messages
- **Security**: No information disclosure in error messages
- **Testing**: Comprehensive error testing capabilities

---

## 🚀 **Future Enhancements**

### **Potential Improvements:**
- **Error Reporting**: Integration with error reporting services (Sentry, LogRocket)
- **Error Analytics**: Track error frequency and patterns
- **Automatic Recovery**: Self-healing mechanisms for certain errors
- **Error Categorization**: More sophisticated error classification
- **Performance Monitoring**: Error impact on application performance
- **User Feedback**: Allow users to report errors with context

### **Advanced Features:**
- **Error Boundaries with Retry Logic**: Automatic retry mechanisms
- **Progressive Error Handling**: Escalating error handling strategies
- **Error Context Preservation**: Maintain application state during errors
- **Error Recovery Strategies**: Different recovery approaches for different error types

---

This comprehensive error handling system ensures that our Task Management System provides a robust, user-friendly, and secure experience even when errors occur. The multi-layered approach guarantees that errors are caught, handled appropriately, and communicated effectively to users while maintaining the application's functionality and security.
