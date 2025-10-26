const helmet = require('helmet');
const express = require('express');

/**
 * Security Middleware
 * Comprehensive security headers and protection
 */
class SecurityMiddleware {
  constructor(options = {}) {
    this.options = {
      enableHelmet: options.enableHelmet !== false,
      enableCORS: options.enableCORS !== false,
      enableRateLimit: options.enableRateLimit !== false,
      ...options
    };
  }

  /**
   * Get Helmet configuration for security headers
   */
  getHelmetConfig() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", "http://localhost:*", "ws://localhost:*"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: []
        }
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    });
  }

  /**
   * Get CORS configuration
   */
  getCORSConfig() {
    return {
      origin: this.options.corsOrigins || [
        'http://localhost:3000',
        'http://localhost:4000',
        'http://localhost:4001',
        'http://localhost:4002',
        'http://localhost:4003',
        'http://localhost:4004'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'X-API-Key',
        'X-Forwarded-For',
        'X-Real-IP'
      ],
      exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
      maxAge: 86400 // 24 hours
    };
  }

  /**
   * Get rate limiting configuration
   */
  getRateLimitConfig() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Temporarily disable rate limiting in development
    if (isDevelopment) {
      return {
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 10000, // Very high limit
        message: {
          error: 'Rate limiting temporarily disabled in development',
          retryAfter: '1 second'
        },
        standardHeaders: true,
        legacyHeaders: false,
        skip: () => true // Skip all rate limiting in development
      };
    }
    
    return {
      windowMs: 15 * 60 * 1000, // 15 minutes in prod
      max: 100, // 100 requests in prod
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) => {
        // Skip rate limiting for health checks and API docs
        if (req.path === '/health' || req.path === '/api-docs') {
          return true;
        }
        return false;
      }
    };
  }

  /**
   * Get login rate limiting configuration
   */
  getLoginRateLimitConfig() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Temporarily disable login rate limiting in development
    if (isDevelopment) {
      return {
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 10000, // Very high limit
        message: {
          error: 'Login rate limiting temporarily disabled in development',
          retryAfter: '1 second'
        },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: true,
        skip: () => true // Skip all login rate limiting in development
      };
    }
    
    return {
      windowMs: 15 * 60 * 1000, // 15 minutes in prod
      max: 5, // 5 attempts in prod
      message: {
        error: 'Too many login attempts, please try again later.',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: true
    };
  }

  /**
   * Security middleware setup
   */
  setupSecurity(app) {
    // 1. Helmet for security headers
    if (this.options.enableHelmet) {
      app.use(this.getHelmetConfig());
    }

    // 2. Trust proxy for accurate IP addresses
    app.set('trust proxy', 1);

    // 3. Additional security headers
    app.use((req, res, next) => {
      // Remove X-Powered-By header
      res.removeHeader('X-Powered-By');
      
      // Add custom security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
      
      next();
    });

    // 4. Request size limiting
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    return app;
  }

  /**
   * CORS middleware setup
   */
  setupCORS(app) {
    if (this.options.enableCORS) {
      const cors = require('cors');
      app.use(cors(this.getCORSConfig()));
    }
    return app;
  }

  /**
   * Rate limiting middleware setup
   */
  setupRateLimit(app) {
    if (this.options.enableRateLimit) {
      const rateLimit = require('express-rate-limit');
      
      // General rate limiting
      app.use(rateLimit(this.getRateLimitConfig()));
      
      // Login-specific rate limiting
      app.use('/api/auth/login', rateLimit(this.getLoginRateLimitConfig()));
      app.use('/api/auth/register', rateLimit(this.getLoginRateLimitConfig()));
    }
    return app;
  }

  /**
   * Complete security setup
   */
  setupCompleteSecurity(app) {
    this.setupSecurity(app);
    this.setupCORS(app);
    this.setupRateLimit(app);
    return app;
  }
}

/**
 * Factory function to create security middleware
 */
const createSecurityMiddleware = (options = {}) => {
  return new SecurityMiddleware(options);
};

module.exports = {
  SecurityMiddleware,
  createSecurityMiddleware
};
