/**
 * Shared Backend Utilities
 * Centralized exports for all shared components
 */

// Middleware
const { AuthMiddleware, createAuthMiddleware } = require('./middleware/auth');
const { SecurityMiddleware, createSecurityMiddleware } = require('./middleware/security');
const { ValidationMiddleware, createValidationMiddleware } = require('./middleware/validation');
const { SecurityMonitoring, createSecurityMonitoring } = require('./middleware/securityMonitoring');
const { EnvironmentSecurityMiddleware, createEnvironmentSecurityMiddleware } = require('./middleware/environmentSecurity');
const { ErrorHandlingMiddleware, createErrorHandlingMiddleware } = require('./middleware/errorHandling');

// Utilities
const ResponseUtils = require('./utils/response');
const ValidationUtils = require('./utils/validation');
const ErrorHandler = require('./utils/errorHandler');
const SanitizationUtils = require('./utils/sanitization');
const { SecurityLogger, createSecurityLogger } = require('./utils/securityLogger');
const { SecurityDashboard, createSecurityDashboard } = require('./utils/securityDashboard');
const { EnvironmentSecurity, createEnvironmentSecurity } = require('./utils/environmentSecurity');
const { SecurityTesting, createSecurityTesting } = require('./utils/securityTesting');
const { SecurityMonitoring: SecurityMonitoringUtil, createSecurityMonitoring: createSecurityMonitoringUtil } = require('./utils/securityMonitoring');
const { ErrorLogger, createErrorLogger } = require('./utils/errorLogger');

// Configuration
const { SwaggerConfig, createSwaggerConfig } = require('./config/swagger');

// Constants
const BACKEND_CONSTANTS = require('./constants');

// Schemas
const userSchemas = require('./schemas/userSchemas');
const taskSchemas = require('./schemas/taskSchemas');
const notificationSchemas = require('./schemas/notificationSchemas');

// Routes
const createSecurityRoutes = require('./routes/securityRoutes');
const createEnvironmentRoutes = require('./routes/environmentRoutes');
const createSecurityTestingRoutes = require('./routes/securityTestingRoutes');

module.exports = {
  // Middleware
  AuthMiddleware,
  createAuthMiddleware,
  SecurityMiddleware,
  createSecurityMiddleware,
  ValidationMiddleware,
  createValidationMiddleware,
  SecurityMonitoring,
  createSecurityMonitoring,
  EnvironmentSecurityMiddleware,
  createEnvironmentSecurityMiddleware,
  ErrorHandlingMiddleware,
  createErrorHandlingMiddleware,
  
  // Utilities
  ResponseUtils,
  ValidationUtils,
  ErrorHandler,
  SanitizationUtils,
  SecurityLogger,
  createSecurityLogger,
  SecurityDashboard,
  createSecurityDashboard,
  EnvironmentSecurity,
  createEnvironmentSecurity,
  SecurityTesting,
  createSecurityTesting,
  SecurityMonitoringUtil,
  createSecurityMonitoringUtil,
  ErrorLogger,
  createErrorLogger,
  
  // Configuration
  SwaggerConfig,
  createSwaggerConfig,
  
  // Constants
  BACKEND_CONSTANTS,
  
  // Schemas
  userSchemas,
  taskSchemas,
  notificationSchemas,
  
  // Routes
  createSecurityRoutes,
  createEnvironmentRoutes,
  createSecurityTestingRoutes
};
