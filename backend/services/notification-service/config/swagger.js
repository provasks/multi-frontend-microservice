const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notification Service API',
      version: '1.0.0',
      description: 'Notification service for Task Management System',
      contact: {
        name: 'Task Management System',
        email: 'support@taskmanagement.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3003',
        description: 'Notification Service'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
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
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            },
            message: {
              type: 'string',
              description: 'Detailed error message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJSDoc(options);
module.exports = specs;

