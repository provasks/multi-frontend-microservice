import React from 'react';
import ReactDOM from 'react-dom/client';
import { render, screen } from '@testing-library/react';
import bootstrap from '../bootstrap';

// Mock ReactDOM
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn()
  }))
}));

// Mock TaskManagement component
jest.mock('../TaskManagement', () => {
  return function MockTaskManagement() {
    return <div data-testid="task-management">Task Management Component</div>;
  };
});

// Mock document.getElementById
const mockGetElementById = jest.fn();
Object.defineProperty(document, 'getElementById', {
  value: mockGetElementById,
  writable: true
});

describe('bootstrap.jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders TaskManagement when root element exists', () => {
    const mockRootElement = document.createElement('div');
    mockRootElement.id = 'root';
    mockGetElementById.mockReturnValue(mockRootElement);

    const mockCreateRoot = jest.fn(() => ({
      render: jest.fn()
    }));
    ReactDOM.createRoot = mockCreateRoot;

    // Import and execute bootstrap
    require('../bootstrap');

    expect(mockGetElementById).toHaveBeenCalledWith('root');
    expect(mockCreateRoot).toHaveBeenCalledWith(mockRootElement);
  });

  it('does not render when root element does not exist', () => {
    mockGetElementById.mockReturnValue(null);

    const mockCreateRoot = jest.fn();
    ReactDOM.createRoot = mockCreateRoot;

    // Import and execute bootstrap
    require('../bootstrap');

    expect(mockGetElementById).toHaveBeenCalledWith('root');
    expect(mockCreateRoot).not.toHaveBeenCalled();
  });

  it('handles root element with different id', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'different-id';
    mockGetElementById.mockReturnValue(mockElement);

    const mockCreateRoot = jest.fn();
    ReactDOM.createRoot = mockCreateRoot;

    // Import and execute bootstrap
    require('../bootstrap');

    expect(mockGetElementById).toHaveBeenCalledWith('root');
    expect(mockCreateRoot).not.toHaveBeenCalled();
  });

  it('handles document.getElementById throwing an error', () => {
    mockGetElementById.mockImplementation(() => {
      throw new Error('DOM error');
    });

    const mockCreateRoot = jest.fn();
    ReactDOM.createRoot = mockCreateRoot;

    // Should not throw an error
    expect(() => {
      require('../bootstrap');
    }).not.toThrow();

    expect(mockCreateRoot).not.toHaveBeenCalled();
  });

  it('handles ReactDOM.createRoot throwing an error', () => {
    const mockRootElement = document.createElement('div');
    mockRootElement.id = 'root';
    mockGetElementById.mockReturnValue(mockRootElement);

    ReactDOM.createRoot.mockImplementation(() => {
      throw new Error('ReactDOM error');
    });

    // Should not throw an error
    expect(() => {
      require('../bootstrap');
    }).not.toThrow();
  });

  it('handles root.render throwing an error', () => {
    const mockRootElement = document.createElement('div');
    mockRootElement.id = 'root';
    mockGetElementById.mockReturnValue(mockRootElement);

    const mockRender = jest.fn(() => {
      throw new Error('Render error');
    });
    ReactDOM.createRoot.mockReturnValue({
      render: mockRender
    });

    // Should not throw an error
    expect(() => {
      require('../bootstrap');
    }).not.toThrow();

    expect(mockRender).toHaveBeenCalled();
  });

  it('calls root.render with TaskManagement component', () => {
    const mockRootElement = document.createElement('div');
    mockRootElement.id = 'root';
    mockGetElementById.mockReturnValue(mockRootElement);

    const mockRender = jest.fn();
    ReactDOM.createRoot.mockReturnValue({
      render: mockRender
    });

    // Import and execute bootstrap
    require('../bootstrap');

    expect(mockRender).toHaveBeenCalledTimes(1);
    // The render function should be called with a React element
    expect(mockRender).toHaveBeenCalledWith(expect.any(Object));
  });

  it('handles multiple calls to bootstrap', () => {
    const mockRootElement = document.createElement('div');
    mockRootElement.id = 'root';
    mockGetElementById.mockReturnValue(mockRootElement);

    const mockRender = jest.fn();
    ReactDOM.createRoot.mockReturnValue({
      render: mockRender
    });

    // Call bootstrap multiple times
    require('../bootstrap');
    require('../bootstrap');
    require('../bootstrap');

    expect(mockRender).toHaveBeenCalledTimes(3);
  });

  it('handles root element being removed after initial check', () => {
    const mockRootElement = document.createElement('div');
    mockRootElement.id = 'root';
    
    // First call returns element, second call returns null
    mockGetElementById
      .mockReturnValueOnce(mockRootElement)
      .mockReturnValueOnce(null);

    const mockRender = jest.fn();
    ReactDOM.createRoot.mockReturnValue({
      render: mockRender
    });

    // First call should work
    require('../bootstrap');
    expect(mockRender).toHaveBeenCalledTimes(1);

    // Second call should not render
    require('../bootstrap');
    expect(mockRender).toHaveBeenCalledTimes(1);
  });
});
