const Joi = require('joi');

/**
 * Task Service Validation Schemas
 * Comprehensive validation schemas for task operations
 */
const taskSchemas = {
  // Task creation schema
  create: Joi.object({
    title: Joi.string()
      .min(1)
      .max(200)
      .required()
      .messages({
        'string.min': 'Task title is required',
        'string.max': 'Task title cannot exceed 200 characters',
        'any.required': 'Task title is required'
      }),
    
    description: Joi.string()
      .max(1000)
      .allow('')
      .optional(),
    
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .default('medium'),
    
    assignedTo: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid assigned user ID format',
        'any.required': 'Assigned user is required'
      }),
    
    dueDate: Joi.date()
      .iso()
      .greater('now')
      .optional()
      .messages({
        'date.greater': 'Due date must be in the future'
      }),
    
    tags: Joi.array()
      .items(Joi.string().max(50))
      .max(10)
      .optional()
  }),

  // Task update schema
  update: Joi.object({
    title: Joi.string()
      .min(1)
      .max(200)
      .optional(),
    
    description: Joi.string()
      .max(1000)
      .allow('')
      .optional(),
    
    status: Joi.string()
      .valid('pending', 'in_progress', 'completed', 'cancelled')
      .optional(),
    
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .optional(),
    
    assignedTo: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Invalid assigned user ID format'
      }),
    
    dueDate: Joi.date()
      .iso()
      .optional(),
    
    tags: Joi.array()
      .items(Joi.string().max(50))
      .max(10)
      .optional(),
    
    isArchived: Joi.boolean()
      .optional()
  }),

  // Task query schema
  query: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .max(1000)
      .default(1),
    
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10),
    
    search: Joi.string()
      .max(100)
      .optional(),
    
    status: Joi.string()
      .valid('pending', 'in_progress', 'completed', 'cancelled')
      .optional(),
    
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .optional(),
    
    assignedTo: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Invalid assigned user ID format'
      }),
    
    createdBy: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Invalid creator ID format'
      }),
    
    isArchived: Joi.boolean()
      .optional(),
    
    sort: Joi.string()
      .valid('createdAt', 'updatedAt', 'title', 'dueDate', 'priority')
      .default('createdAt'),
    
    order: Joi.string()
      .valid('asc', 'desc')
      .default('desc')
  }),

  // Task ID parameter schema
  taskId: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid task ID format',
        'any.required': 'Task ID is required'
      })
  }),

  // Comment schema
  comment: Joi.object({
    text: Joi.string()
      .min(1)
      .max(500)
      .required()
      .messages({
        'string.min': 'Comment text is required',
        'string.max': 'Comment cannot exceed 500 characters',
        'any.required': 'Comment text is required'
      })
  }),

  // Comment ID parameter schema
  commentId: Joi.object({
    commentId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid comment ID format',
        'any.required': 'Comment ID is required'
      })
  })
};

module.exports = taskSchemas;
