const axios = require('axios');
const crypto = require('crypto');

/**
 * Security Testing Utilities
 * Comprehensive security testing and vulnerability assessment
 */
class SecurityTesting {
  constructor(options = {}) {
    this.options = {
      baseUrl: options.baseUrl || 'http://localhost:3000',
      timeout: options.timeout || 5000,
      enableLogging: options.enableLogging !== false,
      ...options
    };
  }

  /**
   * Test XSS vulnerabilities
   */
  async testXSSVulnerabilities(endpoints = []) {
    const results = [];
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src="x" onerror="alert(\'XSS\')">',
      'javascript:alert("XSS")',
      '<svg onload="alert(\'XSS\')">',
      '<iframe src="javascript:alert(\'XSS\')">',
      '"><script>alert("XSS")</script>',
      "'><script>alert('XSS')</script>",
      '"><img src="x" onerror="alert("XSS")">',
      "'><img src='x' onerror='alert(\"XSS\")'>",
      '"><svg onload="alert("XSS")">'
    ];

    for (const endpoint of endpoints) {
      for (const payload of xssPayloads) {
        try {
          const response = await this.sendTestRequest(endpoint, { test: payload });
          
          if (this.detectXSSInResponse(response, payload)) {
            results.push({
              type: 'XSS',
              endpoint,
              payload,
              severity: 'high',
              description: 'XSS vulnerability detected',
              response: response.data
            });
          }
        } catch (error) {
          // Log error but continue testing
          console.error(`XSS test error for ${endpoint}:`, error.message);
        }
      }
    }

