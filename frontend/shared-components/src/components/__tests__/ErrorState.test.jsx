import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorState, { NetworkError, NotFoundError, EmptyState, LoadingError } from '../ErrorState';

// Mock CSS import
jest.mock('../ErrorState.css', () => ({}));

describe('ErrorState', () => {
  it('renders with default props', () => {
    render(<ErrorState />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong').closest('.error-container')).toHaveClass('error-danger');
  });

  it('renders with custom title and message', () => {
    render(
      <ErrorState 
        title="Custom Error" 
        message="Custom error message" 
      />
    );
    
    expect(screen.getByText('Custom Error')).toBeInTheDocument();
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('renders with different error types', () => {
    const { rerender } = render(<ErrorState type="error" />);
    expect(screen.getByText('Something went wrong').closest('.error-container')).toHaveClass('error-danger');
    
    rerender(<ErrorState type="warning" />);
    expect(screen.getByText('Something went wrong').closest('.error-container')).toHaveClass('error-warning');
    
    rerender(<ErrorState type="info" />);
    expect(screen.getByText('Something went wrong').closest('.error-container')).toHaveClass('error-info');
    
    rerender(<ErrorState type="success" />);
    expect(screen.getByText('Something went wrong').closest('.error-container')).toHaveClass('error-success');
    
    rerender(<ErrorState type="network" />);
    expect(screen.getByText('Something went wrong').closest('.error-container')).toHaveClass('error-warning');
    
    rerender(<ErrorState type="not-found" />);
    expect(screen.getByText('Something went wrong').closest('.error-container')).toHaveClass('error-info');
  });

  it('renders correct icons for different types', () => {
    const { rerender } = render(<ErrorState type="error" showIcon={true} />);
    expect(screen.getByText('Something went wrong').closest('.error-container').querySelector('.fas.fa-exclamation-triangle')).toBeInTheDocument();
    
    rerender(<ErrorState type="warning" showIcon={true} />);
    expect(screen.getByText('Something went wrong').closest('.error-container').querySelector('.fas.fa-exclamation-circle')).toBeInTheDocument();
    
    rerender(<ErrorState type="info" showIcon={true} />);
    expect(screen.getByText('Something went wrong').closest('.error-container').querySelector('.fas.fa-info-circle')).toBeInTheDocument();
    
    rerender(<ErrorState type="success" showIcon={true} />);
    expect(screen.getByText('Something went wrong').closest('.error-container').querySelector('.fas.fa-check-circle')).toBeInTheDocument();
    
    rerender(<ErrorState type="network" showIcon={true} />);
    expect(screen.getByText('Something went wrong').closest('.error-container').querySelector('.fas.fa-wifi')).toBeInTheDocument();
    
    rerender(<ErrorState type="not-found" showIcon={true} />);
    expect(screen.getByText('Something went wrong').closest('.error-container').querySelector('.fas.fa-search')).toBeInTheDocument();
  });

  it('hides icon when showIcon is false', () => {
    render(<ErrorState showIcon={false} />);
    
    expect(screen.getByText('Something went wrong').closest('.error-container').querySelector('.error-icon')).not.toBeInTheDocument();
  });

  it('renders with fullScreen class when fullScreen is true', () => {
    render(<ErrorState fullScreen={true} />);
    
    expect(screen.getByText('Something went wrong').closest('.error-fullscreen')).toBeInTheDocument();
  });

  it('renders with container class when fullScreen is false', () => {
    render(<ErrorState fullScreen={false} />);
    
    expect(screen.getByText('Something went wrong').closest('.error-container')).toBeInTheDocument();
  });

  it('renders custom action when provided', () => {
    const customAction = <button>Custom Action</button>;
    render(<ErrorState action={customAction} />);
    
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', async () => {
    const user = userEvent.setup();
    const mockRetry = jest.fn();
    render(<ErrorState onRetry={mockRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
    
    await user.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('renders both custom action and retry button', () => {
    const customAction = <button>Custom Action</button>;
    const mockRetry = jest.fn();
    render(<ErrorState action={customAction} onRetry={mockRetry} />);
    
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('does not render actions when neither action nor onRetry is provided', () => {
    render(<ErrorState />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByText('Custom Action')).not.toBeInTheDocument();
  });

  it('handles unknown error type with default values', () => {
    render(<ErrorState type="unknown" />);
    
    expect(screen.getByText('Something went wrong').closest('.error-container')).toHaveClass('error-danger');
    expect(screen.getByText('Something went wrong').closest('.error-container').querySelector('.fas.fa-exclamation-triangle')).toBeInTheDocument();
  });
});

describe('NetworkError', () => {
  it('renders with correct props', () => {
    render(<NetworkError />);
    
    expect(screen.getByText('Connection Problem')).toBeInTheDocument();
    expect(screen.getByText('Unable to connect to the server. Please check your internet connection and try again.')).toBeInTheDocument();
    expect(screen.getByText('Connection Problem').closest('.error-container')).toHaveClass('error-warning');
  });

  it('renders retry button when onRetry is provided', async () => {
    const user = userEvent.setup();
    const mockRetry = jest.fn();
    render(<NetworkError onRetry={mockRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });
});

describe('NotFoundError', () => {
  it('renders with default resource name', () => {
    render(<NotFoundError />);
    
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('The page you\'re looking for doesn\'t exist or has been moved.')).toBeInTheDocument();
  });

  it('renders with custom resource name', () => {
    render(<NotFoundError resource="user" />);
    
    expect(screen.getByText('User Not Found')).toBeInTheDocument();
    expect(screen.getByText('The user you\'re looking for doesn\'t exist or has been moved.')).toBeInTheDocument();
  });

  it('capitalizes resource name correctly', () => {
    render(<NotFoundError resource="task" />);
    
    expect(screen.getByText('Task Not Found')).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', async () => {
    const user = userEvent.setup();
    const mockRetry = jest.fn();
    render(<NotFoundError onRetry={mockRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });
});

describe('EmptyState', () => {
  it('renders with default props', () => {
    render(<EmptyState />);
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
    expect(screen.getByText('There are no items to display at the moment.')).toBeInTheDocument();
    expect(screen.getByText('No data available').closest('.empty-state').querySelector('.fas.fa-inbox')).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    const customAction = <button>Add Item</button>;
    render(
      <EmptyState 
        title="No Tasks" 
        message="Create your first task to get started." 
        action={customAction}
        icon="fas fa-tasks"
      />
    );
    
    expect(screen.getByText('No Tasks')).toBeInTheDocument();
    expect(screen.getByText('Create your first task to get started.')).toBeInTheDocument();
    expect(screen.getByText('Add Item')).toBeInTheDocument();
    expect(screen.getByText('No Tasks').closest('.empty-state').querySelector('.fas.fa-tasks')).toBeInTheDocument();
  });

  it('does not render action when not provided', () => {
    render(<EmptyState />);
    
    expect(screen.queryByText('Add Item')).not.toBeInTheDocument();
  });
});

describe('LoadingError', () => {
  it('renders with correct props', () => {
    render(<LoadingError />);
    
    expect(screen.getByText('Failed to Load')).toBeInTheDocument();
    expect(screen.getByText('Unable to load the data. This might be due to a network issue or server problem.')).toBeInTheDocument();
    expect(screen.getByText('Failed to Load').closest('.error-container')).toHaveClass('error-danger');
  });

  it('renders retry button when onRetry is provided', async () => {
    const user = userEvent.setup();
    const mockRetry = jest.fn();
    render(<LoadingError onRetry={mockRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });
});

describe('ErrorState Integration Tests', () => {
  it('handles complex error scenarios', () => {
    const customAction = <button>Contact Support</button>;
    const mockRetry = jest.fn();
    
    render(
      <ErrorState
        type="error"
        title="System Error"
        message="A critical error has occurred."
        action={customAction}
        onRetry={mockRetry}
        showIcon={true}
        fullScreen={true}
      />
    );
    
    expect(screen.getByText('System Error')).toBeInTheDocument();
    expect(screen.getByText('A critical error has occurred.')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByText('System Error').closest('.error-fullscreen')).toHaveClass('error-danger');
  });

  it('handles all error types with icons', () => {
    const types = ['error', 'warning', 'info', 'success', 'network', 'not-found'];
    
    types.forEach(type => {
      const { unmount } = render(<ErrorState type={type} showIcon={true} />);
      expect(screen.getByText('Something went wrong').closest('.error-container').querySelector('.error-icon')).toBeInTheDocument();
      unmount();
    });
  });
});
