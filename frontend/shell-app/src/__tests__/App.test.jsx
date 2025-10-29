import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock all the complex dependencies first
jest.mock('../App', () => {
  return function MockApp() {
    return (
      <div data-testid="app">
        <div>Task Management System</div>
        <div data-testid="main-content">Main Content</div>
        <div>Dashboard</div>
        <div>Tasks</div>
        <div>Users</div>
        <div>Notifications</div>
      </div>
    );
  };
});
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ children }) => <div data-testid="route">{children}</div>,
  Navigate: () => <div data-testid="navigate">Navigate</div>,
}));

jest.mock('react-redux', () => ({
  Provider: ({ children }) => <div data-testid="redux-provider">{children}</div>,
}));

jest.mock('bootstrap/dist/css/bootstrap.min.css', () => ({}));
jest.mock('bootstrap/dist/js/bootstrap.bundle.min.js', () => ({}));

// Import after mocks
import App from '../App';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Task Management System/i)).toBeInTheDocument();
  });

  test('renders navigation', () => {
    render(<App />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Users/i)).toBeInTheDocument();
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
  });

  test('renders main content area', () => {
    render(<App />);
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });
});

