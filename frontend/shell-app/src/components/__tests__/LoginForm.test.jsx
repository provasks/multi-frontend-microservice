import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';

// Mock CSS import
jest.mock('../LoginForm.css', () => ({}));

// Mock the API
jest.mock('../../utils/api', () => ({
  authApi: {
    post: jest.fn()
  }
}));

// Mock window.showSuccess and window.showError
global.window.showSuccess = jest.fn();
global.window.showError = jest.fn();

import { authApi } from '../../utils/api';

describe('LoginForm', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    delete window.showSuccess;
    delete window.showError;
    window.showSuccess = jest.fn();
    window.showError = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    expect(screen.getByText(/TaskFlow/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });

  it('renders email and password input fields', () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('renders sign in button', () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('updates email input when user types', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    await user.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('updates password input when user types', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    const passwordInput = screen.getByLabelText(/Password/i);
    await user.type(passwordInput, 'password123');
    
    expect(passwordInput).toHaveValue('password123');
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Valid email is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for empty password', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it('calls onLogin with token on successful login', async () => {
    const user = userEvent.setup();
    const mockToken = 'test-token-123';
    authApi.post.mockResolvedValue({
      data: { token: mockToken }
    });

    render(<LoginForm onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(authApi.post).toHaveBeenCalledWith('/auth/login', expect.objectContaining({
        email: 'test@example.com',
        password: 'password123'
      }));
      expect(mockOnLogin).toHaveBeenCalledWith(mockToken);
    });
  });

  it('shows success message on successful login', async () => {
    const user = userEvent.setup();
    authApi.post.mockResolvedValue({
      data: { token: 'test-token' }
    });

    render(<LoginForm onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(window.showSuccess).toHaveBeenCalledWith('Login successful!');
    });
  });

  it('shows error message on API error', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid credentials';
    authApi.post.mockRejectedValue({
      response: {
        status: 401,
        data: { error: errorMessage }
      }
    });

    render(<LoginForm onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(window.showError).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('shows error message when server is not responding', async () => {
    const user = userEvent.setup();
    authApi.post.mockRejectedValue({
      request: {},
      message: 'Network Error'
    });

    render(<LoginForm onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/No response from server/i)).toBeInTheDocument();
    });
  });

  it('shows loading state when submitting', async () => {
    const user = userEvent.setup();
    authApi.post.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ data: { token: 'test' } }), 100)));

    render(<LoginForm onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    expect(screen.getByText(/Signing in/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('clears error when user starts typing', async () => {
    const user = userEvent.setup();
    authApi.post.mockRejectedValue({
      response: {
        status: 401,
        data: { error: 'Invalid credentials' }
      }
    });

    render(<LoginForm onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
    
    await user.type(emailInput, 'x');
    
    await waitFor(() => {
      expect(screen.queryByText(/Invalid credentials/i)).not.toBeInTheDocument();
    });
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    const passwordInput = screen.getByLabelText(/Password/i);
    const toggleButton = screen.getByRole('button', { name: '' }); // Password toggle button
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    await user.type(passwordInput, 'password123');
    await user.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    await user.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('sanitizes form data before sending', async () => {
    const user = userEvent.setup();
    authApi.post.mockResolvedValue({
      data: { token: 'test-token' }
    });

    render(<LoginForm onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    
    // Enter potentially malicious input
    await user.type(emailInput, 'test<script>alert("xss")</script>@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(authApi.post).toHaveBeenCalledWith('/auth/login', expect.objectContaining({
        email: expect.stringContaining('&lt;script&gt;'),
        password: 'password123'
      }));
    });
  });

  it('renders demo credentials section', () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    expect(screen.getByText(/Demo Credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/password123/i)).toBeInTheDocument();
  });

  it('prevents form submission with invalid data', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(authApi.post).not.toHaveBeenCalled();
      expect(mockOnLogin).not.toHaveBeenCalled();
    });
  });
});


