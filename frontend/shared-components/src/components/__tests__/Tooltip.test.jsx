import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tooltip from '../Tooltip';

// Mock window.getComputedStyle
const mockGetComputedStyle = jest.fn();
Object.defineProperty(window, 'getComputedStyle', {
  value: mockGetComputedStyle,
  writable: true
});

describe('Tooltip Component', () => {
  const defaultProps = {
    children: <span>Hover me</span>,
    content: 'This is a tooltip'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetComputedStyle.mockReturnValue({
      lineHeight: '16px',
      maxHeight: '32px'
    });
  });

  it('renders children correctly', () => {
    render(<Tooltip {...defaultProps} />);
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows tooltip on mouse enter after delay', async () => {
    render(<Tooltip {...defaultProps} delay={100} />);
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('hides tooltip on mouse leave', async () => {
    render(<Tooltip {...defaultProps} delay={100} />);
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
    });
    
    fireEvent.mouseLeave(trigger);
    
    await waitFor(() => {
      expect(screen.queryByText('This is a tooltip')).not.toBeInTheDocument();
    });
  });

  it('renders with different positions', () => {
    const { rerender } = render(<Tooltip {...defaultProps} position="top" />);
    expect(screen.getByText('Hover me')).toBeInTheDocument();

    rerender(<Tooltip {...defaultProps} position="bottom" />);
    expect(screen.getByText('Hover me')).toBeInTheDocument();

    rerender(<Tooltip {...defaultProps} position="left" />);
    expect(screen.getByText('Hover me')).toBeInTheDocument();

    rerender(<Tooltip {...defaultProps} position="right" />);
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Tooltip {...defaultProps} className="custom-tooltip" />);
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('handles empty content gracefully', () => {
    render(<Tooltip children={<span>Test</span>} content="" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles null content gracefully', () => {
    render(<Tooltip children={<span>Test</span>} content={null} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('respects custom delay', async () => {
    const startTime = Date.now();
    render(<Tooltip {...defaultProps} delay={500} />);
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    // Should not show immediately
    expect(screen.queryByText('This is a tooltip')).not.toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
    }, { timeout: 600 });
    
    const endTime = Date.now();
    expect(endTime - startTime).toBeGreaterThanOrEqual(450); // Allow some margin
  });

  it('cancels timeout on mouse leave before delay', async () => {
    render(<Tooltip {...defaultProps} delay={500} />);
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);
    
    // Wait longer than delay to ensure tooltip doesn't appear
    await new Promise(resolve => setTimeout(resolve, 600));
    
    expect(screen.queryByText('This is a tooltip')).not.toBeInTheDocument();
  });

  it('handles focus events', async () => {
    render(<Tooltip {...defaultProps} delay={100} />);
    
    const trigger = screen.getByText('Hover me');
    fireEvent.focus(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
    });
    
    fireEvent.blur(trigger);
    
    await waitFor(() => {
      expect(screen.queryByText('This is a tooltip')).not.toBeInTheDocument();
    });
  });

  it('handles keyboard events', async () => {
    render(<Tooltip {...defaultProps} delay={100} />);
    
    const trigger = screen.getByText('Hover me');
    fireEvent.keyDown(trigger, { key: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
    });
  });

  it('handles escape key to close tooltip', async () => {
    render(<Tooltip {...defaultProps} delay={100} />);
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
    });
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByText('This is a tooltip')).not.toBeInTheDocument();
    });
  });

  it('handles click outside to close tooltip', async () => {
    render(<Tooltip {...defaultProps} delay={100} />);
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
    });
    
    fireEvent.mouseDown(document);
    
    await waitFor(() => {
      expect(screen.queryByText('This is a tooltip')).not.toBeInTheDocument();
    });
  });

  it('cleans up timeouts on unmount', () => {
    const { unmount } = render(<Tooltip {...defaultProps} delay={500} />);
    
    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);
    
    unmount();
    
    // Should not throw any errors
    expect(() => unmount()).not.toThrow();
  });
});
