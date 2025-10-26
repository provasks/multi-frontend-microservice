# 🔧 Technical Deep Dive - Task Management System

## 🎯 Quick Technical Overview

### **Core Technologies**
- **Frontend**: React 18, Redux Toolkit, Webpack Module Federation, Chart.js
- **Backend**: Node.js, Express, MongoDB, JWT Authentication
- **DevOps**: Docker, Environment-based Configuration
- **Security**: Multi-layer security with Helmet.js, rate limiting, input sanitization

### **Key Code Examples**

#### **1. Module Federation Setup**
```javascript
// webpack.config.js
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        userApp: 'userApp@http://localhost:4001/remoteEntry.js',
        taskApp: 'taskApp@http://localhost:4002/remoteEntry.js',
        notificationApp: 'notificationApp@http://localhost:4003/remoteEntry.js',
        sharedComponents: 'sharedComponents@http://localhost:4004/remoteEntry.js'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'react-redux': { singleton: true }
      }
    })
  ]
};
```

#### **2. Redux Store Configuration**
```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import tasksSlice from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: tasksSlice,
    notifications: notificationsSlice,
    ui: uiSlice,
    idleTimeout: idleTimeoutSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});
```

#### **3. API Gateway Implementation**
```javascript
// api-gateway/server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 10000 : 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

// Proxy routes
app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true
}));

app.use('/api/tasks', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true
}));
```

#### **4. Security Middleware**
```javascript
// shared/middleware/security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss');
const validator = require('validator');

const createSecurityMiddleware = (options = {}) => {
  return {
    setupHelmet: (app) => {
      app.use(helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"]
          }
        }
      }));
    },
    
    setupRateLimit: (app) => {
      if (options.enableRateLimit) {
        const limiter = rateLimit({
          windowMs: 15 * 60 * 1000,
          max: 100,
          message: 'Too many requests from this IP'
        });
        app.use(limiter);
      }
    },
    
    sanitizeInput: (req, res, next) => {
      if (req.body) {
        req.body = sanitizeObject(req.body);
      }
      next();
    }
  };
};
```

#### **5. Idle Timeout Implementation**
```javascript
// utils/idleTimeout.js
class IdleTimeout {
  constructor(options = {}) {
    this.timeout = options.timeout || 15 * 60 * 1000; // 15 minutes
    this.warningTime = options.warningTime || 2 * 60 * 1000; // 2 minutes
    this.isActive = false;
    this.isWarning = false;
    this.timer = null;
    this.warningTimer = null;
    this.onWarning = options.onWarning || (() => {});
    this.onTimeout = options.onTimeout || (() => {});
    this.onReset = options.onReset || (() => {});
  }

  init() {
    this.bindEvents();
    this.reset();
  }

  bindEvents() {
    const events = [
      'mousedown', 'mousemove', 'mouseup', 'click',
      'keydown', 'keyup', 'keypress',
      'touchstart', 'touchend', 'touchmove',
      'pointerdown', 'pointerup', 'pointermove',
      'scroll', 'wheel', 'focus', 'blur'
    ];

    events.forEach(event => {
      document.addEventListener(event, this.handleActivity.bind(this), true);
    });
  }

  handleActivity() {
    if (this.isActive && !this.isWarning) {
      this.onReset();
      this.reset();
    }
  }

  reset() {
    this.clearTimers();
    this.isActive = true;
    this.isWarning = false;
    
    this.warningTimer = setTimeout(() => {
      this.isWarning = true;
      this.onWarning();
    }, this.timeout - this.warningTime);
    
    this.timer = setTimeout(() => {
      this.isActive = false;
      this.onTimeout();
    }, this.timeout);
  }
}
```

### **Key Technical Decisions**

1. **Module Federation**: Chosen for runtime integration and independent deployment
2. **Redux Toolkit**: Reduces boilerplate and provides better developer experience
3. **API Gateway**: Centralizes cross-cutting concerns and provides single entry point
4. **MongoDB**: Document-based storage suitable for flexible task data
5. **JWT Authentication**: Stateless authentication suitable for microservices
6. **Docker**: Containerization for consistent deployment across environments

### **Performance Optimizations**

1. **Database Indexing**: Optimized queries with proper indexes
2. **Connection Pooling**: Efficient database connections
3. **Caching**: Redis for frequently accessed data
4. **Code Splitting**: Lazy loading of microfrontends
5. **Memoization**: Reselect selectors for Redux performance

### **Security Measures**

1. **Input Validation**: Joi schemas for request validation
2. **XSS Protection**: Input sanitization with xss library
3. **Rate Limiting**: Environment-aware request limiting
4. **CORS**: Proper cross-origin resource sharing
5. **Security Headers**: Helmet.js for security headers

This technical deep dive covers the core implementation details and architectural decisions made in the Task Management System.
