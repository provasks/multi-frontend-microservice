/**
 * Task App Configuration (Port 4002)
 * Configuration specific to the task management microfrontend
 */

// Import shared configuration
const { TASK_CONSTANTS, FRONTEND_MESSAGES } = require('sharedComponents/frontendConfig');

// ============================================================================
// TASK APP SPECIFIC CONFIGURATION
// ============================================================================

const TASK_APP_CONFIG = {
  // Application metadata
  APP: {
    NAME: 'Task Management',
    VERSION: '1.0.0',
    DESCRIPTION: 'Task management microfrontend'
  },
  
  // Task management specific settings
  TASK_MANAGEMENT: {
    // Pagination
    PAGINATION: {
      DEFAULT_PAGE_SIZE: 10,
      PAGE_SIZE_OPTIONS: [5, 10, 25, 50]
    },
    
    // Search configuration
    SEARCH: {
      DEBOUNCE_DELAY: 300,
      MIN_SEARCH_LENGTH: 2,
      SEARCH_FIELDS: ['title', 'description', 'assignedTo']
    },
    
    // Task form configuration
    FORM: {
      VALIDATION: {
        TITLE: {
          MIN_LENGTH: 1,
          MAX_LENGTH: 200,
          REQUIRED: true
        },
        DESCRIPTION: {
          MAX_LENGTH: 1000,
          REQUIRED: false
        },
        DUE_DATE: {
          MIN_DATE: new Date().toISOString().split('T')[0] // Today
        }
      },
      
      FIELDS: {
        REQUIRED: ['title', 'priority', 'status'],
        OPTIONAL: ['description', 'assignedTo', 'dueDate']
      }
    },
    
    // Task list configuration
    LIST: {
      SORTABLE_COLUMNS: ['title', 'priority', 'status', 'assignedTo', 'dueDate', 'createdAt'],
      DEFAULT_SORT: { field: 'createdAt', direction: 'desc' },
      FILTERABLE_FIELDS: ['priority', 'status', 'assignedTo']
    },
    
    // Task board configuration
    BOARD: {
      COLUMNS: [
        { id: 'pending', title: 'Pending', status: 'pending' },
        { id: 'in_progress', title: 'In Progress', status: 'in_progress' },
        { id: 'completed', title: 'Completed', status: 'completed' }
      ],
      
      CARD_CONFIG: {
        MAX_TITLE_LENGTH: 50,
        MAX_DESCRIPTION_LENGTH: 100,
        SHOW_PRIORITY: true,
        SHOW_ASSIGNEE: true,
        SHOW_DUE_DATE: true
      }
    }
  },
  
  // API configuration
  API: {
    ENDPOINTS: {
      TASKS: '/api/tasks',
      TASK_ASSIGN: '/api/tasks/assign',
      TASK_COMPLETE: '/api/tasks/complete'
    },
    
    TIMEOUTS: {
      DEFAULT: 10000,
      UPLOAD: 30000
    }
  }
};

// ============================================================================
// TASK APP SPECIFIC MESSAGES
// ============================================================================

const TASK_APP_MESSAGES = {
  // Task-specific error messages
  ERROR: {
    TASK_LOAD_FAILED: 'Failed to load tasks',
    TASK_CREATE_FAILED: 'Failed to create task',
    TASK_UPDATE_FAILED: 'Failed to update task',
    TASK_DELETE_FAILED: 'Failed to delete task',
    TASK_NOT_FOUND: 'Task not found',
    INVALID_TASK_DATA: 'Invalid task data provided',
    TASK_ASSIGN_FAILED: 'Failed to assign task',
    TASK_COMPLETE_FAILED: 'Failed to complete task'
  },
  
  // Task-specific success messages
  SUCCESS: {
    TASK_CREATED: 'Task created successfully',
    TASK_UPDATED: 'Task updated successfully',
    TASK_DELETED: 'Task deleted successfully',
    TASKS_LOADED: 'Tasks loaded successfully',
    TASK_ASSIGNED: 'Task assigned successfully',
    TASK_COMPLETED: 'Task completed successfully'
  }
};

// ============================================================================
// EXPORT CONFIGURATION
// ============================================================================

module.exports = {
  // Task app specific configuration
  TASK_APP_CONFIG,
  TASK_APP_MESSAGES,
  
  // Re-export shared configuration
  TASK_CONSTANTS,
  MESSAGES: FRONTEND_MESSAGES
};
