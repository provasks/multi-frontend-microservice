const validator = require('validator');
const xss = require('xss');

/**
 * Input Sanitization Utilities
 * Comprehensive input cleaning and validation
 */
class SanitizationUtils {
  /**
   * Sanitize string input
   */
  static sanitizeString(input, options = {}) {
    if (typeof input !== 'string') {
      return input;
    }

    const {
      allowHtml = false,
      maxLength = 1000,
      trim = true,
      removeScripts = true,
      removeHtml = false
    } = options;

    let sanitized = input;

    // Trim whitespace
    if (trim) {
      sanitized = sanitized.trim();
    }

    // Remove HTML if not allowed
    if (!allowHtml || removeHtml) {
      sanitized = validator.stripLow(sanitized);
    }

    // Remove script tags and dangerous content
    if (removeScripts) {
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      sanitized = sanitized.replace(/javascript:/gi, '');
      sanitized = sanitized.replace(/on\w+\s*=/gi, '');
    }

    // XSS protection
    sanitized = xss(sanitized, {
      whiteList: allowHtml ? {
        p: [],
        br: [],
        strong: [],
        em: [],
        u: [],
        h1: [], h2: [], h3: [], h4: [], h5: [], h6: [],
        ul: [], ol: [], li: [],
        blockquote: []
      } : {},
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script']
    });

    // Limit length
    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  }

  /**
   * Sanitize email input
   */
  static sanitizeEmail(email) {
    if (typeof email !== 'string') {
      return null;
    }

    const sanitized = email.trim().toLowerCase();
    
    if (!validator.isEmail(sanitized)) {
      return null;
    }

    return sanitized;
  }

  /**
   * Sanitize username input
   */
  static sanitizeUsername(username) {
    if (typeof username !== 'string') {
      return null;
    }

    const sanitized = username.trim();
    
    // Only allow alphanumeric, underscore, and hyphen
    if (!/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
      return null;
    }

    // Length validation
    if (sanitized.length < 3 || sanitized.length > 30) {
      return null;
    }

    return sanitized;
  }

  /**
   * Sanitize password input
   */
  static sanitizePassword(password) {
    if (typeof password !== 'string') {
      return null;
    }

    // Remove any potential XSS
    const sanitized = password.replace(/<[^>]*>/g, '');
    
    // Length validation
    if (sanitized.length < 6) {
      return null;
    }

    return sanitized;
  }

  /**
   * Sanitize object input recursively
   */
  static sanitizeObject(obj, options = {}) {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return this.sanitizeString(obj, options);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item, options));
    }

    if (typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        // Sanitize key
        const sanitizedKey = this.sanitizeString(key, { maxLength: 50 });
        if (sanitizedKey) {
          sanitized[sanitizedKey] = this.sanitizeObject(value, options);
        }
      }
      return sanitized;
    }

    return obj;
  }

  /**
   * Sanitize MongoDB query to prevent NoSQL injection
   */
  static sanitizeMongoQuery(query) {
    if (typeof query !== 'object' || query === null) {
      return {};
    }

    const sanitized = {};
    
    for (const [key, value] of Object.entries(query)) {
      // Sanitize field names
      const sanitizedKey = this.sanitizeString(key, { maxLength: 50 });
      if (!sanitizedKey) continue;

      // Handle different query operators
      if (typeof value === 'object' && value !== null) {
        const sanitizedValue = {};
        for (const [op, val] of Object.entries(value)) {
          const sanitizedOp = this.sanitizeString(op, { maxLength: 20 });
          if (sanitizedOp && this.isValidMongoOperator(sanitizedOp)) {
            sanitizedValue[sanitizedOp] = this.sanitizeQueryValue(val);
          }
        }
        sanitized[sanitizedKey] = Object.keys(sanitizedValue).length > 0 ? sanitizedValue : value;
      } else {
        sanitized[sanitizedKey] = this.sanitizeQueryValue(value);
      }
    }

    return sanitized;
  }

  /**
   * Sanitize query value
   */
  static sanitizeQueryValue(value) {
    if (typeof value === 'string') {
      return this.sanitizeString(value, { maxLength: 200 });
    }
    if (typeof value === 'number') {
      return isNaN(value) ? 0 : value;
    }
    if (typeof value === 'boolean') {
      return Boolean(value);
    }
    if (Array.isArray(value)) {
      return value.map(item => this.sanitizeQueryValue(item));
    }
    return value;
  }

  /**
   * Check if MongoDB operator is valid
   */
  static isValidMongoOperator(operator) {
    const validOperators = [
      '$eq', '$ne', '$gt', '$gte', '$lt', '$lte',
      '$in', '$nin', '$exists', '$regex', '$options',
      '$and', '$or', '$nor', '$not',
      '$all', '$elemMatch', '$size'
    ];
    return validOperators.includes(operator);
  }

  /**
   * Sanitize file upload data
   */
  static sanitizeFileData(fileData) {
    if (typeof fileData !== 'object' || fileData === null) {
      return null;
    }

    return {
      originalname: this.sanitizeString(fileData.originalname || '', { maxLength: 255 }),
      mimetype: this.sanitizeString(fileData.mimetype || '', { maxLength: 100 }),
      size: typeof fileData.size === 'number' ? fileData.size : 0,
      buffer: fileData.buffer || null
    };
  }

  /**
   * Sanitize URL input
   */
  static sanitizeUrl(url) {
    if (typeof url !== 'string') {
      return null;
    }

    const sanitized = url.trim();
    
    if (!validator.isURL(sanitized, { 
      protocols: ['http', 'https'],
      require_protocol: true 
    })) {
      return null;
    }

    return sanitized;
  }

  /**
   * Sanitize phone number
   */
  static sanitizePhone(phone) {
    if (typeof phone !== 'string') {
      return null;
    }

    const sanitized = phone.replace(/[^\d+\-\(\)\s]/g, '').trim();
    
    if (!validator.isMobilePhone(sanitized)) {
      return null;
    }

    return sanitized;
  }

  /**
   * Sanitize date input
   */
  static sanitizeDate(date) {
    if (typeof date === 'string') {
      const parsed = new Date(date);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    if (date instanceof Date) {
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  }

  /**
   * Sanitize numeric input
   */
  static sanitizeNumber(input, options = {}) {
    const { min = -Infinity, max = Infinity, integer = false } = options;
    
    let num = Number(input);
    
    if (isNaN(num)) {
      return null;
    }

    if (integer) {
      num = Math.floor(num);
    }

    if (num < min || num > max) {
      return null;
    }

    return num;
  }

  /**
   * Sanitize boolean input
   */
  static sanitizeBoolean(input) {
    if (typeof input === 'boolean') {
      return input;
    }
    if (typeof input === 'string') {
      const lower = input.toLowerCase();
      return lower === 'true' || lower === '1' || lower === 'yes';
    }
    if (typeof input === 'number') {
      return input !== 0;
    }
    return Boolean(input);
  }
}

module.exports = SanitizationUtils;
