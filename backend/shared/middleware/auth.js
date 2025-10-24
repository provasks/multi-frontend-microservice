const jwt = require('jsonwebtoken');
const axios = require('axios');

/**
 * Shared Authentication Middleware
 * Supports both direct JWT verification and service-to-service verification
 */
class AuthMiddleware {
  constructor(options = {}) {
    this.jwtSecret = options.jwtSecret || process.env.JWT_SECRET || 'your-secret-key';
    this.userServiceUrl = options.userServiceUrl || process.env.USER_SERVICE_URL || 'http://localhost:3001';
    this.verifyMode = options.verifyMode || 'service'; // 'direct' or 'service'
  }

  /**
   * Direct JWT verification (for User Service)
   */
  async verifyDirectToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      
      // For direct verification, we need the User model
      const User = require('../../services/user-service/models/User');
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        throw new Error('Token is no longer valid');
      }

      return {
        userId: decoded.userId,
        email: decoded.email,
        role: user.role
      };
    } catch (error) {
      throw new Error('Token is not valid');
    }
  }

  /**
   * Service-to-service verification (for Task/Notification Services)
   */
  async verifyServiceToken(token) {
    try {
      const response = await axios.get(`${this.userServiceUrl}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.valid) {
        return response.data.user;
      } else {
        throw new Error('Token is not valid');
      }
    } catch (error) {
      throw new Error('Token verification failed');
    }
  }

  /**
   * Main authentication middleware
   */
  middleware() {
    return async (req, res, next) => {
      try {
        const authHeader = req.header('Authorization');
        const token = authHeader?.replace('Bearer ', '');
        
        if (!token) {
          return res.status(401).json({ error: 'No token, authorization denied' });
        }

        let user;
        if (this.verifyMode === 'direct') {
          user = await this.verifyDirectToken(token);
        } else {
          user = await this.verifyServiceToken(token);
        }

        req.user = user;
        next();
      } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: error.message || 'Token is not valid' });
      }
    };
  }
}

/**
 * Factory function to create auth middleware instances
 */
const createAuthMiddleware = (options = {}) => {
  const authMiddleware = new AuthMiddleware(options);
  return authMiddleware.middleware();
};

module.exports = {
  AuthMiddleware,
  createAuthMiddleware
};
