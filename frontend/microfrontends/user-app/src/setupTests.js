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
  USER_CONSTANTS: {
    ROLE_CONFIG: {
      admin: { label: 'Admin', bgClass: 'role-admin' },
      user: { label: 'User', bgClass: 'role-user' },
      guest: { label: 'Guest', bgClass: 'role-guest' },
    },
  },
  useAuth: jest.fn(() => ({
    user: { id: '1', name: 'Test User', role: 'user' },
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn()
  }))
};