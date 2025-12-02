# 🍪 HttpOnly Cookies with Module Federation

## ✅ **Short Answer: YES, Module Federation works perfectly with HttpOnly cookies!**

In fact, **HttpOnly cookies are often considered MORE secure** than sessionStorage for authentication tokens in microfrontend architectures.

---

## 🔄 **How It Works**

### **Key Differences from sessionStorage Approach**

```
┌─────────────────────────────────────────────────────────────┐
│              Current: sessionStorage Approach               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Backend returns token in response body                   │
│  2. Frontend stores token in sessionStorage                  │
│  3. Frontend reads token from sessionStorage                │
│  4. Frontend adds token to Authorization header              │
│  5. Backend reads token from Authorization header           │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│            Proposed: HttpOnly Cookie Approach                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Backend sets token in HttpOnly cookie                   │
│  2. Browser automatically stores cookie                     │
│  3. Browser automatically sends cookie with requests        │
│  4. Backend reads token from cookie                          │
│                                                              │
│  ✅ No JavaScript access needed                             │
│  ✅ No manual header management                              │
│  ✅ Automatic cookie handling                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ **Architecture with HttpOnly Cookies**

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Tab                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         HttpOnly Cookie                               │   │
│  │  { authToken: "eyJhbGc..." }                         │   │
│  │  • Automatically sent with requests                  │   │
│  │  • NOT accessible via JavaScript                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ▲                                   │
│                          │ (automatic)                     │
│                          │                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Shell    │  │ Task     │  │ User     │  │ Notif  ││
│  │ App      │  │ App      │  │ App      │  │ App    ││
│  │          │  │          │  │          │  │        ││
│  │ Makes    │  │ Makes    │  │ Makes    │  │ Makes  ││
│  │ API      │  │ API      │  │ API      │  │ API    ││
│  │ requests │  │ requests │  │ requests │  │ requests││
│  └──────────┘  └──────────┘  └──────────┘  └────────┘│
│       │              │              │              │    │
│       └──────────────┴──────────────┴──────────────┘    │
│                          │                               │
│              ┌───────────────────────┐                   │
│              │  unifiedApiClient     │                   │
│              │  (shared-components)   │                   │
│              │                       │                   │
│              │  NO token interceptors│                   │
│              │  needed! Browser      │                   │
│              │  automatically sends  │                   │
│              │  cookies              │                   │
│              └───────────────────────┘                   │
│                          │                               │
│                          ▼                               │
│              ┌───────────────────────┐                   │
│              │    Backend API        │                   │
│              │  Reads token from      │                   │
│              │  req.cookies.authToken │                   │
│              └───────────────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 **Implementation Changes Required**

### **1. Backend Changes**

#### **Login Endpoint - Set HttpOnly Cookie**

```javascript
// backend/services/user-service/controllers/authController.js

async login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    const user = await userService.authenticateUser(email, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Set HttpOnly cookie - environment-aware settings
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('authToken', token, {
      httpOnly: true,        // Prevents JavaScript access
      secure: isProduction,  // Only sent over HTTPS in production
      sameSite: isProduction ? 'strict' : 'lax', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'              // Available to all routes
    });
    
    // Return user data (no token in response)
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
```

#### **Logout Endpoint - Clear Cookie**

```javascript
async logout(req, res) {
  try {
    // Clear the HttpOnly cookie - options must EXACTLY match the cookie settings
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Method 1: Clear cookie with exact same options as when it was set
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/'
    });
    
    // Method 2: Set cookie to empty with immediate expiration (backup method)
    // This ensures cookie is cleared even if clearCookie doesn't work
    res.cookie('authToken', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
      expires: new Date(0),  // Expire immediately
      maxAge: 0
    });
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
```

#### **Auth Middleware - Read from Cookie**

```javascript
// backend/shared/middleware/auth.js

