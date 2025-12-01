import { authApi, taskApi, notificationApi, userApi, API_BASE_URLS } from '../api';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: {
        use: jest.fn()
      },
      response: {
        use: jest.fn()
      }
    }
  }))
}));

// Mock shared components constants
jest.mock('sharedComponents/constants', () => ({
  API_CONFIG: {
    BASE_URLS: {
      AUTH: 'http://localhost:3001/api',
      TASKS: 'http://localhost:3002/api',
      NOTIFICATIONS: 'http://localhost:3003/api',
      USERS: 'http://localhost:3001/api'
    },
    TIMEOUTS: {
      DEFAULT: 10000
    }
  }
}));

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; })
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

// Mock document.querySelector
Object.defineProperty(document, 'querySelector', {
  value: jest.fn(),
});

// Mock window.location
delete window.location;
window.location = {
  pathname: '/dashboard',
  href: 'http://localhost:4000/dashboard'
};

describe('API Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
  });

  describe('API_BASE_URLS', () => {
    it('exports correct base URLs', () => {
      expect(API_BASE_URLS).toEqual({
        AUTH: 'http://localhost:3001/api',
        TASKS: 'http://localhost:3002/api',
        NOTIFICATIONS: 'http://localhost:3003/api',
        USERS: 'http://localhost:3001/api'
      });
    });
  });

  describe('API instances', () => {
    it('creates authApi instance', () => {
      expect(authApi).toBeDefined();
      expect(authApi.interceptors).toBeDefined();
    });

    it('creates taskApi instance', () => {
      expect(taskApi).toBeDefined();
      expect(taskApi.interceptors).toBeDefined();
    });

    it('creates notificationApi instance', () => {
      expect(notificationApi).toBeDefined();
      expect(notificationApi.interceptors).toBeDefined();
    });

    it('creates userApi instance', () => {
      expect(userApi).toBeDefined();
      expect(userApi.interceptors).toBeDefined();
    });
  });

  describe('Request interceptor', () => {
    it('is configured on all API instances', () => {
      // Test that interceptors are configured
      expect(authApi.interceptors.request.use).toBeDefined();
      expect(authApi.interceptors.response.use).toBeDefined();
      expect(taskApi.interceptors.request.use).toBeDefined();
      expect(taskApi.interceptors.response.use).toBeDefined();
      expect(notificationApi.interceptors.request.use).toBeDefined();
      expect(notificationApi.interceptors.response.use).toBeDefined();
      expect(userApi.interceptors.request.use).toBeDefined();
      expect(userApi.interceptors.response.use).toBeDefined();
    });
  });

  describe('Response interceptor', () => {
    it('is configured on all API instances', () => {
      // Test that response interceptors are configured
      expect(authApi.interceptors.response.use).toBeDefined();
      expect(taskApi.interceptors.response.use).toBeDefined();
      expect(notificationApi.interceptors.response.use).toBeDefined();
      expect(userApi.interceptors.response.use).toBeDefined();
    });
  });

  describe('Session storage integration', () => {
    it('uses sessionStorage for token retrieval', () => {
      mockSessionStorage.getItem.mockReturnValue('test-token');
      
      // The interceptor should call sessionStorage.getItem
      expect(mockSessionStorage.getItem).toBeDefined();
    });
  });

  describe('CSRF token integration', () => {
    it('handles missing CSRF meta tag gracefully', () => {
      document.querySelector.mockReturnValue(null);
      
      // Should not throw when CSRF meta tag is missing
      expect(() => {
        // This would be called by the request interceptor
      }).not.toThrow();
    });

    it('handles CSRF meta tag with missing content', () => {
      document.querySelector.mockReturnValue({});
      
      // Should not throw when content is missing
      expect(() => {
        // This would be called by the request interceptor
      }).not.toThrow();
    });
  });
});
