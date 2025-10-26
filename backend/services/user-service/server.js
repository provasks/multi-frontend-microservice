const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const { createSecurityMiddleware, ErrorHandler } = require('../../shared');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tms_users')
.then(() => console.log('User Service: Connected to MongoDB'))
.catch(err => console.error('User Service: MongoDB connection error:', err));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'User Service API Documentation'
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    service: 'User Service', 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

// Error handling middleware
app.use(ErrorHandler.handle);
app.use(ErrorHandler.notFound);

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
