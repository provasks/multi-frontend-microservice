const { createSwaggerConfig } = require('../../../shared');

// Notification Service specific schemas
const notificationSchemas = {
  Notification: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'Notification ID'
      },
      userId: {
        type: 'string',
        description: 'User ID'
      },
      taskId: {
        type: 'string',
        description: 'Task ID'
      },
      type: {
        type: 'string',
        enum: ['task_assigned', 'task_due_soon', 'task_overdue', 'task_completed', 'task_updated', 'comment_added', 'status_changed'],
        description: 'Notification type'
      },
      title: {
        type: 'string',
        description: 'Notification title'
      },
      message: {
        type: 'string',
        description: 'Notification message'
      },
      isRead: {
        type: 'boolean',
        description: 'Read status'
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'urgent'],
        description: 'Notification priority'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp'
      }
    }
  }
};

// Create swagger configuration for Notification Service
const swaggerConfig = createSwaggerConfig({
  title: 'Notification Service API',
  version: '1.0.0',
  description: 'Notification service for Task Management System',
  url: 'http://localhost:3003'
});

const specs = swaggerConfig.generateSpecs(notificationSchemas);
module.exports = specs;

