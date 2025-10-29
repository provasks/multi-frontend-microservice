import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FloatingMessageManager from '../FloatingMessageManager';

// Mock CSS import
jest.mock('../FloatingMessageManager.css', () => ({}));

describe('FloatingMessageManager', () => {
  beforeEach(() => {
    // Clear any existing global functions
    delete window.showSuccess;
    delete window.showError;
    delete window.showWarning;
    delete window.showInfo;
  });

  afterEach(() => {
    // Cleanup after each test
    delete window.showSuccess;
    delete window.showError;
    delete window.showWarning;
    delete window.showInfo;
  });

  it('renders without crashing', () => {
    render(<FloatingMessageManager />);
    expect(screen.getByTestId('floating-message-container')).toBeInTheDocument();
  });

  it('creates global message functions on mount', () => {
    render(<FloatingMessageManager />);
    
    expect(typeof window.showSuccess).toBe('function');
    expect(typeof window.showError).toBe('function');
    expect(typeof window.showWarning).toBe('function');
    expect(typeof window.showInfo).toBe('function');
  });

  it('shows success message when showSuccess is called', async () => {
    render(<FloatingMessageManager />);
    
    window.showSuccess('Test success message');
    
    await waitFor(() => {
      expect(screen.getByText('Test success message')).toBeInTheDocument();
    });
    expect(screen.getByRole('alert')).toHaveClass('alert-success');
  });

  it('shows error message when showError is called', async () => {
    render(<FloatingMessageManager />);
    
    window.showError('Test error message');
    
    await waitFor(() => {
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });
    expect(screen.getByRole('alert')).toHaveClass('alert-danger');
  });

  it('shows warning message when showWarning is called', async () => {
    render(<FloatingMessageManager />);
    
    window.showWarning('Test warning message');
    
    await waitFor(() => {
      expect(screen.getByText('Test warning message')).toBeInTheDocument();
    });
    expect(screen.getByRole('alert')).toHaveClass('alert-warning');
  });

  it('shows info message when showInfo is called', async () => {
    render(<FloatingMessageManager />);
    
    window.showInfo('Test info message');
    
    await waitFor(() => {
      expect(screen.getByText('Test info message')).toBeInTheDocument();
    });
    expect(screen.getByRole('alert')).toHaveClass('alert-info');
  });

  it('can display multiple messages', async () => {
    render(<FloatingMessageManager />);
    
    window.showSuccess('First message');
    window.showError('Second message');
    window.showWarning('Third message');
    
    await waitFor(() => {
      expect(screen.getByText('First message')).toBeInTheDocument();
      expect(screen.getByText('Second message')).toBeInTheDocument();
      expect(screen.getByText('Third message')).toBeInTheDocument();
    });
    expect(screen.getAllByRole('alert')).toHaveLength(3);
  });

  it('removes message when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<FloatingMessageManager />);
    
    window.showSuccess('Test message');
    
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByRole('button');
    await user.click(closeButton);
    
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('auto-removes messages after timeout', async () => {
    jest.useFakeTimers();
    render(<FloatingMessageManager />);
    
    window.showSuccess('Test message');
    
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
    
    // Fast-forward time by 4 seconds
    jest.advanceTimersByTime(4000);
    
    await waitFor(() => {
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  it('cleans up global functions on unmount', () => {
    const { unmount } = render(<FloatingMessageManager />);
    
    expect(typeof window.showSuccess).toBe('function');
    
    unmount();
    
    expect(window.showSuccess).toBeUndefined();
    expect(window.showError).toBeUndefined();
    expect(window.showWarning).toBeUndefined();
    expect(window.showInfo).toBeUndefined();
  });

  it('handles multiple calls to the same message type', async () => {
    render(<FloatingMessageManager />);
    
    window.showSuccess('First success');
    window.showSuccess('Second success');
    
    await waitFor(() => {
      expect(screen.getByText('First success')).toBeInTheDocument();
      expect(screen.getByText('Second success')).toBeInTheDocument();
    });
    expect(screen.getAllByRole('alert')).toHaveLength(2);
  });

  it('generates unique IDs for messages', async () => {
    render(<FloatingMessageManager />);
    
    // Mock Date.now and Math.random to ensure unique IDs
    const originalDateNow = Date.now;
    const originalMathRandom = Math.random;
    
    let callCount = 0;
    Date.now = jest.fn(() => 1000);
    Math.random = jest.fn(() => {
      callCount++;
      return callCount * 0.1;
    });
    
    window.showSuccess('Message 1');
    window.showSuccess('Message 2');
    
    await waitFor(() => {
      expect(screen.getAllByRole('alert')).toHaveLength(2);
    });
    
    // Restore original functions
    Date.now = originalDateNow;
    Math.random = originalMathRandom;
  });
});
