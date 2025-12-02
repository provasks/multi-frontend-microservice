const taskService = require('../services/taskService');
const { validationResult } = require('express-validator');

class TaskController {
  /**
   * Get all overdue tasks
   */
  async getOverdueTasks(req, res) {
    try {
      const overdueTasks = await taskService.getOverdueTasks();
      
      res.json({
        tasks: overdueTasks,
        count: overdueTasks.length
      });
    } catch (error) {
      console.error('Get overdue tasks error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Get all tasks with filtering and pagination
   */
  async getAllTasks(req, res) {
    try {
      const { 
        status, 
        priority, 
        assignedTo, 
        search, 
        page = 1, 
        limit = 10, 
        sortBy = 'createdAt', 
        sortOrder = 'desc' 
      } = req.query;
      
      const authToken = req.header('Authorization')?.replace('Bearer ', '');
      
      const result = await taskService.getAllTasks({
        userId: req.user._id,
        status,
        priority,
        assignedTo,
        search,
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        authToken
      });
      
      res.json(result);
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Get task by ID
   */
  async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const authToken = req.header('Authorization')?.replace('Bearer ', '');
      
      const task = await taskService.getTaskById(id, req.user._id, authToken);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.json({ task });
    } catch (error) {
      console.error('Get task error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Create a new task
   */
  async createTask(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, priority, assignedTo, dueDate, tags } = req.body;
      const authToken = req.header('Authorization')?.replace('Bearer ', '');
      
      const task = await taskService.createTask({
        title,
        description,
        priority,
        assignedTo,
        dueDate,
        tags,
        createdBy: req.user._id,
        authToken
      });
      
      res.status(201).json({
        message: 'Task created successfully',
        task
      });
    } catch (error) {
      console.error('Create task error:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Assigned user not found') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Update a task
   */
  async updateTask(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const updateData = req.body;
      const authToken = req.header('Authorization')?.replace('Bearer ', '');
      
      const task = await taskService.updateTask(id, updateData, req.user._id, authToken);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.json({
        message: 'Task updated successfully',
        task
      });
    } catch (error) {
      console.error('Update task error:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const authToken = req.header('Authorization')?.replace('Bearer ', '');
      
      const deleted = await taskService.deleteTask(id, req.user._id, authToken);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Add comment to task
   */
  async addComment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { comment } = req.body;
      const authToken = req.header('Authorization')?.replace('Bearer ', '');
      
      const task = await taskService.addComment(id, comment, req.user._id, authToken);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.json({
        message: 'Comment added successfully',
        task
      });
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Archive a task
   */
  async archiveTask(req, res) {
    try {
      const { id } = req.params;
      const authToken = req.header('Authorization')?.replace('Bearer ', '');
      
      const task = await taskService.archiveTask(id, req.user._id, authToken);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.json({
        message: 'Task archived successfully',
        task
      });
    } catch (error) {
      console.error('Archive task error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new TaskController();