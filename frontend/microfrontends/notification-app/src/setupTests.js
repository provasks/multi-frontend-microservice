import '@testing-library/jest-dom';

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock window.showError and window.showSuccess
window.showError = jest.fn();
window.showSuccess = jest.fn();

// Mock shared components globally
global.mockSharedComponents = {
  NOTIFICATION_CONSTANTS: {
    TYPE_CONFIG: {
      info: { label: 'Info', bgClass: 'type-info' },
      warning: { label: 'Warning', bgClass: 'type-warning' },
      error: { label: 'Error', bgClass: 'type-error' },
      success: { label: 'Success', bgClass: 'type-success' },
    },
  },
  useAuth: jest.fn(() => ({
    user: { id: '1', name: 'Test User', role: 'user' },
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn()
  }))
};