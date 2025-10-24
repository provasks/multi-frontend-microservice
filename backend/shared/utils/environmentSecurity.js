const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Environment Security Utilities
 * Comprehensive environment security and configuration management
 */
class EnvironmentSecurity {
  constructor(options = {}) {
    this.options = {
      envFile: options.envFile || '.env',
      backupDir: options.backupDir || './env-backups',
      encryptionKey: options.encryptionKey || process.env.ENCRYPTION_KEY,
      ...options
    };

    this.ensureBackupDirectory();
  }

  /**
   * Ensure backup directory exists
   */
  ensureBackupDirectory() {
    if (!fs.existsSync(this.options.backupDir)) {
      fs.mkdirSync(this.options.backupDir, { recursive: true });
    }
  }

  /**
   * Generate secure random string
   */
  generateSecureRandom(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate secure JWT secret
   */
  generateJWTSecret() {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Generate secure API key
   */
  generateAPIKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate secure database password
   */
  generateDatabasePassword(length = 32) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  /**
   * Encrypt sensitive data
   */
  encryptData(data, key = null) {
    const encryptionKey = key || this.options.encryptionKey;
    if (!encryptionKey) {
      throw new Error('Encryption key is required');
    }

    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, encryptionKey);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  /**
   * Decrypt sensitive data
   */
  decryptData(encryptedData, key = null) {
    const encryptionKey = key || this.options.encryptionKey;
    if (!encryptionKey) {
      throw new Error('Encryption key is required');
    }

    const algorithm = 'aes-256-gcm';
    const decipher = crypto.createDecipher(algorithm, encryptionKey);
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Validate environment variables
   */
  validateEnvironment() {
    const requiredVars = [
      'NODE_ENV',
      'JWT_SECRET',
      'MONGODB_URI',
      'PORT'
    ];

    const missingVars = [];
    const weakVars = [];

    // Check for missing variables
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    });

    // Check for weak JWT secret
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      weakVars.push('JWT_SECRET');
    }

    // Check for weak database password
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('password=')) {
      const passwordMatch = process.env.MONGODB_URI.match(/password=([^&]+)/);
      if (passwordMatch && passwordMatch[1].length < 8) {
        weakVars.push('MONGODB_URI');
      }
    }

