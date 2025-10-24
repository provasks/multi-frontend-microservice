const { createEnvironmentSecurity } = require('../utils/environmentSecurity');
const { ResponseUtils } = require('../utils/response');

/**
 * Environment Security Middleware
 * Environment security validation and monitoring
 */
class EnvironmentSecurityMiddleware {
  constructor(options = {}) {
    this.options = {
      enableValidation: options.enableValidation !== false,
      enableMonitoring: options.enableMonitoring !== false,
      enableBackup: options.enableBackup !== false,
      ...options
    };

    this.environmentSecurity = createEnvironmentSecurity(options);
  }

  /**
   * Environment validation middleware
   */
  validateEnvironment() {
    return (req, res, next) => {
      if (!this.options.enableValidation) {
        return next();
      }

      try {
        const validation = this.environmentSecurity.validateEnvironment();
        
        if (!validation.isValid) {
          console.error('Environment validation failed:', validation);
          
          // Log security violation
          if (this.options.enableMonitoring) {
            // This would be logged by the security monitoring system
            console.log('Environment security violation detected');
          }
          
          return ResponseUtils.error(res, 'Environment configuration is invalid', 500, {
            missingVars: validation.missingVars,
            weakVars: validation.weakVars,
            recommendations: validation.recommendations
          });
        }

        // Check for weak variables in production
        if (process.env.NODE_ENV === 'production' && validation.weakVars.length > 0) {
          console.warn('Weak environment variables detected in production:', validation.weakVars);
        }

        next();
      } catch (error) {
        console.error('Environment validation error:', error);
        return ResponseUtils.error(res, 'Environment validation failed', 500);
      }
    };
  }

  /**
   * Environment monitoring middleware
   */
  monitorEnvironment() {
    return (req, res, next) => {
      if (!this.options.enableMonitoring) {
        return next();
      }

      // Monitor environment changes
      const currentEnv = {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        JWT_SECRET: process.env.JWT_SECRET ? '***' : null,
        MONGODB_URI: process.env.MONGODB_URI ? '***' : null
      };

      // Store in request for potential logging
      req.environmentInfo = currentEnv;

      next();
    };
  }

  /**
   * Environment backup middleware
   */
  backupEnvironment() {
    return (req, res, next) => {
      if (!this.options.enableBackup) {
        return next();
      }

      // Perform backup on startup (this would typically be done once)
      if (!this.hasBackedUp) {
        try {
          const backupFile = this.environmentSecurity.backupEnvironment();
          if (backupFile) {
            console.log(`Environment backed up to: ${backupFile}`);
          }
          this.hasBackedUp = true;
        } catch (error) {
          console.error('Environment backup failed:', error);
        }
      }

      next();
    };
  }

  /**
   * Environment security headers middleware
   */
  securityHeaders() {
    return (req, res, next) => {
      // Add environment security headers
      res.set('X-Environment', process.env.NODE_ENV || 'unknown');
      res.set('X-Security-Status', 'monitored');
      
      // Hide sensitive information
      if (process.env.NODE_ENV === 'production') {
        res.set('X-Powered-By', 'Task Management System');
      }

      next();
    };
  }

  /**
   * Environment health check middleware
   */
  healthCheck() {
    return (req, res, next) => {
      if (req.path === '/health' || req.path === '/health/environment') {
        try {
          const validation = this.environmentSecurity.validateEnvironment();
          const fileValidation = this.environmentSecurity.validateEnvironmentFile();
          
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
            securityScore: this.environmentSecurity.calculateSecurityScore(validation, fileValidation)
          };

          return res.status(validation.isValid ? 200 : 500).json(healthStatus);
        } catch (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Environment health check failed',
            error: error.message
          });
        }
      }

      next();
    };
  }

  /**
   * Complete environment security setup
   */
  setupEnvironmentSecurity(app) {
    // Apply all environment security middleware
    app.use(this.validateEnvironment());
    app.use(this.monitorEnvironment());
    app.use(this.backupEnvironment());
    app.use(this.securityHeaders());
    app.use(this.healthCheck());

    // Clean old backups daily
    if (this.options.enableBackup) {
      setInterval(() => {
        try {
          const cleanedCount = this.environmentSecurity.cleanOldBackups(30);
          if (cleanedCount > 0) {
            console.log(`Cleaned ${cleanedCount} old environment backups`);
          }
        } catch (error) {
          console.error('Failed to clean old backups:', error);
        }
      }, 24 * 60 * 60 * 1000); // 24 hours
    }

    return app;
  }
}

/**
 * Factory function to create environment security middleware
 */
const createEnvironmentSecurityMiddleware = (options = {}) => {
  return new EnvironmentSecurityMiddleware(options);
};

module.exports = {
  EnvironmentSecurityMiddleware,
  createEnvironmentSecurityMiddleware
};
