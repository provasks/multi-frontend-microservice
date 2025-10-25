const Joi = require('joi');
const BACKEND_CONSTANTS = require('../constants');

/**
 * Notification Service Validation Schemas
 * Comprehensive validation schemas for notification operations
 */
const notificationSchemas = {
  // Notification creation schema
  create: Joi.object({
    title: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.min': BACKEND_CONSTANTS.VALIDATION_MESSAGES.NOTIFICATION_TITLE_MIN_LENGTH,
        'string.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.NOTIFICATION_TITLE_MAX_LENGTH,
        'any.required': BACKEND_CONSTANTS.VALIDATION_MESSAGES.NOTIFICATION_TITLE_REQUIRED
      }),
    
    message: Joi.string()
      .min(1)
      .max(500)
      .required()
      .messages({
        'string.min': BACKEND_CONSTANTS.VALIDATION_MESSAGES.NOTIFICATION_MESSAGE_REQUIRED,
        'string.max': 'Notification message cannot exceed 500 characters',
        'any.required': BACKEND_CONSTANTS.VALIDATION_MESSAGES.NOTIFICATION_MESSAGE_REQUIRED
      }),
    
    type: Joi.string()
      .valid('info', 'warning', 'error', 'success')
      .default('info')
      .messages({
        'any.only': BACKEND_CONSTANTS.VALIDATION_MESSAGES.NOTIFICATION_TYPE_INVALID
      }),
    
    userId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': BACKEND_CONSTANTS.VALIDATION_MESSAGES.USER_ID_INVALID,
        'any.required': BACKEND_CONSTANTS.VALIDATION_MESSAGES.USER_ID_REQUIRED
      }),
    
    isRead: Joi.boolean()
      .default(false),
    
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .default('medium')
      .messages({
        'any.only': 'Priority must be low, medium, high, or urgent'
      }),
    
    expiresAt: Joi.date()
      .iso()
      .greater('now')
      .optional()
      .messages({
        'date.format': 'Expiration date must be a valid ISO date',
        'date.greater': 'Expiration date must be in the future'
      })
  }),

  // Notification update schema
  update: Joi.object({
    title: Joi.string()
      .min(1)
      .max(100)
      .optional()
      .messages({
        'string.min': BACKEND_CONSTANTS.VALIDATION_MESSAGES.NOTIFICATION_TITLE_MIN_LENGTH,
        'string.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.NOTIFICATION_TITLE_MAX_LENGTH
      }),
    
    message: Joi.string()
      .min(1)
      .max(500)
      .optional()
      .messages({
        'string.min': BACKEND_CONSTANTS.VALIDATION_MESSAGES.NOTIFICATION_MESSAGE_REQUIRED,
        'string.max': 'Notification message cannot exceed 500 characters'
      }),
    
    type: Joi.string()
      .valid('info', 'warning', 'error', 'success')
      .optional()
      .messages({
        'any.only': BACKEND_CONSTANTS.VALIDATION_MESSAGES.NOTIFICATION_TYPE_INVALID
      }),
    
    isRead: Joi.boolean()
      .optional(),
    
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .optional()
      .messages({
        'any.only': 'Priority must be low, medium, high, or urgent'
      }),
    
    expiresAt: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.format': 'Expiration date must be a valid ISO date'
      })
  }),

  // Notification query schema
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
    
    type: Joi.string()
      .valid('info', 'warning', 'error', 'success')
      .optional()
      .messages({
        'any.only': BACKEND_CONSTANTS.VALIDATION_MESSAGES.NOTIFICATION_TYPE_INVALID
      }),
    
    isRead: Joi.boolean()
      .optional(),
    
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .optional()
      .messages({
        'any.only': 'Priority must be low, medium, high, or urgent'
      }),
    
    userId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': BACKEND_CONSTANTS.VALIDATION_MESSAGES.USER_ID_INVALID
      }),
    
    createdFrom: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.format': 'Created from date must be a valid ISO date'
      }),
    
    createdTo: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.format': 'Created to date must be a valid ISO date'
      })
  }),

  // Notification ID parameter schema
  notificationId: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': BACKEND_CONSTANTS.VALIDATION_MESSAGES.NOTIFICATION_ID_INVALID,
        'any.required': BACKEND_CONSTANTS.VALIDATION_MESSAGES.NOTIFICATION_ID_REQUIRED
      })
  }),

  // Mark as read schema
  markAsRead: Joi.object({
    notificationIds: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .min(1)
      .max(100)
      .required()
      .messages({
        'array.min': 'At least one notification ID is required',
        'array.max': 'Maximum 100 notification IDs allowed',
        'string.pattern.base': BACKEND_CONSTANTS.VALIDATION_MESSAGES.NOTIFICATION_ID_INVALID,
        'any.required': 'Notification IDs are required'
      })
  })
};

module.exports = notificationSchemas;