middleware() {
  return async (req, res, next) => {
    try {
      // Try to get token from cookie first, then from Authorization header (backward compatibility)
      const token = req.cookies?.authToken || 
                    req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
      }

      let user;
      if (this.verifyMode === 'direct') {
        user = await this.verifyDirectToken(token);
      } else {
        user = await this.verifyServiceToken(token);
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ error: error.message || 'Token is not valid' });
    }
  };
}
```

#### **Add Cookie Parser Middleware**

**CRITICAL**: You must add `cookie-parser` middleware to all backend services:

```javascript
// backend/api-gateway/server.js
// backend/services/user-service/server.js
// backend/services/task-service/server.js
// backend/services/notification-service/server.js

const cookieParser = require('cookie-parser');

// Add cookie parser middleware BEFORE routes
app.use(cookieParser());
```

#### **CORS Configuration - Allow Credentials**

```javascript
// backend/api-gateway/server.js or backend/shared/config/backendConfig.js

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:4001',
    'http://localhost:4002',
    'http://localhost:4003',
    'http://localhost:4004'
  ],
  credentials: true,  // ⚠️ CRITICAL: Must be true for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
```

---

### **2. Frontend Changes**

#### **Remove Token Management from Frontend**

```javascript
// frontend/shared-components/src/hooks/useAuth.js

import { useState, useCallback, useEffect, useRef } from 'react';
import { authApi } from '../utils/unifiedApiClient';

// Shared state to prevent multiple simultaneous auth checks
let authCheckPromise = null;
let authCheckCache = {
  timestamp: 0,
  result: null,
  subscribers: new Set()
};
const CACHE_DURATION = 5000; // Cache for 5 seconds

// Shared function to check auth (prevents duplicate API calls)
const performAuthCheck = async () => {
  const now = Date.now();
  
  // If there's a recent cache and it's still valid, return cached result
  if (authCheckCache.result !== null && (now - authCheckCache.timestamp) < CACHE_DURATION) {
    return authCheckCache.result;
  }
  
  // If there's already a pending request, wait for it
  if (authCheckPromise) {
    return authCheckPromise;
  }
  
  // Create new auth check promise
  authCheckPromise = (async () => {
    try {
      const response = await authApi.get('/auth/me');
      const result = {
        isAuthenticated: true,
        user: response.data.user
      };
      
      // Update cache
      authCheckCache = {
        timestamp: Date.now(),
        result,
        subscribers: new Set()
      };
      
      // Notify all subscribers
      authCheckCache.subscribers.forEach(callback => callback(result));
      
      return result;
    } catch (error) {
      const result = {
        isAuthenticated: false,
        user: null
      };
      
      // Only cache 401 errors (expected when not logged in)
      if (error.response?.status === 401) {
        authCheckCache = {
          timestamp: Date.now(),
          result,
          subscribers: new Set()
        };
      } else {
        console.error('Auth check error:', error);
      }
      
      // Notify all subscribers
      authCheckCache.subscribers.forEach(callback => callback(result));
      
      return result;
    } finally {
      authCheckPromise = null;
    }
  })();
  
  return authCheckPromise;
};

