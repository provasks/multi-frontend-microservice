// Mock data factories for testing
export const createMockTask = (overrides = {}) => ({
  _id: '1',
  title: 'Test Task',
  description: 'Test Description',
  priority: 'medium',
  status: 'pending',
  assignedTo: 'user123',
  dueDate: '2024-12-31T10:00:00.000Z',
  tags: ['test', 'example'],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides
});

export const createMockUser = (overrides = {}) => ({
  _id: 'user1',
  username: 'johndoe',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user',
  isActive: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides
});

export const createMockUIState = (overrides = {}) => ({
  showModal: false,
  modalMode: 'add',
  editingTask: null,
  formData: {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: '',
    dueDate: '',
    tags: ''
  },
  formErrors: {},
  ...overrides
});

export const createMockTasksState = (overrides = {}) => ({
  tasks: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  totalPages: 1,
  totalTasks: 0,
  searchTerm: '',
  ...overrides
});

export const createMockAuthState = (overrides = {}) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  ...overrides
});