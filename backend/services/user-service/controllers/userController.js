const userService = require('../services/userService');
const { validationResult } = require('express-validator');

class UserController {
  /**
   * Get all users (admin only)
   */
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, search, role } = req.query;
      
      const result = await userService.getAllUsers({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        role
      });
      
      res.json(result);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      const user = await userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ user });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(req, res) {
    try {
      const user = await userService.getUserById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ user });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Update user profile
   */
  async updateUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const updateData = req.body;
      
      // Check if user is updating their own profile or is admin
      if (id !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      const user = await userService.updateUser(id, updateData, req.user.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        message: 'User updated successfully',
        user
      });
    } catch (error) {
      console.error('Update user error:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Delete/deactivate user (admin only)
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      // Only admin can delete users
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin role required.' });
      }
      
      // Prevent admin from deleting themselves
      if (id === req.user.userId) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }
      
      const deleted = await userService.deleteUser(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Change user password
   */
  async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;
      
      // Check if user is changing their own password or is admin
      if (id !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      const success = await userService.changePassword(id, currentPassword, newPassword, req.user.role);
      
      if (!success) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      if (error.message === 'Current password is incorrect') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new UserController();