    // Check for development secrets in production
    if (process.env.NODE_ENV === 'production') {
      const devSecrets = ['your-secret-key', 'dev-secret', 'test-secret', 'localhost'];
      devSecrets.forEach(secret => {
        if (process.env.JWT_SECRET === secret) {
          weakVars.push('JWT_SECRET');
        }
        if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes(secret)) {
          weakVars.push('MONGODB_URI');
        }
      });
    }

    return {
      isValid: missingVars.length === 0 && weakVars.length === 0,
      missingVars,
      weakVars,
      recommendations: this.generateRecommendations(missingVars, weakVars)
    };
  }

  /**
   * Generate security recommendations
   */
  generateRecommendations(missingVars, weakVars) {
    const recommendations = [];

    if (missingVars.length > 0) {
      recommendations.push({
        type: 'error',
        title: 'Missing Environment Variables',
        description: `The following environment variables are missing: ${missingVars.join(', ')}`,
        action: 'Set the missing environment variables in your .env file'
      });
    }

    if (weakVars.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Weak Environment Variables',
        description: `The following environment variables have weak values: ${weakVars.join(', ')}`,
        action: 'Generate stronger values for the weak environment variables'
      });
    }

    // General recommendations
    recommendations.push({
      type: 'info',
      title: 'Environment Security Best Practices',
      description: 'Follow these best practices for environment security',
      action: 'Review and implement the recommended security measures'
    });

    return recommendations;
  }

  /**
   * Generate secure environment file
   */
  generateSecureEnvironment(options = {}) {
    const {
      nodeEnv = 'development',
      jwtSecret = this.generateJWTSecret(),
      mongodbUri = 'mongodb://localhost:27017/tms',
      port = 3000,
      encryptionKey = this.generateSecureRandom(32),
      apiKey = this.generateAPIKey(),
      databasePassword = this.generateDatabasePassword()
    } = options;

    const envContent = `# Environment Configuration
# Generated on ${new Date().toISOString()}

# Application Environment
NODE_ENV=${nodeEnv}

# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Database Configuration
MONGODB_URI=${mongodbUri}
DATABASE_PASSWORD=${databasePassword}

# Server Configuration
PORT=${port}
HOST=localhost

# Security Configuration
ENCRYPTION_KEY=${encryptionKey}
API_KEY=${apiKey}

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:4000,http://localhost:4001,http://localhost:4002,http://localhost:4003

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_LOGIN_MAX_REQUESTS=5

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
ENABLE_FILE_LOGGING=true
ENABLE_CONSOLE_LOGGING=true

# Security Headers
ENABLE_HELMET=true
ENABLE_CORS=true
ENABLE_RATE_LIMIT=true

# Service URLs
USER_SERVICE_URL=http://localhost:3001
TASK_SERVICE_URL=http://localhost:3002
NOTIFICATION_SERVICE_URL=http://localhost:3003
API_GATEWAY_URL=http://localhost:3000

# Monitoring
ENABLE_SECURITY_MONITORING=true
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_THREAT_DETECTION=true

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_INTERVAL=24h
BACKUP_RETENTION_DAYS=30
`;

    return envContent;
  }

  /**
   * Backup current environment
   */
  backupEnvironment() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(this.options.backupDir, `env-backup-${timestamp}.env`);
    
    if (fs.existsSync(this.options.envFile)) {
      const envContent = fs.readFileSync(this.options.envFile, 'utf8');
      fs.writeFileSync(backupFile, envContent);
      return backupFile;
    }
    
    return null;
  }

  /**
   * Restore environment from backup
   */
  restoreEnvironment(backupFile) {
    if (fs.existsSync(backupFile)) {
      const envContent = fs.readFileSync(backupFile, 'utf8');
      fs.writeFileSync(this.options.envFile, envContent);
      return true;
    }
    
    return false;
  }

  /**
   * List available backups
   */
  listBackups() {
    const backupFiles = fs.readdirSync(this.options.backupDir)
      .filter(file => file.startsWith('env-backup-') && file.endsWith('.env'))
      .map(file => {
        const filePath = path.join(this.options.backupDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          path: filePath,
          created: stats.birthtime,
          size: stats.size
        };
      })
      .sort((a, b) => b.created - a.created);

    return backupFiles;
  }

  /**
   * Clean old backups
   */
  cleanOldBackups(retentionDays = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    const backups = this.listBackups();
    const oldBackups = backups.filter(backup => backup.created < cutoffDate);
    
    oldBackups.forEach(backup => {
      fs.unlinkSync(backup.path);
      console.log(`Deleted old backup: ${backup.filename}`);
    });
    
    return oldBackups.length;
  }

  /**
   * Validate environment file
   */
  validateEnvironmentFile() {
    if (!fs.existsSync(this.options.envFile)) {
      return {
        isValid: false,
        errors: ['Environment file does not exist'],
        warnings: [],
        recommendations: ['Create a .env file with required environment variables']
      };
    }

    const envContent = fs.readFileSync(this.options.envFile, 'utf8');
    const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    const errors = [];
    const warnings = [];
    const recommendations = [];

    // Check for duplicate variables
    const variables = {};
    lines.forEach((line, index) => {
      const [key] = line.split('=');
      if (key) {
        if (variables[key]) {
          errors.push(`Duplicate variable '${key}' found on line ${index + 1}`);
        } else {
          variables[key] = true;
        }
      }
    });

    // Check for empty values
    lines.forEach((line, index) => {
      if (line.includes('=') && line.endsWith('=')) {
        warnings.push(`Empty value for variable on line ${index + 1}`);
      }
    });

    // Check for weak secrets
    lines.forEach((line, index) => {
      if (line.includes('JWT_SECRET=') && line.length < 50) {
        warnings.push(`Weak JWT_SECRET on line ${index + 1}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      recommendations: [
        'Use strong, unique values for all secrets',
        'Regularly rotate sensitive credentials',
        'Never commit .env files to version control',
        'Use environment-specific configuration files'
      ]
    };
  }

  /**
   * Generate environment security report
   */
  generateSecurityReport() {
    const validation = this.validateEnvironment();
    const fileValidation = this.validateEnvironmentFile();
    const backups = this.listBackups();

    return {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT,
        host: process.env.HOST
      },
      validation,
      fileValidation,
      backups: {
        count: backups.length,
        latest: backups[0]?.created,
        totalSize: backups.reduce((sum, backup) => sum + backup.size, 0)
      },
      securityScore: this.calculateSecurityScore(validation, fileValidation),
      recommendations: [
        ...validation.recommendations,
        ...fileValidation.recommendations
      ]
    };
  }

  /**
   * Calculate security score
   */
  calculateSecurityScore(validation, fileValidation) {
    let score = 100;
    
    // Deduct for missing variables
    score -= validation.missingVars.length * 20;
    
    // Deduct for weak variables
    score -= validation.weakVars.length * 10;
    
    // Deduct for file validation errors
    score -= fileValidation.errors.length * 15;
    
    // Deduct for file validation warnings
    score -= fileValidation.warnings.length * 5;
    
    return Math.max(score, 0);
  }
}

/**
 * Factory function to create environment security
 */
const createEnvironmentSecurity = (options = {}) => {
  return new EnvironmentSecurity(options);
};

module.exports = {
  EnvironmentSecurity,
  createEnvironmentSecurity
};
