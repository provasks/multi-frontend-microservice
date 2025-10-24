/**
 * Environment Configuration Templates
 * Pre-configured environment templates for different deployment scenarios
 */

const environmentTemplates = {
  /**
   * Development Environment Template
   */
  development: {
    NODE_ENV: 'development',
    PORT: 3000,
    HOST: 'localhost',
    JWT_SECRET: 'dev-jwt-secret-key-change-in-production',
    JWT_EXPIRES_IN: '24h',
    JWT_REFRESH_EXPIRES_IN: '7d',
    MONGODB_URI: 'mongodb://localhost:27017/tms_dev',
    DATABASE_PASSWORD: 'dev-password',
    ENCRYPTION_KEY: 'dev-encryption-key-change-in-production',
    API_KEY: 'dev-api-key',
    CORS_ORIGINS: 'http://localhost:3000,http://localhost:4000,http://localhost:4001,http://localhost:4002,http://localhost:4003',
    RATE_LIMIT_WINDOW_MS: '900000',
    RATE_LIMIT_MAX_REQUESTS: '1000',
    RATE_LIMIT_LOGIN_MAX_REQUESTS: '10',
    MAX_FILE_SIZE: '10485760',
    ALLOWED_FILE_TYPES: 'image/jpeg,image/png,image/gif,application/pdf,text/plain',
    LOG_LEVEL: 'debug',
    LOG_DIR: './logs',
    ENABLE_FILE_LOGGING: 'true',
    ENABLE_CONSOLE_LOGGING: 'true',
    ENABLE_HELMET: 'true',
    ENABLE_CORS: 'true',
    ENABLE_RATE_LIMIT: 'true',
    ENABLE_SECURITY_MONITORING: 'true',
    ENABLE_PERFORMANCE_MONITORING: 'true',
    ENABLE_THREAT_DETECTION: 'true',
    USER_SERVICE_URL: 'http://localhost:3001',
    TASK_SERVICE_URL: 'http://localhost:3002',
    NOTIFICATION_SERVICE_URL: 'http://localhost:3003',
    API_GATEWAY_URL: 'http://localhost:3000',
    BACKUP_ENABLED: 'true',
    BACKUP_INTERVAL: '24h',
    BACKUP_RETENTION_DAYS: '7'
  },

  /**
   * Production Environment Template
   */
  production: {
    NODE_ENV: 'production',
    PORT: 3000,
    HOST: '0.0.0.0',
    JWT_SECRET: 'CHANGE_THIS_IN_PRODUCTION',
    JWT_EXPIRES_IN: '1h',
    JWT_REFRESH_EXPIRES_IN: '7d',
    MONGODB_URI: 'CHANGE_THIS_IN_PRODUCTION',
    DATABASE_PASSWORD: 'CHANGE_THIS_IN_PRODUCTION',
    ENCRYPTION_KEY: 'CHANGE_THIS_IN_PRODUCTION',
    API_KEY: 'CHANGE_THIS_IN_PRODUCTION',
    CORS_ORIGINS: 'https://yourdomain.com,https://api.yourdomain.com',
    RATE_LIMIT_WINDOW_MS: '900000',
    RATE_LIMIT_MAX_REQUESTS: '100',
    RATE_LIMIT_LOGIN_MAX_REQUESTS: '5',
    MAX_FILE_SIZE: '5242880',
    ALLOWED_FILE_TYPES: 'image/jpeg,image/png,image/gif,application/pdf',
    LOG_LEVEL: 'info',
    LOG_DIR: '/var/log/tms',
    ENABLE_FILE_LOGGING: 'true',
    ENABLE_CONSOLE_LOGGING: 'false',
    ENABLE_HELMET: 'true',
    ENABLE_CORS: 'true',
    ENABLE_RATE_LIMIT: 'true',
    ENABLE_SECURITY_MONITORING: 'true',
    ENABLE_PERFORMANCE_MONITORING: 'true',
    ENABLE_THREAT_DETECTION: 'true',
    USER_SERVICE_URL: 'https://user.yourdomain.com',
    TASK_SERVICE_URL: 'https://task.yourdomain.com',
    NOTIFICATION_SERVICE_URL: 'https://notification.yourdomain.com',
    API_GATEWAY_URL: 'https://api.yourdomain.com',
    BACKUP_ENABLED: 'true',
    BACKUP_INTERVAL: '6h',
    BACKUP_RETENTION_DAYS: '30'
  },

  /**
   * Testing Environment Template
   */
  testing: {
    NODE_ENV: 'test',
    PORT: 3000,
    HOST: 'localhost',
    JWT_SECRET: 'test-jwt-secret-key',
    JWT_EXPIRES_IN: '1h',
    JWT_REFRESH_EXPIRES_IN: '1d',
    MONGODB_URI: 'mongodb://localhost:27017/tms_test',
    DATABASE_PASSWORD: 'test-password',
    ENCRYPTION_KEY: 'test-encryption-key',
    API_KEY: 'test-api-key',
    CORS_ORIGINS: 'http://localhost:3000',
    RATE_LIMIT_WINDOW_MS: '60000',
    RATE_LIMIT_MAX_REQUESTS: '1000',
    RATE_LIMIT_LOGIN_MAX_REQUESTS: '100',
    MAX_FILE_SIZE: '1048576',
    ALLOWED_FILE_TYPES: 'image/jpeg,image/png,text/plain',
    LOG_LEVEL: 'error',
    LOG_DIR: './test-logs',
    ENABLE_FILE_LOGGING: 'false',
    ENABLE_CONSOLE_LOGGING: 'false',
    ENABLE_HELMET: 'false',
    ENABLE_CORS: 'true',
    ENABLE_RATE_LIMIT: 'false',
    ENABLE_SECURITY_MONITORING: 'false',
    ENABLE_PERFORMANCE_MONITORING: 'false',
    ENABLE_THREAT_DETECTION: 'false',
    USER_SERVICE_URL: 'http://localhost:3001',
    TASK_SERVICE_URL: 'http://localhost:3002',
    NOTIFICATION_SERVICE_URL: 'http://localhost:3003',
    API_GATEWAY_URL: 'http://localhost:3000',
    BACKUP_ENABLED: 'false',
    BACKUP_INTERVAL: '24h',
    BACKUP_RETENTION_DAYS: '1'
  },

  /**
   * Docker Environment Template
   */
  docker: {
    NODE_ENV: 'production',
    PORT: 3000,
    HOST: '0.0.0.0',
    JWT_SECRET: 'CHANGE_THIS_IN_PRODUCTION',
    JWT_EXPIRES_IN: '24h',
    JWT_REFRESH_EXPIRES_IN: '7d',
    MONGODB_URI: 'mongodb://mongo:27017/tms',
    DATABASE_PASSWORD: 'CHANGE_THIS_IN_PRODUCTION',
    ENCRYPTION_KEY: 'CHANGE_THIS_IN_PRODUCTION',
    API_KEY: 'CHANGE_THIS_IN_PRODUCTION',
    CORS_ORIGINS: 'http://localhost:3000,http://localhost:4000',
    RATE_LIMIT_WINDOW_MS: '900000',
    RATE_LIMIT_MAX_REQUESTS: '100',
    RATE_LIMIT_LOGIN_MAX_REQUESTS: '5',
    MAX_FILE_SIZE: '5242880',
    ALLOWED_FILE_TYPES: 'image/jpeg,image/png,image/gif,application/pdf',
    LOG_LEVEL: 'info',
    LOG_DIR: '/app/logs',
    ENABLE_FILE_LOGGING: 'true',
    ENABLE_CONSOLE_LOGGING: 'true',
    ENABLE_HELMET: 'true',
    ENABLE_CORS: 'true',
    ENABLE_RATE_LIMIT: 'true',
    ENABLE_SECURITY_MONITORING: 'true',
    ENABLE_PERFORMANCE_MONITORING: 'true',
    ENABLE_THREAT_DETECTION: 'true',
    USER_SERVICE_URL: 'http://user-service:3001',
    TASK_SERVICE_URL: 'http://task-service:3002',
    NOTIFICATION_SERVICE_URL: 'http://notification-service:3003',
    API_GATEWAY_URL: 'http://api-gateway:3000',
    BACKUP_ENABLED: 'true',
    BACKUP_INTERVAL: '12h',
    BACKUP_RETENTION_DAYS: '14'
  }
};

