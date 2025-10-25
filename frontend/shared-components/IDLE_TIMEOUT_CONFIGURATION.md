# Idle Timeout Configuration Guide

## 🎯 **Current Configuration**

The idle timeout is now configured to use **2 minutes** by default, but the actual timeout depends on the detected environment.

## 🔧 **Environment Detection**

The system automatically detects the environment and applies the appropriate timeout:

### **Development Environment (localhost)**
- **Timeout**: 2 minutes
- **Warning**: 30 seconds before timeout
- **Detection**: Running on `localhost` or `127.0.0.1`

### **Production Environment**
- **Timeout**: 15 minutes
- **Warning**: 2 minutes before timeout
- **Detection**: Not running on localhost

### **Testing Environment (Manual Override)**
- **Timeout**: 30 seconds
- **Warning**: 10 seconds before timeout
- **Activation**: Set `window.IDLE_TIMEOUT_TESTING = 'true'` in browser console

## 🛠️ **How to Change Timeout Values**

### **1. For Development (Current Setup)**
Edit `frontend/shared-components/src/config/frontendConfig.js`:
```javascript
DEVELOPMENT: {
  TIMEOUT: 2 * 60 * 1000, // 2 minutes
  WARNING_TIME: 30 * 1000 // 30 seconds
},
```

### **2. For Production**
Edit the same file:
```javascript
PRODUCTION: {
  TIMEOUT: 15 * 60 * 1000, // 15 minutes
  WARNING_TIME: 2 * 60 * 1000 // 2 minutes
},
```

### **3. For Testing (Quick Test)**
In browser console, run:
```javascript
window.IDLE_TIMEOUT_TESTING = 'true';
// Refresh the page to apply
```

## 🔍 **Debugging Current Values**

### **Check Current Environment**
Open browser console and run:
```javascript
// Check what environment is detected
console.log('Environment:', window.location.hostname);

// Check current timeout values
// Look for: "🔍 Idle timeout environment detected: development"
```

### **Check Current Timeout**
The console will show:
```
🔄 IdleTimeout init: {timeout: 120, warningTime: 30}
```
- `timeout: 120` = 120 seconds = 2 minutes
- `warningTime: 30` = 30 seconds warning

## 📊 **Configuration Hierarchy**

```
1. Default Values (frontendConfig.js)
   ├── DEFAULT_TIMEOUT: 2 minutes
   └── DEFAULT_WARNING_TIME: 30 seconds

2. Environment Overrides
   ├── DEVELOPMENT: 2 minutes / 30 seconds
   ├── PRODUCTION: 15 minutes / 2 minutes
   └── TESTING: 30 seconds / 10 seconds

3. Runtime Detection
   ├── localhost → DEVELOPMENT
   ├── other domains → PRODUCTION
   └── window.IDLE_TIMEOUT_TESTING → TESTING
```

## 🎛️ **Quick Configuration Changes**

### **Make Development Use 5 Minutes**
```javascript
// In frontendConfig.js, line 356
DEVELOPMENT: {
  TIMEOUT: 5 * 60 * 1000, // 5 minutes
  WARNING_TIME: 30 * 1000 // 30 seconds
},
```

### **Make Development Use 30 Seconds (Testing)**
```javascript
// In frontendConfig.js, line 356
DEVELOPMENT: {
  TIMEOUT: 30 * 1000, // 30 seconds
  WARNING_TIME: 10 * 1000 // 10 seconds
},
```

## 🚀 **After Making Changes**

1. **Restart shared-components service**:
   ```bash
   cd frontend/shared-components
   npm start
   ```

2. **Restart shell app**:
   ```bash
   cd frontend/shell-app
   npm start
   ```

3. **Check console logs** for the new timeout values

## ✅ **Current Status**

- **Default**: 2 minutes (120 seconds)
- **Development**: 2 minutes (120 seconds)
- **Production**: 15 minutes (900 seconds)
- **Testing**: 30 seconds (when enabled)

The idle timeout should now use **2 minutes** instead of 30 seconds! 🎉
