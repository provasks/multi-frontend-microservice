# Error Logging Locations & Configuration

## 📍 **Where Errors Are Logged**

### **1. File Logging Locations**

#### **Error Logs**
- **Directory**: `./logs/`
- **File Format**: `error-YYYY-MM-DD.log`
- **Example**: `error-2024-01-15.log`
- **Content**: All application errors with full context

#### **Security Logs**
- **Directory**: `./logs/`
- **File Format**: `security-YYYY-MM-DD.log`
- **Example**: `security-2024-01-15.log`
- **Content**: Security-related events and violations

#### **Log File Structure**
```
logs/
├── error-2024-01-15.log
├── error-2024-01-14.log
├── security-2024-01-15.log
├── security-2024-01-14.log
└── ...
```

### **2. Console Logging**

#### **Real-time Console Output**
- **Format**: Structured JSON with timestamps
- **Level**: Error, Warn, Info
- **Context**: Complete request context
- **Example**:
```json
[2024-01-15T10:30:45.123Z] [ERROR] [user-service] [192.168.1.100] [user123] Authentication failed
```

### **3. Log Entry Format**

#### **Error Log Entry Structure**
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "error",
  "error": {
    "name": "AuthenticationError",
    "message": "Invalid credentials",
    "stack": "Error: Invalid credentials\n    at ...",
    "code": "AUTH_FAILED",
    "statusCode": 401
  },
  "context": {
    "service": "user-service",
    "ip": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "userId": "user123",
    "requestId": "req_123456789",
    "method": "POST",
    "url": "/api/auth/login"
  }
}
```

### **4. Error Classification & Logging**

#### **Authentication Errors**
- **File**: `error-YYYY-MM-DD.log`
- **Level**: `error`
- **Security Log**: `security-YYYY-MM-DD.log`
- **Examples**:
  - Invalid credentials
  - Token expired
  - Authentication failed

#### **Authorization Errors**
- **File**: `error-YYYY-MM-DD.log`
- **Level**: `error`
- **Security Log**: `security-YYYY-MM-DD.log`
- **Examples**:
  - Access denied
  - Insufficient permissions
  - Role-based access violations

#### **Validation Errors**
- **File**: `error-YYYY-MM-DD.log`
- **Level**: `warn`
- **Examples**:
  - Input validation failed
  - Invalid data format
  - Missing required fields

#### **Rate Limit Errors**
- **File**: `error-YYYY-MM-DD.log`
- **Level**: `warn`
- **Security Log**: `security-YYYY-MM-DD.log`
- **Examples**:
  - Rate limit exceeded
  - Too many requests
  - Brute force attempts

#### **Security Violations**
- **File**: `error-YYYY-MM-DD.log`
- **Level**: `error`
- **Security Log**: `security-YYYY-MM-DD.log`
- **Examples**:
  - XSS attempts
  - SQL injection attempts
  - NoSQL injection attempts
  - File upload attacks

#### **Database Errors**
- **File**: `error-YYYY-MM-DD.log`
- **Level**: `error`
- **Examples**:
  - Connection failures
  - Query errors
  - Transaction failures

#### **External Service Errors**
- **File**: `error-YYYY-MM-DD.log`
- **Level**: `error`
- **Examples**:
  - API call failures
  - Service unavailable
  - Timeout errors

#### **System Errors**
- **File**: `error-YYYY-MM-DD.log`
- **Level**: `error`
- **Examples**:
  - Unhandled exceptions
  - Memory issues
  - Performance problems

### **5. Log Configuration**

#### **Default Configuration**
```javascript
{
  logDir: './logs',
  enableFileLogging: true,
  enableConsoleLogging: true,
  enableSecurityLogging: true,
  maxLogSize: 10485760, // 10MB
  maxFiles: 5,
  logLevel: 'error'
}
```

#### **Environment-Specific Configuration**

##### **Development**
```javascript
{
  logDir: './logs',
  enableFileLogging: true,
  enableConsoleLogging: true,
  enableSecurityLogging: true,
  logLevel: 'debug'
}
```

##### **Production**
```javascript
{
  logDir: '/var/log/tms',
  enableFileLogging: true,
  enableConsoleLogging: false,
  enableSecurityLogging: true,
  logLevel: 'error'
}
```

##### **Testing**
```javascript
{
  logDir: './test-logs',
  enableFileLogging: false,
  enableConsoleLogging: false,
  enableSecurityLogging: false,
  logLevel: 'error'
}
```

### **6. Log Rotation & Cleanup**

#### **Automatic Log Rotation**
- **Max File Size**: 10MB per file
- **Max Files**: 5 files per type
- **Cleanup**: Daily automatic cleanup
- **Retention**: 30 days (configurable)

#### **Manual Log Cleanup**
```bash
# Clean old error logs
POST /api/logs/clean

# Clean old security logs
POST /api/security/clean-logs
```

### **7. Log Monitoring & Analytics**

#### **Error Statistics**
- **Endpoint**: `GET /api/errors/statistics`
- **Response**: Error counts, trends, and analytics
- **Period**: Configurable (default: 7 days)

#### **Recent Errors**
- **Endpoint**: `GET /api/errors/recent`
- **Response**: Recent error logs
- **Limit**: Configurable (default: 50)

#### **Error Trends**
- **Endpoint**: `GET /api/errors/trends`
- **Response**: Error trend analysis
- **Period**: Configurable (default: 30 days)

### **8. Security Logging Integration**

#### **Security Event Logging**
- **Authentication Events**: Login attempts, failures, successes
- **Authorization Events**: Access grants, denials, role changes
- **Security Violations**: XSS attempts, injection attacks, rate limiting
- **System Events**: Service starts, stops, errors, configuration changes

#### **Security Log Format**
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "info",
  "message": "User login successful",
  "service": "user-service",
  "userId": "user123",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "event": "authentication",
  "subEvent": "login_success"
}
```

### **9. Log Access & Permissions**

#### **File Permissions**
- **Error Logs**: Readable by application and monitoring systems
- **Security Logs**: Restricted access, audit trail required
- **Backup Logs**: Compressed and archived

#### **Log Retrieval**
- **API Endpoints**: RESTful API for log access
- **Authentication**: Required for sensitive logs
- **Rate Limiting**: Applied to log access endpoints

### **10. Troubleshooting Log Issues**

#### **Common Issues**
1. **Log Directory Not Found**: Check permissions and create directory
2. **Log Files Not Created**: Verify file logging is enabled
3. **Log Rotation Issues**: Check disk space and file permissions
4. **Performance Impact**: Monitor log file sizes and rotation frequency

#### **Debug Commands**
```bash
# Check log directory
ls -la ./logs/

# View recent errors
tail -f ./logs/error-$(date +%Y-%m-%d).log

# Check log file sizes
du -h ./logs/*.log

# Monitor security logs
tail -f ./logs/security-$(date +%Y-%m-%d).log
```

---

**Last Updated**: January 2024  
**Version**: 1.0.0
