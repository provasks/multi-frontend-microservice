import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskManagementRedux from '../TaskManagementRedux';

// Mock the shared components
jest.mock('../components/TaskTable', () => () => <div data-testid="task-table">TaskTable</div>);
jest.mock('../components/TaskModal', () => () => <div data-testid="task-modal">TaskModal</div>);
jest.mock('sharedComponents/SearchBar', () => () => <div data-testid="search-bar">SearchBar</div>);
jest.mock('sharedComponents/LoadingSpinner', () => () => <div data-testid="loading-spinner">LoadingSpinner</div>);

// Mock the Redux hooks
jest.mock('sharedComponents/store/hooks', () => ({
  useTasks: jest.fn(),
  useAuth: jest.fn(),
  useUI: jest.fn(),
}));

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();

describe('TaskManagementRedux Component', () => {
  const { useTasks, useAuth, useUI } = require('sharedComponents/store/hooks');
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleLog.mockClear();
    mockConsoleWarn.mockClear();
  });

  it('renders with Redux state when Redux is available', () => {
    // Mock Redux state
    useTasks.mockReturnValue({
      tasks: [{ _id: '1', title: 'Test Task' }],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalTasks: 1,
      searchTerm: '',
    });
    
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { _id: 'user1', name: 'Test User' },
    });
    
    useUI.mockReturnValue({
      showModal: false,
      modalMode: 'add',
      formData: {},
      formErrors: {},
    });

    render(<TaskManagementRedux />);
    
    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('task-table')).toBeInTheDocument();
    expect(mockConsoleLog).toHaveBeenCalledWith('✅ Using Redux for state management');
  });

  it('renders with local state when Redux is not available', () => {
    // Mock require to throw an error
    jest.doMock('sharedComponents/store/hooks', () => {
      throw new Error('Redux not available');
    });

    render(<TaskManagementRedux />);
    
    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('task-table')).toBeInTheDocument();
    expect(mockConsoleWarn).toHaveBeenCalledWith('Redux not available, falling back to local state:', 'Redux not available');
  });

  it('renders loading state', () => {
    useTasks.mockReturnValue({
      tasks: [],
      loading: true,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalTasks: 0,
      searchTerm: '',
    });
    
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: null,
    });
    
    useUI.mockReturnValue({
      showModal: false,
      modalMode: 'add',
      formData: {},
      formErrors: {},
    });

    render(<TaskManagementRedux />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error state', () => {
    useTasks.mockReturnValue({
      tasks: [],
      loading: false,
      error: 'Failed to fetch tasks',
      currentPage: 1,
      totalPages: 1,
      totalTasks: 0,
      searchTerm: '',
    });
    
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: null,
    });
    
    useUI.mockReturnValue({
      showModal: false,
      modalMode: 'add',
      formData: {},
      formErrors: {},
    });

    render(<TaskManagementRedux />);
    
    expect(screen.getByText('Error!')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch tasks')).toBeInTheDocument();
  });

  it('renders with tasks', () => {
    const mockTasks = [
      { _id: '1', title: 'Task 1', priority: 'high', status: 'pending' },
      { _id: '2', title: 'Task 2', priority: 'low', status: 'completed' },
    ];

    useTasks.mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalTasks: 2,
      searchTerm: '',
    });
    
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { _id: 'user1', name: 'Test User' },
    });
    
    useUI.mockReturnValue({
      showModal: false,
      modalMode: 'add',
      formData: {},
      formErrors: {},
    });

    render(<TaskManagementRedux />);
    
    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByTestId('task-table')).toBeInTheDocument();
  });

  it('renders modal when showModal is true', () => {
    useTasks.mockReturnValue({
      tasks: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalTasks: 0,
      searchTerm: '',
    });
    
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: null,
    });
    
    useUI.mockReturnValue({
      showModal: true,
      modalMode: 'add',
      formData: { title: '', description: '' },
      formErrors: {},
    });

    render(<TaskManagementRedux />);
    
    expect(screen.getByTestId('task-modal')).toBeInTheDocument();
  });
});