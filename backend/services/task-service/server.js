const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const taskRoutes = require('./routes/taskRoutes');
const { createSecurityMiddleware, ErrorHandler } = require('../../shared');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Security Middleware
const securityMiddleware = createSecurityMiddleware({
  enableHelmet: true,
  enableCORS: true,
  enableRateLimit: process.env.NODE_ENV !== 'development', // Disable rate limiting in development
  corsOrigins: [
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:4001',
    'http://localhost:4002',
    'http://localhost:4003',
    'http://localhost:4004'
  ]
});

securityMiddleware.setupCompleteSecurity(app);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tms_tasks')
.then(() => console.log('Task Service: Connected to MongoDB'))
.catch(err => console.error('Task Service: MongoDB connection error:', err));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Task Service API Documentation'
}));

// Routes
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    service: 'Task Service', 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

// Error handling middleware
app.use(ErrorHandler.handle);
app.use(ErrorHandler.notFound);

app.listen(PORT, () => {
  console.log(`Task Service running on port ${PORT}`);
});
