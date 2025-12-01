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
    
    // Set HttpOnly cookie instead of returning token in body
    res.cookie('authToken', token, {
      httpOnly: true,        // Prevents JavaScript access
      secure: true,          // Only sent over HTTPS
      sameSite: 'strict',    // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'              // Available to all routes
    });
    
    // Return user data (no token in response)
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
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
    // Clear the HttpOnly cookie
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/'
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
      // Try to get token from cookie first, then from Authorization header
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

import { useState, useCallback } from 'react';
import axios from 'axios';

export const useAuth = () => {
  // No token state needed - cookie is handled by browser
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(async (email, password) => {
    try {
      // Make login request - cookie is set automatically by backend
      const response = await axios.post('/api/auth/login', {
        email,
        password
      }, {
        withCredentials: true  // ⚠️ CRITICAL: Send cookies
      });
      
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Make logout request - cookie is cleared by backend
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true  // ⚠️ CRITICAL: Send cookies
      });
      
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  // Check authentication status by making a request to verify endpoint
  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get('/api/auth/me', {
        withCredentials: true  // ⚠️ CRITICAL: Send cookies
      });
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  return {
    isAuthenticated,
    login,
    logout,
    checkAuth
  };
};
```

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
      // Log successful requests in development
      if (process.env.NODE_ENV === 'development') {
        const duration = new Date() - response.config.metadata.startTime;
        console.log(`API request completed: ${response.config.url} (${duration}ms)`);
      }
      
      return response;
    },
    (error) => {
      // Handle 401 errors
      if (error.response?.status === 401) {
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      // ... other error handling
      
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

```javascript
// Development
res.cookie('authToken', token, {
  httpOnly: true,
  secure: false,  // Allow HTTP in development
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000
});

// Production
res.cookie('authToken', token, {
  httpOnly: true,
  secure: true,   // HTTPS only
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000
});
```

### **4. Checking Authentication Status**

Since you can't read the cookie in JavaScript, you need to:

```javascript
// Option 1: Make a request to verify endpoint
const checkAuth = async () => {
  try {
    const response = await axios.get('/api/auth/me', {
      withCredentials: true
    });
    return response.data.user;
  } catch (error) {
    return null;
  }
};

// Option 2: Store authentication state in Redux/Context
// (but not the token itself)
```

---

## 🔄 **Migration Path**

### **Step 1: Update Backend**
1. Modify login endpoint to set HttpOnly cookie
2. Update auth middleware to read from cookie
3. Configure CORS with `credentials: true`

### **Step 2: Update Frontend**
1. Remove token storage from `useAuth` hook
2. Remove token interceptors from API clients
3. Add `withCredentials: true` to all API instances
4. Update login/logout handlers

### **Step 3: Test**
1. Test login flow
2. Test API requests (cookies should be sent automatically)
3. Test logout (cookie should be cleared)
4. Test across all microfrontends

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

The main requirement is ensuring proper CORS configuration with `credentials: true` on both backend and frontend.

