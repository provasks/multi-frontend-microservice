# Rate Limiting Documentation - Task Management System

## 🛡️ Overview

The Task Management System implements intelligent rate limiting that adapts to different environments, providing robust protection against abuse while maintaining a smooth development experience.

## 🏗️ Architecture

### **Multi-Layer Rate Limiting**
```
┌─────────────────────────────────────────────────────────────┐
│                    Rate Limiting Layers                     │
├─────────────────────────────────────────────────────────────┤
│  API Gateway (Port 3000)                                   │
│  ├── General Rate Limiting                                 │
│  └── Localhost Detection & Skip Logic                     │
├─────────────────────────────────────────────────────────────┤
│  Backend Services (Ports 3001-3003)                       │
│  ├── Shared Security Middleware                           │
│  ├── Environment-based Configuration                      │
│  └── Service-specific Overrides                           │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Ports 4000-4004)                               │
│  ├── Request Throttling                                   │
│  └── Error Handling & Retry Logic                        │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Configuration

### **Environment-Based Settings**

#### **Development Environment**
```javascript
// API Gateway
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Very high limit for development
  skip: (req) => {
    // Skip rate limiting for localhost
    const ip = req.ip || req.connection.remoteAddress;
    return ip === '127.0.0.1' || ip === '::1' || 
           req.hostname === 'localhost';
  }
});

// Backend Services
enableRateLimit: process.env.NODE_ENV !== 'development'
```

#### **Production Environment**
```javascript
// API Gateway
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Strict limit for production
  skip: (req) => false // No skipping in production
});

// Backend Services
enableRateLimit: true
```

## 📊 Rate Limiting Details

### **API Gateway (Port 3000)**

#### **General Rate Limiting**
- **Window**: 15 minutes
- **Development Limit**: 10,000 requests
- **Production Limit**: 100 requests
- **Localhost Skip**: Enabled in development

#### **Implementation**
```javascript
// backend/api-gateway/server.js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 10000 : 100,
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => {
    if (process.env.NODE_ENV === 'development') {
      const ip = req.ip || req.connection.remoteAddress;
      return ip === '127.0.0.1' || ip === '::1' || 
             ip === '::ffff:127.0.0.1' || 
             req.hostname === 'localhost' || 
             req.hostname === '127.0.0.1';
    }
    return false;
  }
});
```

### **Backend Services (Ports 3001-3003)**

#### **Shared Security Middleware**
All backend services use the shared security middleware with environment-based configuration:

```javascript
// backend/shared/middleware/security.js
getRateLimitConfig() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return {
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 10000, // Very high limit
      skip: () => true // Skip all rate limiting
    };
  }
  
  return {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests
    skip: (req) => {
      if (req.path === '/health' || req.path === '/api-docs') {
        return true;
      }
      return false;
    }
  };
}
```

#### **Service Configuration**
```javascript
// Each service (user-service, task-service, notification-service)
const securityMiddleware = createSecurityMiddleware({
  enableHelmet: true,
  enableCORS: true,
  enableRateLimit: process.env.NODE_ENV !== 'development', // Disabled in dev
  corsOrigins: [...]
});
```

## 🚨 Error Handling

### **Rate Limit Exceeded Response**
```json
{
  "error": "Too many requests from this IP, please try again later.",
  "retryAfter": "15 minutes",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### **HTTP Headers**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1642248600
Retry-After: 900
```

### **Frontend Error Handling**
```javascript
// Automatic retry logic in frontend
const apiCall = async (url, options, retries = 3) => {
  try {
    const response = await fetch(url, options);
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      if (retries > 0) {
        await new Promise(resolve => 
          setTimeout(resolve, parseInt(retryAfter) * 1000)
        );
        return apiCall(url, options, retries - 1);
      }
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      return apiCall(url, options, retries - 1);
    }
    throw error;
  }
};
```

## 🔄 Clearing Rate Limits

### **Development Reset**
```bash
# Navigate to backend directory
cd backend

# Run the restart script
node restart-all-services.js

# Or manually restart services
npm run stop:all
npm start
```

### **Rate Limit Data Storage**
- **Memory-based**: Rate limit data is stored in memory
- **Service Restart**: Clears all rate limit data
- **Window Expiry**: Automatic cleanup after window period

## 🛠️ Troubleshooting

### **Common Issues**

#### **1. "Too Many Requests" in Development**
**Cause**: Rate limiting not properly disabled for localhost
**Solution**:
```bash
# Check NODE_ENV
echo $NODE_ENV

# Restart services
cd backend
node restart-all-services.js
```

#### **2. Rate Limits Not Clearing**
**Cause**: Rate limit data stored in memory
**Solution**:
```bash
# Restart all backend services
npm run stop:all
npm start
```

#### **3. Inconsistent Rate Limiting**
**Cause**: Mixed environment configurations
**Solution**:
```bash
# Verify environment variables
cat .env | grep NODE_ENV

# Ensure consistent configuration
grep -r "enableRateLimit" backend/services/
```

### **Debug Commands**
```bash
# Check rate limit status
curl -I http://localhost:3000/health

# Test rate limiting
for i in {1..10}; do curl http://localhost:3000/health; done

# Check service configurations
grep -r "rateLimit" backend/
```

## 📈 Monitoring

### **Rate Limit Metrics**
- **Requests per Window**: Track usage patterns
- **Rate Limit Hits**: Monitor abuse attempts
- **IP-based Analysis**: Identify problematic sources
- **Service-specific Metrics**: Per-service rate limiting stats

### **Logging**
```javascript
// Rate limit events are logged
console.log('Rate limit exceeded:', {
  ip: req.ip,
  endpoint: req.path,
  timestamp: new Date().toISOString(),
  retryAfter: '15 minutes'
});
```

## 🔒 Security Considerations

### **DoS Protection**
- **Request Flooding**: Prevents overwhelming the server
- **Resource Exhaustion**: Protects against memory/CPU abuse
- **API Abuse**: Limits automated scraping attempts

### **Brute Force Protection**
- **Login Attempts**: Separate rate limiting for auth endpoints
- **Password Reset**: Limits password reset requests
- **Account Creation**: Prevents spam account creation

### **IP-based Limiting**
- **Geographic Considerations**: Different limits for different regions
- **Proxy Detection**: Handle requests through proxies
- **VPN Detection**: Identify and handle VPN traffic

## 🎯 Best Practices

### **Development**
- **Localhost Exemption**: Always skip rate limiting for localhost
- **High Limits**: Use generous limits for development
- **Easy Reset**: Provide simple reset mechanisms

### **Production**
- **Conservative Limits**: Start with strict limits
- **Monitor Usage**: Track rate limit effectiveness
- **Gradual Adjustment**: Adjust limits based on usage patterns

### **Testing**
- **Rate Limit Testing**: Include rate limit tests in test suite
- **Load Testing**: Test system under rate limit conditions
- **Error Handling**: Verify proper error responses

## 🚀 Future Enhancements

### **Planned Features**
- **Redis Integration**: Persistent rate limit storage
- **Dynamic Limits**: Adjust limits based on server load
- **User-based Limiting**: Different limits for different user types
- **Geographic Limiting**: Region-specific rate limits
- **API Key Limiting**: Per-API-key rate limits

### **Advanced Features**
- **Sliding Window**: More sophisticated time windows
- **Burst Allowance**: Allow short bursts of requests
- **Adaptive Limiting**: Machine learning-based limits
- **Real-time Monitoring**: Live rate limit dashboard
