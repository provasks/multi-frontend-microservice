const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
// const rateLimit = require('express-rate-limit'); // DISABLED for now
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Cookie parser middleware (must be before routes)
app.use(cookieParser());

// Rate limiting - DISABLED for now
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: process.env.NODE_ENV === 'development' ? 10000 : 100, // Very high limit for development
//   message: 'Too many requests from this IP, please try again later.',
//   skip: (req) => {
//     // Completely skip rate limiting in development
//     if (process.env.NODE_ENV === 'development') {
//       return true; // Skip ALL rate limiting in development
//     }
//     return false;
//   }
// });
// app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:4001',
    'http://localhost:4002',
    'http://localhost:4003'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    service: 'API Gateway', 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: {
      userService: process.env.USER_SERVICE_URL || 'http://localhost:3001',
      taskService: process.env.TASK_SERVICE_URL || 'http://localhost:3002',
      notificationService: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3003'
    }
  });
});

// Service discovery and health checks
const checkServiceHealth = async (serviceName, serviceUrl) => {
  try {
    const response = await fetch(`${serviceUrl}/health`);
    const data = await response.json();
    return { name: serviceName, status: 'healthy', data };
  } catch (error) {
    return { name: serviceName, status: 'unhealthy', error: error.message };
  }
};

// Services status endpoint
app.get('/services/status', async (req, res) => {
  const services = [
    { name: 'user-service', url: process.env.USER_SERVICE_URL || 'http://localhost:3001' },
    { name: 'task-service', url: process.env.TASK_SERVICE_URL || 'http://localhost:3002' },
    { name: 'notification-service', url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3003' }
  ];

  const statuses = await Promise.all(
    services.map(service => checkServiceHealth(service.name, service.url))
  );

  res.json({
    timestamp: new Date().toISOString(),
    services: statuses
  });
});

// Proxy configuration for each service
const userServiceProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/api/users',
    '^/api/auth': '/api/auth'
  },
  onError: (err, req, res) => {
    console.error('User Service Proxy Error:', err);
    res.status(503).json({ 
      error: 'User Service temporarily unavailable',
      message: 'Please try again later'
    });
  }
});

const taskServiceProxy = createProxyMiddleware({
  target: process.env.TASK_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/tasks': '/api/tasks'
  },
  onError: (err, req, res) => {
    console.error('Task Service Proxy Error:', err);
    res.status(503).json({ 
      error: 'Task Service temporarily unavailable',
      message: 'Please try again later'
    });
  }
});

const notificationServiceProxy = createProxyMiddleware({
  target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/notifications': '/api/notifications'
  },
  onError: (err, req, res) => {
    console.error('Notification Service Proxy Error:', err);
    res.status(503).json({ 
      error: 'Notification Service temporarily unavailable',
      message: 'Please try again later'
    });
  }
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management System API Gateway',
      version: '1.0.0',
      description: 'Microservice-based Task Management System API Gateway',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Task Management System API Documentation'
}));

// Proxy routes for individual service Swagger docs
app.use('/api-docs/user-service', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api-docs/user-service': '/api-docs'
  }
}));

app.use('/api-docs/task-service', createProxyMiddleware({
  target: process.env.TASK_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api-docs/task-service': '/api-docs'
  }
}));

app.use('/api-docs/notification-service', createProxyMiddleware({
  target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api-docs/notification-service': '/api-docs'
  }
}));

// Route proxying
app.use('/api/users', userServiceProxy);
app.use('/api/auth', userServiceProxy);
app.use('/api/tasks', taskServiceProxy);
app.use('/api/notifications', notificationServiceProxy);

// API Documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Task Management System API',
    version: '1.0.0',
    description: 'Microservice-based Task Management System',
    endpoints: {
      authentication: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/me': 'Get current user profile',
        'GET /api/auth/verify': 'Verify JWT token'
      },
      users: {
        'GET /api/users': 'Get all users (admin only)',
        'GET /api/users/:id': 'Get user by ID',
        'PUT /api/users/:id': 'Update user profile',
        'DELETE /api/users/:id': 'Deactivate user (admin only)',
        'PUT /api/users/:id/change-password': 'Change user password'
      },
      tasks: {
        'GET /api/tasks': 'Get tasks with filtering and pagination',
        'GET /api/tasks/:id': 'Get task by ID',
        'POST /api/tasks': 'Create new task',
        'PUT /api/tasks/:id': 'Update task',
        'DELETE /api/tasks/:id': 'Delete task',
        'POST /api/tasks/:id/comments': 'Add comment to task',
        'PATCH /api/tasks/:id/archive': 'Archive task'
      },
      notifications: {
        'GET /api/notifications': 'Get user notifications',
        'GET /api/notifications/:id': 'Get notification by ID',
        'PATCH /api/notifications/:id/read': 'Mark notification as read',
        'PATCH /api/notifications/read-all': 'Mark all notifications as read',
        'DELETE /api/notifications/:id': 'Delete notification',
        'DELETE /api/notifications': 'Delete all notifications',
        'GET /api/notifications/stats/summary': 'Get notification statistics'
      }
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /health',
      'GET /services/status',
      'GET /api/docs',
      'GET /api-docs',
      'GET /api-docs/user-service',
      'GET /api-docs/task-service',
      'GET /api-docs/notification-service',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/users',
      'GET /api/tasks',
      'GET /api/notifications'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`User Service: ${process.env.USER_SERVICE_URL || 'http://localhost:3001'}`);
  console.log(`Task Service: ${process.env.TASK_SERVICE_URL || 'http://localhost:3002'}`);
  console.log(`Notification Service: ${process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3003'}`);
});