export const useAuth = () => {
  // No token state needed - cookie is handled by browser
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasCheckedRef = useRef(false);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use shared auth check to prevent duplicate calls
      const result = await performAuthCheck();
      
      setIsAuthenticated(result.isAuthenticated);
      setUser(result.user);
      
      return result.user;
    } catch (error) {
      console.error('Unexpected error in checkAuth:', error);
      setIsAuthenticated(false);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to auth changes
  useEffect(() => {
    const updateState = (result) => {
      setIsAuthenticated(result.isAuthenticated);
      setUser(result.user);
      setLoading(false);
    };
    
    // Subscribe to cache updates
    authCheckCache.subscribers.add(updateState);
    
    // Check auth on mount (only once per component instance)
    if (!hasCheckedRef.current) {
      hasCheckedRef.current = true;
      checkAuth();
    }
    
    // Check if we have cached data
    if (authCheckCache.result !== null) {
      updateState(authCheckCache.result);
    }
    
    return () => {
      authCheckCache.subscribers.delete(updateState);
    };
  }, [checkAuth]);

  const login = useCallback(async (emailParam, passwordParam) => {
    if (!emailParam || !passwordParam) {
      throw new Error('Email and password are required');
    }
    
    try {
      setLoading(true);
      
      const emailToSend = String(emailParam).trim();
      const passwordToSend = String(passwordParam);
      
      if (!emailToSend) {
        throw new Error('Email cannot be empty');
      }
      
      const loginPayload = {
        email: emailToSend,
        password: passwordToSend
      };
      
      // Make login request - cookie is set automatically by backend
      const response = await authApi.post('/auth/login', loginPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = {
        isAuthenticated: true,
        user: response.data.user
      };
      
      // Update cache with new auth state
      authCheckCache = {
        timestamp: Date.now(),
        result,
        subscribers: new Set()
      };
      
      // Notify all subscribers
      authCheckCache.subscribers.forEach(callback => callback(result));
      
      setIsAuthenticated(true);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      // Make logout request - cookie is cleared by backend
      await authApi.post('/auth/logout', {});
      
      const result = {
        isAuthenticated: false,
        user: null
      };
      
      // Clear cache
      authCheckCache = {
        timestamp: Date.now(),
        result,
        subscribers: new Set()
      };
      
      // Notify all subscribers
      authCheckCache.subscribers.forEach(callback => callback(result));
      
      setIsAuthenticated(false);
      setUser(null);
      
      // Clear any sessionStorage data (legacy cleanup)
      if (typeof window !== 'undefined' && window.sessionStorage) {
        try {
          window.sessionStorage.removeItem('token');
          window.sessionStorage.removeItem('user');
          window.sessionStorage.removeItem('authToken');
        } catch (error) {
          console.warn('Error clearing sessionStorage:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Clear state even on error
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth
  };
};
```

**Key Features:**
- ✅ **Shared Cache**: Prevents duplicate `/auth/me` calls across all components
- ✅ **Subscriber Pattern**: Notifies all components when auth state changes
- ✅ **Request Deduplication**: Multiple components can call `checkAuth()` simultaneously without duplicate API calls
- ✅ **5-Second Cache**: Caches auth check results for 5 seconds to reduce API calls

#### **Update API Client - Remove Token Interceptors**

```javascript
// frontend/shared-components/src/utils/unifiedApiClient.js

import axios from 'axios';
import { API_CONFIG } from '../constants';

// Create axios instances
export const authApi = axios.create({
  baseURL: API_CONFIG.BASE_URLS.AUTH,
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  withCredentials: true,  // ⚠️ CRITICAL: Send cookies with requests
  headers: {
    'Content-Type': 'application/json'
  }
});

export const taskApi = axios.create({
  baseURL: API_CONFIG.BASE_URLS.TASKS,
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  withCredentials: true,  // ⚠️ CRITICAL: Send cookies with requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// ... similar for notificationApi and userApi

/**
 * Configure API instances - NO TOKEN INTERCEPTORS NEEDED!
 */
const configureApiInstance = (apiInstance) => {
  // Request interceptor - Only add CSRF token (if needed)
  apiInstance.interceptors.request.use(
    (config) => {
      // Add CSRF token if available
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
      
      // Add request timestamp for debugging
      config.metadata = { startTime: new Date() };
      
      // NO TOKEN MANAGEMENT - Browser handles cookies automatically!
      
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors
  apiInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Don't log 401 errors for /auth/me (expected when checking auth status)
      const isAuthCheck = error.config?.url?.includes('/auth/me') && error.response?.status === 401;
      
      if (!isAuthCheck && error.response?.status >= 500) {
        // Only log server errors (500+)
        console.error('API Server Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status
        });
      }

      // Handle specific error cases
      if (error.response?.status === 401) {
        // Don't redirect or log errors for /auth/me endpoint (used for checking auth status)
        const isAuthCheck = error.config?.url?.includes('/auth/me');
        
        if (isAuthCheck) {
          // This is expected when checking auth status - don't log or redirect
          return Promise.reject(error);
        }
        
        // Don't redirect if we're already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      } else if (error.response?.status === 403) {
        if (window.showError) {
          window.showError('Access denied. You do not have permission to perform this action.');
        }
      } else if (error.response?.status === 404) {
        if (window.showError) {
          window.showError('Resource not found. Please check your request.');
        }
      } else if (error.response?.status >= 500) {
        if (window.showError) {
          window.showError('Server error. Please try again later.');
        }
      } else if (error.code === 'ECONNABORTED') {
        if (window.showError) {
          window.showError('Request timeout. Please try again.');
        }
      } else if (!navigator.onLine) {
        if (window.showError) {
          window.showError('No internet connection. Please check your network.');
        }
      } else if (!isAuthCheck) {
        if (window.showError) {
          window.showError('An error occurred. Please try again.');
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Configure all API instances
configureApiInstance(authApi);
configureApiInstance(taskApi);
configureApiInstance(notificationApi);
configureApiInstance(userApi);
```

#### **Update Shell App Login**

```javascript
// frontend/shell-app/src/App.jsx

const handleLogin = async (email, password) => {
  try {
    // Login request - cookie is set automatically
    const response = await authApi.post('/login', {
      email,
      password
    });
    
    // No need to store token - cookie is handled by browser
    setIsAuthenticated(true);
    
    // Optionally store user data in Redux or state
    dispatch(setUser(response.data.user));
  } catch (error) {
    console.error('Login error:', error);
    setIsAuthenticated(false);
  }
};

const handleLogout = async () => {
  try {
    // Logout request - cookie is cleared automatically
    await authApi.post('/logout');
    
    setIsAuthenticated(false);
    dispatch(clearUser());
  } catch (error) {
    console.error('Logout error:', error);
  }
};
```

---

## ✅ **Benefits of HttpOnly Cookies**

### **1. Enhanced Security**
- ✅ **XSS Protection**: JavaScript cannot access HttpOnly cookies
- ✅ **Automatic Management**: Browser handles cookie lifecycle
- ✅ **CSRF Protection**: Can use `sameSite` attribute
- ✅ **Secure Transmission**: `secure` flag ensures HTTPS-only

### **2. Simplified Frontend Code**
- ✅ **No Token Storage**: No need for sessionStorage/localStorage
- ✅ **No Manual Headers**: No Authorization header management
- ✅ **No Token Interceptors**: Browser automatically sends cookies
- ✅ **Less Code**: Simpler authentication logic

### **3. Better for Module Federation**
- ✅ **No Shared State Needed**: No need to share token across MFEs
- ✅ **Automatic Sharing**: All MFEs automatically get cookies
- ✅ **No Synchronization Issues**: Browser handles everything
- ✅ **Works Across Origins**: With proper CORS configuration

---

## ⚠️ **Important Considerations**

### **1. CORS Configuration**

**CRITICAL**: You MUST configure CORS to allow credentials:

```javascript
// Backend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000'],
  credentials: true  // ⚠️ MUST be true
}));

// Frontend (Axios)
axios.defaults.withCredentials = true;
```

### **2. Same-Origin Requirements**

- **Same Domain**: All MFEs must be on the same domain (or subdomains)
- **Cookie Domain**: Set cookie domain to `.example.com` for subdomain sharing
- **Path**: Set cookie path to `/` for all routes

### **3. Development vs Production**

The implementation automatically adjusts cookie settings based on environment:

```javascript
// Automatically handles both development and production
const isProduction = process.env.NODE_ENV === 'production';
res.cookie('authToken', token, {
  httpOnly: true,
  secure: isProduction,  // false in dev, true in production
  sameSite: isProduction ? 'strict' : 'lax',  // 'lax' in dev, 'strict' in production
  maxAge: 24 * 60 * 60 * 1000,
  path: '/'
});
```

**Important**: When clearing cookies on logout, the options must **EXACTLY match** the options used when setting the cookie.

### **4. Checking Authentication Status**

Since you can't read the cookie in JavaScript, you need to make a request to verify endpoint. The implementation includes **request deduplication** to prevent multiple simultaneous calls:

```javascript
// Shared cache prevents duplicate /auth/me calls
let authCheckCache = {
  timestamp: 0,
  result: null,
  subscribers: new Set()
};
const CACHE_DURATION = 5000; // Cache for 5 seconds

// Multiple components can call checkAuth() simultaneously
// but only one API call will be made
const checkAuth = async () => {
  // If cached result is still valid, return it
  if (authCheckCache.result && (Date.now() - authCheckCache.timestamp) < CACHE_DURATION) {
    return authCheckCache.result;
  }
  
  // If request is in progress, wait for it
  if (authCheckPromise) {
    return authCheckPromise;
  }
  
  // Make API call and cache result
  // ...
};
```

**Benefits:**
- ✅ Prevents duplicate `/auth/me` calls when multiple components mount simultaneously
- ✅ Caches results for 5 seconds to reduce API calls
- ✅ Subscriber pattern notifies all components when auth state changes
- ✅ Works seamlessly across all microfrontends

---

## 🔄 **Migration Path**

### **Step 1: Update Backend**
1. Install `cookie-parser` in all backend services: `npm install cookie-parser`
2. Add `app.use(cookieParser());` middleware to all server files
3. Modify login endpoint to set HttpOnly cookie (environment-aware)
4. Update logout endpoint to clear cookie (with matching options)
5. Update auth middleware to read from cookie (with Authorization header fallback)
6. Configure CORS with `credentials: true`

### **Step 2: Update Frontend**
1. Remove token storage from `useAuth` hook
2. Remove token interceptors from API clients
3. Add `withCredentials: true` to all API instances (via `axios.defaults.withCredentials = true`)
4. Update login/logout handlers to use shared cache
5. Implement request deduplication for auth checks

### **Step 3: Optimizations**
1. Implement shared cache for `/auth/me` calls to prevent duplicates
2. Add subscriber pattern for auth state changes
3. Implement request deduplication for task/notification API calls
4. Remove unnecessary console.log statements
5. Optimize error handling (silent 401s for auth checks)

### **Step 4: Test**
1. Test login flow (cookie should be set automatically)
2. Test API requests (cookies should be sent automatically)
3. Test logout (cookie should be cleared)
4. Test across all microfrontends
5. Verify no duplicate API calls on route changes
6. Verify auth state syncs across all components

---

## 📊 **Comparison: sessionStorage vs HttpOnly Cookies**

| Feature | sessionStorage | HttpOnly Cookies |
|---------|---------------|------------------|
| **XSS Protection** | ❌ Vulnerable | ✅ Protected |
| **Automatic Sending** | ❌ Manual | ✅ Automatic |
| **Cross-Origin** | ⚠️ Limited | ✅ With CORS |
| **Code Complexity** | ⚠️ More code | ✅ Less code |
| **JavaScript Access** | ✅ Yes | ❌ No |
| **Browser Support** | ✅ All browsers | ✅ All browsers |
| **CSRF Protection** | ⚠️ Manual | ✅ Built-in |
| **Module Federation** | ✅ Works | ✅ Works |

---

## 🎯 **Conclusion**

**YES, Module Federation works excellently with HttpOnly cookies!**

In fact, HttpOnly cookies are often **preferred** for production applications because:
1. ✅ Better security (XSS protection)
2. ✅ Simpler code (no token management)
3. ✅ Automatic cookie handling
4. ✅ Works seamlessly with Module Federation
5. ✅ Request deduplication prevents duplicate API calls
6. ✅ Shared cache reduces unnecessary auth checks

## 📝 **Implementation Notes**

### **Key Optimizations Implemented:**
1. **Shared Auth Cache**: Prevents duplicate `/auth/me` calls across all microfrontends
2. **Subscriber Pattern**: All components are notified when auth state changes
3. **Request Deduplication**: Multiple simultaneous requests with same parameters are deduplicated
4. **Environment-Aware Cookies**: Automatically adjusts `secure` and `sameSite` based on `NODE_ENV`
5. **Silent Error Handling**: 401 errors for `/auth/me` are handled silently (expected when not logged in)
6. **Cookie Parser Middleware**: Required in all backend services to read cookies

### **Requirements:**
- ✅ CORS configuration with `credentials: true` on both backend and frontend
- ✅ `cookie-parser` middleware in all backend services
- ✅ `withCredentials: true` in all Axios instances
- ✅ Cookie options must match exactly when clearing cookies

The implementation is production-ready with optimizations for performance and user experience.

