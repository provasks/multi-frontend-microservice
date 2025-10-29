import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';

// Import your store slices
import { tasksSlice } from '../store/slices/tasksSlice';
import { authSlice } from '../store/slices/authSlice';
import { uiSlice } from '../store/slices/uiSlice';

// Create a test store
export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      tasks: tasksSlice.reducer,
      auth: authSlice.reducer,
      ui: uiSlice.reducer,
    },
    preloadedState,
  });
};

// Custom render function that includes providers
const AllTheProviders = ({ children, store = createTestStore() }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

const customRender = (ui, options = {}) => {
  const { store, ...renderOptions } = options;
  return render(ui, {
    wrapper: (props) => <AllTheProviders {...props} store={store} />,
    ...renderOptions,
  });
};

// Mock data factories
export const createMockTask = (overrides = {}) => ({
  _id: '1',
  title: 'Test Task',
  description: 'Test Description',
  priority: 'medium',
  status: 'pending',
  assignedTo: 'user123',
  dueDate: '2024-12-31T23:59:59.000Z',
  tags: 'test,example',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  _id: 'user123',
  username: 'testuser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'user',
  ...overrides,
});

export const createMockTasks = (count = 3) => {
  return Array.from({ length: count }, (_, index) => 
    createMockTask({
      _id: `task-${index + 1}`,
      title: `Task ${index + 1}`,
    })
  );
};

// Mock API responses
export const mockApiResponse = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data)),
});

// Mock fetch implementation
export const mockFetch = (response) => {
  global.fetch = jest.fn().mockResolvedValue(response);
};

// Mock fetch with error
export const mockFetchError = (error) => {
  global.fetch = jest.fn().mockRejectedValue(error);
};

// Test helpers
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

// Custom matchers for testing
export const expectElementToBeInDocument = (element) => {
  expect(element).toBeInTheDocument();
};

export const expectElementToHaveText = (element, text) => {
  expect(element).toHaveTextContent(text);
};

export const expectElementToHaveClass = (element, className) => {
  expect(element).toHaveClass(className);
};

// Re-export everything from testing library
export * from '@testing-library/react';
export * from '@testing-library/user-event';

// Export custom render as default
export { customRender as render };
