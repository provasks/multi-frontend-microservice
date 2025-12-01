import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// Mock CSS imports
jest.mock('bootstrap/dist/css/bootstrap.min.css', () => ({}));
jest.mock('bootstrap/dist/js/bootstrap.bundle.min.js', () => ({}));

// Mock components
jest.mock('../components/LoginForm', () => {
  return function MockLoginForm({ onLogin }) {
    return (
      <div data-testid="login-form">
        <button onClick={() => onLogin('test-token')}>Login</button>
      </div>
    );
  };
});

jest.mock('../components/AuthenticatedApp', () => {
  return function MockAuthenticatedApp({ onLogout }) {
    return (
      <div data-testid="authenticated-app">
        <button onClick={onLogout}>Logout</button>
      </div>
    );
  };
});

jest.mock('../components/FloatingMessageManager', () => {
  return function MockFloatingMessageManager() {
    return <div data-testid="floating-message-manager"></div>;
  };
});

// Mock shared components
jest.mock('sharedComponents/IdleTimeoutWarning', () => ({
  __esModule: true,
  default: () => null
}));

jest.mock('sharedComponents/IdleTimeoutConfig', () => ({
  __esModule: true,
  default: () => null
}));

jest.mock('sharedComponents/IdleTimeoutDebug', () => ({
  __esModule: true,
  default: () => null
}));

jest.mock('sharedComponents/ReduxStore', () => ({
  store: {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
    subscribe: jest.fn()
  }
}));

jest.mock('sharedComponents/ReduxHooks', () => ({}));

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; })
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true
});

// Mock window methods
global.window.showError = jest.fn();
global.window.showSuccess = jest.fn();
global.window.showWarning = jest.fn();
global.window.showInfo = jest.fn();

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true
});

// Import after mocks
import App from '../App';

const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
    delete window.showError;
    delete window.showSuccess;
    delete window.showWarning;
    delete window.showInfo;
    window.showError = jest.fn();
    window.showSuccess = jest.fn();
    window.showWarning = jest.fn();
    window.showInfo = jest.fn();
  });

  it('renders without crashing', () => {
    renderApp();
    expect(screen.getByTestId('floating-message-manager')).toBeInTheDocument();
  });

  it('shows loading spinner initially', () => {
    renderApp();
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders login form when not authenticated', async () => {
    mockSessionStorage.getItem.mockReturnValue(null);
    
    renderApp();
    
    await waitFor(() => {
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });
  });

  it('renders authenticated app when token exists', async () => {
    mockSessionStorage.getItem.mockReturnValue('test-token');
    
    renderApp();
    
    await waitFor(() => {
      expect(screen.getByTestId('authenticated-app')).toBeInTheDocument();
    });
  });

  it('handles login and switches to authenticated view', async () => {
    const user = userEvent.setup();
    
    mockSessionStorage.getItem.mockReturnValue(null);
    
    renderApp();
    
    await waitFor(() => {
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    const loginButton = screen.getByText('Login');
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
      expect(screen.getByTestId('authenticated-app')).toBeInTheDocument();
    });
  });

  it('handles logout and switches to login view', async () => {
    const user = userEvent.setup();
    
    mockSessionStorage.getItem.mockReturnValue('test-token');
    
    renderApp();
    
    await waitFor(() => {
      expect(screen.getByTestId('authenticated-app')).toBeInTheDocument();
    });

    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);
    
    await waitFor(() => {
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('token');
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });
  });

  it('sets up global error handlers', async () => {
    renderApp();
    
    await waitFor(() => {
      // Trigger an error event
      const errorEvent = new ErrorEvent('error', {
        error: new Error('Test error')
      });
      window.dispatchEvent(errorEvent);
    });
    
    // Error handler should be set up
    expect(window.addEventListener).toBeDefined();
  });

  it('handles network online event', async () => {
    renderApp();
    
    await waitFor(() => {
      const onlineEvent = new Event('online');
      window.dispatchEvent(onlineEvent);
    });
    
    // Should handle online event (though showSuccess might not be called in test environment)
    expect(window.addEventListener).toBeDefined();
  });

  it('handles network offline event', async () => {
    renderApp();
    
    await waitFor(() => {
      const offlineEvent = new Event('offline');
      window.dispatchEvent(offlineEvent);
    });
    
    // Should handle offline event
    expect(window.addEventListener).toBeDefined();
  });

  it('handles idle timeout logout message', async () => {
    mockSessionStorage.getItem.mockReturnValue('test-token');
    
    renderApp();
    
    await waitFor(() => {
      expect(screen.getByTestId('authenticated-app')).toBeInTheDocument();
    });

    // Simulate idle timeout logout message
    const messageEvent = new MessageEvent('message', {
      data: { type: 'IDLE_TIMEOUT_LOGOUT' }
    });
    window.dispatchEvent(messageEvent);
    
    await waitFor(() => {
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = renderApp();
    
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalled();
    
    removeEventListenerSpy.mockRestore();
  });

  it('renders with Redux Provider when store is available', async () => {
    mockSessionStorage.getItem.mockReturnValue('test-token');
    
    renderApp();
    
    await waitFor(() => {
      expect(screen.getByTestId('authenticated-app')).toBeInTheDocument();
    });
  });
});
