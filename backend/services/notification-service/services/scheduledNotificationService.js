const cron = require('node-cron');
const Notification = require('../models/Notification');
const axios = require('axios');

const TASK_SERVICE_URL = process.env.TASK_SERVICE_URL || 'http://localhost:3002';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

const scheduledNotificationService = {
  // Check for tasks due soon (within 24 hours)
  async checkTasksDueSoon() {
    try {
      // This would typically query the task service for tasks due soon
      // For now, we'll create a placeholder implementation
      
      // In a real implementation, you would:
      // 1. Query the task service for tasks due within 24 hours
      // 2. Create notifications for each task's assigned user
      // 3. Handle errors gracefully
    } catch (error) {
      console.error('Error checking tasks due soon:', error);
    }
  },

  // Check for overdue tasks
  async checkOverdueTasks() {
    try {
      // Query task service for overdue tasks
      const response = await axios.get(`${TASK_SERVICE_URL}/api/tasks/overdue`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const overdueTasks = response.data.tasks || [];
      
      // Create notifications for each overdue task
      for (const task of overdueTasks) {
        try {
          // Check if notification already exists to prevent duplicates
          const existingNotification = await Notification.findOne({
            userId: task.assignedTo,
            taskId: task._id,
            type: 'task_overdue',
            isRead: false
          });
          
          if (!existingNotification) {
            // Create overdue notification
            await Notification.create({
              userId: task.assignedTo,
              taskId: task._id,
              type: 'task_overdue',
              title: 'Task Overdue',
              message: `Task "${task.title}" is now overdue`,
              priority: 'urgent',
              metadata: { taskTitle: task.title },
              isRead: false
            });
          }
        } catch (taskError) {
          console.error(`Error creating notification for task ${task._id}:`, taskError);
        }
      }
    } catch (error) {
      console.error('Error checking overdue tasks:', error);
    }
  },

  // Start scheduled notifications
  startScheduledNotifications() {
    // Check for tasks due soon every hour
    cron.schedule('0 * * * *', () => {
      this.checkTasksDueSoon();
    });

    // Check for overdue tasks every 6 hours
    cron.schedule('0 */6 * * *', () => {
      this.checkOverdueTasks();
    });
  },

  // Stop scheduled notifications
  stopScheduledNotifications() {
    cron.destroy();
  }
};

module.exports = scheduledNotificationService;
