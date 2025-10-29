import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge', () => {
  it('renders with default props', () => {
    render(<Badge>Default Badge</Badge>);
    
    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge', 'bg-secondary');
  });

  it('renders with custom children', () => {
    render(<Badge>Custom Content</Badge>);
    
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
    
    variants.forEach(variant => {
      const { unmount } = render(<Badge variant={variant}>Badge</Badge>);
      expect(screen.getByText('Badge')).toHaveClass(`bg-${variant}`);
      unmount();
    });
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Badge size="sm">Small Badge</Badge>);
    expect(screen.getByText('Small Badge')).toHaveClass('badge-sm');
    
    rerender(<Badge size="md">Medium Badge</Badge>);
    expect(screen.getByText('Medium Badge')).toHaveClass('badge');
    expect(screen.getByText('Medium Badge')).not.toHaveClass('badge-sm', 'badge-lg');
    
    rerender(<Badge size="lg">Large Badge</Badge>);
    expect(screen.getByText('Large Badge')).toHaveClass('badge-lg');
  });

  it('renders as pill when pill prop is true', () => {
    render(<Badge pill={true}>Pill Badge</Badge>);
    
    expect(screen.getByText('Pill Badge')).toHaveClass('rounded-pill');
  });

  it('does not render as pill when pill prop is false', () => {
    render(<Badge pill={false}>Normal Badge</Badge>);
    
    expect(screen.getByText('Normal Badge')).not.toHaveClass('rounded-pill');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);
    
    expect(screen.getByText('Custom Badge')).toHaveClass('custom-class');
  });

  it('combines all props correctly', () => {
    render(
      <Badge 
        variant="success" 
        size="lg" 
        pill={true} 
        className="custom-class"
      >
        Complete Badge
      </Badge>
    );
    
    const badge = screen.getByText('Complete Badge');
    expect(badge).toHaveClass(
      'badge', 
      'bg-success', 
      'badge-lg', 
      'rounded-pill', 
      'custom-class'
    );
  });

  it('has correct display name', () => {
    expect(Badge.displayName).toBe('Badge');
  });

  it('is memoized', () => {
    expect(Badge.$$typeof).toBe(Symbol.for('react.memo'));
  });

  it('handles empty children', () => {
    const { container } = render(<Badge></Badge>);
    
    const badge = container.querySelector('span.badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge', 'bg-secondary');
  });

  it('handles null children', () => {
    const { container } = render(<Badge>{null}</Badge>);
    
    const badge = container.querySelector('span.badge');
    expect(badge).toBeInTheDocument();
  });

  it('handles undefined children', () => {
    const { container } = render(<Badge>{undefined}</Badge>);
    
    const badge = container.querySelector('span.badge');
    expect(badge).toBeInTheDocument();
  });

  it('handles number children', () => {
    render(<Badge>{42}</Badge>);
    
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('handles boolean children', () => {
    const { container } = render(<Badge>{true}</Badge>);
    
    // React doesn't render boolean true as text, so we check the container
    const badge = container.querySelector('span.badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge', 'bg-secondary');
  });

  it('handles complex children', () => {
    render(
      <Badge>
        <span>Complex</span> <strong>Content</strong>
      </Badge>
    );
    
    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('handles all size variants', () => {
    const sizes = ['sm', 'md', 'lg'];
    
    sizes.forEach(size => {
      const { unmount } = render(<Badge size={size}>Badge</Badge>);
      const badge = screen.getByText('Badge');
      
      if (size === 'sm') {
        expect(badge).toHaveClass('badge-sm');
      } else if (size === 'lg') {
        expect(badge).toHaveClass('badge-lg');
      } else {
        expect(badge).toHaveClass('badge');
        expect(badge).not.toHaveClass('badge-sm', 'badge-lg');
      }
      
      unmount();
    });
  });

  it('handles all variant variants', () => {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
    
    variants.forEach(variant => {
      const { unmount } = render(<Badge variant={variant}>Badge</Badge>);
      expect(screen.getByText('Badge')).toHaveClass(`bg-${variant}`);
      unmount();
    });
  });

  it('handles multiple className values', () => {
    render(<Badge className="class1 class2 class3">Badge</Badge>);
    
    expect(screen.getByText('Badge')).toHaveClass('class1', 'class2', 'class3');
  });

  it('handles empty className', () => {
    render(<Badge className="">Badge</Badge>);
    
    expect(screen.getByText('Badge')).toHaveClass('badge', 'bg-secondary');
  });

  it('handles undefined className', () => {
    render(<Badge className={undefined}>Badge</Badge>);
    
    expect(screen.getByText('Badge')).toHaveClass('badge', 'bg-secondary');
  });
});
