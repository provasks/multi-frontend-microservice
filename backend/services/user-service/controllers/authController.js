const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const { validationResult } = require('express-validator');

class AuthController {
  /**
   * Register a new user
   */
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email, username, password } = req.body;
      
      const user = await userService.createUser({
        firstName,
        lastName,
        email,
        username,
        password
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        message: 'User registered successfully',
        user,
        token
      });
    } catch (error) {
      console.error('Register error:', error);
      if (error.message === 'User with this email or username already exists') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Login user
   */
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      
      const user = await userService.authenticateUser(email, password);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      res.json({
        message: 'Login successful',
        user,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Get current user profile
   */
  async getMe(req, res) {
    try {
      const user = await userService.getUserById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ user });
    } catch (error) {
      console.error('Get me error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Verify JWT token
   */
  async verifyToken(req, res) {
    try {
      const user = await userService.getUserById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        valid: true,
        user
      });
    } catch (error) {
      console.error('Verify token error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new AuthController();
