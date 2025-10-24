/**
 * Shared Response Utilities
 * Standardized response formats across all services
 */

class ResponseUtils {
  /**
   * Success response
   */
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Error response
   */
  static error(res, message = 'Internal Server Error', statusCode = 500, error = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error?.message || error,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Validation error response
   */
  static validationError(res, errors, message = 'Validation failed') {
    return res.status(400).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Not found response
   */
  static notFound(res, message = 'Resource not found') {
    return res.status(404).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Unauthorized response
   */
  static unauthorized(res, message = 'Unauthorized') {
    return res.status(401).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Forbidden response
   */
  static forbidden(res, message = 'Forbidden') {
    return res.status(403).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Paginated response
   */
  static paginated(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        hasNext: pagination.hasNext,
        hasPrev: pagination.hasPrev,
        limit: pagination.limit
      },
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = ResponseUtils;
