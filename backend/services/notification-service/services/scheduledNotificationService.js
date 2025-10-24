const cron = require('node-cron');
const Notification = require('../models/Notification');
const axios = require('axios');

const TASK_SERVICE_URL = process.env.TASK_SERVICE_URL || 'http://localhost:3002';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

const scheduledNotificationService = {
  // Check for tasks due soon (within 24 hours)
  async checkTasksDueSoon() {
    try {
      console.log('Checking for tasks due soon...');
      
      // This would typically query the task service for tasks due soon
      // For now, we'll create a placeholder implementation
      
      // In a real implementation, you would:
      // 1. Query the task service for tasks due within 24 hours
      // 2. Create notifications for each task's assigned user
      // 3. Handle errors gracefully
      
      console.log('Due soon check completed');
    } catch (error) {
      console.error('Error checking tasks due soon:', error);
    }
  },

  // Check for overdue tasks
  async checkOverdueTasks() {
    try {
      console.log('Checking for overdue tasks...');
      
      // This would typically query the task service for overdue tasks
      // For now, we'll create a placeholder implementation
      
      // In a real implementation, you would:
      // 1. Query the task service for overdue tasks
      // 2. Create urgent notifications for each task's assigned user
      // 3. Handle errors gracefully
      
      console.log('Overdue check completed');
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

    console.log('Scheduled notifications started');
  },

  // Stop scheduled notifications
  stopScheduledNotifications() {
    cron.destroy();
    console.log('Scheduled notifications stopped');
  }
};

module.exports = scheduledNotificationService;
