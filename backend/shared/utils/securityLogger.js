const fs = require('fs');
const path = require('path');

/**
 * Security Logger
 * Comprehensive security event logging and monitoring
 */
class SecurityLogger {
  constructor(options = {}) {
    this.options = {
      logDir: options.logDir || './logs',
      logLevel: options.logLevel || 'info',
      enableFileLogging: options.enableFileLogging !== false,
      enableConsoleLogging: options.enableConsoleLogging !== false,
      maxLogSize: options.maxLogSize || 10 * 1024 * 1024, // 10MB
      maxFiles: options.maxFiles || 5,
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
  getLogFilePath(type = 'security') {
    const today = new Date().toISOString().split('T')[0];
    return path.join(this.options.logDir, `${type}-${today}.log`);
  }

  /**
   * Format log entry
   */
  formatLogEntry(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      service: data.service || 'unknown',
      userId: data.userId || null,
      ip: data.ip || null,
      userAgent: data.userAgent || null,
      requestId: data.requestId || null,
      ...data
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
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Write to console
   */
  writeToConsole(level, message, data = {}) {
    if (!this.options.enableConsoleLogging) return;

    const timestamp = new Date().toISOString();
    const service = data.service || 'unknown';
    const ip = data.ip || 'unknown';
    const userId = data.userId || 'anonymous';

    console.log(`[${timestamp}] [${level.toUpperCase()}] [${service}] [${ip}] [${userId}] ${message}`);
    
    if (Object.keys(data).length > 0) {
      console.log('Data:', JSON.stringify(data, null, 2));
    }
  }

  /**
   * Log security event
   */
  log(level, message, data = {}) {
    const logEntry = this.formatLogEntry(level, message, data);
    
    this.writeToFile('security', logEntry);
    this.writeToConsole(level, message, data);
  }

  /**
   * Log authentication events
   */
  logAuth(event, data = {}) {
    const messages = {
      'login_success': 'User login successful',
      'login_failed': 'User login failed',
      'login_blocked': 'User login blocked due to rate limiting',
      'logout': 'User logout',
      'token_verified': 'Token verification successful',
      'token_invalid': 'Token verification failed',
      'token_expired': 'Token expired',
      'password_change': 'Password changed',
      'password_reset': 'Password reset requested',
      'account_locked': 'Account locked due to failed attempts',
      'account_unlocked': 'Account unlocked'
    };

    this.log('info', messages[event] || event, {
      ...data,
      event: 'authentication',
      subEvent: event
    });
  }

  /**
   * Log authorization events
   */
  logAuthz(event, data = {}) {
    const messages = {
      'access_granted': 'Access granted',
      'access_denied': 'Access denied',
      'permission_denied': 'Permission denied',
      'role_change': 'User role changed',
      'admin_action': 'Admin action performed',
      'unauthorized_access': 'Unauthorized access attempt'
    };

    this.log('warn', messages[event] || event, {
      ...data,
      event: 'authorization',
      subEvent: event
    });
  }

  /**
   * Log security violations
   */
  logViolation(event, data = {}) {
    const messages = {
      'xss_attempt': 'XSS attack attempt detected',
      'sql_injection': 'SQL injection attempt detected',
      'nosql_injection': 'NoSQL injection attempt detected',
      'file_upload_attack': 'Malicious file upload attempt',
      'rate_limit_exceeded': 'Rate limit exceeded',
      'brute_force_attempt': 'Brute force attack detected',
      'suspicious_activity': 'Suspicious activity detected',
      'data_breach_attempt': 'Data breach attempt detected'
    };

    this.log('error', messages[event] || event, {
      ...data,
      event: 'security_violation',
      subEvent: event,
      severity: 'high'
    });
  }

  /**
   * Log system events
   */
  logSystem(event, data = {}) {
    const messages = {
      'service_start': 'Service started',
      'service_stop': 'Service stopped',
      'service_error': 'Service error',
      'database_error': 'Database error',
      'external_api_error': 'External API error',
      'configuration_change': 'Configuration changed',
      'backup_created': 'Backup created',
      'backup_failed': 'Backup failed'
    };

    this.log('info', messages[event] || event, {
      ...data,
      event: 'system',
      subEvent: event
    });
  }

  /**
   * Log data access events
   */
  logDataAccess(event, data = {}) {
    const messages = {
      'data_read': 'Data read',
      'data_created': 'Data created',
      'data_updated': 'Data updated',
      'data_deleted': 'Data deleted',
      'bulk_operation': 'Bulk operation performed',
      'data_export': 'Data exported',
      'data_import': 'Data imported',
      'sensitive_data_access': 'Sensitive data accessed'
    };

    this.log('info', messages[event] || event, {
      ...data,
      event: 'data_access',
      subEvent: event
    });
  }

  /**
   * Log API events
   */
  logAPI(event, data = {}) {
    const messages = {
      'api_request': 'API request received',
      'api_response': 'API response sent',
      'api_error': 'API error occurred',
      'api_timeout': 'API request timeout',
      'api_rate_limited': 'API rate limited',
      'api_validation_failed': 'API validation failed',
      'api_authentication_failed': 'API authentication failed'
    };

    this.log('info', messages[event] || event, {
      ...data,
      event: 'api',
      subEvent: event
    });
  }

  /**
   * Log performance events
   */
  logPerformance(event, data = {}) {
    const messages = {
      'slow_query': 'Slow database query detected',
      'high_memory_usage': 'High memory usage detected',
      'cpu_high': 'High CPU usage detected',
      'disk_space_low': 'Low disk space detected',
      'connection_pool_exhausted': 'Connection pool exhausted',
      'cache_miss': 'Cache miss occurred',
      'cache_hit': 'Cache hit occurred'
    };

    this.log('warn', messages[event] || event, {
      ...data,
      event: 'performance',
      subEvent: event
    });
  }

  /**
   * Get security metrics
   */
  getSecurityMetrics(date = null) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const logFile = path.join(this.options.logDir, `security-${targetDate}.log`);
    
    if (!fs.existsSync(logFile)) {
      return {
        totalEvents: 0,
        eventsByType: {},
        eventsByLevel: {},
        topIPs: [],
        topUsers: [],
        violations: 0
      };
    }

    try {
      const logContent = fs.readFileSync(logFile, 'utf8');
      const lines = logContent.split('\n').filter(line => line.trim());
      
      const events = lines.map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      }).filter(event => event);

      const metrics = {
        totalEvents: events.length,
        eventsByType: {},
        eventsByLevel: {},
        topIPs: [],
        topUsers: [],
        violations: 0
      };

      // Process events
      events.forEach(event => {
        // Count by type
        const eventType = event.event || 'unknown';
        metrics.eventsByType[eventType] = (metrics.eventsByType[eventType] || 0) + 1;
        
        // Count by level
        const level = event.level || 'unknown';
        metrics.eventsByLevel[level] = (metrics.eventsByLevel[level] || 0) + 1;
        
        // Count violations
        if (event.event === 'security_violation') {
          metrics.violations++;
        }
      });

      return metrics;
    } catch (error) {
      console.error('Failed to read security metrics:', error);
      return {
        totalEvents: 0,
        eventsByType: {},
        eventsByLevel: {},
        topIPs: [],
        topUsers: [],
        violations: 0
      };
    }
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
 * Factory function to create security logger
 */
const createSecurityLogger = (options = {}) => {
  return new SecurityLogger(options);
};

module.exports = {
  SecurityLogger,
  createSecurityLogger
};
