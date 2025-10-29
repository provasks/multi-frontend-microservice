import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.showError
    global.window.showError = jest.fn();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error UI when child throws an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Notification Management Error')).toBeInTheDocument();
    expect(screen.getByText('There was an error in the Notification Management module.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('logs the error to console.error and calls window.showError', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(console.error).toHaveBeenCalledWith('Notification App Error:', expect.any(Error));
    expect(console.error).toHaveBeenCalledWith('Error Info:', expect.any(Object));
    expect(global.window.showError).toHaveBeenCalledWith('Notification Management error: Test error');
  });

  it('resets error state when retry button is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Notification Management Error')).toBeInTheDocument();
    
    const retryButton = screen.getByRole('button', { name: 'Retry' });
    retryButton.click();
    
    // Rerender with no error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('handles multiple errors correctly', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Notification Management Error')).toBeInTheDocument();
    
    const retryButton = screen.getByRole('button', { name: 'Retry' });
    retryButton.click();
    
    // Rerender with no error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders with correct CSS classes', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    const errorContainer = screen.getByText('Notification Management Error').closest('div');
    expect(errorContainer).toHaveClass('alert', 'alert-danger');
  });

  it('renders retry button with correct classes', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    const retryButton = screen.getByRole('button', { name: 'Retry' });
    expect(retryButton).toHaveClass('btn', 'btn-sm', 'btn-outline-danger');
  });

  it('handles error without message gracefully', () => {
    const ThrowErrorNoMessage = () => {
      throw new Error();
    };
    
    render(
      <ErrorBoundary>
        <ThrowErrorNoMessage />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Notification Management Error')).toBeInTheDocument();
    expect(global.window.showError).toHaveBeenCalledWith('Notification Management error: ');
  });

  it('handles non-Error objects gracefully', () => {
    const ThrowNonError = () => {
      throw 'String error';
    };
    
    render(
      <ErrorBoundary>
        <ThrowNonError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Notification Management Error')).toBeInTheDocument();
    expect(global.window.showError).toHaveBeenCalledWith('Notification Management error: undefined');
  });
});