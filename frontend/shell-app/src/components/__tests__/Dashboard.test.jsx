import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';

// Mock CSS import
jest.mock('../Dashboard.css', () => ({}));

// Mock shared components
jest.mock('sharedComponents/useAuth', () => ({
  useAuth: jest.fn(() => ({
    isAuthenticated: jest.fn(() => true),
    user: { id: '1', name: 'Test User' }
  }))
}));

jest.mock('sharedComponents/unifiedApiClient', () => ({
  apiHelpers: {
    fetchTasks: jest.fn(),
    fetchUsers: jest.fn(),
    fetchNotifications: jest.fn()
  }
}));

jest.mock('sharedComponents/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

// Mock Chart.js components
jest.mock('react-chartjs-2', () => ({
  Bar: ({ data }) => <div data-testid="bar-chart">{JSON.stringify(data)}</div>,
  Doughnut: ({ data }) => <div data-testid="doughnut-chart">{JSON.stringify(data)}</div>,
  Pie: ({ data }) => <div data-testid="pie-chart">{JSON.stringify(data)}</div>,
  Line: ({ data }) => <div data-testid="line-chart">{JSON.stringify(data)}</div>
}));

// Mock Chart.js registration
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn()
  },
  CategoryScale: {},
  LinearScale: {},
  BarElement: {},
  Title: {},
  Tooltip: {},
  Legend: {},
  ArcElement: {},
  PointElement: {},
  LineElement: {}
}));

import { apiHelpers } from 'sharedComponents/unifiedApiClient';

describe('Dashboard', () => {
  const mockTasks = [
    {
      _id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'completed',
      priority: 'high',
      dueDate: new Date('2024-12-31'),
      createdAt: new Date('2024-01-01')
    },
    {
      _id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date('2024-12-30'),
      createdAt: new Date('2024-01-02')
    },
    {
      _id: '3',
      title: 'Task 3',
      description: 'Description 3',
      status: 'in_progress',
      priority: 'low',
      dueDate: new Date('2023-12-01'), // Overdue
      createdAt: new Date('2024-01-03')
    }
  ];

  const mockUsers = [
    { _id: '1', name: 'User 1', isActive: true },
    { _id: '2', name: 'User 2', isActive: false }
  ];

  const mockNotifications = [
    { _id: '1', message: 'Notification 1', read: false },
    { _id: '2', message: 'Notification 2', read: true }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    apiHelpers.fetchTasks.mockResolvedValue({ tasks: mockTasks });
    apiHelpers.fetchUsers.mockResolvedValue({ users: mockUsers });
    apiHelpers.fetchNotifications.mockResolvedValue({ notifications: mockNotifications });
  });

  it('renders without crashing', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
  });

  it('shows loading spinner initially', () => {
    render(<Dashboard />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('fetches dashboard data on mount', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(apiHelpers.fetchTasks).toHaveBeenCalled();
      expect(apiHelpers.fetchUsers).toHaveBeenCalled();
      expect(apiHelpers.fetchNotifications).toHaveBeenCalled();
    });
  });

  it('displays task statistics', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Total Tasks/i)).toBeInTheDocument();
      expect(screen.getByText(/Completed Tasks/i)).toBeInTheDocument();
      expect(screen.getByText(/Pending Tasks/i)).toBeInTheDocument();
      expect(screen.getByText(/In Progress Tasks/i)).toBeInTheDocument();
      expect(screen.getByText(/Overdue Tasks/i)).toBeInTheDocument();
    });
  });

  it('displays correct task counts', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      // Total tasks
      const totalTasksCard = screen.getByText(/Total Tasks/i).closest('.card');
      expect(totalTasksCard).toHaveTextContent('3');
      
      // Completed tasks
      const completedTasksCard = screen.getByText(/Completed Tasks/i).closest('.card');
      expect(completedTasksCard).toHaveTextContent('1');
      
      // Pending tasks
      const pendingTasksCard = screen.getByText(/Pending Tasks/i).closest('.card');
      expect(pendingTasksCard).toHaveTextContent('1');
    });
  });

  it('renders task status distribution chart', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByText(/Task Status Distribution/i)).toBeInTheDocument();
    });
  });

  it('renders task priority distribution chart', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByText(/Task Priority Distribution/i)).toBeInTheDocument();
    });
  });

  it('renders task trends chart', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByText(/Task Trends/i)).toBeInTheDocument();
    });
  });

  it('renders system overview chart', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
      expect(screen.getByText(/System Overview/i)).toBeInTheDocument();
    });
  });

  it('displays recent activity section', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    apiHelpers.fetchTasks.mockRejectedValue(new Error('API Error'));
    apiHelpers.fetchUsers.mockResolvedValue({ users: [] });
    apiHelpers.fetchNotifications.mockResolvedValue({ notifications: [] });

    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load dashboard data/i)).toBeInTheDocument();
    });
  });

  it('shows error when user is not authenticated', async () => {
    const { useAuth } = require('sharedComponents/useAuth');
    useAuth.mockReturnValue({
      isAuthenticated: jest.fn(() => false),
      user: null
    });

    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Please log in to view dashboard/i)).toBeInTheDocument();
    });
  });

  it('handles empty data gracefully', async () => {
    apiHelpers.fetchTasks.mockResolvedValue({ tasks: [] });
    apiHelpers.fetchUsers.mockResolvedValue({ users: [] });
    apiHelpers.fetchNotifications.mockResolvedValue({ notifications: [] });

    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Total Tasks/i)).toBeInTheDocument();
      expect(screen.getByText(/No recent activity/i)).toBeInTheDocument();
    });
  });

  it('refreshes data when refresh button is clicked', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(apiHelpers.fetchTasks).toHaveBeenCalledTimes(1);
    });

    const refreshButton = screen.getByText(/Refresh/i);
    fireEvent.click(refreshButton);
    
    await waitFor(() => {
      expect(apiHelpers.fetchTasks).toHaveBeenCalledTimes(2);
    });
  });

  it('handles API errors gracefully for individual services', async () => {
    apiHelpers.fetchTasks.mockRejectedValue(new Error('Tasks API Error'));
    apiHelpers.fetchUsers.mockResolvedValue({ users: mockUsers });
    apiHelpers.fetchNotifications.mockResolvedValue({ notifications: mockNotifications });

    render(<Dashboard />);
    
    await waitFor(() => {
      // Should still render with partial data
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
  });

  it('calculates overdue tasks correctly', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      const overdueCard = screen.getByText(/Overdue Tasks/i).closest('.card');
      expect(overdueCard).toHaveTextContent('1'); // One overdue task
    });
  });

  it('displays completion rate in completed tasks card', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      const completedCard = screen.getByText(/Completed Tasks/i).closest('.card');
      expect(completedCard).toHaveTextContent('% completion rate');
    });
  });

  it('groups recent activity by status', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Completed Tasks/i)).toBeInTheDocument();
      expect(screen.getByText(/Pending Tasks/i)).toBeInTheDocument();
      expect(screen.getByText(/Overdue Tasks/i)).toBeInTheDocument();
    });
  });

  it('renders refresh button', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Refresh/i)).toBeInTheDocument();
    });
  });
});