    return results;
  }

  /**
   * Test SQL injection vulnerabilities
   */
  async testSQLInjection(endpoints = []) {
    const results = [];
    const sqlPayloads = [
      "' OR '1'='1",
      "' OR 1=1--",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM users--",
      "' OR 'x'='x",
      "1' OR '1'='1",
      "admin'--",
      "' OR 1=1#",
      "' OR 'a'='a",
      "1' OR 1=1--"
    ];

    for (const endpoint of endpoints) {
      for (const payload of sqlPayloads) {
        try {
          const response = await this.sendTestRequest(endpoint, { query: payload });
          
          if (this.detectSQLInjectionInResponse(response, payload)) {
            results.push({
              type: 'SQL_INJECTION',
              endpoint,
              payload,
              severity: 'high',
              description: 'SQL injection vulnerability detected',
              response: response.data
            });
          }
        } catch (error) {
          console.error(`SQL injection test error for ${endpoint}:`, error.message);
        }
      }
    }

    return results;
  }

  /**
   * Test NoSQL injection vulnerabilities
   */
  async testNoSQLInjection(endpoints = []) {
    const results = [];
    const nosqlPayloads = [
      { $where: '1==1' },
      { $ne: null },
      { $regex: '.*' },
      { $exists: true },
      { $or: [{ username: 'admin' }, { password: 'admin' }] },
      { $where: 'this.username == this.password' },
      { $where: '1==1' },
      { $ne: '' },
      { $regex: '^.*$' },
      { $exists: false }
    ];

    for (const endpoint of endpoints) {
      for (const payload of nosqlPayloads) {
        try {
          const response = await this.sendTestRequest(endpoint, payload);
          
          if (this.detectNoSQLInjectionInResponse(response, payload)) {
            results.push({
              type: 'NOSQL_INJECTION',
              endpoint,
              payload,
              severity: 'high',
              description: 'NoSQL injection vulnerability detected',
              response: response.data
            });
          }
        } catch (error) {
          console.error(`NoSQL injection test error for ${endpoint}:`, error.message);
        }
      }
    }

    return results;
  }

  /**
   * Test authentication bypass
   */
  async testAuthenticationBypass(endpoints = []) {
    const results = [];
    const bypassPayloads = [
      { Authorization: 'Bearer invalid-token' },
      { Authorization: 'Bearer ' },
      { Authorization: 'Basic invalid' },
      { 'X-API-Key': 'invalid-key' },
      { 'X-API-Key': '' },
      { 'X-Forwarded-For': '127.0.0.1' },
      { 'X-Real-IP': '127.0.0.1' },
      { 'X-Original-IP': '127.0.0.1' }
    ];

    for (const endpoint of endpoints) {
      for (const payload of bypassPayloads) {
        try {
          const response = await this.sendTestRequest(endpoint, {}, payload);
          
          if (response.status === 200 && !this.isErrorResponse(response)) {
            results.push({
              type: 'AUTH_BYPASS',
              endpoint,
              payload,
              severity: 'high',
              description: 'Authentication bypass vulnerability detected',
              response: response.data
            });
          }
        } catch (error) {
          console.error(`Auth bypass test error for ${endpoint}:`, error.message);
        }
      }
    }

    return results;
  }

  /**
   * Test rate limiting
   */
  async testRateLimiting(endpoint, maxRequests = 100) {
    const results = [];
    const requests = [];
    
    // Send multiple requests rapidly
    for (let i = 0; i < maxRequests; i++) {
      requests.push(this.sendTestRequest(endpoint, { test: i }));
    }
    
    try {
      const responses = await Promise.all(requests);
      
      const rateLimited = responses.some(response => 
        response.status === 429 || 
        response.headers['x-ratelimit-remaining'] === '0'
      );
      
      if (!rateLimited) {
        results.push({
          type: 'RATE_LIMIT_BYPASS',
          endpoint,
          severity: 'medium',
          description: 'Rate limiting not properly implemented',
          requestsSent: maxRequests,
          responses: responses.length
        });
      }
    } catch (error) {
      console.error(`Rate limiting test error for ${endpoint}:`, error.message);
    }
    
    return results;
  }

  /**
   * Test file upload vulnerabilities
   */
  async testFileUploadVulnerabilities(endpoint) {
    const results = [];
    const maliciousFiles = [
      { name: 'test.php', content: '<?php system($_GET["cmd"]); ?>', type: 'application/x-php' },
      { name: 'test.jsp', content: '<% Runtime.getRuntime().exec(request.getParameter("cmd")); %>', type: 'application/x-jsp' },
      { name: 'test.asp', content: '<% eval request("cmd") %>', type: 'application/x-asp' },
      { name: 'test.exe', content: 'MZ', type: 'application/x-executable' },
      { name: 'test.bat', content: '@echo off\nnet user hacker password /add', type: 'application/x-bat' },
      { name: 'test.cmd', content: '@echo off\nnet user hacker password /add', type: 'application/x-cmd' }
    ];

    for (const file of maliciousFiles) {
      try {
        const formData = new FormData();
        formData.append('file', new Blob([file.content], { type: file.type }), file.name);
        
        const response = await axios.post(`${this.options.baseUrl}${endpoint}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: this.options.timeout
        });
        
        if (response.status === 200 && !this.isErrorResponse(response)) {
          results.push({
            type: 'FILE_UPLOAD_VULNERABILITY',
            endpoint,
            file: file.name,
            severity: 'high',
            description: 'Malicious file upload accepted',
            response: response.data
          });
        }
      } catch (error) {
        console.error(`File upload test error for ${endpoint}:`, error.message);
      }
    }
    
    return results;
  }

  /**
   * Test CORS vulnerabilities
   */
  async testCORSVulnerabilities(endpoints = []) {
    const results = [];
    const origins = [
      'https://evil.com',
      'http://evil.com',
      'https://attacker.com',
      'null',
      'https://subdomain.evil.com',
      'https://evil.com:8080'
    ];

    for (const endpoint of endpoints) {
      for (const origin of origins) {
        try {
          const response = await axios.options(`${this.options.baseUrl}${endpoint}`, {
            headers: {
              'Origin': origin,
              'Access-Control-Request-Method': 'POST',
              'Access-Control-Request-Headers': 'Content-Type'
            },
            timeout: this.options.timeout
          });
          
          const corsHeaders = {
            'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
            'Access-Control-Allow-Credentials': response.headers['access-control-allow-credentials'],
            'Access-Control-Allow-Methods': response.headers['access-control-allow-methods']
          };
          
          if (this.detectCORSVulnerability(corsHeaders, origin)) {
            results.push({
              type: 'CORS_VULNERABILITY',
              endpoint,
              origin,
              severity: 'medium',
              description: 'CORS misconfiguration detected',
              corsHeaders
            });
          }
        } catch (error) {
          console.error(`CORS test error for ${endpoint}:`, error.message);
        }
      }
    }
    
    return results;
  }

  /**
   * Test security headers
   */
  async testSecurityHeaders(endpoints = []) {
    const results = [];
    const requiredHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security',
      'Content-Security-Policy',
      'Referrer-Policy'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await this.sendTestRequest(endpoint);
        const missingHeaders = [];
        
        requiredHeaders.forEach(header => {
          if (!response.headers[header.toLowerCase()]) {
            missingHeaders.push(header);
          }
        });
        
        if (missingHeaders.length > 0) {
          results.push({
            type: 'MISSING_SECURITY_HEADERS',
            endpoint,
            missingHeaders,
            severity: 'medium',
            description: 'Missing security headers',
            headers: response.headers
          });
        }
      } catch (error) {
        console.error(`Security headers test error for ${endpoint}:`, error.message);
      }
    }
    
    return results;
  }

  /**
   * Run comprehensive security test suite
   */
  async runSecurityTestSuite(config = {}) {
    const {
      endpoints = ['/api/users', '/api/tasks', '/api/notifications'],
      includeXSS = true,
      includeSQL = true,
      includeNoSQL = true,
      includeAuthBypass = true,
      includeRateLimit = true,
      includeFileUpload = true,
      includeCORS = true,
      includeHeaders = true
    } = config;

    const results = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {
        total: 0,
        vulnerabilities: 0,
        high: 0,
        medium: 0,
        low: 0
      }
    };

    // XSS Testing
    if (includeXSS) {
      console.log('Testing XSS vulnerabilities...');
      const xssResults = await this.testXSSVulnerabilities(endpoints);
      results.tests.push(...xssResults);
    }

    // SQL Injection Testing
    if (includeSQL) {
      console.log('Testing SQL injection vulnerabilities...');
      const sqlResults = await this.testSQLInjection(endpoints);
      results.tests.push(...sqlResults);
    }

    // NoSQL Injection Testing
    if (includeNoSQL) {
      console.log('Testing NoSQL injection vulnerabilities...');
      const nosqlResults = await this.testNoSQLInjection(endpoints);
      results.tests.push(...nosqlResults);
    }

    // Authentication Bypass Testing
    if (includeAuthBypass) {
      console.log('Testing authentication bypass...');
      const authResults = await this.testAuthenticationBypass(endpoints);
      results.tests.push(...authResults);
    }

    // Rate Limiting Testing
    if (includeRateLimit) {
      console.log('Testing rate limiting...');
      for (const endpoint of endpoints) {
        const rateLimitResults = await this.testRateLimiting(endpoint);
        results.tests.push(...rateLimitResults);
      }
    }

    // File Upload Testing
    if (includeFileUpload) {
      console.log('Testing file upload vulnerabilities...');
      for (const endpoint of endpoints) {
        const fileUploadResults = await this.testFileUploadVulnerabilities(endpoint);
        results.tests.push(...fileUploadResults);
      }
    }

    // CORS Testing
    if (includeCORS) {
      console.log('Testing CORS vulnerabilities...');
      const corsResults = await this.testCORSVulnerabilities(endpoints);
      results.tests.push(...corsResults);
    }

    // Security Headers Testing
    if (includeHeaders) {
      console.log('Testing security headers...');
      const headerResults = await this.testSecurityHeaders(endpoints);
      results.tests.push(...headerResults);
    }

    // Calculate summary
    results.summary.total = results.tests.length;
    results.summary.vulnerabilities = results.tests.length;
    results.summary.high = results.tests.filter(t => t.severity === 'high').length;
    results.summary.medium = results.tests.filter(t => t.severity === 'medium').length;
    results.summary.low = results.tests.filter(t => t.severity === 'low').length;

    return results;
  }

  /**
   * Send test request
   */
  async sendTestRequest(endpoint, data = {}, headers = {}) {
    try {
      const response = await axios.post(`${this.options.baseUrl}${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        timeout: this.options.timeout,
        validateStatus: () => true // Accept all status codes
      });
      
      return response;
    } catch (error) {
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  /**
   * Detect XSS in response
   */
  detectXSSInResponse(response, payload) {
    const responseText = JSON.stringify(response.data);
    return responseText.includes(payload) || responseText.includes('alert(');
  }

  /**
   * Detect SQL injection in response
   */
  detectSQLInjectionInResponse(response, payload) {
    const responseText = JSON.stringify(response.data);
    const sqlErrorPatterns = [
      /mysql/i,
      /sqlite/i,
      /postgresql/i,
      /oracle/i,
      /sql server/i,
      /syntax error/i,
      /sql error/i
    ];
    
    return sqlErrorPatterns.some(pattern => pattern.test(responseText));
  }

  /**
   * Detect NoSQL injection in response
   */
  detectNoSQLInjectionInResponse(response, payload) {
    const responseText = JSON.stringify(response.data);
    const nosqlErrorPatterns = [
      /mongo/i,
      /mongodb/i,
      /nosql/i,
      /bson/i,
      /objectid/i
    ];
    
    return nosqlErrorPatterns.some(pattern => pattern.test(responseText));
  }

  /**
   * Check if response is an error
   */
  isErrorResponse(response) {
    return response.status >= 400 || 
           (response.data && (response.data.error || response.data.message));
  }

  /**
   * Detect CORS vulnerability
   */
  detectCORSVulnerability(corsHeaders, origin) {
    const allowOrigin = corsHeaders['Access-Control-Allow-Origin'];
    const allowCredentials = corsHeaders['Access-Control-Allow-Credentials'];
    
    // Check for wildcard with credentials
    if (allowOrigin === '*' && allowCredentials === 'true') {
      return true;
    }
    
    // Check for null origin
    if (allowOrigin === 'null') {
      return true;
    }
    
    // Check for overly permissive origins
    if (allowOrigin && allowOrigin.includes('*')) {
      return true;
    }
    
    return false;
  }
}

/**
 * Factory function to create security testing
 */
const createSecurityTesting = (options = {}) => {
  return new SecurityTesting(options);
};

module.exports = {
  SecurityTesting,
  createSecurityTesting
};
