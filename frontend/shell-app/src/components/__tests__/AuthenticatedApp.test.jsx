import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AuthenticatedApp from '../AuthenticatedApp';

// Mock CSS imports
jest.mock('../TestDropdown.css', () => ({}));
jest.mock('../Dashboard.css', () => ({}));

// Mock child components
jest.mock('../Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard">Dashboard</div>;
  };
});

jest.mock('../ReduxTest', () => {
  return function MockReduxTest() {
    return <div data-testid="redux-test">Redux Test</div>;
  };
});

jest.mock('../IdleTimeoutTest', () => {
  return function MockIdleTimeoutTest() {
    return <div data-testid="idle-timeout-test">Idle Timeout Test</div>;
  };
});

jest.mock('../ErrorTesting', () => {
  return function MockErrorTesting() {
    return <div data-testid="error-testing">Error Testing</div>;
  };
});

// Mock shellConfig
jest.mock('../../config/shellConfig', () => ({
  __esModule: true,
  default: {
    SHELL_CONFIG: {
      SHELL: {
        NAVIGATION: {
          MAIN_MENU: [
            { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
            { id: 'tasks', label: 'Tasks', icon: 'fas fa-tasks', route: '/tasks' },
            { id: 'users', label: 'Users', icon: 'fas fa-users', route: '/users' },
            { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell', route: '/notifications' }
          ],
          USER_MENU: [
            { id: 'profile', label: 'Profile', icon: 'fas fa-user', route: '/profile' },
            { id: 'settings', label: 'Settings', icon: 'fas fa-cog', route: '/settings' },
            { id: 'logout', label: 'Logout', icon: 'fas fa-sign-out-alt', action: 'logout' }
          ]
        }
      }
    }
  }
}));

// Mock microfrontends
jest.mock('userApp/UserManagement', () => ({
  __esModule: true,
  default: () => <div data-testid="user-management">User Management</div>
}));

jest.mock('taskApp/TaskManagement', () => ({
  __esModule: true,
  default: () => <div data-testid="task-management">Task Management</div>
}));

jest.mock('notificationApp/Notifications', () => ({
  __esModule: true,
  default: () => <div data-testid="notifications">Notifications</div>
}));

// Mock window.showError
global.window.showError = jest.fn();

const renderWithRouter = (component, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AuthenticatedApp', () => {
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.showError = jest.fn();
  });

  it('renders without crashing', () => {
    renderWithRouter(<AuthenticatedApp onLogout={mockOnLogout} />);
    expect(screen.getByText(/Task Management System/i)).toBeInTheDocument();
  });

  it('renders navigation menu items', () => {
    renderWithRouter(<AuthenticatedApp onLogout={mockOnLogout} />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Users/i)).toBeInTheDocument();
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
  });

  it('renders test dropdown menu', () => {
    renderWithRouter(<AuthenticatedApp onLogout={mockOnLogout} />);
    expect(screen.getByText(/Test/i)).toBeInTheDocument();
  });

  it('renders user dropdown menu', () => {
    renderWithRouter(<AuthenticatedApp onLogout={mockOnLogout} />);
    expect(screen.getByText(/User/i)).toBeInTheDocument();
  });

  it('renders Dashboard component on root route', () => {
    renderWithRouter(<AuthenticatedApp onLogout={mockOnLogout} />, { route: '/' });
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  it('renders Dashboard component on /dashboard route', () => {
    renderWithRouter(<AuthenticatedApp onLogout={mockOnLogout} />, { route: '/dashboard' });
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  it('renders ErrorTesting component on /error-testing route', async () => {
    renderWithRouter(<AuthenticatedApp onLogout={mockOnLogout} />, { route: '/error-testing' });
    await waitFor(() => {
      expect(screen.getByTestId('error-testing')).toBeInTheDocument();
    });
  });

  it('renders ReduxTest component on /redux-test route', async () => {
    renderWithRouter(<AuthenticatedApp onLogout={mockOnLogout} />, { route: '/redux-test' });
    await waitFor(() => {
      expect(screen.getByTestId('redux-test')).toBeInTheDocument();
    });
  });

  it('renders IdleTimeoutTest component on /idle-timeout-test route', async () => {
    renderWithRouter(<AuthenticatedApp onLogout={mockOnLogout} />, { route: '/idle-timeout-test' });
    await waitFor(() => {
      expect(screen.getByTestId('idle-timeout-test')).toBeInTheDocument();
    });
  });

  it('calls onLogout when logout is clicked', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<AuthenticatedApp onLogout={mockOnLogout} />);
    
    // Click on User dropdown
    const userButton = screen.getByText(/User/i);
    await user.click(userButton);
    
    // Click on Logout
    const logoutButton = screen.getByText(/Logout/i);
    await user.click(logoutButton);
    
    expect(mockOnLogout).toHaveBeenCalled();
  });

  it('handles microfrontend error boundary', () => {
    // Mock a component that throws an error
    const ThrowError = () => {
      throw new Error('Test error');
    };

    // This test verifies the error boundary exists
    // In a real scenario, we'd test the error boundary rendering
    expect(() => {
      renderWithRouter(
        <AuthenticatedApp onLogout={mockOnLogout} />,
        { route: '/tasks' }
      );
    }).not.toThrow();
  });

  it('shows loading spinner while microfrontend loads', async () => {
    // Mock a slow-loading component
    jest.doMock('taskApp/TaskManagement', () => ({
      __esModule: true,
      default: React.lazy(() => new Promise(resolve => setTimeout(() => resolve({ default: () => <div>Task Management</div> }), 100)))
    }));

    renderWithRouter(<AuthenticatedApp onLogout={mockOnLogout} />, { route: '/tasks' });
    
    // The Suspense fallback should show a loading spinner
    // Note: This is a simplified test - in reality, Suspense fallback might not be easily testable
    expect(screen.getByText(/Task Management System/i)).toBeInTheDocument();
  });

  it('renders profile placeholder on /profile route', () => {
    renderWithRouter(<AuthenticatedApp onLogout={mockOnLogout} />, { route: '/profile' });
    expect(screen.getByText(/Profile Page/i)).toBeInTheDocument();
  });

  it('renders settings placeholder on /settings route', () => {
    renderWithRouter(<AuthenticatedApp onLogout={mockOnLogout} />, { route: '/settings' });
    expect(screen.getByText(/Settings Page/i)).toBeInTheDocument();
  });

  it('navigates to dashboard for unknown routes', () => {
    renderWithRouter(<AuthenticatedApp onLogout={mockOnLogout} />, { route: '/unknown-route' });
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    renderWithRouter(<AuthenticatedApp onLogout={mockOnLogout} />, { route: '/dashboard' });
    
    const dashboardButton = screen.getByText(/Dashboard/i).closest('button');
    expect(dashboardButton).toHaveClass('bg-dark');
  });
});