/**
 * Generate environment file content
 */
function generateEnvironmentFile(template, customVars = {}) {
  const envVars = { ...template, ...customVars };
  
  let content = `# Environment Configuration\n`;
  content += `# Generated on ${new Date().toISOString()}\n`;
  content += `# Template: ${template.NODE_ENV || 'custom'}\n\n`;
  
  Object.entries(envVars).forEach(([key, value]) => {
    content += `${key}=${value}\n`;
  });
  
  return content;
}

/**
 * Get environment template
 */
function getEnvironmentTemplate(environment) {
  return environmentTemplates[environment] || environmentTemplates.development;
}

/**
 * Validate environment template
 */
function validateEnvironmentTemplate(template) {
  const requiredVars = [
    'NODE_ENV',
    'PORT',
    'HOST',
    'JWT_SECRET',
    'MONGODB_URI'
  ];
  
  const missingVars = requiredVars.filter(varName => !template[varName]);
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
    recommendations: missingVars.length > 0 ? [
      `Missing required environment variables: ${missingVars.join(', ')}`
    ] : []
  };
}

/**
 * Get all available templates
 */
function getAvailableTemplates() {
  return Object.keys(environmentTemplates);
}

module.exports = {
  environmentTemplates,
  generateEnvironmentFile,
  getEnvironmentTemplate,
  validateEnvironmentTemplate,
  getAvailableTemplates
};
