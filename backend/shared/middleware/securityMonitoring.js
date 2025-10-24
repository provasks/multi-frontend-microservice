const { createSecurityLogger } = require('../utils/securityLogger');
const { SanitizationUtils } = require('../utils/sanitization');

/**
 * Security Monitoring Middleware
 * Comprehensive security event monitoring and logging
 */
class SecurityMonitoring {
  constructor(options = {}) {
    this.options = {
      enableRequestLogging: options.enableRequestLogging !== false,
      enableResponseLogging: options.enableResponseLogging !== false,
      enableErrorLogging: options.enableErrorLogging !== false,
      enablePerformanceLogging: options.enablePerformanceLogging !== false,
      logSensitiveData: options.logSensitiveData || false,
      ...options
    };

    this.logger = createSecurityLogger({
      logDir: options.logDir || './logs',
      enableFileLogging: options.enableFileLogging !== false,
      enableConsoleLogging: options.enableConsoleLogging !== false
    });
  }

  /**
   * Extract request information
   */
  extractRequestInfo(req) {
    return {
      method: req.method,
      url: req.url,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      referer: req.get('Referer'),
      origin: req.get('Origin'),
      contentType: req.get('Content-Type'),
      contentLength: req.get('Content-Length'),
      authorization: req.get('Authorization') ? 'Bearer ***' : null,
      userId: req.user?.userId || null,
      role: req.user?.role || null,
      timestamp: new Date().toISOString(),
      requestId: req.requestId || null
    };
  }

  /**
   * Extract response information
   */
  extractResponseInfo(req, res, responseTime) {
    return {
      statusCode: res.statusCode,
      responseTime: responseTime,
      contentLength: res.get('Content-Length'),
      contentType: res.get('Content-Type'),
      userId: req.user?.userId || null,
      role: req.user?.role || null,
      timestamp: new Date().toISOString(),
      requestId: req.requestId || null
    };
  }

