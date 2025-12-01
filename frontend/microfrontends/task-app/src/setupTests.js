// Import Jest DOM matchers
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Chart.js mocking removed - not used in task-app

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.showSuccess and window.showError
global.window.showSuccess = jest.fn();
global.window.showError = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock fetch
global.fetch = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock shared components globally
global.mockSharedComponents = {
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
      success: { label: 'Success', bgClass: 'type-success' },
      warning: { label: 'Warning', bgClass: 'type-warning' },
      error: { label: 'Error', bgClass: 'type-error' }
    }
  },
  useAuth: jest.fn(() => ({
    user: { id: '1', name: 'Test User', role: 'user' },
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn()
  }))
};
