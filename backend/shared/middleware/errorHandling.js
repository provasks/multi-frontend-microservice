const { ErrorHandler } = require('../utils/errorHandler');
const { createErrorLogger } = require('../utils/errorLogger');
const { createSecurityLogger } = require('../utils/securityLogger');

/**
 * Enhanced Error Handling Middleware
 * Comprehensive error handling with security integration
 */
class ErrorHandlingMiddleware {
  constructor(options = {}) {
    this.options = {
      enableErrorLogging: options.enableErrorLogging !== false,
      enableSecurityLogging: options.enableSecurityLogging !== false,
      enableErrorTracking: options.enableErrorTracking !== false,
      logDir: options.logDir || './logs',
      serviceName: options.serviceName || 'unknown',
      ...options
    };

    this.errorLogger = createErrorLogger({
      logDir: this.options.logDir,
      enableFileLogging: this.options.enableErrorLogging,
      enableConsoleLogging: this.options.enableErrorLogging
    });

    this.securityLogger = createSecurityLogger({
      logDir: this.options.logDir,
      enableFileLogging: this.options.enableSecurityLogging,
      enableConsoleLogging: this.options.enableSecurityLogging
    });
  }

  /**
   * Enhanced error handling middleware
   */
  errorHandler() {
    return (error, req, res, next) => {
      // Add request context to error
      error.requestContext = {
        method: req.method,
        url: req.url,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        userId: req.user?.userId || null,
        timestamp: new Date().toISOString(),
        service: this.options.serviceName
      };

      // Log error based on type
      this.logErrorByType(error, req);

      // Handle error with enhanced error handler
      return ErrorHandler.handle(error, req, res, next);
    };
  }

  /**
   * Log error based on type
   */
  logErrorByType(error, req) {
    const context = {
      service: this.options.serviceName,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      userId: req.user?.userId || null,
      method: req.method,
      url: req.url
    };

    switch (error.name) {
      case 'AuthenticationError':
        this.errorLogger.logAuthenticationError(error, context);
        this.securityLogger.logAuth('login_failed', context);
        break;

      case 'AuthorizationError':
        this.errorLogger.logAuthorizationError(error, context);
        this.securityLogger.logAuthz('access_denied', context);
        break;

      case 'ValidationError':
      case 'InputValidationError':
        this.errorLogger.logValidationError(error, context);
        break;

      case 'RateLimitError':
        this.errorLogger.logRateLimitError(error, context);
        this.securityLogger.logViolation('rate_limit_exceeded', context);
        break;

      case 'SecurityViolationError':
        this.errorLogger.logSecurityError(error, context);
        this.securityLogger.logViolation('security_violation', context);
        break;

      case 'MongoServerError':
      case 'MongoError':
        this.errorLogger.logDatabaseError(error, context);
        break;

      case 'AxiosError':
        this.errorLogger.logExternalServiceError(error, context);
        break;

      case 'FileUploadError':
        this.errorLogger.logFileUploadError(error, context);
        break;

      default:
        this.errorLogger.logSystemError(error, context);
        break;
    }
  }

  /**
   * Async error wrapper with enhanced logging
   */
  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch((error) => {
        // Add request context to error
        error.requestContext = {
          method: req.method,
          url: req.url,
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent'),
          userId: req.user?.userId || null,
          timestamp: new Date().toISOString(),
          service: this.options.serviceName
        };

        // Log the error
        this.logErrorByType(error, req);

        next(error);
      });
    };
  }

  /**
   * 404 handler with logging
   */
  notFoundHandler() {
    return (req, res, next) => {
      const error = new Error(`Route ${req.originalUrl} not found`);
      error.name = 'NotFoundError';
      error.statusCode = 404;
      error.requestContext = {
        method: req.method,
        url: req.url,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        userId: req.user?.userId || null,
        timestamp: new Date().toISOString(),
        service: this.options.serviceName
      };

      // Log 404 errors
      this.errorLogger.logError('warn', error, error.requestContext);

      return ErrorHandler.notFound(req, res, next);
    };
  }

  /**
   * Request error tracking middleware
   */
  requestErrorTracking() {
    return (req, res, next) => {
      const startTime = Date.now();
      
      // Track response time and errors
      const originalSend = res.send;
      const originalJson = res.json;

      res.send = function(data) {
        const responseTime = Date.now() - startTime;
        
        // Log slow responses
        if (responseTime > 5000) {
          const slowResponseError = new Error('Slow response detected');
          slowResponseError.name = 'SlowResponseError';
          slowResponseError.responseTime = responseTime;
          
          this.errorLogger.logSystemError(slowResponseError, {
            service: this.options.serviceName,
            ip: req.ip || req.connection.remoteAddress,
            method: req.method,
            url: req.url,
            responseTime
          });
        }

        return originalSend.call(this, data);
      }.bind(this);

      res.json = function(data) {
        const responseTime = Date.now() - startTime;
        
        // Log slow responses
        if (responseTime > 5000) {
          const slowResponseError = new Error('Slow response detected');
          slowResponseError.name = 'SlowResponseError';
          slowResponseError.responseTime = responseTime;
          
          this.errorLogger.logSystemError(slowResponseError, {
            service: this.options.serviceName,
            ip: req.ip || req.connection.remoteAddress,
            method: req.method,
            url: req.url,
            responseTime
          });
        }

        return originalJson.call(this, data);
      }.bind(this);

      next();
    };
  }

  /**
   * Setup comprehensive error handling
   */
  setupErrorHandling(app) {
    // Request error tracking
    app.use(this.requestErrorTracking());

    // Global error handler
    app.use(this.errorHandler());

    // 404 handler
    app.use(this.notFoundHandler());

    // Handle unhandled rejections and exceptions
    ErrorHandler.handleUnhandledRejection();
    ErrorHandler.handleUncaughtException();

    // Clean old logs daily
    setInterval(() => {
      this.errorLogger.cleanOldLogs();
    }, 24 * 60 * 60 * 1000); // 24 hours

    return app;
  }

  /**
   * Get error statistics
   */
  getErrorStatistics(days = 7) {
    return this.errorLogger.getErrorStatistics(days);
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit = 50) {
    return this.errorLogger.getRecentErrors(limit);
  }
}

/**
 * Factory function to create error handling middleware
 */
const createErrorHandlingMiddleware = (options = {}) => {
  return new ErrorHandlingMiddleware(options);
};

module.exports = {
  ErrorHandlingMiddleware,
  createErrorHandlingMiddleware
};
