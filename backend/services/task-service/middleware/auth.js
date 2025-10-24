const jwt = require('jsonwebtoken');
const axios = require('axios');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Verify token with User Service
    try {
      const response = await axios.get(`${process.env.USER_SERVICE_URL || 'http://localhost:3001'}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.valid) {
        req.user = response.data.user;
        next();
      } else {
        return res.status(401).json({ error: 'Token is not valid' });
      }
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ error: 'Token verification failed' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = auth;

