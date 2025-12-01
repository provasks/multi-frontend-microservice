// Simplified mock for sharedComponents module
const React = require('react');

// Mock constants
const TASK_CONSTANTS = {
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
};

const USER_CONSTANTS = {
  ROLE_CONFIG: {
    admin: { label: 'Admin', bgClass: 'role-admin' },
    user: { label: 'User', bgClass: 'role-user' },
    manager: { label: 'Manager', bgClass: 'role-manager' }
  }
};

const NOTIFICATION_CONSTANTS = {
  TYPE_CONFIG: {
    info: { label: 'Info', bgClass: 'type-info' },
    warning: { label: 'Warning', bgClass: 'type-warning' },
    error: { label: 'Error', bgClass: 'type-error' },
    success: { label: 'Success', bgClass: 'type-success' }
  }
};

const FRONTEND_MESSAGES = {
  ERROR: {
    GENERAL: 'An unexpected error occurred.',
    NETWORK: 'Network error. Please check your connection.',
    NOT_FOUND: (resource = 'resource') => `${resource} not found.`,
  },
  SUCCESS: {
    GENERAL: 'Operation successful!',
  },
};

// Mock hooks
const useAuth = jest.fn(() => ({
  user: { id: '1', name: 'Test User', role: 'user' },
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn()
}));

// Mock API client
const apiHelpers = {
  fetchUsers: jest.fn(() => Promise.resolve({ users: [] })),
  fetchTasks: jest.fn(() => Promise.resolve({ tasks: [] })),
  createTask: jest.fn(() => Promise.resolve({})),
  updateTask: jest.fn(() => Promise.resolve({})),
  deleteTask: jest.fn(() => Promise.resolve({})),
};

const unifiedApiClient = {
  apiHelpers,
  hasCachedUsers: jest.fn(() => false),
  getCachedUsers: jest.fn(() => null),
};

// Mock Redux hooks
const useTasks = jest.fn(() => ({
  tasks: [],
  isLoading: false,
  error: null,
  fetchTasks: jest.fn(),
  addTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

const useUI = jest.fn(() => ({
  modals: { taskModal: false },
  notifications: [],
  showModal: jest.fn(),
  hideModal: jest.fn(),
  showNotification: jest.fn(),
}));

// Mock components
const SearchBar = jest.fn(({ searchTerm, onSearchChange, onClearSearch, totalCount, filteredCount, searchLoading, showCount = true }) => 
  React.createElement('div', { 'data-testid': 'search-bar' },
    React.createElement('input', {
      'data-testid': 'search-input',
      value: searchTerm || '',
      onChange: (e) => onSearchChange(e.target.value)
    }),
    React.createElement('button', { 'data-testid': 'clear-search', onClick: onClearSearch }, 'Clear'),
    showCount && React.createElement('div', { 'data-testid': 'search-count' }, `Showing ${filteredCount} of ${totalCount} items`)
  )
);

const LoadingSpinner = jest.fn(() => React.createElement('div', { 'data-testid': 'loading-spinner' }, 'Loading...'));

// Export all mocks
module.exports = {
  // Constants
  TASK_CONSTANTS,
  USER_CONSTANTS,
  NOTIFICATION_CONSTANTS,
  FRONTEND_MESSAGES,
  
  // Hooks
  useAuth,
  
  // API Client
  apiHelpers,
  unifiedApiClient,
  
  // Redux Hooks
  useTasks,
  useUI,
  
  // Components
  SearchBar,
  LoadingSpinner,
};
