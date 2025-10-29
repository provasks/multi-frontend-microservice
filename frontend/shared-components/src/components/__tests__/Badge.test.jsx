import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge Component', () => {
  const defaultProps = {
    children: 'Test Badge'
  };

  it('renders with default props', () => {
    render(<Badge {...defaultProps} />);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('renders with custom children', () => {
    render(<Badge>Custom Text</Badge>);
    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });

  it('applies default variant and size classes', () => {
    render(<Badge {...defaultProps} />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('badge', 'bg-secondary');
    expect(badge).not.toHaveClass('badge-sm', 'badge-lg', 'rounded-pill');
  });

  it('applies custom variant class', () => {
    render(<Badge {...defaultProps} variant="primary" />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('badge', 'bg-primary');
  });

  it('applies custom size classes', () => {
    const { rerender } = render(<Badge {...defaultProps} size="sm" />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('badge-sm');

    rerender(<Badge {...defaultProps} size="lg" />);
    const largeBadge = screen.getByText('Test Badge');
    expect(largeBadge).toHaveClass('badge-lg');
  });

  it('applies pill class when pill prop is true', () => {
    render(<Badge {...defaultProps} pill={true} />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('badge', 'bg-secondary', 'rounded-pill');
  });

  it('does not apply pill class when pill prop is false', () => {
    render(<Badge {...defaultProps} pill={false} />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('badge', 'bg-secondary');
    expect(badge).not.toHaveClass('rounded-pill');
  });

  it('applies custom className', () => {
    render(<Badge {...defaultProps} className="custom-class" />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('custom-class');
  });

  it('applies multiple custom classes', () => {
    render(<Badge {...defaultProps} className="class1 class2" />);
    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('class1', 'class2');
  });

  it('renders with all props combined', () => {
    render(
      <Badge
        variant="success"
        size="lg"
        pill={true}
        className="custom-class"
      >
        Success Badge
      </Badge>
    );
    
    const badge = screen.getByText('Success Badge');
    expect(badge).toHaveClass('badge', 'bg-success', 'badge-lg', 'rounded-pill', 'custom-class');
  });

  it('handles multiple size variants', () => {
    const { rerender } = render(<Badge {...defaultProps} size="sm" />);
    expect(screen.getByText('Test Badge')).toHaveClass('badge-sm');

    rerender(<Badge {...defaultProps} size="md" />);
    expect(screen.getByText('Test Badge')).not.toHaveClass('badge-sm', 'badge-lg');

    rerender(<Badge {...defaultProps} size="lg" />);
    expect(screen.getByText('Test Badge')).toHaveClass('badge-lg');
  });

  it('handles multiple variant types', () => {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
    
    variants.forEach(variant => {
      const { unmount } = render(<Badge {...defaultProps} variant={variant} />);
      expect(screen.getByText('Test Badge')).toHaveClass(`bg-${variant}`);
      unmount();
    });
  });

  it('has correct display name', () => {
    expect(Badge.displayName).toBe('Badge');
  });

  it('is memoized', () => {
    expect(Badge.$$typeof).toBe(Symbol.for('react.memo'));
  });

  it('renders with empty children', () => {
    render(<Badge />);
    const badge = screen.getByRole('generic');
    expect(badge).toBeInTheDocument();
  });

  it('renders with number children', () => {
    render(<Badge>42</Badge>);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders with complex children', () => {
    render(
      <Badge>
        <span>Complex</span> <strong>Content</strong>
      </Badge>
    );
    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('handles pill prop with different variants', () => {
    const variants = ['primary', 'success', 'danger'];
    
    variants.forEach(variant => {
      const { unmount } = render(<Badge {...defaultProps} variant={variant} pill={true} />);
      const badge = screen.getByText('Test Badge');
      expect(badge).toHaveClass('badge', `bg-${variant}`, 'rounded-pill');
      unmount();
    });
  });

  it('handles size prop with different variants', () => {
    const sizes = ['sm', 'md', 'lg'];
    
    sizes.forEach(size => {
      const { unmount } = render(<Badge {...defaultProps} size={size} />);
      const badge = screen.getByText('Test Badge');
      if (size === 'md') {
        expect(badge).not.toHaveClass('badge-sm', 'badge-lg');
      } else {
        expect(badge).toHaveClass(`badge-${size}`);
      }
      unmount();
    });
  });

  it('combines all props correctly', () => {
    render(
      <Badge
        variant="warning"
        size="sm"
        pill={true}
        className="extra-class"
      >
        Warning Badge
      </Badge>
    );
    
    const badge = screen.getByText('Warning Badge');
    expect(badge).toHaveClass(
      'badge',
      'bg-warning',
      'badge-sm',
      'rounded-pill',
      'extra-class'
    );
  });
});