import React from 'react';
import { render, screen, act } from '@testing-library/react';
import PerformanceMonitor from '../PerformanceMonitor';

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => 1000),
  memory: {
    usedJSHeapSize: 50 * 1024 * 1024 // 50MB
  }
};

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true
});

// Mock addEventListener and removeEventListener
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
  writable: true
});
Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true
});

// Mock setInterval and clearInterval
const mockSetInterval = jest.fn();
const mockClearInterval = jest.fn();
Object.defineProperty(global, 'setInterval', {
  value: mockSetInterval,
  writable: true
});
Object.defineProperty(global, 'clearInterval', {
  value: mockClearInterval,
  writable: true
});

describe('PerformanceMonitor Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPerformance.now.mockReturnValue(1000);
  });

  it('renders nothing when disabled', () => {
    const { container } = render(<PerformanceMonitor enabled={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when enabled prop is not provided', () => {
    const { container } = render(<PerformanceMonitor />);
    expect(container.firstChild).toBeNull();
  });

  it('renders performance monitor when enabled', () => {
    render(<PerformanceMonitor enabled={true} />);
    
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
    expect(screen.getByText(/Load Time:/)).toBeInTheDocument();
    expect(screen.getByText(/Render Time:/)).toBeInTheDocument();
    expect(screen.getByText(/Memory:/)).toBeInTheDocument();
    expect(screen.getByText(/Bundle:/)).toBeInTheDocument();
  });

  it('sets up event listeners when enabled', () => {
    render(<PerformanceMonitor enabled={true} />);
    
    expect(mockAddEventListener).toHaveBeenCalledWith('load', expect.any(Function));
    expect(mockAddEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));
  });

  it('sets up memory tracking interval when enabled', () => {
    render(<PerformanceMonitor enabled={true} />);
    
    expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 5000);
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<PerformanceMonitor enabled={true} />);
    
    unmount();
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('load', expect.any(Function));
    expect(mockRemoveEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));
    expect(mockClearInterval).toHaveBeenCalled();
  });

  it('displays initial metrics', () => {
    render(<PerformanceMonitor enabled={true} />);
    
    expect(screen.getByText('Load Time: 0.00ms')).toBeInTheDocument();
    expect(screen.getByText('Render Time: 0.00ms')).toBeInTheDocument();
    expect(screen.getByText('Memory: 0MB')).toBeInTheDocument();
    expect(screen.getByText('Bundle: 0KB')).toBeInTheDocument();
  });

  it('updates metrics when load event fires', () => {
    render(<PerformanceMonitor enabled={true} />);
    
    // Get the load event handler
    const loadHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'load'
    )[1];
    
    // Mock performance.now to return different values
    mockPerformance.now
      .mockReturnValueOnce(1000) // Initial time
      .mockReturnValueOnce(1500); // Time when load event fires
    
    act(() => {
      loadHandler();
    });
    
    expect(screen.getByText('Load Time: 500.00ms')).toBeInTheDocument();
  });

  it('updates metrics when DOMContentLoaded event fires', () => {
    render(<PerformanceMonitor enabled={true} />);
    
    // Get the DOMContentLoaded event handler
    const domContentLoadedHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'DOMContentLoaded'
    )[1];
    
    // Mock performance.now to return different values
    mockPerformance.now
      .mockReturnValueOnce(1000) // Initial time
      .mockReturnValueOnce(1200); // Time when DOMContentLoaded event fires
    
    act(() => {
      domContentLoadedHandler();
    });
    
    expect(screen.getByText('Render Time: 200.00ms')).toBeInTheDocument();
  });

  it('updates memory usage when memory tracking runs', () => {
    render(<PerformanceMonitor enabled={true} />);
    
    // Get the memory tracking function
    const memoryTrackingFunction = mockSetInterval.mock.calls[0][0];
    
    act(() => {
      memoryTrackingFunction();
    });
    
    expect(screen.getByText('Memory: 50MB')).toBeInTheDocument();
  });

  it('handles missing performance.memory gracefully', () => {
    // Mock performance without memory
    const mockPerformanceWithoutMemory = {
      now: jest.fn(() => 1000)
    };
    Object.defineProperty(window, 'performance', {
      value: mockPerformanceWithoutMemory,
      writable: true
    });
    
    render(<PerformanceMonitor enabled={true} />);
    
    // Get the memory tracking function
    const memoryTrackingFunction = mockSetInterval.mock.calls[0][0];
    
    act(() => {
      memoryTrackingFunction();
    });
    
    // Should not crash and memory should remain 0
    expect(screen.getByText('Memory: 0MB')).toBeInTheDocument();
  });

  it('has correct styling', () => {
    render(<PerformanceMonitor enabled={true} />);
    
    const monitor = screen.getByText('Performance Metrics').closest('.performance-monitor');
    expect(monitor).toHaveClass('position-fixed');
    expect(monitor).toHaveStyle({
      top: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: '9999',
      fontFamily: 'monospace'
    });
  });

  it('formats numbers correctly', () => {
    render(<PerformanceMonitor enabled={true} />);
    
    // All metrics should show 2 decimal places for time and 0 for memory/bundle
    expect(screen.getByText('Load Time: 0.00ms')).toBeInTheDocument();
    expect(screen.getByText('Render Time: 0.00ms')).toBeInTheDocument();
    expect(screen.getByText('Memory: 0MB')).toBeInTheDocument();
    expect(screen.getByText('Bundle: 0KB')).toBeInTheDocument();
  });

  it('does not set up tracking when disabled', () => {
    render(<PerformanceMonitor enabled={false} />);
    
    expect(mockAddEventListener).not.toHaveBeenCalled();
    expect(mockSetInterval).not.toHaveBeenCalled();
  });
});
