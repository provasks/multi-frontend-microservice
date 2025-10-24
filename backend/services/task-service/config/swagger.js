const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Service API',
      version: '1.0.0',
      description: 'Task management service for Task Management System',
      contact: {
        name: 'Task Management System',
        email: 'support@taskmanagement.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Task Service'
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
        Task: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Task ID'
            },
            title: {
              type: 'string',
              description: 'Task title'
            },
            description: {
              type: 'string',
              description: 'Task description'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed', 'cancelled'],
              description: 'Task status'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              description: 'Task priority'
            },
            assignedTo: {
              type: 'string',
              description: 'User ID of assigned user'
            },
            createdBy: {
              type: 'string',
              description: 'User ID of creator'
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Task due date'
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Task completion date'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Task tags'
            },
            isArchived: {
              type: 'boolean',
              description: 'Archive status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        CreateTaskRequest: {
          type: 'object',
          required: ['title', 'assignedTo'],
          properties: {
            title: {
              type: 'string',
              description: 'Task title'
            },
            description: {
              type: 'string',
              description: 'Task description'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              description: 'Task priority'
            },
            assignedTo: {
              type: 'string',
              description: 'User ID of assigned user'
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Task due date'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Task tags'
            }
          }
        },
        UpdateTaskRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Task title'
            },
            description: {
              type: 'string',
              description: 'Task description'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed', 'cancelled'],
              description: 'Task status'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              description: 'Task priority'
            },
            assignedTo: {
              type: 'string',
              description: 'User ID of assigned user'
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Task due date'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Task tags'
            }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Comment ID'
            },
            user: {
              type: 'string',
              description: 'User ID who made the comment'
            },
            text: {
              type: 'string',
              description: 'Comment text'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Comment creation timestamp'
            }
          }
        },
        AddCommentRequest: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string',
              description: 'Comment text'
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

