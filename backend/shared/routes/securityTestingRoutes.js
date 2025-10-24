const express = require('express');
const { createSecurityTesting } = require('../utils/securityTesting');
const { createSecurityMonitoring } = require('../utils/securityMonitoring');
const { ResponseUtils } = require('../utils/response');

/**
 * Security Testing Routes
 * Security testing and monitoring endpoints
 */
const createSecurityTestingRoutes = (options = {}) => {
  const router = express.Router();
  const securityTesting = createSecurityTesting(options);
  const securityMonitoring = createSecurityMonitoring(options);

  /**
   * Run security test suite endpoint
   */
  router.post('/test-suite', async (req, res) => {
    try {
      const { config = {} } = req.body;
      
      const results = await securityTesting.runSecurityTestSuite(config);
      
      ResponseUtils.success(res, results, 'Security test suite completed');
    } catch (error) {
      console.error('Security test suite error:', error);
      ResponseUtils.error(res, 'Failed to run security test suite', 500);
    }
  });

  /**
   * Test XSS vulnerabilities endpoint
   */
  router.post('/test-xss', async (req, res) => {
    try {
      const { endpoints = ['/api/users', '/api/tasks'] } = req.body;
      
      const results = await securityTesting.testXSSVulnerabilities(endpoints);
      
      ResponseUtils.success(res, results, 'XSS vulnerability testing completed');
    } catch (error) {
      console.error('XSS testing error:', error);
      ResponseUtils.error(res, 'Failed to test XSS vulnerabilities', 500);
    }
  });

  /**
   * Test SQL injection vulnerabilities endpoint
   */
  router.post('/test-sql-injection', async (req, res) => {
    try {
      const { endpoints = ['/api/users', '/api/tasks'] } = req.body;
      
      const results = await securityTesting.testSQLInjection(endpoints);
      
      ResponseUtils.success(res, results, 'SQL injection testing completed');
    } catch (error) {
      console.error('SQL injection testing error:', error);
      ResponseUtils.error(res, 'Failed to test SQL injection vulnerabilities', 500);
    }
  });

  /**
   * Test NoSQL injection vulnerabilities endpoint
   */
  router.post('/test-nosql-injection', async (req, res) => {
    try {
      const { endpoints = ['/api/users', '/api/tasks'] } = req.body;
      
      const results = await securityTesting.testNoSQLInjection(endpoints);
      
      ResponseUtils.success(res, results, 'NoSQL injection testing completed');
    } catch (error) {
      console.error('NoSQL injection testing error:', error);
      ResponseUtils.error(res, 'Failed to test NoSQL injection vulnerabilities', 500);
    }
  });

  /**
   * Test authentication bypass endpoint
   */
  router.post('/test-auth-bypass', async (req, res) => {
    try {
      const { endpoints = ['/api/users', '/api/tasks'] } = req.body;
      
      const results = await securityTesting.testAuthenticationBypass(endpoints);
      
      ResponseUtils.success(res, results, 'Authentication bypass testing completed');
    } catch (error) {
      console.error('Auth bypass testing error:', error);
      ResponseUtils.error(res, 'Failed to test authentication bypass', 500);
    }
  });

  /**
   * Test rate limiting endpoint
   */
  router.post('/test-rate-limiting', async (req, res) => {
    try {
      const { endpoint, maxRequests = 100 } = req.body;
      
      if (!endpoint) {
        return ResponseUtils.validationError(res, [{
          field: 'endpoint',
          message: 'Endpoint is required'
        }], 'Validation failed');
      }
      
      const results = await securityTesting.testRateLimiting(endpoint, maxRequests);
      
      ResponseUtils.success(res, results, 'Rate limiting testing completed');
    } catch (error) {
      console.error('Rate limiting testing error:', error);
      ResponseUtils.error(res, 'Failed to test rate limiting', 500);
    }
  });

  /**
   * Test file upload vulnerabilities endpoint
   */
  router.post('/test-file-upload', async (req, res) => {
    try {
      const { endpoint } = req.body;
      
      if (!endpoint) {
        return ResponseUtils.validationError(res, [{
          field: 'endpoint',
          message: 'Endpoint is required'
        }], 'Validation failed');
      }
      
      const results = await securityTesting.testFileUploadVulnerabilities(endpoint);
      
      ResponseUtils.success(res, results, 'File upload vulnerability testing completed');
    } catch (error) {
      console.error('File upload testing error:', error);
      ResponseUtils.error(res, 'Failed to test file upload vulnerabilities', 500);
    }
  });

  /**
   * Test CORS vulnerabilities endpoint
   */
  router.post('/test-cors', async (req, res) => {
    try {
      const { endpoints = ['/api/users', '/api/tasks'] } = req.body;
      
      const results = await securityTesting.testCORSVulnerabilities(endpoints);
      
      ResponseUtils.success(res, results, 'CORS vulnerability testing completed');
    } catch (error) {
      console.error('CORS testing error:', error);
      ResponseUtils.error(res, 'Failed to test CORS vulnerabilities', 500);
    }
  });

  /**
   * Test security headers endpoint
   */
  router.post('/test-security-headers', async (req, res) => {
    try {
      const { endpoints = ['/api/users', '/api/tasks'] } = req.body;
      
      const results = await securityTesting.testSecurityHeaders(endpoints);
      
      ResponseUtils.success(res, results, 'Security headers testing completed');
    } catch (error) {
      console.error('Security headers testing error:', error);
      ResponseUtils.error(res, 'Failed to test security headers', 500);
    }
  });

  /**
   * Start security monitoring endpoint
   */
  router.post('/monitoring/start', (req, res) => {
    try {
      securityMonitoring.startRealTimeMonitoring();
      
      ResponseUtils.success(res, {
        monitoring: 'started',
        timestamp: new Date().toISOString()
      }, 'Security monitoring started successfully');
    } catch (error) {
      console.error('Start monitoring error:', error);
      ResponseUtils.error(res, 'Failed to start security monitoring', 500);
    }
  });

  /**
   * Stop security monitoring endpoint
   */
  router.post('/monitoring/stop', (req, res) => {
    try {
      securityMonitoring.stopMonitoring();
      
      ResponseUtils.success(res, {
        monitoring: 'stopped',
        timestamp: new Date().toISOString()
      }, 'Security monitoring stopped successfully');
    } catch (error) {
      console.error('Stop monitoring error:', error);
      ResponseUtils.error(res, 'Failed to stop security monitoring', 500);
    }
  });

  /**
   * Get monitoring status endpoint
   */
  router.get('/monitoring/status', (req, res) => {
    try {
      const status = securityMonitoring.getMonitoringStatus();
      
      ResponseUtils.success(res, status, 'Monitoring status retrieved successfully');
    } catch (error) {
      console.error('Monitoring status error:', error);
      ResponseUtils.error(res, 'Failed to retrieve monitoring status', 500);
    }
  });

  /**
   * Get security recommendations endpoint
   */
  router.get('/recommendations', (req, res) => {
    try {
      const recommendations = securityMonitoring.getSecurityRecommendations();
      
      ResponseUtils.success(res, recommendations, 'Security recommendations retrieved successfully');
    } catch (error) {
      console.error('Security recommendations error:', error);
      ResponseUtils.error(res, 'Failed to retrieve security recommendations', 500);
    }
  });

  /**
   * Run automated security scan endpoint
   */
  router.post('/scan', async (req, res) => {
    try {
      const { 
        endpoints = ['/api/users', '/api/tasks', '/api/notifications'],
        includeAll = true,
        includeXSS = true,
        includeSQL = true,
        includeNoSQL = true,
        includeAuthBypass = true,
        includeRateLimit = true,
        includeFileUpload = true,
        includeCORS = true,
        includeHeaders = true
      } = req.body;
      
      const config = {
        endpoints,
        includeXSS: includeAll || includeXSS,
        includeSQL: includeAll || includeSQL,
        includeNoSQL: includeAll || includeNoSQL,
        includeAuthBypass: includeAll || includeAuthBypass,
        includeRateLimit: includeAll || includeRateLimit,
        includeFileUpload: includeAll || includeFileUpload,
        includeCORS: includeAll || includeCORS,
        includeHeaders: includeAll || includeHeaders
      };
      
      const results = await securityTesting.runSecurityTestSuite(config);
      
      ResponseUtils.success(res, results, 'Automated security scan completed');
    } catch (error) {
      console.error('Security scan error:', error);
      ResponseUtils.error(res, 'Failed to run security scan', 500);
    }
  });

  /**
   * Get security test history endpoint
   */
  router.get('/history', (req, res) => {
    try {
      const { limit = 50 } = req.query;
      
      // This would typically retrieve from a database
      const history = {
        tests: [],
        total: 0,
        message: 'Security test history not implemented yet'
      };
      
      ResponseUtils.success(res, history, 'Security test history retrieved successfully');
    } catch (error) {
      console.error('Security test history error:', error);
      ResponseUtils.error(res, 'Failed to retrieve security test history', 500);
    }
  });

  return router;
};

module.exports = createSecurityTestingRoutes;
