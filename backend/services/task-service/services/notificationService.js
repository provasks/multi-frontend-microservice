const axios = require('axios');

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3003';

const notificationService = {
  // Create notification via notification service
  async createNotification(userId, taskId, type, title, message, priority = 'medium', metadata = {}) {
    try {
      const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
        userId,
        taskId,
        type,
        title,
        message,
        priority,
        metadata
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.SERVICE_TOKEN || 'service-token'}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`Notification created: ${type} for user ${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error.message);
      // Don't throw error to avoid breaking task operations
      return null;
    }
  },

  // Notify task assignment
  async notifyTaskAssignment(userId, taskId, taskTitle, authToken) {
    return this.createNotification(
      userId,
      taskId,
      'task_assigned',
      'New Task Assigned',
      `You have been assigned a new task: "${taskTitle}"`,
      'medium',
      { taskTitle },
      authToken
    );
  },

  // Notify task status change
  async notifyTaskStatusChange(userId, taskId, taskTitle, oldStatus, newStatus, authToken) {
    const statusMessages = {
      'pending': 'Pending',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };

    return this.createNotification(
      userId,
      taskId,
      'status_changed',
      'Task Status Updated',
      `Task "${taskTitle}" status changed from ${statusMessages[oldStatus]} to ${statusMessages[newStatus]}`,
      newStatus === 'completed' ? 'low' : 'medium',
      { taskTitle, oldStatus, newStatus },
      authToken
    );
  },

  // Notify task update
  async notifyTaskUpdate(userId, taskId, taskTitle, authToken) {
    return this.createNotification(
      userId,
      taskId,
      'task_updated',
      'Task Updated',
      `Task "${taskTitle}" has been updated`,
      'medium',
      { taskTitle },
      authToken
    );
  },

  // Notify task completion
  async notifyTaskCompleted(userId, taskId, taskTitle, authToken) {
    return this.createNotification(
      userId,
      taskId,
      'task_completed',
      'Task Completed',
      `Task "${taskTitle}" has been completed`,
      'low',
      { taskTitle },
      authToken
    );
  },

  // Notify task due soon (for scheduled notifications)
  async notifyTaskDueSoon(userId, taskId, taskTitle, dueDate, authToken) {
    return this.createNotification(
      userId,
      taskId,
      'task_due_soon',
      'Task Due Soon',
      `Task "${taskTitle}" is due soon (${new Date(dueDate).toLocaleDateString()})`,
      'high',
      { taskTitle, dueDate },
      authToken
    );
  },

  // Notify task overdue
  async notifyTaskOverdue(userId, taskId, taskTitle, authToken) {
    return this.createNotification(
      userId,
      taskId,
      'task_overdue',
      'Task Overdue',
      `Task "${taskTitle}" is now overdue`,
      'urgent',
      { taskTitle },
      authToken
    );
  }
};

module.exports = notificationService;
