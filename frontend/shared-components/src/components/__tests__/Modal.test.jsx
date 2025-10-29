import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal Component', () => {
  const defaultProps = {
    show: true,
    title: 'Test Modal',
    children: <div>Modal Content</div>,
    onClose: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when show is false', () => {
    render(<Modal {...defaultProps} show={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal when show is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('renders with correct title', () => {
    render(<Modal {...defaultProps} title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders children content', () => {
    const customContent = <div data-testid="custom-content">Custom Content</div>;
    render(<Modal {...defaultProps} children={customContent} />);
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Modal {...defaultProps} size="sm" />);
    expect(screen.getByRole('dialog').querySelector('.modal-dialog')).toHaveClass('modal-sm');

    rerender(<Modal {...defaultProps} size="lg" />);
    expect(screen.getByRole('dialog').querySelector('.modal-dialog')).toHaveClass('modal-lg');

    rerender(<Modal {...defaultProps} size="xl" />);
    expect(screen.getByRole('dialog').querySelector('.modal-dialog')).toHaveClass('modal-xl');
  });

  it('renders with default size when size is not specified', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByRole('dialog').querySelector('.modal-dialog')).toHaveClass('modal-lg');
  });

  it('hides footer when showFooter is false', () => {
    render(<Modal {...defaultProps} showFooter={false} />);
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('renders custom footer content', () => {
    const customFooter = (
      <div data-testid="custom-footer">
        <button>Custom Button</button>
      </div>
    );
    
    render(<Modal {...defaultProps} footerContent={customFooter} />);
    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
    expect(screen.getByText('Custom Button')).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('renders default footer when showFooter is true and no footerContent provided', () => {
    render(<Modal {...defaultProps} showFooter={true} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<Modal {...defaultProps} />);
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('tabIndex', '-1');
  });

  it('has correct display name', () => {
    expect(Modal.displayName).toBe('Modal');
  });

  it('is memoized', () => {
    expect(Modal.$$typeof).toBe(Symbol.for('react.memo'));
  });

  it('handles multiple close button clicks', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    
    fireEvent.click(closeButton);
    fireEvent.click(cancelButton);
    
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('renders with complex children', () => {
    const complexChildren = (
      <div>
        <h3>Complex Content</h3>
        <p>This is a paragraph</p>
        <button>Action Button</button>
      </div>
    );
    
    render(<Modal {...defaultProps} children={complexChildren} />);
    expect(screen.getByText('Complex Content')).toBeInTheDocument();
    expect(screen.getByText('This is a paragraph')).toBeInTheDocument();
    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });

  it('handles undefined children gracefully', () => {
    render(<Modal {...defaultProps} children={undefined} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('handles null children gracefully', () => {
    render(<Modal {...defaultProps} children={null} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
