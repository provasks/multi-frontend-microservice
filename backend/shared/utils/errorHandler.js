/**
 * Shared Error Handling Utilities
 * Centralized error handling patterns
 */

class ErrorHandler {
  /**
   * Handle different types of errors
   */
  static handle(error, req, res, next) {
    console.error('Error:', error);

    // Validation errors
    if (error.type === 'validation') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
        timestamp: new Date().toISOString()
      });
    }

    // MongoDB errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
        timestamp: new Date().toISOString()
      });
    }

    // MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
        timestamp: new Date().toISOString()
      });
    }

    // MongoDB cast error
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
        timestamp: new Date().toISOString()
      });
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        timestamp: new Date().toISOString()
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        timestamp: new Date().toISOString()
      });
    }

    // Axios errors
    if (error.isAxiosError) {
      if (error.response) {
        return res.status(error.response.status).json({
          success: false,
          message: error.response.data?.message || 'External service error',
          timestamp: new Date().toISOString()
        });
      } else if (error.request) {
        return res.status(503).json({
          success: false,
          message: 'Service unavailable',
          timestamp: new Date().toISOString()
        });
      }
    }

    // Default error
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Async error wrapper
   */
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * 404 handler
   */
  static notFound(req, res, next) {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = ErrorHandler;
