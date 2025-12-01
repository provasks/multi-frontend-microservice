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
      
      // Set HttpOnly cookie for registered users (auto-login)
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/'
      });
      
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          role: user.role,
          isActive: user.isActive
        }
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
      // Log the incoming request for debugging
      console.log('Login request received');
      console.log('Request body:', req.body);
      console.log('Request headers:', req.headers);
      console.log('Content-Type:', req.headers['content-type']);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Login validation errors:', JSON.stringify(errors.array(), null, 2));
        return res.status(400).json({ 
          error: 'Validation failed',
          errors: errors.array() 
        });
      }

      const { email, password } = req.body;
      
      // Log the received data for debugging
      console.log('Login attempt for email:', email);
      
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
      
      // Set HttpOnly cookie instead of returning token in body
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('authToken', token, {
        httpOnly: true,        // Prevents JavaScript access
        secure: isProduction,  // Only sent over HTTPS in production
        sameSite: isProduction ? 'strict' : 'lax', // CSRF protection
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/'              // Available to all routes
      });
      
      // Return user data (no token in response)
      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          role: user.role,
          isActive: user.isActive
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Logout user
   */
  async logout(req, res) {
    try {
      // Clear the HttpOnly cookie - options must EXACTLY match the cookie settings
      const isProduction = process.env.NODE_ENV === 'production';
      
      // Method 1: Clear cookie with exact same options as when it was set
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/'
      });
      
      // Method 2: Set cookie to empty with immediate expiration (backup method)
      // This ensures cookie is cleared even if clearCookie doesn't work
      res.cookie('authToken', '', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
        expires: new Date(0),  // Expire immediately (Jan 1, 1970)
        maxAge: 0  // Also set maxAge to 0
      });
      
      res.json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
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

  /**
   * Reset password (forgot password)
   */
  async resetPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, newPassword } = req.body;
      
      const result = await userService.resetPasswordByEmail(email, newPassword);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      
      // In development, return the new password
      // In production, you would send an email with reset link instead
      res.json({
        message: 'Password reset successfully',
        newPassword: result.newPassword, // Only for development
        user: result.user
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new AuthController();
