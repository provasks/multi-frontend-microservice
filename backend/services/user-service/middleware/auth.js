const { createAuthMiddleware } = require('../../../shared');

// Create auth middleware for User Service (direct JWT verification)
const auth = createAuthMiddleware({
  verifyMode: 'direct',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key'
});

module.exports = auth;

