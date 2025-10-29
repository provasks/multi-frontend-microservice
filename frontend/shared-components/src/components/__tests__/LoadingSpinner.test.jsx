import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

// Mock CSS import
jest.mock('../LoadingSpinner.css', () => ({}));

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Loading...').closest('.loading-container')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Please wait..." />);
    
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('renders without text when text is empty', () => {
    render(<LoadingSpinner text="" />);
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('renders without text when text is null', () => {
    render(<LoadingSpinner text={null} />);
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('renders without text when text is undefined', () => {
    render(<LoadingSpinner text={undefined} />);
    
    // The component still renders "Loading..." as default when text is undefined
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<LoadingSpinner size="small" />);
    expect(screen.getByText('Loading...').closest('.loading-container').querySelector('.spinner')).toHaveClass('spinner-sm');
    
    rerender(<LoadingSpinner size="default" />);
    expect(screen.getByText('Loading...').closest('.loading-container').querySelector('.spinner')).toHaveClass('spinner-md');
    
    rerender(<LoadingSpinner size="large" />);
    expect(screen.getByText('Loading...').closest('.loading-container').querySelector('.spinner')).toHaveClass('spinner-lg');
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<LoadingSpinner variant="primary" />);
    expect(screen.getByText('Loading...').closest('.loading-container').querySelector('.spinner')).toHaveClass('spinner-primary');
    
    rerender(<LoadingSpinner variant="secondary" />);
    expect(screen.getByText('Loading...').closest('.loading-container').querySelector('.spinner')).toHaveClass('spinner-secondary');
    
    rerender(<LoadingSpinner variant="success" />);
    expect(screen.getByText('Loading...').closest('.loading-container').querySelector('.spinner')).toHaveClass('spinner-success');
    
    rerender(<LoadingSpinner variant="warning" />);
    expect(screen.getByText('Loading...').closest('.loading-container').querySelector('.spinner')).toHaveClass('spinner-warning');
    
    rerender(<LoadingSpinner variant="danger" />);
    expect(screen.getByText('Loading...').closest('.loading-container').querySelector('.spinner')).toHaveClass('spinner-danger');
    
    rerender(<LoadingSpinner variant="info" />);
    expect(screen.getByText('Loading...').closest('.loading-container').querySelector('.spinner')).toHaveClass('spinner-info');
  });

  it('applies fullScreen class when fullScreen is true', () => {
    render(<LoadingSpinner fullScreen={true} />);
    
    expect(screen.getByText('Loading...').closest('.loading-fullscreen')).toBeInTheDocument();
  });

  it('applies container class when fullScreen is false', () => {
    render(<LoadingSpinner fullScreen={false} />);
    
    expect(screen.getByText('Loading...').closest('.loading-container')).toBeInTheDocument();
  });

  it('shows dots when showDots is true', () => {
    render(<LoadingSpinner showDots={true} text="Loading..." />);
    
    const dotsContainer = screen.getByText('Loading...').closest('.loading-text').querySelector('.loading-dots');
    expect(dotsContainer).toBeInTheDocument();
  });

  it('hides dots when showDots is false', () => {
    render(<LoadingSpinner showDots={false} text="Loading..." />);
    
    const dotsContainer = screen.getByText('Loading...').closest('.loading-text').querySelector('.loading-dots');
    expect(dotsContainer).not.toBeInTheDocument();
  });

  it('renders loading dots with three spans', () => {
    render(<LoadingSpinner showDots={true} text="Loading..." />);
    
    const dotsContainer = screen.getByText('Loading...').closest('.loading-text').querySelector('.loading-dots');
    const spans = dotsContainer.querySelectorAll('span');
    expect(spans).toHaveLength(3); // 3 for dots
  });

  it('applies size classes to text when text is present', () => {
    render(<LoadingSpinner size="large" text="Loading..." />);
    
    const textContainer = screen.getByText('Loading...').parentElement;
    expect(textContainer).toHaveClass('loading-text', 'spinner-lg');
  });

  it('renders spinner ring element', () => {
    render(<LoadingSpinner />);
    
    const spinnerRing = screen.getByText('Loading...').closest('.loading-container').querySelector('.spinner-ring');
    expect(spinnerRing).toBeInTheDocument();
  });

  it('has correct display name', () => {
    expect(LoadingSpinner.displayName).toBe('LoadingSpinner');
  });

  it('is memoized', () => {
    expect(LoadingSpinner.$$typeof).toBe(Symbol.for('react.memo'));
  });

  it('handles all size variants correctly', () => {
    const sizes = ['small', 'default', 'large'];
    
    sizes.forEach(size => {
      const { unmount } = render(<LoadingSpinner size={size} />);
      const expectedClass = size === 'default' ? 'spinner-md' : size === 'small' ? 'spinner-sm' : 'spinner-lg';
      expect(screen.getByText('Loading...').closest('.loading-container').querySelector('.spinner')).toHaveClass(expectedClass);
      unmount();
    });
  });

  it('handles all variant variants correctly', () => {
    const variants = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'];
    
    variants.forEach(variant => {
      const { unmount } = render(<LoadingSpinner variant={variant} />);
      expect(screen.getByText('Loading...').closest('.loading-container').querySelector('.spinner')).toHaveClass(`spinner-${variant}`);
      unmount();
    });
  });

  it('combines size and variant classes correctly', () => {
    render(<LoadingSpinner size="large" variant="success" />);
    
    const spinner = screen.getByText('Loading...').closest('.loading-container').querySelector('.spinner');
    expect(spinner).toHaveClass('spinner-lg', 'spinner-success');
  });

  it('renders with complex text content', () => {
    const complexText = 'Loading data from server...';
    render(<LoadingSpinner text={complexText} />);
    
    expect(screen.getByText(complexText)).toBeInTheDocument();
  });

  it('handles boolean props correctly', () => {
    const { rerender } = render(<LoadingSpinner showDots={true} fullScreen={true} />);
    expect(screen.getByText('Loading...').closest('.loading-fullscreen')).toBeInTheDocument();
    
    rerender(<LoadingSpinner showDots={false} fullScreen={false} />);
    expect(screen.getByText('Loading...').closest('.loading-container')).toBeInTheDocument();
  });
});
