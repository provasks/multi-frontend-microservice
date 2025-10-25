const Joi = require('joi');
const BACKEND_CONSTANTS = require('../constants');

/**
 * User Service Validation Schemas
 * Comprehensive validation schemas for user operations
 */
const userSchemas = {
  // User registration schema
  register: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(BACKEND_CONSTANTS.VALIDATION.USERNAME.MIN_LENGTH)
      .max(BACKEND_CONSTANTS.VALIDATION.USERNAME.MAX_LENGTH)
      .required()
      .messages({
        'string.alphanum': BACKEND_CONSTANTS.VALIDATION_MESSAGES.USERNAME_ALPHANUM,
        'string.min': BACKEND_CONSTANTS.VALIDATION_MESSAGES.USERNAME_MIN_LENGTH,
        'string.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.USERNAME_MAX_LENGTH,
        'any.required': BACKEND_CONSTANTS.VALIDATION_MESSAGES.USERNAME_REQUIRED
      }),
    
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': BACKEND_CONSTANTS.VALIDATION_MESSAGES.EMAIL_INVALID,
        'any.required': BACKEND_CONSTANTS.VALIDATION_MESSAGES.EMAIL_REQUIRED
      }),
    
    password: Joi.string()
      .min(BACKEND_CONSTANTS.VALIDATION.PASSWORD.MIN_LENGTH)
      .max(BACKEND_CONSTANTS.VALIDATION.PASSWORD.MAX_LENGTH)
      .required()
      .messages({
        'string.min': BACKEND_CONSTANTS.VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH,
        'string.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.PASSWORD_MAX_LENGTH,
        'any.required': BACKEND_CONSTANTS.VALIDATION_MESSAGES.PASSWORD_REQUIRED
      }),
    
    firstName: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.min': BACKEND_CONSTANTS.VALIDATION_MESSAGES.FIRST_NAME_MIN_LENGTH,
        'string.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.FIRST_NAME_MAX_LENGTH,
        'any.required': BACKEND_CONSTANTS.VALIDATION_MESSAGES.FIRST_NAME_REQUIRED
      }),
    
    lastName: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.min': BACKEND_CONSTANTS.VALIDATION_MESSAGES.LAST_NAME_MIN_LENGTH,
        'string.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.LAST_NAME_MAX_LENGTH,
        'any.required': BACKEND_CONSTANTS.VALIDATION_MESSAGES.LAST_NAME_REQUIRED
      })
  }),

  // User login schema
  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': BACKEND_CONSTANTS.VALIDATION_MESSAGES.EMAIL_INVALID,
        'any.required': BACKEND_CONSTANTS.VALIDATION_MESSAGES.EMAIL_REQUIRED
      }),
    
    password: Joi.string()
      .required()
      .messages({
        'any.required': BACKEND_CONSTANTS.VALIDATION_MESSAGES.PASSWORD_REQUIRED
      })
  }),

  // User update schema
  update: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(BACKEND_CONSTANTS.VALIDATION.USERNAME.MIN_LENGTH)
      .max(BACKEND_CONSTANTS.VALIDATION.USERNAME.MAX_LENGTH)
      .optional()
      .messages({
        'string.alphanum': BACKEND_CONSTANTS.VALIDATION_MESSAGES.USERNAME_ALPHANUM,
        'string.min': BACKEND_CONSTANTS.VALIDATION_MESSAGES.USERNAME_MIN_LENGTH,
        'string.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.USERNAME_MAX_LENGTH
      }),
    
    email: Joi.string()
      .email()
      .optional()
      .messages({
        'string.email': BACKEND_CONSTANTS.VALIDATION_MESSAGES.EMAIL_INVALID
      }),
    
    firstName: Joi.string()
      .min(1)
      .max(50)
      .optional()
      .messages({
        'string.min': BACKEND_CONSTANTS.VALIDATION_MESSAGES.FIRST_NAME_MIN_LENGTH,
        'string.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.FIRST_NAME_MAX_LENGTH
      }),
    
    lastName: Joi.string()
      .min(1)
      .max(50)
      .optional()
      .messages({
        'string.min': BACKEND_CONSTANTS.VALIDATION_MESSAGES.LAST_NAME_MIN_LENGTH,
        'string.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.LAST_NAME_MAX_LENGTH
      }),
    
    role: Joi.string()
      .valid('user', 'admin', 'moderator')
      .optional()
      .messages({
        'any.only': BACKEND_CONSTANTS.VALIDATION_MESSAGES.ROLE_INVALID
      }),
    
    isActive: Joi.boolean()
      .optional()
  }),

  // Password change schema
  changePassword: Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'any.required': BACKEND_CONSTANTS.VALIDATION_MESSAGES.CURRENT_PASSWORD_REQUIRED
      }),
    
    newPassword: Joi.string()
      .min(BACKEND_CONSTANTS.VALIDATION.PASSWORD.MIN_LENGTH)
      .max(BACKEND_CONSTANTS.VALIDATION.PASSWORD.MAX_LENGTH)
      .required()
      .messages({
        'string.min': BACKEND_CONSTANTS.VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH,
        'string.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.PASSWORD_MAX_LENGTH,
        'any.required': BACKEND_CONSTANTS.VALIDATION_MESSAGES.NEW_PASSWORD_REQUIRED
      })
  }),

  // User query schema
  query: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .max(1000)
      .default(BACKEND_CONSTANTS.PAGINATION.DEFAULT_PAGE)
      .messages({
        'number.base': BACKEND_CONSTANTS.VALIDATION_MESSAGES.PAGE_INVALID,
        'number.min': BACKEND_CONSTANTS.VALIDATION_MESSAGES.PAGE_INVALID,
        'number.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.PAGE_INVALID
      }),
    
    limit: Joi.number()
      .integer()
      .min(1)
      .max(BACKEND_CONSTANTS.PAGINATION.MAX_LIMIT)
      .default(BACKEND_CONSTANTS.PAGINATION.DEFAULT_LIMIT)
      .messages({
        'number.base': BACKEND_CONSTANTS.VALIDATION_MESSAGES.LIMIT_INVALID,
        'number.min': BACKEND_CONSTANTS.VALIDATION_MESSAGES.LIMIT_INVALID,
        'number.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.LIMIT_INVALID
      }),
    
    search: Joi.string()
      .max(100)
      .optional()
      .messages({
        'string.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.SEARCH_MAX_LENGTH
      }),
    
    role: Joi.string()
      .valid('user', 'admin', 'moderator')
      .optional()
      .messages({
        'any.only': BACKEND_CONSTANTS.VALIDATION_MESSAGES.ROLE_INVALID
      }),
    
    isActive: Joi.boolean()
      .optional()
  }),

  // User ID parameter schema
  userId: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': BACKEND_CONSTANTS.VALIDATION_MESSAGES.USER_ID_INVALID,
        'any.required': BACKEND_CONSTANTS.VALIDATION_MESSAGES.USER_ID_REQUIRED
      })
  })
};

module.exports = userSchemas;