const Task = require('../models/Task');
const userService = require('./userService');
const notificationService = require('./notificationService');

class TaskService {
  /**
   * Get all tasks with filtering and pagination
   */
  async getAllTasks({ userId, status, priority, assignedTo, search, page, limit, sortBy, sortOrder, authToken }) {
    try {
      // Build filter - user can see tasks they created or are assigned to
      let filter;
      
      if (search) {
        // For search, we need to combine user permissions with search terms
        filter = {
          $and: [
            {
              $or: [
                { createdBy: userId },
                { assignedTo: userId }
              ]
            },
            {
              $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
              ]
            }
          ]
        };
      } else {
        // Simple filter for user permissions
        filter = {
          $or: [
            { createdBy: userId },
            { assignedTo: userId }
          ]
        };
      }

      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (assignedTo) filter.assignedTo = assignedTo;

      // Calculate pagination
      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const tasks = await Task.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Task.countDocuments(filter);

      // Enrich tasks with user data
      const tasksWithUsers = await this.enrichTasksWithUsers(tasks, authToken);

      return {
        tasks: tasksWithUsers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalTasks: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error in getAllTasks:', error);
      throw error;
    }
  }

  /**
   * Get task by ID
   */
  async getTaskById(taskId, userId, authToken) {
    try {
      const task = await Task.findOne({ 
        _id: taskId, 
        $or: [{ createdBy: userId }, { assignedTo: userId }] 
      });
      
      if (!task) {
        return null;
      }

      // Enrich with user data
      const enrichedTask = await this.enrichTasksWithUsers([task], authToken);
      return enrichedTask[0];
    } catch (error) {
      console.error('Error in getTaskById:', error);
      throw error;
    }
  }

  /**
   * Create a new task
   */
  async createTask({ title, description, priority, assignedTo, dueDate, tags, createdBy, authToken }) {
    try {
      // Validate assigned user exists
      const assignedUser = await userService.getUserById(assignedTo, authToken);
      if (!assignedUser) {
        throw new Error('Assigned user not found');
      }

      // Create task
      const task = new Task({
        title,
        description,
        priority,
        assignedTo,
        createdBy,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        tags: tags || []
      });

      await task.save();

      // Create notification for task assignment
      try {
        await notificationService.notifyTaskAssignment(assignedTo, task._id, title, authToken);
      } catch (error) {
        console.error('Failed to create notification:', error);
        // Don't fail the task creation if notification fails
      }

      // Enrich with user data
      const enrichedTask = await this.enrichTasksWithUsers([task], authToken);
      return enrichedTask[0];
    } catch (error) {
      console.error('Error in createTask:', error);
      throw error;
    }
  }

  /**
   * Update a task
   */
  async updateTask(taskId, updateData, userId, authToken) {
    try {
      const task = await Task.findOne({ 
        _id: taskId, 
        $or: [{ createdBy: userId }, { assignedTo: userId }] 
      });
      
      if (!task) {
        return null;
      }

      // Update task
      Object.assign(task, updateData);
      await task.save();

      // Create notification if status changed
      if (updateData.status && updateData.status !== task.status) {
        try {
          await notificationService.notifyTaskStatusChange(
            task.assignedTo, 
            task._id, 
            task.title, 
            updateData.status, 
            authToken
          );
        } catch (error) {
          console.error('Failed to create status change notification:', error);
        }
      }

      // Enrich with user data
      const enrichedTask = await this.enrichTasksWithUsers([task], authToken);
      return enrichedTask[0];
    } catch (error) {
      console.error('Error in updateTask:', error);
      throw error;
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId, userId, authToken) {
    try {
      const task = await Task.findOneAndDelete({ 
        _id: taskId, 
        createdBy: userId 
      });
      return !!task;
    } catch (error) {
      console.error('Error in deleteTask:', error);
      throw error;
    }
  }

  /**
   * Add comment to task
   */
  async addComment(taskId, comment, userId, authToken) {
    try {
      const task = await Task.findOne({ 
        _id: taskId, 
        $or: [{ createdBy: userId }, { assignedTo: userId }] 
      });
      
      if (!task) {
        return null;
      }

      // Add comment
      task.comments.push({
        text: comment,
        author: userId,
        createdAt: new Date()
      });

      await task.save();

      // Create notification for comment
      try {
        await notificationService.notifyTaskComment(
          task.assignedTo, 
          task._id, 
          task.title, 
          comment, 
          authToken
        );
      } catch (error) {
        console.error('Failed to create comment notification:', error);
      }

      // Enrich with user data
      const enrichedTask = await this.enrichTasksWithUsers([task], authToken);
      return enrichedTask[0];
    } catch (error) {
      console.error('Error in addComment:', error);
      throw error;
    }
  }

  /**
   * Archive a task
   */
  async archiveTask(taskId, userId, authToken) {
    try {
      const task = await Task.findOne({ 
        _id: taskId, 
        createdBy: userId 
      });
      
      if (!task) {
        return null;
      }

      // Archive task
      task.archived = true;
      task.archivedAt = new Date();
      await task.save();

      // Enrich with user data
      const enrichedTask = await this.enrichTasksWithUsers([task], authToken);
      return enrichedTask[0];
    } catch (error) {
      console.error('Error in archiveTask:', error);
      throw error;
    }
  }

  /**
   * Enrich tasks with user data
   */
  async enrichTasksWithUsers(tasks, authToken) {
    try {
      return Promise.all(tasks.map(async (task) => {
        const taskObj = task.toObject();
        
        try {
          // Fetch user data separately
          const assignedUserData = await userService.getUserById(task.assignedTo, authToken);
          const createdByUserData = await userService.getUserById(task.createdBy, authToken);
          
          taskObj.assignedToUser = assignedUserData;
          taskObj.createdByUser = createdByUserData;
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // Continue without user data
        }
        
        return taskObj;
      }));
    } catch (error) {
      console.error('Error in enrichTasksWithUsers:', error);
      throw error;
    }
  }
}

module.exports = new TaskService();