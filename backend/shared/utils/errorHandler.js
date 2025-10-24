const { BACKEND_CONSTANTS } = require('../constants');
const ResponseUtils = require('./response');

/**
 * Enhanced Error Handling Utilities
 * Comprehensive error handling with security integration
 */
class ErrorHandler {
  constructor(options = {}) {
    this.options = {
      enableSecurityLogging: options.enableSecurityLogging !== false,
      enableErrorTracking: options.enableErrorTracking !== false,
      securityLogger: options.securityLogger || null,
      ...options
    };
  }

  /**
   * Handle different types of errors with security integration
   */
  static handle(error, req, res, next) {
    const errorHandler = new ErrorHandler();
    return errorHandler.handleError(error, req, res, next);
  }

  /**
   * Enhanced error handling with security logging
   */
  handleError(error, req, res, next) {
    // Log error for debugging
    console.error('Error:', error);

    // Security logging for suspicious errors
    if (this.options.enableSecurityLogging && this.options.securityLogger) {
      this.logSecurityError(error, req);
    }

    // Handle different error types
    if (error.name === 'ValidationError') {
      return this.handleValidationError(error, req, res);
    }

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return this.handleCastError(error, req, res);
    }

    if (error.name === 'MongoServerError' && error.code === 11000) {
      return this.handleDuplicateKeyError(error, req, res);
    }

    if (error.name === 'JsonWebTokenError') {
      return this.handleJWTError(error, req, res);
    }

    if (error.name === 'TokenExpiredError') {
      return this.handleTokenExpiredError(error, req, res);
    }

    if (error.isAxiosError) {
      return this.handleAxiosError(error, req, res);
    }

    if (error.name === 'SecurityViolationError') {
      return this.handleSecurityViolation(error, req, res);
    }

    if (error.name === 'RateLimitError') {
      return this.handleRateLimitError(error, req, res);
    }

    if (error.name === 'AuthenticationError') {
      return this.handleAuthenticationError(error, req, res);
    }

    if (error.name === 'AuthorizationError') {
      return this.handleAuthorizationError(error, req, res);
    }

    if (error.name === 'InputValidationError') {
      return this.handleInputValidationError(error, req, res);
    }

    if (error.name === 'FileUploadError') {
      return this.handleFileUploadError(error, req, res);
    }

