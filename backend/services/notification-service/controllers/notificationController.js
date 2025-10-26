const notificationService = require('../services/notificationService');
const { validationResult } = require('express-validator');

class NotificationController {
  /**
   * Create a new notification
   */
  async createNotification(req, res) {
    try {
      console.log('Notification controller - createNotification called:', {
        body: req.body,
        user: req.user,
        hasAuthHeader: !!req.header('Authorization')
      });
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId, taskId, type, title, message, priority = 'medium', metadata = {} } = req.body;
      
      console.log('Creating notification with data:', {
        userId,
        taskId,
        type,
        title,
        message,
        priority,
        metadata
      });
      
      const notification = await notificationService.createNotification({
        userId,
        taskId,
        type,
        title,
        message,
        priority,
        metadata,
        isRead: false
      });
      
      console.log('Notification created successfully:', notification);
      
      res.status(201).json({
        message: 'Notification created successfully',
        notification
      });
    } catch (error) {
      console.error('Create notification error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(req, res) {
    try {
      const { page = 1, limit = 10, type, status = 'unread' } = req.query;
      
      const result = await notificationService.getUserNotifications({
        userId: req.user._id,
        page: parseInt(page),
        limit: parseInt(limit),
        type,
        status
      });
      
      res.json(result);
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Get notification by ID
   */
  async getNotificationById(req, res) {
    try {
      const { id } = req.params;
      
      const notification = await notificationService.getNotificationById(id, req.user._id);
      
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      
      res.json({ notification });
    } catch (error) {
      console.error('Get notification error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      
      const notification = await notificationService.markAsRead(id, req.user._id);
      
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      
      res.json({
        message: 'Notification marked as read',
        notification
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(req, res) {
    try {
      const count = await notificationService.markAllAsRead(req.user._id);
      
      res.json({
        message: 'All notifications marked as read',
        count
      });
    } catch (error) {
      console.error('Mark all as read error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await notificationService.deleteNotification(id, req.user._id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      
      res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
      console.error('Delete notification error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Delete all notifications
   */
  async deleteAllNotifications(req, res) {
    try {
      const count = await notificationService.deleteAllNotifications(req.user._id);
      
      res.json({
        message: 'All notifications deleted successfully',
        count
      });
    } catch (error) {
      console.error('Delete all notifications error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(req, res) {
    try {
      const stats = await notificationService.getNotificationStats(req.user._id);
      
      res.json({ stats });
    } catch (error) {
      console.error('Get notification stats error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new NotificationController();
