// Mock for sharedComponents/useAuth
module.exports = {
  useAuth: jest.fn(() => ({
    user: { id: '1', name: 'Test User', role: 'user' },
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn()
  }))
};
