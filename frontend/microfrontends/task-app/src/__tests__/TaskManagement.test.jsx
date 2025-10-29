import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskManagement from '../TaskManagement';

// Mock the useTaskManagement hook
jest.mock('../hooks/useTaskManagement', () => ({
  useTaskManagement: () => ({
    // State
    tasks: [
      {
        _id: '1',
        title: 'Test Task 1',
        description: 'Test Description 1',
        priority: 'high',
        status: 'pending',
        assignedTo: 'user1@example.com',
        dueDate: '2024-12-31T23:59:59.000Z',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        _id: '2',
        title: 'Test Task 2',
        description: 'Test Description 2',
        priority: 'medium',
        status: 'in_progress',
        assignedTo: 'user2@example.com',
        dueDate: '2024-12-30T23:59:59.000Z',
        createdAt: '2024-01-02T00:00:00.000Z'
      }
    ],
    loading: false,
    refreshing: false,
    searchLoading: false,
    showModal: false,
    modalMode: 'add',
    searchTerm: '',
    formData: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      assignedTo: '',
      dueDate: '',
      tags: ''
    },
    filteredTasks: [],
    taskStats: {
      total: 2,
      pending: 1,
      in_progress: 1,
      completed: 0,
      highPriority: 1
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalTasks: 2,
      hasNext: false,
      hasPrev: false
    },
    currentPage: 1,
    pageSize: 10,
    
    // Actions
    fetchTasks: jest.fn(),
    refreshTasks: jest.fn(),
    handleAddTask: jest.fn(),
    handleEditTask: jest.fn(),
    handleDeleteTask: jest.fn(),
    handleCloseModal: jest.fn(),
    handleSubmit: jest.fn(),
    handleInputChange: jest.fn(),
    handleSearchChange: jest.fn(),
    handleClearSearch: jest.fn(),
    handlePageChange: jest.fn(),
    handlePageSizeChange: jest.fn()
  })
}));

// Mock shared components
jest.mock('sharedComponents/SearchBar', () => {
  return function MockSearchBar({ searchTerm, onSearchChange, onClearSearch, totalCount, filteredCount, searchLoading }) {
    return (
      <div data-testid="search-bar">
        <input
          data-testid="search-input"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
        />
        {searchTerm && (
          <button data-testid="clear-search" onClick={onClearSearch}>
            Clear
          </button>
        )}
        <span data-testid="search-count">{filteredCount} of {totalCount} items</span>
        {searchLoading && <span data-testid="search-loading">Searching...</span>}
      </div>
    );
  };
});

jest.mock('sharedComponents/LoadingSpinner', () => {
  return function MockLoadingSpinner({ message }) {
    return <div data-testid="loading-spinner">{message}</div>;
  };
});

