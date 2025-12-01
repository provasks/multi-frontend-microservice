import { createMockTask, createMockUser } from '../test-utils';

describe('test-utils', () => {
  describe('createMockTask', () => {
    it('creates a mock task with default values', () => {
      const mockTask = createMockTask();
      
      expect(mockTask).toHaveProperty('_id');
      expect(mockTask).toHaveProperty('title');
      expect(mockTask).toHaveProperty('description');
      expect(mockTask).toHaveProperty('priority');
      expect(mockTask).toHaveProperty('status');
      expect(mockTask).toHaveProperty('assignedTo');
      expect(mockTask).toHaveProperty('dueDate');
      expect(mockTask).toHaveProperty('tags');
      expect(mockTask).toHaveProperty('createdAt');
      expect(mockTask).toHaveProperty('updatedAt');
    });

    it('creates a mock task with custom values', () => {
      const customTask = createMockTask({
        title: 'Custom Task',
        priority: 'high',
        status: 'in_progress'
      });
      
      expect(customTask.title).toBe('Custom Task');
      expect(customTask.priority).toBe('high');
      expect(customTask.status).toBe('in_progress');
      expect(customTask._id).toBeDefined();
    });

    it('creates a mock task with all custom values', () => {
      const customTask = createMockTask({
        _id: 'custom-id',
        title: 'Custom Task',
        description: 'Custom Description',
        priority: 'urgent',
        status: 'completed',
        assignedTo: 'user@example.com',
        dueDate: '2024-12-31T23:59:59.000Z',
        tags: ['urgent', 'custom'],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z'
      });
      
      expect(customTask._id).toBe('custom-id');
      expect(customTask.title).toBe('Custom Task');
      expect(customTask.description).toBe('Custom Description');
      expect(customTask.priority).toBe('urgent');
      expect(customTask.status).toBe('completed');
      expect(customTask.assignedTo).toBe('user@example.com');
      expect(customTask.dueDate).toBe('2024-12-31T23:59:59.000Z');
      expect(customTask.tags).toEqual(['urgent', 'custom']);
      expect(customTask.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(customTask.updatedAt).toBe('2024-01-02T00:00:00.000Z');
    });
  });

  describe('createMockUser', () => {
    it('creates a mock user with default values', () => {
      const mockUser = createMockUser();
      
      expect(mockUser).toHaveProperty('_id');
      expect(mockUser).toHaveProperty('username');
      expect(mockUser).toHaveProperty('email');
      expect(mockUser).toHaveProperty('firstName');
      expect(mockUser).toHaveProperty('lastName');
      expect(mockUser).toHaveProperty('role');
      expect(mockUser).toHaveProperty('isActive');
      expect(mockUser).toHaveProperty('createdAt');
      expect(mockUser).toHaveProperty('updatedAt');
    });

    it('creates a mock user with custom values', () => {
      const customUser = createMockUser({
        username: 'customuser',
        email: 'custom@example.com',
        role: 'admin'
      });
      
      expect(customUser.username).toBe('customuser');
      expect(customUser.email).toBe('custom@example.com');
      expect(customUser.role).toBe('admin');
      expect(customUser._id).toBeDefined();
    });

    it('creates a mock user with all custom values', () => {
      const customUser = createMockUser({
        _id: 'user-123',
        username: 'johndoe',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'moderator',
        isActive: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z'
      });
      
      expect(customUser._id).toBe('user-123');
      expect(customUser.username).toBe('johndoe');
      expect(customUser.email).toBe('john@example.com');
      expect(customUser.firstName).toBe('John');
      expect(customUser.lastName).toBe('Doe');
      expect(customUser.role).toBe('moderator');
      expect(customUser.isActive).toBe(false);
      expect(customUser.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(customUser.updatedAt).toBe('2024-01-02T00:00:00.000Z');
    });
  });
});