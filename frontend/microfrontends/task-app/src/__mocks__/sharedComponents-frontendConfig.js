// Mock for sharedComponents/frontendConfig
module.exports = {
  TASK_CONSTANTS: {
    PRIORITY_CONFIG: {
      low: { bgClass: 'priority-low', label: 'Low' },
      medium: { bgClass: 'priority-medium', label: 'Medium' },
      high: { bgClass: 'priority-high', label: 'High' },
      urgent: { bgClass: 'priority-urgent', label: 'Urgent' }
    },
    STATUS_CONFIG: {
      pending: { bgClass: 'status-pending', label: 'Pending' },
      'in-progress': { bgClass: 'status-in-progress', label: 'In Progress' },
      completed: { bgClass: 'status-completed', label: 'Completed' },
      cancelled: { bgClass: 'status-cancelled', label: 'Cancelled' }
    }
  },
  USER_CONSTANTS: {
    ROLE_CONFIG: {
      admin: { label: 'Admin', bgClass: 'role-admin' },
      user: { label: 'User', bgClass: 'role-user' },
      manager: { label: 'Manager', bgClass: 'role-manager' }
    }
  },
  NOTIFICATION_CONSTANTS: {
    TYPE_CONFIG: {
      info: { label: 'Info', bgClass: 'type-info' },
      warning: { label: 'Warning', bgClass: 'type-warning' },
      error: { label: 'Error', bgClass: 'type-error' },
      success: { label: 'Success', bgClass: 'type-success' }
    }
  },
  FRONTEND_MESSAGES: {
    ERROR: {
      GENERAL: 'An unexpected error occurred.',
      NETWORK: 'Network error. Please check your connection.',
      NOT_FOUND: (resource = 'resource') => `${resource} not found.`,
    },
    SUCCESS: {
      GENERAL: 'Operation successful!',
    },
  }
};
