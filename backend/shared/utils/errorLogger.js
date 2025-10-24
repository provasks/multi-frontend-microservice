const fs = require('fs');
const path = require('path');

/**
 * Enhanced Error Logging Utilities
 * Comprehensive error logging with security integration
 */
class ErrorLogger {
  constructor(options = {}) {
    this.options = {
      logDir: options.logDir || './logs',
      enableFileLogging: options.enableFileLogging !== false,
      enableConsoleLogging: options.enableConsoleLogging !== false,
      enableSecurityLogging: options.enableSecurityLogging !== false,
      maxLogSize: options.maxLogSize || 10 * 1024 * 1024, // 10MB
      maxFiles: options.maxFiles || 5,
      logLevel: options.logLevel || 'error',
      ...options
    };

    this.ensureLogDirectory();
  }

  /**
   * Ensure log directory exists
   */
  ensureLogDirectory() {
    if (this.options.enableFileLogging && !fs.existsSync(this.options.logDir)) {
      fs.mkdirSync(this.options.logDir, { recursive: true });
    }
  }

  /**
   * Get log file path for today
   */
  getLogFilePath(type = 'error') {
    const today = new Date().toISOString().split('T')[0];
    return path.join(this.options.logDir, `${type}-${today}.log`);
  }

  /**
   * Format error log entry
   */
  formatErrorLogEntry(level, error, context = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
        statusCode: error.statusCode
      },
      context: {
        service: context.service || 'unknown',
        ip: context.ip || null,
        userAgent: context.userAgent || null,
        userId: context.userId || null,
        requestId: context.requestId || null,
        method: context.method || null,
        url: context.url || null,
        ...context
      }
    };

    return JSON.stringify(logEntry);
  }

  /**
   * Write to log file
   */
  writeToFile(type, logEntry) {
    if (!this.options.enableFileLogging) return;

    try {
      const logFile = this.getLogFilePath(type);
      fs.appendFileSync(logFile, logEntry + '\n');
    } catch (error) {
      console.error('Failed to write to error log file:', error);
    }
  }

  /**
   * Write to console
   */
  writeToConsole(level, error, context = {}) {
    if (!this.options.enableConsoleLogging) return;

    const timestamp = new Date().toISOString();
    const service = context.service || 'unknown';
    const ip = context.ip || 'unknown';
    const userId = context.userId || 'anonymous';

    console.error(`[${timestamp}] [${level.toUpperCase()}] [${service}] [${ip}] [${userId}] ${error.message}`);
    
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    
    if (Object.keys(context).length > 0) {
      console.error('Context:', JSON.stringify(context, null, 2));
    }
  }

  /**
   * Log error with context
   */
  logError(level, error, context = {}) {
    const logEntry = this.formatErrorLogEntry(level, error, context);
    
    this.writeToFile('error', logEntry);
    this.writeToConsole(level, error, context);
  }

  /**
   * Log security error
   */
  logSecurityError(error, context = {}) {
    if (!this.options.enableSecurityLogging) return;

    const securityContext = {
      ...context,
      securityLevel: this.determineSecurityLevel(error),
      isSecurityError: true
    };

    this.logError('error', error, securityContext);
  }

  /**
   * Log authentication error
   */
  logAuthenticationError(error, context = {}) {
    const authContext = {
      ...context,
      errorType: 'authentication',
      severity: 'high'
    };

    this.logError('error', error, authContext);
  }

  /**
   * Log authorization error
   */
  logAuthorizationError(error, context = {}) {
    const authzContext = {
      ...context,
      errorType: 'authorization',
      severity: 'high'
    };

    this.logError('error', error, authzContext);
  }

  /**
   * Log validation error
   */
  logValidationError(error, context = {}) {
    const validationContext = {
      ...context,
      errorType: 'validation',
      severity: 'medium'
    };

    this.logError('warn', error, validationContext);
  }

  /**
   * Log rate limit error
   */
  logRateLimitError(error, context = {}) {
    const rateLimitContext = {
      ...context,
      errorType: 'rate_limit',
      severity: 'medium'
    };

    this.logError('warn', error, rateLimitContext);
  }

  /**
   * Log database error
   */
  logDatabaseError(error, context = {}) {
    const dbContext = {
      ...context,
      errorType: 'database',
      severity: 'high'
    };

    this.logError('error', error, dbContext);
  }

  /**
   * Log external service error
   */
  logExternalServiceError(error, context = {}) {
    const externalContext = {
      ...context,
      errorType: 'external_service',
      severity: 'medium'
    };

    this.logError('error', error, externalContext);
  }

  /**
   * Log file upload error
   */
  logFileUploadError(error, context = {}) {
    const fileContext = {
      ...context,
      errorType: 'file_upload',
      severity: 'medium'
    };

    this.logError('warn', error, fileContext);
  }

  /**
   * Log system error
   */
  logSystemError(error, context = {}) {
    const systemContext = {
      ...context,
      errorType: 'system',
      severity: 'high'
    };

    this.logError('error', error, systemContext);
  }

  /**
   * Determine security level of error
   */
  determineSecurityLevel(error) {
    const securityErrors = [
      'SecurityViolationError',
      'AuthenticationError',
      'AuthorizationError',
      'RateLimitError',
      'InputValidationError'
    ];

    if (securityErrors.includes(error.name)) {
      return 'high';
    }

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Get error statistics
   */
  getErrorStatistics(days = 7) {
    const stats = {
      totalErrors: 0,
      errorsByType: {},
      errorsByLevel: {},
      securityErrors: 0,
      topErrors: [],
      errorTrend: []
    };

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const logFile = path.join(this.options.logDir, `error-${dateString}.log`);
      
      if (fs.existsSync(logFile)) {
        try {
          const logContent = fs.readFileSync(logFile, 'utf8');
          const lines = logContent.split('\n').filter(line => line.trim());
          
          lines.forEach(line => {
            try {
              const logEntry = JSON.parse(line);
              stats.totalErrors++;
              
              // Count by type
              const errorType = logEntry.context?.errorType || 'unknown';
              stats.errorsByType[errorType] = (stats.errorsByType[errorType] || 0) + 1;
              
              // Count by level
              const level = logEntry.level || 'unknown';
              stats.errorsByLevel[level] = (stats.errorsByLevel[level] || 0) + 1;
              
              // Count security errors
              if (logEntry.context?.isSecurityError) {
                stats.securityErrors++;
              }
            } catch {
              // Skip invalid JSON
            }
          });
        } catch (error) {
          console.error('Failed to read error statistics:', error);
        }
      }
    }

    return stats;
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit = 50) {
    const errors = [];
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.options.logDir, `error-${today}.log`);
    
    if (fs.existsSync(logFile)) {
      try {
        const logContent = fs.readFileSync(logFile, 'utf8');
        const lines = logContent.split('\n').filter(line => line.trim());
        
        lines.forEach(line => {
          try {
            const logEntry = JSON.parse(line);
            errors.push({
              timestamp: logEntry.timestamp,
              level: logEntry.level,
              error: logEntry.error,
              context: logEntry.context
            });
          } catch {
            // Skip invalid JSON
          }
        });
      } catch (error) {
        console.error('Failed to read recent errors:', error);
      }
    }

    // Sort by timestamp (newest first) and limit
    return errors
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * Clean old log files
   */
  cleanOldLogs() {
    if (!this.options.enableFileLogging) return;

    try {
      const files = fs.readdirSync(this.options.logDir);
      const logFiles = files
        .filter(file => file.endsWith('.log'))
        .map(file => ({
          name: file,
          path: path.join(this.options.logDir, file),
          stats: fs.statSync(path.join(this.options.logDir, file))
        }))
        .sort((a, b) => b.stats.mtime - a.stats.mtime);

      // Keep only the most recent files
      if (logFiles.length > this.options.maxFiles) {
        const filesToDelete = logFiles.slice(this.options.maxFiles);
        filesToDelete.forEach(file => {
          fs.unlinkSync(file.path);
          console.log(`Deleted old log file: ${file.name}`);
        });
      }
    } catch (error) {
      console.error('Failed to clean old logs:', error);
    }
  }
}

/**
 * Factory function to create error logger
 */
const createErrorLogger = (options = {}) => {
  return new ErrorLogger(options);
};

module.exports = {
  ErrorLogger,
  createErrorLogger
};