  /**
   * Detect suspicious activity
   */
  detectSuspiciousActivity(req, res) {
    const suspiciousPatterns = [];

    // Check for XSS attempts
    const xssPatterns = [
      /<script[^>]*>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /expression\s*\(/i
    ];

    const requestBody = JSON.stringify(req.body || {});
    const requestQuery = JSON.stringify(req.query || {});
    const requestParams = JSON.stringify(req.params || {});
    const requestString = requestBody + requestQuery + requestParams;

    xssPatterns.forEach(pattern => {
      if (pattern.test(requestString)) {
        suspiciousPatterns.push('xss_attempt');
      }
    });

    // Check for SQL injection attempts
    const sqlPatterns = [
      /union\s+select/i,
      /drop\s+table/i,
      /delete\s+from/i,
      /insert\s+into/i,
      /update\s+set/i,
      /or\s+1\s*=\s*1/i,
      /and\s+1\s*=\s*1/i
    ];

    sqlPatterns.forEach(pattern => {
      if (pattern.test(requestString)) {
        suspiciousPatterns.push('sql_injection');
      }
    });

    // Check for NoSQL injection attempts
    const nosqlPatterns = [
      /\$where/i,
      /\$ne\s*:\s*null/i,
      /\$regex/i,
      /\$exists\s*:\s*true/i,
      /\$or\s*:\s*\[/i
    ];

    nosqlPatterns.forEach(pattern => {
      if (pattern.test(requestString)) {
        suspiciousPatterns.push('nosql_injection');
      }
    });

    // Check for file upload attacks
    if (req.file || req.files) {
      const files = req.files || [req.file];
      files.forEach(file => {
        if (file.originalname) {
          const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js'];
          const hasDangerousExtension = dangerousExtensions.some(ext => 
            file.originalname.toLowerCase().endsWith(ext)
          );
          
          if (hasDangerousExtension) {
            suspiciousPatterns.push('file_upload_attack');
          }
        }
      });
    }

    // Check for suspicious user agents
    const userAgent = req.get('User-Agent') || '';
    const suspiciousUserAgents = [
      /sqlmap/i,
      /nikto/i,
      /nmap/i,
      /masscan/i,
      /zap/i,
      /burp/i,
      /w3af/i
    ];

    suspiciousUserAgents.forEach(pattern => {
      if (pattern.test(userAgent)) {
        suspiciousPatterns.push('suspicious_user_agent');
      }
    });

    return suspiciousPatterns;
  }

  /**
   * Request logging middleware
   */
  requestLogger() {
    return (req, res, next) => {
      if (!this.options.enableRequestLogging) {
        return next();
      }

      const startTime = Date.now();
      req.startTime = startTime;

      // Generate request ID
      req.requestId = req.requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Extract request info
      const requestInfo = this.extractRequestInfo(req);

      // Log API request
      this.logger.logAPI('api_request', {
        ...requestInfo,
        service: this.options.serviceName || 'unknown'
      });

      // Detect suspicious activity
      const suspiciousPatterns = this.detectSuspiciousActivity(req, res);
      if (suspiciousPatterns.length > 0) {
        suspiciousPatterns.forEach(pattern => {
          this.logger.logViolation(pattern, {
            ...requestInfo,
            service: this.options.serviceName || 'unknown',
            details: {
              pattern,
              requestBody: this.options.logSensitiveData ? req.body : '***',
              requestQuery: req.query,
              requestParams: req.params
            }
          });
        });
      }

      next();
    };
  }

  /**
   * Response logging middleware
   */
  responseLogger() {
    return (req, res, next) => {
      if (!this.options.enableResponseLogging) {
        return next();
      }

      const originalSend = res.send;
      const originalJson = res.json;

      // Override res.send
      res.send = function(data) {
        const responseTime = Date.now() - (req.startTime || Date.now());
        const responseInfo = this.extractResponseInfo(req, res, responseTime);

        // Log API response
        this.logger.logAPI('api_response', {
          ...responseInfo,
          service: this.options.serviceName || 'unknown'
        });

        // Log performance if response time is high
        if (responseTime > 5000) { // 5 seconds
          this.logger.logPerformance('slow_response', {
            ...responseInfo,
            service: this.options.serviceName || 'unknown',
            threshold: 5000
          });
        }

        return originalSend.call(this, data);
      }.bind(this);

      // Override res.json
      res.json = function(data) {
        const responseTime = Date.now() - (req.startTime || Date.now());
        const responseInfo = this.extractResponseInfo(req, res, responseTime);

        // Log API response
        this.logger.logAPI('api_response', {
          ...responseInfo,
          service: this.options.serviceName || 'unknown'
        });

        return originalJson.call(this, data);
      }.bind(this);

      next();
    };
  }

  /**
   * Error logging middleware
   */
  errorLogger() {
    return (err, req, res, next) => {
      if (!this.options.enableErrorLogging) {
        return next(err);
      }

      const requestInfo = this.extractRequestInfo(req);
      const errorInfo = {
        ...requestInfo,
        error: {
          message: err.message,
          stack: err.stack,
          name: err.name,
          statusCode: err.statusCode || 500
        },
        service: this.options.serviceName || 'unknown'
      };

      // Log API error
      this.logger.logAPI('api_error', errorInfo);

      // Log system error
      this.logger.logSystem('service_error', errorInfo);

      next(err);
    };
  }

  /**
   * Authentication monitoring middleware
   */
  authMonitor() {
    return (req, res, next) => {
      // Monitor authentication attempts
      if (req.path.includes('/login') || req.path.includes('/auth')) {
        const requestInfo = this.extractRequestInfo(req);
        
        // Log authentication attempt
        this.logger.logAuth('login_attempt', {
          ...requestInfo,
          service: this.options.serviceName || 'unknown',
          endpoint: req.path,
          method: req.method
        });
      }

      // Monitor authorization
      if (req.user) {
        const requestInfo = this.extractRequestInfo(req);
        
        // Log data access
        this.logger.logDataAccess('data_read', {
          ...requestInfo,
          service: this.options.serviceName || 'unknown',
          resource: req.path,
          method: req.method
        });
      }

      next();
    };
  }

  /**
   * Rate limiting monitor
   */
  rateLimitMonitor() {
    return (req, res, next) => {
      // Check if rate limited
      if (res.get('X-RateLimit-Remaining') === '0') {
        const requestInfo = this.extractRequestInfo(req);
        
        this.logger.logViolation('rate_limit_exceeded', {
          ...requestInfo,
          service: this.options.serviceName || 'unknown',
          rateLimitInfo: {
            limit: res.get('X-RateLimit-Limit'),
            remaining: res.get('X-RateLimit-Remaining'),
            reset: res.get('X-RateLimit-Reset')
          }
        });
      }

      next();
    };
  }

  /**
   * Complete security monitoring setup
   */
  setupSecurityMonitoring(app, serviceName) {
    this.options.serviceName = serviceName;

    // Apply all monitoring middleware
    app.use(this.requestLogger());
    app.use(this.responseLogger());
    app.use(this.errorLogger());
    app.use(this.authMonitor());
    app.use(this.rateLimitMonitor());

    // Clean old logs daily
    setInterval(() => {
      this.logger.cleanOldLogs();
    }, 24 * 60 * 60 * 1000); // 24 hours

    return app;
  }
}

/**
 * Factory function to create security monitoring
 */
const createSecurityMonitoring = (options = {}) => {
  return new SecurityMonitoring(options);
};

module.exports = {
  SecurityMonitoring,
  createSecurityMonitoring
};
