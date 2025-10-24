/**
 * Shared Validation Utilities
 * Common validation patterns and schemas
 */

const Joi = require('joi');

class ValidationUtils {
  /**
   * Common validation schemas
   */
  static schemas = {
    // User validation
    user: {
      register: Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
      }),
      login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      }),
      update: Joi.object({
        username: Joi.string().min(3).max(30),
        email: Joi.string().email(),
        firstName: Joi.string(),
        lastName: Joi.string(),
        role: Joi.string().valid('user', 'admin', 'moderator'),
        isActive: Joi.boolean()
      })
    },

    // Task validation
    task: {
      create: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().allow(''),
        priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
        assignedTo: Joi.string().required(),
        dueDate: Joi.date().iso(),
        tags: Joi.array().items(Joi.string())
      }),
      update: Joi.object({
        title: Joi.string(),
        description: Joi.string().allow(''),
        status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled'),
        priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
        assignedTo: Joi.string(),
        dueDate: Joi.date().iso(),
        tags: Joi.array().items(Joi.string())
      })
    },

    // Notification validation
    notification: {
      create: Joi.object({
        userId: Joi.string().required(),
        type: Joi.string().valid('info', 'success', 'warning', 'error').required(),
        title: Joi.string().required(),
        message: Joi.string().required(),
        data: Joi.object()
      })
    },

    // Common patterns
    common: {
      id: Joi.string().required(),
      pagination: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10)
      }),
      search: Joi.object({
        q: Joi.string().allow(''),
        sort: Joi.string().valid('createdAt', 'updatedAt', 'title', 'name').default('createdAt'),
        order: Joi.string().valid('asc', 'desc').default('desc')
      })
    }
  };

  /**
   * Validate request data
   */
  static validate(schema, data) {
    const { error, value } = schema.validate(data, { 
      abortEarly: false,
      stripUnknown: true 
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      throw { type: 'validation', errors };
    }
    
    return value;
  }

  /**
   * Validate pagination parameters
   */
  static validatePagination(query) {
    return this.validate(this.schemas.common.pagination, query);
  }

  /**
   * Validate search parameters
   */
  static validateSearch(query) {
    return this.validate(this.schemas.common.search, query);
  }

  /**
   * Validate ID parameter
   */
  static validateId(id) {
    return this.validate(this.schemas.common.id, { id }).id;
  }

  /**
   * Build pagination object
   */
  static buildPagination(page, limit, total) {
    return {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
      limit: parseInt(limit)
    };
  }

  /**
   * Build sort object for MongoDB
   */
  static buildSort(sort, order) {
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;
    return sortObj;
  }
}

module.exports = ValidationUtils;
