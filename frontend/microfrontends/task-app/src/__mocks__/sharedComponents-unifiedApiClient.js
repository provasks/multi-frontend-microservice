// Mock for sharedComponents/unifiedApiClient
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

module.exports = {
  apiHelpers,
  unifiedApiClient
};
