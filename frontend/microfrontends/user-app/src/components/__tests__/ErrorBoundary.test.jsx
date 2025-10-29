import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
    // Suppress React error boundary warnings
    const originalConsoleWarn = console.warn;
    console.warn = jest.fn();
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('User Management Error')).toBeInTheDocument();
    expect(screen.getByText('There was an error in the User Management module.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    
    // Restore console.warn
    console.warn = originalConsoleWarn;
  });

  it('calls console.error when error occurs', () => {
    // Suppress React error boundary warnings
    const originalConsoleWarn = console.warn;
    console.warn = jest.fn();
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(console.error).toHaveBeenCalledWith('User App Error:', expect.any(Error));
    expect(console.error).toHaveBeenCalledWith('Error Info:', expect.any(Object));
    
    // Restore console.warn
    console.warn = originalConsoleWarn;
  });

  it('calls window.showError when available', () => {
    const mockShowError = jest.fn();
    window.showError = mockShowError;
    
    // Suppress React error boundary warnings
    const originalConsoleWarn = console.warn;
    console.warn = jest.fn();
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(mockShowError).toHaveBeenCalledWith('User Management error: Test error');
    
    // Clean up
    delete window.showError;
    console.warn = originalConsoleWarn;
  });

  it('handles retry button click', () => {
    // Suppress React error boundary warnings
    const originalConsoleWarn = console.warn;
    console.warn = jest.fn();
    
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('User Management Error')).toBeInTheDocument();
    
    const retryButton = screen.getByRole('button', { name: 'Retry' });
    fireEvent.click(retryButton);
    
    // After retry, should render children again
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
    
    // Restore console.warn
    console.warn = originalConsoleWarn;
  });

  it('has correct CSS classes', () => {
    // Suppress React error boundary warnings
    const originalConsoleWarn = console.warn;
    console.warn = jest.fn();
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    const errorDiv = screen.getByText('User Management Error').closest('div');
    expect(errorDiv).toHaveClass('alert', 'alert-danger');
    
    const retryButton = screen.getByRole('button', { name: 'Retry' });
    expect(retryButton).toHaveClass('btn', 'btn-sm', 'btn-outline-danger');
    
    // Restore console.warn
    console.warn = originalConsoleWarn;
  });

  it('renders error message correctly', () => {
    // Suppress React error boundary warnings
    const originalConsoleWarn = console.warn;
    console.warn = jest.fn();
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('User Management Error')).toBeInTheDocument();
    expect(screen.getByText('There was an error in the User Management module.')).toBeInTheDocument();
    
    // Restore console.warn
    console.warn = originalConsoleWarn;
  });

  it('handles window.showError not being available', () => {
    // Ensure window.showError is not defined
    const originalShowError = window.showError;
    delete window.showError;
    
    // Suppress React error boundary warnings
    const originalConsoleWarn = console.warn;
    console.warn = jest.fn();
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('User Management Error')).toBeInTheDocument();
    
    // Restore window.showError if it existed
    if (originalShowError) {
      window.showError = originalShowError;
    }
    
    // Restore console.warn
    console.warn = originalConsoleWarn;
  });
});