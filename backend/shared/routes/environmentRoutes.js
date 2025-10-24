const express = require('express');
const { createEnvironmentSecurity } = require('../utils/environmentSecurity');
const { generateEnvironmentFile, getEnvironmentTemplate, validateEnvironmentTemplate, getAvailableTemplates } = require('../templates/environmentTemplates');
const { ResponseUtils } = require('../utils/response');

/**
 * Environment Security Routes
 * Environment configuration and security management endpoints
 */
const createEnvironmentRoutes = (options = {}) => {
  const router = express.Router();
  const environmentSecurity = createEnvironmentSecurity(options);

  /**
   * Environment validation endpoint
   */
  router.get('/validate', (req, res) => {
    try {
      const validation = environmentSecurity.validateEnvironment();
      const fileValidation = environmentSecurity.validateEnvironmentFile();
      
      ResponseUtils.success(res, {
        environment: validation,
        file: fileValidation,
        securityScore: environmentSecurity.calculateSecurityScore(validation, fileValidation)
      }, 'Environment validation completed');
    } catch (error) {
      console.error('Environment validation error:', error);
      ResponseUtils.error(res, 'Failed to validate environment', 500);
    }
  });

  /**
   * Environment health check endpoint
   */
  router.get('/health', (req, res) => {
    try {
      const validation = environmentSecurity.validateEnvironment();
      const fileValidation = environmentSecurity.validateEnvironmentFile();
      
      const healthStatus = {
        status: validation.isValid ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        environment: {
          nodeEnv: process.env.NODE_ENV,
          port: process.env.PORT,
          host: process.env.HOST
        },
        validation: {
          isValid: validation.isValid,
          missingVars: validation.missingVars,
          weakVars: validation.weakVars
        },
        fileValidation: {
          isValid: fileValidation.isValid,
          errors: fileValidation.errors,
          warnings: fileValidation.warnings
        },
        securityScore: environmentSecurity.calculateSecurityScore(validation, fileValidation)
      };

      res.status(validation.isValid ? 200 : 500).json(healthStatus);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Environment health check failed',
        error: error.message
      });
    }
  });

  /**
   * Generate secure environment endpoint
   */
  router.post('/generate', (req, res) => {
    try {
      const { environment = 'development', customVars = {} } = req.body;
      
      const template = getEnvironmentTemplate(environment);
      const envContent = environmentSecurity.generateSecureEnvironment({
        nodeEnv: environment,
        ...customVars
      });
      
      ResponseUtils.success(res, {
        environment,
        content: envContent,
        variables: Object.keys(template)
      }, 'Secure environment generated successfully');
    } catch (error) {
      console.error('Environment generation error:', error);
      ResponseUtils.error(res, 'Failed to generate environment', 500);
    }
  });

  /**
   * Get environment templates endpoint
   */
  router.get('/templates', (req, res) => {
    try {
      const templates = getAvailableTemplates();
      const templateDetails = templates.map(template => ({
        name: template,
        description: getTemplateDescription(template),
        variables: Object.keys(getEnvironmentTemplate(template))
      }));
      
      ResponseUtils.success(res, templateDetails, 'Environment templates retrieved successfully');
    } catch (error) {
      console.error('Environment templates error:', error);
      ResponseUtils.error(res, 'Failed to retrieve environment templates', 500);
    }
  });

  /**
   * Get specific template endpoint
   */
  router.get('/templates/:template', (req, res) => {
    try {
      const { template } = req.params;
      const templateData = getEnvironmentTemplate(template);
      
      if (!templateData) {
        return ResponseUtils.error(res, 'Template not found', 404);
      }
      
      const validation = validateEnvironmentTemplate(templateData);
      
      ResponseUtils.success(res, {
        template,
        variables: templateData,
        validation,
        description: getTemplateDescription(template)
      }, 'Template retrieved successfully');
    } catch (error) {
      console.error('Template retrieval error:', error);
      ResponseUtils.error(res, 'Failed to retrieve template', 500);
    }
  });

  /**
   * Backup environment endpoint
   */
  router.post('/backup', (req, res) => {
    try {
      const backupFile = environmentSecurity.backupEnvironment();
      
      if (backupFile) {
        ResponseUtils.success(res, {
          backupFile,
          timestamp: new Date().toISOString()
        }, 'Environment backed up successfully');
      } else {
        ResponseUtils.error(res, 'No environment file found to backup', 404);
      }
    } catch (error) {
      console.error('Environment backup error:', error);
      ResponseUtils.error(res, 'Failed to backup environment', 500);
    }
  });

  /**
   * List backups endpoint
   */
  router.get('/backups', (req, res) => {
    try {
      const backups = environmentSecurity.listBackups();
      
      ResponseUtils.success(res, backups, 'Environment backups retrieved successfully');
    } catch (error) {
      console.error('Environment backups error:', error);
      ResponseUtils.error(res, 'Failed to retrieve environment backups', 500);
    }
  });

  /**
   * Restore environment endpoint
   */
  router.post('/restore', (req, res) => {
    try {
      const { backupFile } = req.body;
      
      if (!backupFile) {
        return ResponseUtils.validationError(res, [{
          field: 'backupFile',
          message: 'Backup file path is required'
        }], 'Validation failed');
      }
      
      const restored = environmentSecurity.restoreEnvironment(backupFile);
      
      if (restored) {
        ResponseUtils.success(res, {
          backupFile,
          restored: true,
          timestamp: new Date().toISOString()
        }, 'Environment restored successfully');
      } else {
        ResponseUtils.error(res, 'Backup file not found', 404);
      }
    } catch (error) {
      console.error('Environment restore error:', error);
      ResponseUtils.error(res, 'Failed to restore environment', 500);
    }
  });

  /**
   * Clean old backups endpoint
   */
  router.post('/clean-backups', (req, res) => {
    try {
      const { retentionDays = 30 } = req.body;
      const cleanedCount = environmentSecurity.cleanOldBackups(retentionDays);
      
      ResponseUtils.success(res, {
        cleanedCount,
        retentionDays,
        timestamp: new Date().toISOString()
      }, 'Old backups cleaned successfully');
    } catch (error) {
      console.error('Clean backups error:', error);
      ResponseUtils.error(res, 'Failed to clean old backups', 500);
    }
  });

  /**
   * Environment security report endpoint
   */
  router.get('/report', (req, res) => {
    try {
      const report = environmentSecurity.generateSecurityReport();
      
      ResponseUtils.success(res, report, 'Environment security report generated successfully');
    } catch (error) {
      console.error('Environment report error:', error);
      ResponseUtils.error(res, 'Failed to generate environment security report', 500);
    }
  });

  /**
   * Generate secure values endpoint
   */
  router.post('/generate-values', (req, res) => {
    try {
      const { type = 'all' } = req.body;
      
      const values = {};
      
      if (type === 'all' || type === 'jwt') {
        values.jwtSecret = environmentSecurity.generateJWTSecret();
      }
      
      if (type === 'all' || type === 'api') {
        values.apiKey = environmentSecurity.generateAPIKey();
      }
      
      if (type === 'all' || type === 'database') {
        values.databasePassword = environmentSecurity.generateDatabasePassword();
      }
      
      if (type === 'all' || type === 'encryption') {
        values.encryptionKey = environmentSecurity.generateSecureRandom(32);
      }
      
      ResponseUtils.success(res, values, 'Secure values generated successfully');
    } catch (error) {
      console.error('Generate values error:', error);
      ResponseUtils.error(res, 'Failed to generate secure values', 500);
    }
  });

  return router;
};

/**
 * Get template description
 */
function getTemplateDescription(template) {
  const descriptions = {
    development: 'Development environment with relaxed security for local development',
    production: 'Production environment with strict security settings',
    testing: 'Testing environment with minimal security for automated testing',
    docker: 'Docker environment optimized for containerized deployment'
  };
  
  return descriptions[template] || 'Custom environment template';
}

module.exports = createEnvironmentRoutes;
