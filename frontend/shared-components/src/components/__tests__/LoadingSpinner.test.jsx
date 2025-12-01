import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner Component', () => {
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
    expect(screen.queryByText('')).not.toBeInTheDocument();
  });

  it('renders without text when text is null', () => {
    render(<LoadingSpinner text={null} />);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('applies default size and variant classes', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByText('Loading...').closest('.loading-spinner').querySelector('.spinner');
    expect(spinner).toHaveClass('spinner-md', 'spinner-primary');
  });

  it('applies custom size classes', () => {
    render(<LoadingSpinner size="small" />);
    const spinner = screen.getByText('Loading...').closest('.loading-spinner').querySelector('.spinner');
    expect(spinner).toHaveClass('spinner-sm');

    render(<LoadingSpinner size="large" />);
    const largeSpinner = screen.getByText('Loading...').closest('.loading-spinner').querySelector('.spinner');
    expect(largeSpinner).toHaveClass('spinner-lg');
  });

  it('applies custom variant classes', () => {
    render(<LoadingSpinner variant="success" />);
    const spinner = screen.getByText('Loading...').closest('.loading-spinner').querySelector('.spinner');
    expect(spinner).toHaveClass('spinner-success');

    render(<LoadingSpinner variant="danger" />);
    const dangerSpinner = screen.getByText('Loading...').closest('.loading-spinner').querySelector('.spinner');
    expect(dangerSpinner).toHaveClass('spinner-danger');
  });

  it('shows dots when showDots is true', () => {
    render(<LoadingSpinner showDots={true} />);
    const dotsContainer = screen.getByText('Loading...').closest('.loading-text').querySelector('.loading-dots');
    expect(dotsContainer).toBeInTheDocument();
    expect(dotsContainer.children).toHaveLength(3);
  });

  it('hides dots when showDots is false', () => {
    render(<LoadingSpinner showDots={false} />);
    const dotsContainer = screen.getByText('Loading...').closest('.loading-text').querySelector('.loading-dots');
    expect(dotsContainer).not.toBeInTheDocument();
  });

  it('uses fullscreen container when fullScreen is true', () => {
    render(<LoadingSpinner fullScreen={true} />);
    expect(screen.getByText('Loading...').closest('.loading-fullscreen')).toBeInTheDocument();
  });

  it('uses regular container when fullScreen is false', () => {
    render(<LoadingSpinner fullScreen={false} />);
    expect(screen.getByText('Loading...').closest('.loading-container')).toBeInTheDocument();
  });

  it('renders with all props combined', () => {
    render(
      <LoadingSpinner
        size="large"
        text="Processing..."
        variant="warning"
        showDots={false}
        fullScreen={true}
      />
    );
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByText('Processing...').closest('.loading-fullscreen')).toBeInTheDocument();
    
    const spinner = screen.getByText('Processing...').closest('.loading-spinner').querySelector('.spinner');
    expect(spinner).toHaveClass('spinner-lg', 'spinner-warning');
    
    const dotsContainer = screen.getByText('Processing...').closest('.loading-text').querySelector('.loading-dots');
    expect(dotsContainer).not.toBeInTheDocument();
  });

  it('handles multiple size variants', () => {
    const sizes = ['small', 'default', 'large'];
    
    sizes.forEach(size => {
      const { unmount } = render(<LoadingSpinner size={size} />);
      const spinner = screen.getByText('Loading...').closest('.loading-spinner').querySelector('.spinner');
      if (size === 'default') {
        expect(spinner).toHaveClass('spinner-md');
      } else {
        expect(spinner).toHaveClass(`spinner-${size === 'small' ? 'sm' : 'lg'}`);
      }
      unmount();
    });
  });

  it('handles multiple variant types', () => {
    const variants = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'];
    
    variants.forEach(variant => {
      const { unmount } = render(<LoadingSpinner variant={variant} />);
      const spinner = screen.getByText('Loading...').closest('.loading-spinner').querySelector('.spinner');
      expect(spinner).toHaveClass(`spinner-${variant}`);
      unmount();
    });
  });

  it('applies size classes to text element', () => {
    render(<LoadingSpinner size="small" />);
    const textElement = screen.getByText('Loading...').closest('.loading-text');
    expect(textElement).toHaveClass('spinner-sm');

    render(<LoadingSpinner size="large" />);
    const largeTextElement = screen.getByText('Loading...').closest('.loading-text');
    expect(largeTextElement).toHaveClass('spinner-lg');
  });

  it('renders spinner ring element', () => {
    render(<LoadingSpinner />);
    const spinnerRing = screen.getByText('Loading...').closest('.loading-spinner').querySelector('.spinner-ring');
    expect(spinnerRing).toBeInTheDocument();
  });

  it('renders loading text content', () => {
    render(<LoadingSpinner text="Custom text" />);
    const textContent = screen.getByText('Custom text');
    expect(textContent).toHaveClass('loading-text-content');
  });

  it('has correct display name', () => {
    expect(LoadingSpinner.displayName).toBe('LoadingSpinner');
  });

  it('is memoized', () => {
    expect(LoadingSpinner.$$typeof).toBe(Symbol.for('react.memo'));
  });

  it('renders with empty text and no dots', () => {
    render(<LoadingSpinner text="" showDots={false} />);
    const container = screen.getByText('').closest('.loading-container');
    expect(container).toBeInTheDocument();
    expect(container.querySelector('.loading-text')).not.toBeInTheDocument();
  });

  it('renders with text but no dots', () => {
    render(<LoadingSpinner text="Loading" showDots={false} />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    const dotsContainer = screen.getByText('Loading').closest('.loading-text').querySelector('.loading-dots');
    expect(dotsContainer).not.toBeInTheDocument();
  });

  it('renders with dots but no text', () => {
    render(<LoadingSpinner text="" showDots={true} />);
    const container = screen.getByText('').closest('.loading-container');
    expect(container).toBeInTheDocument();
    expect(container.querySelector('.loading-text')).not.toBeInTheDocument();
  });
});