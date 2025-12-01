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

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.showError
global.window.showError = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock shared components globally
global.mockSharedComponents = {
  API_CONFIG: {
    BASE_URLS: {
      AUTH: 'http://localhost:3001/api',
      USERS: 'http://localhost:3001/api',
      TASKS: 'http://localhost:3002/api',
      NOTIFICATIONS: 'http://localhost:3003/api',
      API_GATEWAY: 'http://localhost:3000/api'
    }
  },
  useAuth: jest.fn(() => ({
    user: { id: '1', name: 'Test User', role: 'user' },
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn()
  }))
};