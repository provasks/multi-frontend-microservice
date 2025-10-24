/**
 * Shared Backend Utilities
 * Centralized exports for all shared components
 */

// Middleware
const { AuthMiddleware, createAuthMiddleware } = require('./middleware/auth');

// Utilities
const ResponseUtils = require('./utils/response');
const ValidationUtils = require('./utils/validation');
const ErrorHandler = require('./utils/errorHandler');

// Configuration
const { SwaggerConfig, createSwaggerConfig } = require('./config/swagger');

// Constants
const BACKEND_CONSTANTS = require('./constants');

module.exports = {
  // Middleware
  AuthMiddleware,
  createAuthMiddleware,
  
  // Utilities
  ResponseUtils,
  ValidationUtils,
  ErrorHandler,
  
  // Configuration
  SwaggerConfig,
  createSwaggerConfig,
  
  // Constants
  BACKEND_CONSTANTS
};
