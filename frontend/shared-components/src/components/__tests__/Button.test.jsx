import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  const defaultProps = {
    children: 'Test Button',
    onClick: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<Button {...defaultProps} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('renders with custom children', () => {
    render(<Button onClick={jest.fn()}>Custom Text</Button>);
    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });

  it('applies default variant and size classes', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-primary');
    expect(button).not.toHaveClass('btn-sm', 'btn-lg');
  });

  it('applies custom variant class', () => {
    render(<Button {...defaultProps} variant="secondary" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-secondary');
  });

  it('applies custom size classes', () => {
    const { rerender } = render(<Button {...defaultProps} size="sm" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-sm');

    rerender(<Button {...defaultProps} size="lg" />);
    const largeButton = screen.getByRole('button');
    expect(largeButton).toHaveClass('btn-lg');
  });

  it('renders with icon when provided', () => {
    render(<Button {...defaultProps} icon="fas fa-plus" />);
    const icon = screen.getByRole('button').querySelector('i');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('fas', 'fa-plus', 'me-1');
  });

  it('does not render icon when not provided', () => {
    render(<Button {...defaultProps} />);
    const icon = screen.getByRole('button').querySelector('i');
    expect(icon).not.toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<Button {...defaultProps} onClick={mockOnClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const mockOnClick = jest.fn();
    render(<Button {...defaultProps} onClick={mockOnClick} disabled={true} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button {...defaultProps} disabled={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is not disabled when disabled prop is false', () => {
    render(<Button {...defaultProps} disabled={false} />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('has correct type attribute', () => {
    render(<Button {...defaultProps} type="submit" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('has default type attribute', () => {
    render(<Button {...defaultProps} />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('applies custom className', () => {
    render(<Button {...defaultProps} className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('applies multiple custom classes', () => {
    render(<Button {...defaultProps} className="class1 class2" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('class1', 'class2');
  });

  it('passes through additional props', () => {
    render(<Button {...defaultProps} data-testid="custom-button" aria-label="Custom Button" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-testid', 'custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom Button');
  });

  it('renders with all props combined', () => {
    render(
      <Button
        variant="danger"
        size="lg"
        icon="fas fa-trash"
        onClick={jest.fn()}
        disabled={false}
        type="button"
        className="custom-class"
        data-testid="complex-button"
      >
        Delete Item
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-danger', 'btn-lg', 'custom-class');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-testid', 'complex-button');
    expect(button).not.toBeDisabled();
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    
    const icon = button.querySelector('i');
    expect(icon).toHaveClass('fas', 'fa-trash', 'me-1');
  });

  it('handles click events correctly', () => {
    const mockOnClick = jest.fn();
    render(<Button {...defaultProps} onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });

  it('handles multiple size variants', () => {
    const { rerender } = render(<Button {...defaultProps} size="sm" />);
    expect(screen.getByRole('button')).toHaveClass('btn-sm');

    rerender(<Button {...defaultProps} size="md" />);
    expect(screen.getByRole('button')).not.toHaveClass('btn-sm', 'btn-lg');

    rerender(<Button {...defaultProps} size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('btn-lg');
  });

  it('handles multiple variant types', () => {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
    
    variants.forEach(variant => {
      const { unmount } = render(<Button {...defaultProps} variant={variant} />);
      expect(screen.getByRole('button')).toHaveClass(`btn-${variant}`);
      unmount();
    });
  });

  it('has correct display name', () => {
    expect(Button.displayName).toBe('Button');
  });

  it('is memoized', () => {
    expect(Button.$$typeof).toBe(Symbol.for('react.memo'));
  });

  it('renders with empty children', () => {
    render(<Button onClick={jest.fn()} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('');
  });

  it('renders with icon only (no children)', () => {
    render(<Button onClick={jest.fn()} icon="fas fa-plus" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.querySelector('i')).toHaveClass('fas', 'fa-plus');
  });
});