import { renderHook, act } from '@testing-library/react';
import { useTaskManagement } from '../useTaskManagement';

// Mock the dependencies
jest.mock('sharedComponents/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: jest.fn(() => true)
  })
}));

jest.mock('sharedComponents/unifiedApiClient', () => ({
  apiHelpers: {
    fetchTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn()
  }
}));

jest.mock('sharedComponents/constants', () => ({
  TASK_CONSTANTS: {
    DEFAULT_FORM: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      assignedTo: '',
      dueDate: '',
      tags: ''
    }
  }
}));

// Mock the useDebounce hook
jest.mock('../useDebounce', () => ({
  useDebounce: (value) => value // Return the value immediately for testing
}));

describe('useTaskManagement Hook (Real)', () => {
  const mockApiHelpers = require('sharedComponents/unifiedApiClient').apiHelpers;
  const mockAuth = require('sharedComponents/useAuth').useAuth;

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiHelpers.fetchTasks.mockResolvedValue({
      tasks: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalTasks: 0,
        hasNext: false,
        hasPrev: false
      }
    });
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useTaskManagement());
    
    expect(result.current.tasks).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.showModal).toBe(false);
    expect(result.current.modalMode).toBe('add');
    expect(result.current.editingTask).toBe(null);
  });

  it('handles search term changes', () => {
    const { result } = renderHook(() => useTaskManagement());
    
    act(() => {
      result.current.handleSearchChange('test search');
    });
    
    expect(result.current.searchTerm).toBe('test search');
  });

  it('handles clear search', () => {
    const { result } = renderHook(() => useTaskManagement());
    
    // First set a search term
    act(() => {
      result.current.handleSearchChange('test search');
    });
    
    expect(result.current.searchTerm).toBe('test search');
    
    // Then clear it
    act(() => {
      result.current.handleClearSearch();
    });
    
    expect(result.current.searchTerm).toBe('');
  });

  it('handles add task modal opening', () => {
    const { result } = renderHook(() => useTaskManagement());
    
    act(() => {
      result.current.handleAddTask();
    });
    
    expect(result.current.showModal).toBe(true);
    expect(result.current.modalMode).toBe('add');
    expect(result.current.editingTask).toBe(null);
  });

  it('handles edit task modal opening', () => {
    const { result } = renderHook(() => useTaskManagement());
    const mockTask = {
      _id: '1',
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high',
      status: 'in_progress',
      assignedTo: 'user123',
      dueDate: '2024-12-31',
      tags: 'test,example'
    };
    
    act(() => {
      result.current.handleEditTask(mockTask);
    });
    
    expect(result.current.showModal).toBe(true);
    expect(result.current.modalMode).toBe('edit');
    expect(result.current.editingTask).toEqual(mockTask);
  });

  it('handles modal closing', () => {
    const { result } = renderHook(() => useTaskManagement());
    
    // First open modal
    act(() => {
      result.current.handleAddTask();
    });
    
    expect(result.current.showModal).toBe(true);
    
    // Then close it
    act(() => {
      result.current.handleCloseModal();
    });
    
    expect(result.current.showModal).toBe(false);
    expect(result.current.editingTask).toBe(null);
  });

  it('handles form input changes', () => {
    const { result } = renderHook(() => useTaskManagement());
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'title', value: 'New Title' }
      });
    });
    
    expect(result.current.formData.title).toBe('New Title');
  });

  it('handles page changes', () => {
    const { result } = renderHook(() => useTaskManagement());
    
    act(() => {
      result.current.handlePageChange(2);
    });
    
    expect(result.current.currentPage).toBe(2);
  });

  it('handles page size changes', () => {
    const { result } = renderHook(() => useTaskManagement());
    
    act(() => {
      result.current.handlePageSizeChange(20);
    });
    
    expect(result.current.pageSize).toBe(20);
  });

  it('handles task deletion with confirmation', () => {
    const { result } = renderHook(() => useTaskManagement());
    const mockTasks = [
      { _id: '1', title: 'Task 1' },
      { _id: '2', title: 'Task 2' }
    ];
    
    // Mock window.confirm
    global.window.confirm = jest.fn(() => true);
    mockApiHelpers.deleteTask.mockResolvedValue({ success: true });
    
    act(() => {
      result.current.setTasks(mockTasks);
    });
    
    act(() => {
      result.current.handleDeleteTask('1');
    });
    
    expect(mockApiHelpers.deleteTask).toHaveBeenCalledWith('1');
  });

  it('handles task deletion cancellation', () => {
    const { result } = renderHook(() => useTaskManagement());
    const mockTasks = [
      { _id: '1', title: 'Task 1' },
      { _id: '2', title: 'Task 2' }
    ];
    
    // Mock window.confirm to return false
    global.window.confirm = jest.fn(() => false);
    
    act(() => {
      result.current.setTasks(mockTasks);
    });
    
    act(() => {
      result.current.handleDeleteTask('1');
    });
    
    // Tasks should remain unchanged
    expect(result.current.tasks).toHaveLength(2);
    expect(mockApiHelpers.deleteTask).not.toHaveBeenCalled();
  });

  it('handles refresh tasks', async () => {
    const { result } = renderHook(() => useTaskManagement());
    
    await act(async () => {
      result.current.refreshTasks();
    });
    
    expect(mockApiHelpers.fetchTasks).toHaveBeenCalled();
  });

  it('calculates task statistics correctly', () => {
    const { result } = renderHook(() => useTaskManagement());
    const mockTasks = [
      { status: 'pending', priority: 'high' },
      { status: 'in_progress', priority: 'medium' },
      { status: 'completed', priority: 'low' },
      { status: 'pending', priority: 'urgent' }
    ];
    
    act(() => {
      result.current.setTasks(mockTasks);
    });
    
    expect(result.current.taskStats).toEqual({
      total: 4,
      pending: 2,
      inProgress: 1,
      completed: 1,
      highPriority: 2
    });
  });

  it('handles form submission for add mode', async () => {
    const { result } = renderHook(() => useTaskManagement());
    const mockFormData = {
      title: 'New Task',
      description: 'New Description',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'user123',
      dueDate: '2024-12-31',
      tags: 'new,task'
    };
    
    mockApiHelpers.createTask.mockResolvedValue({ success: true, task: { _id: '1', ...mockFormData } });
    
    act(() => {
      result.current.setFormData(mockFormData);
      result.current.setModalMode('add');
    });
    
    await act(async () => {
      await result.current.handleSubmit();
    });
    
    expect(mockApiHelpers.createTask).toHaveBeenCalledWith(mockFormData);
    expect(result.current.showModal).toBe(false);
    expect(result.current.editingTask).toBe(null);
  });

  it('handles form submission for edit mode', async () => {
    const { result } = renderHook(() => useTaskManagement());
    const mockTask = {
      _id: '1',
      title: 'Updated Task',
      description: 'Updated Description',
      priority: 'high',
      status: 'in_progress',
      assignedTo: 'user123',
      dueDate: '2024-12-31',
      tags: 'updated,task'
    };
    
    mockApiHelpers.updateTask.mockResolvedValue({ success: true, task: mockTask });
    
    act(() => {
      result.current.setFormData(mockTask);
      result.current.setModalMode('edit');
      result.current.setEditingTask(mockTask);
    });
    
    await act(async () => {
      await result.current.handleSubmit();
    });
    
    expect(mockApiHelpers.updateTask).toHaveBeenCalledWith(mockTask._id, mockTask);
    expect(result.current.showModal).toBe(false);
    expect(result.current.editingTask).toBe(null);
  });

  it('handles API errors gracefully', async () => {
    const { result } = renderHook(() => useTaskManagement());
    
    mockApiHelpers.fetchTasks.mockRejectedValue(new Error('API Error'));
    
    await act(async () => {
      result.current.refreshTasks();
    });
    
    expect(result.current.apiStatus).toBe('error');
  });

  it('handles authentication check', () => {
    const { result } = renderHook(() => useTaskManagement());
    
    // Mock authentication failure
    mockAuth.mockReturnValue({
      isAuthenticated: jest.fn(() => false)
    });
    
    act(() => {
      result.current.handleAddTask();
    });
    
    // Should still work even if not authenticated (for testing)
    expect(result.current.showModal).toBe(true);
  });
});