    // Generic error
    return this.handleGenericError(error, req, res);
  }

  /**
   * Log security-related errors
   */
  logSecurityError(error, req) {
    const securityLevel = this.determineSecurityLevel(error);
    
    if (securityLevel !== 'low') {
      this.options.securityLogger.log(securityLevel, `Security error: ${error.message}`, {
        service: this.options.serviceName || 'unknown',
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        userId: req.user?.userId || null,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        request: {
          method: req.method,
          url: req.url,
          headers: req.headers
        }
      });
    }
  }

  /**
   * Determine security level of error
   */
  determineSecurityLevel(error) {
    const securityErrors = [
      'SecurityViolationError',
      'AuthenticationError',
      'AuthorizationError',
      'RateLimitError',
      'InputValidationError'
    ];

    if (securityErrors.includes(error.name)) {
      return 'high';
    }

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Handle validation errors
   */
  handleValidationError(error, req, res) {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));

    return ResponseUtils.validationError(res, errors, 'Validation failed');
  }

  /**
   * Handle cast errors
   */
  handleCastError(error, req, res) {
    return ResponseUtils.error(res, BACKEND_CONSTANTS.ERROR_MESSAGES.INVALID_ID, BACKEND_CONSTANTS.HTTP_STATUS.BAD_REQUEST);
  }

  /**
   * Handle duplicate key errors
   */
  handleDuplicateKeyError(error, req, res) {
    const field = Object.keys(error.keyValue)[0];
    const message = `${field} already exists.`;
    return ResponseUtils.error(res, message, BACKEND_CONSTANTS.HTTP_STATUS.CONFLICT);
  }

  /**
   * Handle JWT errors
   */
  handleJWTError(error, req, res) {
    return ResponseUtils.unauthorized(res, BACKEND_CONSTANTS.ERROR_MESSAGES.INVALID_TOKEN);
  }

  /**
   * Handle token expired errors
   */
  handleTokenExpiredError(error, req, res) {
    return ResponseUtils.unauthorized(res, BACKEND_CONSTANTS.ERROR_MESSAGES.TOKEN_EXPIRED);
  }

  /**
   * Handle Axios errors
   */
  handleAxiosError(error, req, res) {
    const status = error.response?.status || BACKEND_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = error.response?.data?.message || error.message;
    return ResponseUtils.error(res, message, status);
  }

  /**
   * Handle security violations
   */
  handleSecurityViolation(error, req, res) {
    return ResponseUtils.error(res, error.message, BACKEND_CONSTANTS.HTTP_STATUS.FORBIDDEN);
  }

  /**
   * Handle rate limit errors
   */
  handleRateLimitError(error, req, res) {
    return ResponseUtils.error(res, 'Rate limit exceeded', BACKEND_CONSTANTS.HTTP_STATUS.TOO_MANY_REQUESTS);
  }

  /**
   * Handle authentication errors
   */
  handleAuthenticationError(error, req, res) {
    return ResponseUtils.unauthorized(res, error.message || BACKEND_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED);
  }

  /**
   * Handle authorization errors
   */
  handleAuthorizationError(error, req, res) {
    return ResponseUtils.forbidden(res, error.message || BACKEND_CONSTANTS.ERROR_MESSAGES.FORBIDDEN);
  }

  /**
   * Handle input validation errors
   */
  handleInputValidationError(error, req, res) {
    return ResponseUtils.validationError(res, error.errors || [], error.message || 'Input validation failed');
  }

  /**
   * Handle file upload errors
   */
  handleFileUploadError(error, req, res) {
    return ResponseUtils.error(res, error.message, BACKEND_CONSTANTS.HTTP_STATUS.BAD_REQUEST);
  }

  /**
   * Handle generic errors
   */
  handleGenericError(error, req, res) {
    const statusCode = error.statusCode || BACKEND_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = process.env.NODE_ENV === 'production' 
      ? BACKEND_CONSTANTS.ERROR_MESSAGES.SERVER_ERROR
      : error.message || BACKEND_CONSTANTS.ERROR_MESSAGES.SERVER_ERROR;

    return ResponseUtils.error(res, message, statusCode);
  }

  /**
   * Create custom error with security context
   */
  static createSecurityError(message, type = 'SecurityViolationError', statusCode = 403) {
    const error = new Error(message);
    error.name = type;
    error.statusCode = statusCode;
    error.isSecurityError = true;
    return error;
  }

  /**
   * Create authentication error
   */
  static createAuthenticationError(message = 'Authentication failed') {
    return ErrorHandler.createSecurityError(message, 'AuthenticationError', 401);
  }

  /**
   * Create authorization error
   */
  static createAuthorizationError(message = 'Access denied') {
    return ErrorHandler.createSecurityError(message, 'AuthorizationError', 403);
  }

  /**
   * Create rate limit error
   */
  static createRateLimitError(message = 'Rate limit exceeded') {
    return ErrorHandler.createSecurityError(message, 'RateLimitError', 429);
  }

  /**
   * Create input validation error
   */
  static createInputValidationError(message, errors = []) {
    const error = new Error(message);
    error.name = 'InputValidationError';
    error.statusCode = 400;
    error.errors = errors;
    return error;
  }

  /**
   * Create file upload error
   */
  static createFileUploadError(message) {
    const error = new Error(message);
    error.name = 'FileUploadError';
    error.statusCode = 400;
    return error;
  }

  /**
   * Async error wrapper with enhanced logging
   */
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch((error) => {
        // Add request context to error
        error.requestContext = {
          method: req.method,
          url: req.url,
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent'),
          userId: req.user?.userId || null,
          timestamp: new Date().toISOString()
        };
        next(error);
      });
    };
  }

  /**
   * Enhanced 404 handler with security logging
   */
  static notFound(req, res, next) {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.name = 'NotFoundError';
    error.statusCode = 404;
    error.requestContext = {
      method: req.method,
      url: req.url,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      userId: req.user?.userId || null,
      timestamp: new Date().toISOString()
    };

    return ResponseUtils.notFound(res, error.message);
  }

  /**
   * Global error handler with security integration
   */
  static globalErrorHandler(options = {}) {
    const errorHandler = new ErrorHandler(options);
    
    return (error, req, res, next) => {
      return errorHandler.handleError(error, req, res, next);
    };
  }

  /**
   * Unhandled rejection handler
   */
  static handleUnhandledRejection() {
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      
      // Log security-related unhandled rejections
      if (reason && reason.name && reason.name.includes('Security')) {
        console.error('Security-related unhandled rejection:', reason);
      }
    });
  }

  /**
   * Uncaught exception handler
   */
  static handleUncaughtException() {
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      
      // Log security-related uncaught exceptions
      if (error.name && error.name.includes('Security')) {
        console.error('Security-related uncaught exception:', error);
      }
      
      // Graceful shutdown
      process.exit(1);
    });
  }

  /**
   * Setup comprehensive error handling
   */
  static setupErrorHandling(app, options = {}) {
    // Handle unhandled rejections and exceptions
    ErrorHandler.handleUnhandledRejection();
    ErrorHandler.handleUncaughtException();

    // Global error handler
    app.use(ErrorHandler.globalErrorHandler(options));
    
    // 404 handler
    app.use(ErrorHandler.notFound);

    return app;
  }
}

module.exports = ErrorHandler;