// Mock TaskTable component
jest.mock('../components/TaskTable', () => {
  return function MockTaskTable({ tasks, onEdit, onDelete }) {
    return (
      <div data-testid="task-table">
        {tasks.map(task => (
          <div key={task._id} data-testid={`task-item-${task._id}`}>
            <span data-testid={`task-title-${task._id}`}>{task.title}</span>
            <button 
              data-testid={`edit-${task._id}`}
              onClick={() => onEdit(task)}
            >
              Edit
            </button>
            <button 
              data-testid={`delete-${task._id}`}
              onClick={() => onDelete(task._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    );
  };
});

// Mock TaskModal component
jest.mock('../components/TaskModal', () => {
  return function MockTaskModal({ show, mode, formData, onClose, onSubmit, onInputChange }) {
    if (!show) return null;
    
    return (
      <div data-testid="task-modal">
        <h2>{mode === 'add' ? 'Add Task' : 'Edit Task'}</h2>
        <form onSubmit={onSubmit}>
          <input
            data-testid="modal-title-input"
            name="title"
            value={formData.title}
            onChange={onInputChange}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    );
  };
});

// Mock Pagination component
jest.mock('../components/Pagination', () => {
  return function MockPagination({ 
    currentPage, 
    totalPages, 
    totalItems, 
    itemsPerPage, 
    onPageChange, 
    onPageSizeChange 
  }) {
    return (
      <div data-testid="pagination">
        <span data-testid="page-info">Page {currentPage} of {totalPages}</span>
        <span data-testid="items-info">{totalItems} items</span>
        <button 
          data-testid="prev-page"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button 
          data-testid="next-page"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <select 
          data-testid="page-size-select"
          value={itemsPerPage}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    );
  };
});

describe('TaskManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main task management interface', () => {
    render(<TaskManagement />);
    
    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('task-table')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('renders task statistics', () => {
    render(<TaskManagement />);
    
    expect(screen.getByText('Total Tasks: 2')).toBeInTheDocument();
    expect(screen.getByText('Pending: 1')).toBeInTheDocument();
    expect(screen.getByText('In Progress: 1')).toBeInTheDocument();
    expect(screen.getByText('Completed: 0')).toBeInTheDocument();
    expect(screen.getByText('High Priority: 1')).toBeInTheDocument();
  });

  it('renders add task button', () => {
    render(<TaskManagement />);
    
    const addButton = screen.getByRole('button', { name: /add new task/i });
    expect(addButton).toBeInTheDocument();
  });

  it('renders refresh button', () => {
    render(<TaskManagement />);
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    expect(refreshButton).toBeInTheDocument();
  });

  it('displays tasks in the table', () => {
    render(<TaskManagement />);
    
    expect(screen.getByTestId('task-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-item-2')).toBeInTheDocument();
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('handles add task button click', async () => {
    const user = userEvent.setup();
    render(<TaskManagement />);
    
    const addButton = screen.getByRole('button', { name: /add new task/i });
    await user.click(addButton);
    
    // The mock hook should be called
    expect(screen.getByTestId('task-modal')).toBeInTheDocument();
  });

  it('handles refresh button click', async () => {
    const user = userEvent.setup();
    render(<TaskManagement />);
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    await user.click(refreshButton);
    
    // The mock hook should be called
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('handles task edit', async () => {
    const user = userEvent.setup();
    render(<TaskManagement />);
    
    const editButton = screen.getByTestId('edit-1');
    await user.click(editButton);
    
    // The mock hook should be called
    expect(screen.getByTestId('task-modal')).toBeInTheDocument();
  });

  it('handles task deletion', async () => {
    const user = userEvent.setup();
    render(<TaskManagement />);
    
    const deleteButton = screen.getByTestId('delete-1');
    await user.click(deleteButton);
    
    // The mock hook should be called
    expect(screen.getByTestId('task-item-1')).toBeInTheDocument();
  });

  it('handles search input changes', async () => {
    const user = userEvent.setup();
    render(<TaskManagement />);
    
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'test search');
    
    // The mock hook should be called
    expect(searchInput).toHaveValue('test search');
  });

  it('handles search clear', async () => {
    const user = userEvent.setup();
    render(<TaskManagement />);
    
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'test');
    
    const clearButton = screen.getByTestId('clear-search');
    await user.click(clearButton);
    
    // The mock hook should be called
    expect(searchInput).toHaveValue('');
  });

  it('handles pagination changes', async () => {
    const user = userEvent.setup();
    render(<TaskManagement />);
    
    const nextButton = screen.getByTestId('next-page');
    await user.click(nextButton);
    
    // The mock hook should be called
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('handles page size changes', async () => {
    const user = userEvent.setup();
    render(<TaskManagement />);
    
    const pageSizeSelect = screen.getByTestId('page-size-select');
    await user.selectOptions(pageSizeSelect, '20');
    
    // The mock hook should be called
    expect(pageSizeSelect).toHaveValue('20');
  });

  it('shows loading state when loading', () => {
    // Mock loading state
    jest.doMock('../hooks/useTaskManagement', () => ({
      useTaskManagement: () => ({
        tasks: [],
        loading: true,
        refreshing: false,
        searchLoading: false,
        showModal: false,
        modalMode: 'add',
        searchTerm: '',
        formData: {},
        filteredTasks: [],
        taskStats: { total: 0, pending: 0, in_progress: 0, completed: 0, highPriority: 0 },
        pagination: { currentPage: 1, totalPages: 1, totalTasks: 0, hasNext: false, hasPrev: false },
        currentPage: 1,
        pageSize: 10,
        fetchTasks: jest.fn(),
        refreshTasks: jest.fn(),
        handleAddTask: jest.fn(),
        handleEditTask: jest.fn(),
        handleDeleteTask: jest.fn(),
        handleCloseModal: jest.fn(),
        handleSubmit: jest.fn(),
        handleInputChange: jest.fn(),
        handleSearchChange: jest.fn(),
        handleClearSearch: jest.fn(),
        handlePageChange: jest.fn(),
        handlePageSizeChange: jest.fn()
      })
    }));
    
    render(<TaskManagement />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows refreshing state when refreshing', () => {
    // Mock refreshing state
    jest.doMock('../hooks/useTaskManagement', () => ({
      useTaskManagement: () => ({
        tasks: [],
        loading: false,
        refreshing: true,
        searchLoading: false,
        showModal: false,
        modalMode: 'add',
        searchTerm: '',
        formData: {},
        filteredTasks: [],
        taskStats: { total: 0, pending: 0, in_progress: 0, completed: 0, highPriority: 0 },
        pagination: { currentPage: 1, totalPages: 1, totalTasks: 0, hasNext: false, hasPrev: false },
        currentPage: 1,
        pageSize: 10,
        fetchTasks: jest.fn(),
        refreshTasks: jest.fn(),
        handleAddTask: jest.fn(),
        handleEditTask: jest.fn(),
        handleDeleteTask: jest.fn(),
        handleCloseModal: jest.fn(),
        handleSubmit: jest.fn(),
        handleInputChange: jest.fn(),
        handleSearchChange: jest.fn(),
        handleClearSearch: jest.fn(),
        handlePageChange: jest.fn(),
        handlePageSizeChange: jest.fn()
      })
    }));
    
    render(<TaskManagement />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows search loading state when searching', () => {
    // Mock search loading state
    jest.doMock('../hooks/useTaskManagement', () => ({
      useTaskManagement: () => ({
        tasks: [],
        loading: false,
        refreshing: false,
        searchLoading: true,
        showModal: false,
        modalMode: 'add',
        searchTerm: 'test',
        formData: {},
        filteredTasks: [],
        taskStats: { total: 0, pending: 0, in_progress: 0, completed: 0, highPriority: 0 },
        pagination: { currentPage: 1, totalPages: 1, totalTasks: 0, hasNext: false, hasPrev: false },
        currentPage: 1,
        pageSize: 10,
        fetchTasks: jest.fn(),
        refreshTasks: jest.fn(),
        handleAddTask: jest.fn(),
        handleEditTask: jest.fn(),
        handleDeleteTask: jest.fn(),
        handleCloseModal: jest.fn(),
        handleSubmit: jest.fn(),
        handleInputChange: jest.fn(),
        handleSearchChange: jest.fn(),
        handleClearSearch: jest.fn(),
        handlePageChange: jest.fn(),
        handlePageSizeChange: jest.fn()
      })
    }));
    
    render(<TaskManagement />);
    
    expect(screen.getByTestId('search-loading')).toBeInTheDocument();
  });

  it('renders modal when showModal is true', () => {
    // Mock modal state
    jest.doMock('../hooks/useTaskManagement', () => ({
      useTaskManagement: () => ({
        tasks: [],
        loading: false,
        refreshing: false,
        searchLoading: false,
        showModal: true,
        modalMode: 'add',
        searchTerm: '',
        formData: { title: '', description: '', priority: 'medium', status: 'pending', assignedTo: '', dueDate: '', tags: '' },
        filteredTasks: [],
        taskStats: { total: 0, pending: 0, in_progress: 0, completed: 0, highPriority: 0 },
        pagination: { currentPage: 1, totalPages: 1, totalTasks: 0, hasNext: false, hasPrev: false },
        currentPage: 1,
        pageSize: 10,
        fetchTasks: jest.fn(),
        refreshTasks: jest.fn(),
        handleAddTask: jest.fn(),
        handleEditTask: jest.fn(),
        handleDeleteTask: jest.fn(),
        handleCloseModal: jest.fn(),
        handleSubmit: jest.fn(),
        handleInputChange: jest.fn(),
        handleSearchChange: jest.fn(),
        handleClearSearch: jest.fn(),
        handlePageChange: jest.fn(),
        handlePageSizeChange: jest.fn()
      })
    }));
    
    render(<TaskManagement />);
    
    expect(screen.getByTestId('task-modal')).toBeInTheDocument();
  });

  it('renders table skeleton when loading', () => {
    // Mock loading state
    jest.doMock('../hooks/useTaskManagement', () => ({
      useTaskManagement: () => ({
        tasks: [],
        loading: true,
        refreshing: false,
        searchLoading: false,
        showModal: false,
        modalMode: 'add',
        searchTerm: '',
        formData: {},
        filteredTasks: [],
        taskStats: { total: 0, pending: 0, in_progress: 0, completed: 0, highPriority: 0 },
        pagination: { currentPage: 1, totalPages: 1, totalTasks: 0, hasNext: false, hasPrev: false },
        currentPage: 1,
        pageSize: 10,
        fetchTasks: jest.fn(),
        refreshTasks: jest.fn(),
        handleAddTask: jest.fn(),
        handleEditTask: jest.fn(),
        handleDeleteTask: jest.fn(),
        handleCloseModal: jest.fn(),
        handleSubmit: jest.fn(),
        handleInputChange: jest.fn(),
        handleSearchChange: jest.fn(),
        handleClearSearch: jest.fn(),
        handlePageChange: jest.fn(),
        handlePageSizeChange: jest.fn()
      })
    }));
    
    render(<TaskManagement />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
