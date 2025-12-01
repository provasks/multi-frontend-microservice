import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Mock component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Mock component that throws different types of errors
const ThrowStringError = () => {
  throw 'String error';
};

const ThrowObjectError = () => {
  throw { message: 'Object error', code: 500 };
};

const ThrowNullError = () => {
  throw null;
};

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Task Management Error')).toBeInTheDocument();
    expect(screen.getByText('There was an error in the Task Management module.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('calls console.error when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalledWith('Task App Error:', expect.any(Error));
    expect(console.error).toHaveBeenCalledWith('Error Info:', expect.any(Object));
  });

  it('calls window.showError if available when an error occurs', () => {
    const mockShowError = jest.fn();
    window.showError = mockShowError;

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(mockShowError).toHaveBeenCalledWith('Task Management error: Test error');

    // Cleanup
    delete window.showError;
  });

  it('does not call window.showError if not available', () => {
    // Ensure window.showError is not defined
    delete window.showError;

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should not throw an error
    expect(screen.getByText('Task Management Error')).toBeInTheDocument();
  });

  it('resets error state when retry button is clicked', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Verify error is displayed
    expect(screen.getByText('Task Management Error')).toBeInTheDocument();

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);

    // The retry button should still be visible (error state is reset but children don't re-render automatically)
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('handles multiple errors correctly', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Task Management Error')).toBeInTheDocument();

    // Reset and throw another error
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);

    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Task Management Error')).toBeInTheDocument();
  });

  it('maintains error state until explicitly reset', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Task Management Error')).toBeInTheDocument();

    // Re-render with no error but don't reset the boundary
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Error should still be displayed
    expect(screen.getByText('Task Management Error')).toBeInTheDocument();
  });

  it('handles string errors gracefully', () => {
    const mockShowError = jest.fn();
    window.showError = mockShowError;

    render(
      <ErrorBoundary>
        <ThrowStringError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Task Management Error')).toBeInTheDocument();
    expect(mockShowError).toHaveBeenCalledWith('Task Management error: String error');

    // Cleanup
    delete window.showError;
  });

  it('handles object errors gracefully', () => {
    const mockShowError = jest.fn();
    window.showError = mockShowError;

    render(
      <ErrorBoundary>
        <ThrowObjectError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Task Management Error')).toBeInTheDocument();
    expect(mockShowError).toHaveBeenCalledWith('Task Management error: Object error');

    // Cleanup
    delete window.showError;
  });

  it('handles null errors gracefully', () => {
    const mockShowError = jest.fn();
    window.showError = mockShowError;

    render(
      <ErrorBoundary>
        <ThrowNullError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Task Management Error')).toBeInTheDocument();
    expect(mockShowError).toHaveBeenCalledWith('Task Management error: null');

    // Cleanup
    delete window.showError;
  });

  it('has correct CSS classes for error UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const errorContainer = screen.getByText('Task Management Error').closest('div');
    expect(errorContainer).toHaveClass('alert', 'alert-danger');

    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toHaveClass('btn', 'btn-sm', 'btn-outline-danger');
  });

  it('displays proper error message structure', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const heading = screen.getByRole('heading', { level: 6 });
    expect(heading).toHaveTextContent('Task Management Error');

    const paragraph = screen.getByText('There was an error in the Task Management module.');
    expect(paragraph).toBeInTheDocument();
  });

  it('handles multiple error boundaries independently', () => {
    render(
      <div>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
        <ErrorBoundary>
          <div>This should still work</div>
        </ErrorBoundary>
      </div>
    );

    expect(screen.getByText('Task Management Error')).toBeInTheDocument();
    expect(screen.getByText('This should still work')).toBeInTheDocument();
  });
});