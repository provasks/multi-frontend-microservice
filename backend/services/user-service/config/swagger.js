const { createSwaggerConfig } = require('../../../shared');

// User Service specific schemas
const userSchemas = {
  User: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'User ID'
      },
      username: {
        type: 'string',
        description: 'Username'
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'User email'
      },
      firstName: {
        type: 'string',
        description: 'First name'
      },
      lastName: {
        type: 'string',
        description: 'Last name'
      },
      role: {
        type: 'string',
        enum: ['user', 'admin'],
        description: 'User role'
      },
      isActive: {
        type: 'boolean',
        description: 'User active status'
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
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email'
      },
      password: {
        type: 'string',
        minLength: 6,
        description: 'User password'
      }
    }
  },
  RegisterRequest: {
    type: 'object',
    required: ['username', 'email', 'password', 'firstName', 'lastName'],
    properties: {
      username: {
        type: 'string',
        minLength: 3,
        maxLength: 30,
        description: 'Username'
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'User email'
      },
      password: {
        type: 'string',
        minLength: 6,
        description: 'User password'
      },
      firstName: {
        type: 'string',
        description: 'First name'
      },
      lastName: {
        type: 'string',
        description: 'Last name'
      }
    }
  },
  AuthResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Response message'
      },
      token: {
        type: 'string',
        description: 'JWT token'
      },
      user: {
        $ref: '#/components/schemas/User'
      }
    }
  }
};

// Create swagger configuration for User Service
const swaggerConfig = createSwaggerConfig({
  title: 'User Service API',
  version: '1.0.0',
  description: 'User management and authentication service for Task Management System',
  url: 'http://localhost:3001'
});

const specs = swaggerConfig.generateSpecs(userSchemas);
module.exports = specs;

