const Joi = require('joi');
const { SanitizationUtils } = require('../utils/sanitization');
const { ResponseUtils } = require('../utils/response');

/**
 * Input Validation Middleware
 * Comprehensive request validation and sanitization
 */
class ValidationMiddleware {
  constructor(options = {}) {
    this.options = {
      sanitizeInput: options.sanitizeInput !== false,
      strictValidation: options.strictValidation !== false,
      ...options
    };
  }

  /**
   * Validate request body against schema
   */
  validateBody(schema, options = {}) {
    return async (req, res, next) => {
      try {
        // Sanitize input if enabled
        if (this.options.sanitizeInput) {
          req.body = SanitizationUtils.sanitizeObject(req.body, {
            allowHtml: options.allowHtml || false,
            maxLength: options.maxLength || 1000
          });
        }

        // Validate against schema
        const { error, value } = schema.validate(req.body, {
          abortEarly: false,
          stripUnknown: true,
          convert: true
        });

        if (error) {
          const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          }));

          return ResponseUtils.validationError(res, errors, 'Validation failed');
        }

        // Replace body with validated and sanitized data
        req.body = value;
        next();
      } catch (err) {
        console.error('Validation middleware error:', err);
        return ResponseUtils.error(res, 'Validation error', 500);
      }
    };
  }

  /**
   * Validate request query parameters
   */
  validateQuery(schema, options = {}) {
    return async (req, res, next) => {
      try {
        // Sanitize query parameters
        if (this.options.sanitizeInput) {
          req.query = SanitizationUtils.sanitizeObject(req.query, {
            maxLength: options.maxLength || 200
          });
        }

        // Validate against schema
        const { error, value } = schema.validate(req.query, {
          abortEarly: false,
          stripUnknown: true,
          convert: true
        });

        if (error) {
          const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          }));

          return ResponseUtils.validationError(res, errors, 'Query validation failed');
        }

        req.query = value;
        next();
      } catch (err) {
        console.error('Query validation error:', err);
        return ResponseUtils.error(res, 'Query validation error', 500);
      }
    };
  }

  /**
   * Validate request parameters
   */
  validateParams(schema, options = {}) {
    return async (req, res, next) => {
      try {
        // Sanitize parameters
        if (this.options.sanitizeInput) {
          req.params = SanitizationUtils.sanitizeObject(req.params, {
            maxLength: options.maxLength || 100
          });
        }

        // Validate against schema
        const { error, value } = schema.validate(req.params, {
          abortEarly: false,
          stripUnknown: true,
          convert: true
        });

        if (error) {
          const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          }));

          return ResponseUtils.validationError(res, errors, 'Parameter validation failed');
        }

        req.params = value;
        next();
      } catch (err) {
        console.error('Parameter validation error:', err);
        return ResponseUtils.error(res, 'Parameter validation error', 500);
      }
    };
  }

  /**
   * Validate file uploads
   */
  validateFile(options = {}) {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
      required = false
    } = options;

    return async (req, res, next) => {
      try {
        if (!req.file && !req.files) {
          if (required) {
            return ResponseUtils.validationError(res, [{
              field: 'file',
              message: 'File is required'
            }], 'File validation failed');
          }
          return next();
        }

        const files = req.files || [req.file];
        
        for (const file of files) {
          // Sanitize file data
          const sanitizedFile = SanitizationUtils.sanitizeFileData(file);
          
          if (!sanitizedFile) {
            return ResponseUtils.validationError(res, [{
              field: 'file',
              message: 'Invalid file data'
            }], 'File validation failed');
          }

          // Check file size
          if (sanitizedFile.size > maxSize) {
            return ResponseUtils.validationError(res, [{
              field: 'file',
              message: `File size exceeds maximum allowed size of ${maxSize} bytes`
            }], 'File validation failed');
          }

          // Check file type
          if (!allowedTypes.includes(sanitizedFile.mimetype)) {
            return ResponseUtils.validationError(res, [{
              field: 'file',
              message: `File type ${sanitizedFile.mimetype} is not allowed`
            }], 'File validation failed');
          }
        }

        next();
      } catch (err) {
        console.error('File validation error:', err);
        return ResponseUtils.error(res, 'File validation error', 500);
      }
    };
  }

  /**
   * Validate MongoDB ObjectId
   */
  validateObjectId(field = 'id') {
    return async (req, res, next) => {
      try {
        const id = req.params[field] || req.body[field] || req.query[field];
        
        if (!id) {
          return ResponseUtils.validationError(res, [{
            field,
            message: `${field} is required`
          }], 'ID validation failed');
        }

        // Sanitize ID
        const sanitizedId = SanitizationUtils.sanitizeString(id, { maxLength: 24 });
        
        if (!sanitizedId || !/^[0-9a-fA-F]{24}$/.test(sanitizedId)) {
          return ResponseUtils.validationError(res, [{
            field,
            message: `Invalid ${field} format`
          }], 'ID validation failed');
        }

        // Update the field with sanitized ID
        if (req.params[field]) req.params[field] = sanitizedId;
        if (req.body[field]) req.body[field] = sanitizedId;
        if (req.query[field]) req.query[field] = sanitizedId;

        next();
      } catch (err) {
        console.error('ObjectId validation error:', err);
        return ResponseUtils.error(res, 'ID validation error', 500);
      }
    };
  }

  /**
   * Validate pagination parameters
   */
  validatePagination() {
    return async (req, res, next) => {
      try {
        const { page = 1, limit = 10 } = req.query;
        
        // Sanitize and validate page
        const sanitizedPage = SanitizationUtils.sanitizeNumber(page, {
          min: 1,
          max: 1000,
          integer: true
        });
        
        if (!sanitizedPage) {
          return ResponseUtils.validationError(res, [{
            field: 'page',
            message: 'Page must be a positive integer'
          }], 'Pagination validation failed');
        }

        // Sanitize and validate limit
        const sanitizedLimit = SanitizationUtils.sanitizeNumber(limit, {
          min: 1,
          max: 100,
          integer: true
        });
        
        if (!sanitizedLimit) {
          return ResponseUtils.validationError(res, [{
            field: 'limit',
            message: 'Limit must be between 1 and 100'
          }], 'Pagination validation failed');
        }

        req.query.page = sanitizedPage;
        req.query.limit = sanitizedLimit;
        
        next();
      } catch (err) {
        console.error('Pagination validation error:', err);
        return ResponseUtils.error(res, 'Pagination validation error', 500);
      }
    };
  }

  /**
   * Validate search parameters
   */
  validateSearch() {
    return async (req, res, next) => {
      try {
        const { q, sort = 'createdAt', order = 'desc' } = req.query;
        
        // Sanitize search query
        if (q) {
          const sanitizedQuery = SanitizationUtils.sanitizeString(q, {
            maxLength: 100,
            removeHtml: true
          });
          
          if (!sanitizedQuery) {
            return ResponseUtils.validationError(res, [{
              field: 'q',
              message: 'Invalid search query'
            }], 'Search validation failed');
          }
          
          req.query.q = sanitizedQuery;
        }

        // Sanitize sort field
        const sanitizedSort = SanitizationUtils.sanitizeString(sort, {
          maxLength: 50
        });
        
        if (!sanitizedSort || !/^[a-zA-Z0-9_]+$/.test(sanitizedSort)) {
          return ResponseUtils.validationError(res, [{
            field: 'sort',
            message: 'Invalid sort field'
          }], 'Search validation failed');
        }
        
        req.query.sort = sanitizedSort;

        // Sanitize order
        const sanitizedOrder = SanitizationUtils.sanitizeString(order, {
          maxLength: 10
        });
        
        if (!sanitizedOrder || !['asc', 'desc'].includes(sanitizedOrder)) {
          return ResponseUtils.validationError(res, [{
            field: 'order',
            message: 'Order must be asc or desc'
          }], 'Search validation failed');
        }
        
        req.query.order = sanitizedOrder;
        
        next();
      } catch (err) {
        console.error('Search validation error:', err);
        return ResponseUtils.error(res, 'Search validation error', 500);
      }
    };
  }
}

/**
 * Factory function to create validation middleware
 */
const createValidationMiddleware = (options = {}) => {
  return new ValidationMiddleware(options);
};

module.exports = {
  ValidationMiddleware,
  createValidationMiddleware
};
