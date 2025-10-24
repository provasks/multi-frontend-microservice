const Notification = require('../models/Notification');

class NotificationService {
  /**
   * Get user notifications with pagination and filtering
   */
  async getUserNotifications({ userId, page, limit, type, status }) {
    try {
      // Build filter
      const filter = { userId };
      
      if (type) {
        filter.type = type;
      }
      
      if (status === 'read') {
        filter.isRead = true;
      } else if (status === 'unread') {
        // Handle both false and undefined as unread
        filter.$or = [
          { isRead: false },
          { isRead: { $exists: false } },
          { isRead: null }
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      
      const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Notification.countDocuments(filter);

      return {
        notifications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalNotifications: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      throw error;
    }
  }

  /**
   * Get notification by ID
   */
  async getNotificationById(notificationId, userId) {
    try {
      const notification = await Notification.findOne({ 
        _id: notificationId, 
        userId 
      });
      return notification;
    } catch (error) {
      console.error('Error in getNotificationById:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true, readAt: new Date() },
        { new: true }
      );
      return notification;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );
      return result.modifiedCount;
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndDelete({ 
        _id: notificationId, 
        userId 
      });
      return !!notification;
    } catch (error) {
      console.error('Error in deleteNotification:', error);
      throw error;
    }
  }

  /**
   * Delete all notifications
   */
  async deleteAllNotifications(userId) {
    try {
      const result = await Notification.deleteMany({ userId });
      return result.deletedCount;
    } catch (error) {
      console.error('Error in deleteAllNotifications:', error);
      throw error;
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(userId) {
    try {
      const total = await Notification.countDocuments({ userId });
      const unread = await Notification.countDocuments({ userId, isRead: false });
      const read = await Notification.countDocuments({ userId, isRead: true });
      
      // Get counts by type
      const typeStats = await Notification.aggregate([
        { $match: { userId } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]);
      
      const typeCounts = {};
      typeStats.forEach(stat => {
        typeCounts[stat._id] = stat.count;
      });
      
      return {
        total,
        unread,
        read,
        typeCounts
      };
    } catch (error) {
      console.error('Error in getNotificationStats:', error);
      throw error;
    }
  }

  /**
   * Create a new notification
   */
  async createNotification(notificationData) {
    try {
      const notification = new Notification(notificationData);
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error in createNotification:', error);
      throw error;
    }
  }

  /**
   * Notify task assignment
   */
  async notifyTaskAssignment(userId, taskId, taskTitle, authToken) {
    try {
      const notification = await this.createNotification({
        userId,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned a new task: "${taskTitle}"`,
        data: { taskId },
        isRead: false
      });
      
      return notification;
    } catch (error) {
      console.error('Error in notifyTaskAssignment:', error);
      throw error;
    }
  }

  /**
   * Notify task status change
   */
  async notifyTaskStatusChange(userId, taskId, taskTitle, newStatus, authToken) {
    try {
      const notification = await this.createNotification({
        userId,
        type: 'task_status_change',
        title: 'Task Status Updated',
        message: `Task "${taskTitle}" status changed to ${newStatus}`,
        data: { taskId, status: newStatus },
        isRead: false
      });
      
      return notification;
    } catch (error) {
      console.error('Error in notifyTaskStatusChange:', error);
      throw error;
    }
  }

  /**
   * Notify task completion
   */
  async notifyTaskCompleted(userId, taskId, taskTitle, authToken) {
    try {
      const notification = await this.createNotification({
        userId,
        type: 'task_completed',
        title: 'Task Completed',
        message: `Task "${taskTitle}" has been completed`,
        data: { taskId },
        isRead: false
      });
      
      return notification;
    } catch (error) {
      console.error('Error in notifyTaskCompleted:', error);
      throw error;
    }
  }

  /**
   * Notify task comment
   */
  async notifyTaskComment(userId, taskId, taskTitle, comment, authToken) {
    try {
      const notification = await this.createNotification({
        userId,
        type: 'task_comment',
        title: 'New Comment on Task',
        message: `A new comment was added to task "${taskTitle}"`,
        data: { taskId, comment },
        isRead: false
      });
      
      return notification;
    } catch (error) {
      console.error('Error in notifyTaskComment:', error);
      throw error;
    }
  }

  /**
   * Notify task overdue
   */
  async notifyTaskOverdue(userId, taskId, taskTitle, authToken) {
    try {
      const notification = await this.createNotification({
        userId,
        type: 'task_overdue',
        title: 'Task Overdue',
        message: `Task "${taskTitle}" is overdue`,
        data: { taskId },
        isRead: false
      });
      
      return notification;
    } catch (error) {
      console.error('Error in notifyTaskOverdue:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();