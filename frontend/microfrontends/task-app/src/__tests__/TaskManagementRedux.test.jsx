import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskManagementRedux from '../TaskManagementRedux';

// Mock the shared components
jest.mock('sharedComponents/SearchBar', () => {
  return function MockSearchBar({ onSearchChange, onClearSearch, searchTerm }) {
    return (
      <div data-testid="search-bar">
        <input
          data-testid="search-input"
          value={searchTerm || ''}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button data-testid="clear-search" onClick={onClearSearch}>
          Clear
        </button>
      </div>
    );
  };
});

jest.mock('sharedComponents/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

// Mock Redux hooks
const mockUseTasks = jest.fn();
const mockUseAuth = jest.fn();
const mockUseUI = jest.fn();

jest.mock('sharedComponents/ReduxHooks', () => ({
  useTasks: () => mockUseTasks(),
  useAuth: () => mockUseAuth(),
  useUI: () => mockUseUI()
}));

describe('TaskManagementRedux Component', () => {
  const user = userEvent.setup();

  const mockTasks = [
    {
      id: '1',
      title: 'Test Task 1',
      description: 'Test Description 1',
      priority: 'high',
      status: 'pending',
      assignedTo: 'user1@example.com',
      dueDate: '2024-12-31T10:00:00Z',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      title: 'Test Task 2',
      description: 'Test Description 2',
      priority: 'medium',
      status: 'in_progress',
      assignedTo: 'user2@example.com',
      dueDate: '2024-12-30T10:00:00Z',
      createdAt: '2024-01-02T00:00:00Z'
    }
  ];

  const mockTaskActions = {
    fetchTasks: jest.fn(),
    addTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn()
  };

  const mockAuthActions = {
    login: jest.fn(),
    logout: jest.fn()
  };

  const mockUIActions = {
    showModal: jest.fn(),
    hideModal: jest.fn(),
    showNotification: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockUseTasks.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      ...mockTaskActions
    });

    mockUseAuth.mockReturnValue({
      user: { id: '1', name: 'Test User', role: 'admin' },
      isAuthenticated: true,
      ...mockAuthActions
    });

    mockUseUI.mockReturnValue({
      modals: { taskModal: false },
      notifications: [],
      ...mockUIActions
    });
  });

  it('renders task management interface', () => {
    render(<TaskManagementRedux />);
    
    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });

  it('displays tasks in table', () => {
    render(<TaskManagementRedux />);
    
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Description 2')).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      isLoading: true,
      error: null,
      ...mockTaskActions
    });

    render(<TaskManagementRedux />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      isLoading: false,
      error: 'Failed to load tasks',
      ...mockTaskActions
    });

    render(<TaskManagementRedux />);
    
    expect(screen.getByText('Failed to load tasks')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    render(<TaskManagementRedux />);
    
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'Test Task 1');
    
    // Should filter tasks based on search
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
  });

  it('handles clear search functionality', async () => {
    render(<TaskManagementRedux />);
    
    const searchInput = screen.getByTestId('search-input');
    const clearButton = screen.getByTestId('clear-search');
    
    // Type search term
    await user.type(searchInput, 'Test Task 1');
    
    // Clear search
    await user.click(clearButton);
    
    // Should show all tasks again
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('handles task creation', async () => {
    render(<TaskManagementRedux />);
    
    const addButton = screen.getByText('Add Task');
    await user.click(addButton);
    
    // Should open task modal
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
  });

  it('handles task editing', async () => {
    render(<TaskManagementRedux />);
    
    const editButton = screen.getByText('Edit');
    await user.click(editButton);
    
    // Should open task modal with existing task data
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });

  it('handles task deletion', async () => {
    // Mock window.confirm
    window.confirm = jest.fn(() => true);
    
    render(<TaskManagementRedux />);
    
    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this task?');
    expect(mockTaskActions.deleteTask).toHaveBeenCalledWith('1');
  });

  it('does not delete task when confirmation is cancelled', async () => {
    // Mock window.confirm to return false
    window.confirm = jest.fn(() => false);
    
    render(<TaskManagementRedux />);
    
    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this task?');
    expect(mockTaskActions.deleteTask).not.toHaveBeenCalled();
  });

  it('handles task form submission for new task', async () => {
    render(<TaskManagementRedux />);
    
    // Open add task modal
    const addButton = screen.getByText('Add Task');
    await user.click(addButton);
    
    // Fill form
    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByText('Save Task');
    
    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'New Description');
    await user.click(submitButton);
    
    expect(mockTaskActions.addTask).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Task',
        description: 'New Description'
      })
    );
  });

  it('handles task form submission for existing task', async () => {
    render(<TaskManagementRedux />);
    
    // Open edit task modal
    const editButton = screen.getByText('Edit');
    await user.click(editButton);
    
    // Modify form
    const titleInput = screen.getByLabelText('Title');
    const submitButton = screen.getByText('Save Task');
    
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Task');
    await user.click(submitButton);
    
    expect(mockTaskActions.updateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        title: 'Updated Task'
      })
    );
  });

  it('handles modal close', async () => {
    render(<TaskManagementRedux />);
    
    // Open modal
    const addButton = screen.getByText('Add Task');
    await user.click(addButton);
    
    // Close modal
    const closeButton = screen.getByText('Cancel');
    await user.click(closeButton);
    
    // Modal should be closed
    expect(screen.queryByText('Add New Task')).not.toBeInTheDocument();
  });

  it('handles priority filtering', async () => {
    render(<TaskManagementRedux />);
    
    const priorityFilter = screen.getByLabelText('Priority');
    await user.selectOptions(priorityFilter, 'high');
    
    // Should filter tasks by priority
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
  });

  it('handles status filtering', async () => {
    render(<TaskManagementRedux />);
    
    const statusFilter = screen.getByLabelText('Status');
    await user.selectOptions(statusFilter, 'pending');
    
    // Should filter tasks by status
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
  });

  it('handles pagination', async () => {
    // Mock more tasks for pagination
    const manyTasks = Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Task ${i + 1}`,
      description: `Description ${i + 1}`,
      priority: 'medium',
      status: 'pending',
      assignedTo: `user${i + 1}@example.com`,
      dueDate: '2024-12-31T10:00:00Z',
      createdAt: '2024-01-01T00:00:00Z'
    }));

    mockUseTasks.mockReturnValue({
      tasks: manyTasks,
      isLoading: false,
      error: null,
      ...mockTaskActions
    });

    render(<TaskManagementRedux />);
    
    // Should show pagination controls
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });

  it('handles empty task list', () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      isLoading: false,
      error: null,
      ...mockTaskActions
    });

    render(<TaskManagementRedux />);
    
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });

  it('handles Redux not available fallback', () => {
    // Mock require to throw an error
    const originalRequire = require;
    require = jest.fn(() => {
      throw new Error('Module not found');
    });

    render(<TaskManagementRedux />);
    
    // Should still render with fallback state
    expect(screen.getByText('Task Management')).toBeInTheDocument();
    
    // Restore require
    require = originalRequire;
  });

  it('handles task assignment', async () => {
    render(<TaskManagementRedux />);
    
    const assignButton = screen.getByText('Assign');
    await user.click(assignButton);
    
    // Should open assignment modal or handle assignment
    expect(screen.getByText('Assign Task')).toBeInTheDocument();
  });

  it('handles task completion', async () => {
    render(<TaskManagementRedux />);
    
    const completeButton = screen.getByText('Complete');
    await user.click(completeButton);
    
    expect(mockTaskActions.updateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        status: 'completed'
      })
    );
  });
});
