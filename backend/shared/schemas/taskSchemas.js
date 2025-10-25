const Joi = require('joi');
const BACKEND_CONSTANTS = require('../constants');

/**
 * Task Service Validation Schemas
 * Comprehensive validation schemas for task operations
 */
const taskSchemas = {
  // Task creation schema
  create: Joi.object({
    title: Joi.string()
      .min(BACKEND_CONSTANTS.VALIDATION.TASK_TITLE.MIN_LENGTH)
      .max(BACKEND_CONSTANTS.VALIDATION.TASK_TITLE.MAX_LENGTH)
      .required()
      .messages({
        'string.min': BACKEND_CONSTANTS.VALIDATION_MESSAGES.TASK_TITLE_MIN_LENGTH,
        'string.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.TASK_TITLE_MAX_LENGTH,
        'any.required': BACKEND_CONSTANTS.VALIDATION_MESSAGES.TASK_TITLE_REQUIRED
      }),
    
    description: Joi.string()
      .max(BACKEND_CONSTANTS.VALIDATION.TASK_DESCRIPTION.MAX_LENGTH)
      .allow('')
      .optional()
      .messages({
        'string.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.TASK_DESCRIPTION_MAX_LENGTH
      }),
    
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .default('medium')
      .messages({
        'any.only': BACKEND_CONSTANTS.VALIDATION_MESSAGES.TASK_PRIORITY_INVALID
      }),
    
    assignedTo: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': BACKEND_CONSTANTS.VALIDATION_MESSAGES.USER_ID_INVALID
      }),
    
    dueDate: Joi.date()
      .iso()
      .greater('now')
      .optional()
      .messages({
        'date.format': 'Due date must be a valid ISO date',
        'date.greater': 'Due date must be in the future'
      }),
    
    tags: Joi.array()
      .items(Joi.string().max(50))
      .max(10)
      .optional()
      .messages({
        'array.max': 'Maximum 10 tags allowed',
        'string.max': 'Tag cannot exceed 50 characters'
      })
  }),

  // Task update schema
  update: Joi.object({
    title: Joi.string()
      .min(BACKEND_CONSTANTS.VALIDATION.TASK_TITLE.MIN_LENGTH)
      .max(BACKEND_CONSTANTS.VALIDATION.TASK_TITLE.MAX_LENGTH)
      .optional()
      .messages({
        'string.min': BACKEND_CONSTANTS.VALIDATION_MESSAGES.TASK_TITLE_MIN_LENGTH,
        'string.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.TASK_TITLE_MAX_LENGTH
      }),
    
    description: Joi.string()
      .max(BACKEND_CONSTANTS.VALIDATION.TASK_DESCRIPTION.MAX_LENGTH)
      .allow('')
      .optional()
      .messages({
        'string.max': BACKEND_CONSTANTS.VALIDATION_MESSAGES.TASK_DESCRIPTION_MAX_LENGTH
      }),
    
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .optional()
      .messages({
        'any.only': BACKEND_CONSTANTS.VALIDATION_MESSAGES.TASK_PRIORITY_INVALID
      }),
    
    status: Joi.string()
      .valid('pending', 'in-progress', 'completed', 'cancelled')
      .optional()
      .messages({
        'any.only': BACKEND_CONSTANTS.VALIDATION_MESSAGES.TASK_STATUS_INVALID
      }),
    
    assignedTo: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': BACKEND_CONSTANTS.VALIDATION_MESSAGES.USER_ID_INVALID
      }),
    
    dueDate: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.format': 'Due date must be a valid ISO date'
      }),
    
    tags: Joi.array()
      .items(Joi.string().max(50))
      .max(10)
      .optional()
      .messages({
        'array.max': 'Maximum 10 tags allowed',
        'string.max': 'Tag cannot exceed 50 characters'
      })
  }),

  // Task query schema
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
    
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .optional()
      .messages({
        'any.only': BACKEND_CONSTANTS.VALIDATION_MESSAGES.TASK_PRIORITY_INVALID
      }),
    
    status: Joi.string()
      .valid('pending', 'in-progress', 'completed', 'cancelled')
      .optional()
      .messages({
        'any.only': BACKEND_CONSTANTS.VALIDATION_MESSAGES.TASK_STATUS_INVALID
      }),
    
    assignedTo: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': BACKEND_CONSTANTS.VALIDATION_MESSAGES.USER_ID_INVALID
      }),
    
    dueDateFrom: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.format': 'Due date from must be a valid ISO date'
      }),
    
    dueDateTo: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.format': 'Due date to must be a valid ISO date'
      })
  }),

  // Task ID parameter schema
  taskId: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': BACKEND_CONSTANTS.VALIDATION_MESSAGES.TASK_ID_INVALID,
        'any.required': BACKEND_CONSTANTS.VALIDATION_MESSAGES.TASK_ID_REQUIRED
      })
  })
};

module.exports = taskSchemas;