const Joi = require('joi');

/**
 * Notification Service Validation Schemas
 * Comprehensive validation schemas for notification operations
 */
const notificationSchemas = {
  // Notification creation schema
  create: Joi.object({
    userId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid user ID format',
        'any.required': 'User ID is required'
      }),
    
    type: Joi.string()
      .valid('info', 'success', 'warning', 'error', 'task_assigned', 'task_completed', 'task_overdue', 'task_comment')
      .required()
      .messages({
        'any.only': 'Invalid notification type',
        'any.required': 'Notification type is required'
      }),
    
    title: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.min': 'Notification title is required',
        'string.max': 'Notification title cannot exceed 100 characters',
        'any.required': 'Notification title is required'
      }),
    
    message: Joi.string()
      .min(1)
      .max(500)
      .required()
      .messages({
        'string.min': 'Notification message is required',
        'string.max': 'Notification message cannot exceed 500 characters',
        'any.required': 'Notification message is required'
      }),
    
    data: Joi.object()
      .optional(),
    
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .default('medium')
  }),

  // Notification update schema
  update: Joi.object({
    isRead: Joi.boolean()
      .optional(),
    
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .optional()
  }),

  // Notification query schema
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
    
    type: Joi.string()
      .valid('info', 'success', 'warning', 'error', 'task_assigned', 'task_completed', 'task_overdue', 'task_comment')
      .optional(),
    
    status: Joi.string()
      .valid('read', 'unread')
      .optional(),
    
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .optional(),
    
    sort: Joi.string()
      .valid('createdAt', 'updatedAt', 'priority')
      .default('createdAt'),
    
    order: Joi.string()
      .valid('asc', 'desc')
      .default('desc')
  }),

  // Notification ID parameter schema
  notificationId: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid notification ID format',
        'any.required': 'Notification ID is required'
      })
  }),

  // Mark as read schema
  markAsRead: Joi.object({
    notificationIds: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .min(1)
      .max(50)
      .required()
      .messages({
        'array.min': 'At least one notification ID is required',
        'array.max': 'Cannot mark more than 50 notifications at once',
        'any.required': 'Notification IDs are required'
      })
  }),

  // Bulk delete schema
  bulkDelete: Joi.object({
    notificationIds: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .min(1)
      .max(50)
      .required()
      .messages({
        'array.min': 'At least one notification ID is required',
        'array.max': 'Cannot delete more than 50 notifications at once',
        'any.required': 'Notification IDs are required'
      })
  })
};

module.exports = notificationSchemas;
