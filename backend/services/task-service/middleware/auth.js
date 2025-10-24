const { createAuthMiddleware } = require('../../../shared');

// Create auth middleware for Task Service (service-to-service verification)
const auth = createAuthMiddleware({
  verifyMode: 'service',
  userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:3001'
});

module.exports = auth;

