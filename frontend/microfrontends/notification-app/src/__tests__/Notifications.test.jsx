import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Notifications from '../Notifications';
import { useNotificationManagement } from '../hooks/useNotificationManagement';

// Mock the useNotificationManagement hook
jest.mock('../hooks/useNotificationManagement');

// Shared components are mocked in __mocks__/sharedComponents.js

// Mock the child components
jest.mock('../components/NotificationTable', () => {
  return function MockNotificationTable({ notifications, onEdit, onMarkAsRead, onDelete }) {
    return (
      <div data-testid="notification-table">
        <div>Notifications: {notifications.length}</div>
        <button onClick={() => onEdit({ id: 1, title: 'test' })}>Edit Notification</button>
        <button onClick={() => onMarkAsRead({ id: 1, title: 'test' })}>Mark as Read</button>
        <button onClick={() => onDelete({ id: 1, title: 'test' })}>Delete Notification</button>
      </div>
    );
  };
});

jest.mock('../components/NotificationModal', () => {
  return function MockNotificationModal({ show, mode, formData, onClose, onSubmit, onInputChange }) {
    if (!show) return null;
    return (
      <div data-testid="notification-modal" data-mode={mode}>
        <div>Modal Content</div>
        <button onClick={onClose}>Close</button>
        <button onClick={onSubmit}>Submit</button>
        <input onChange={onInputChange} />
      </div>
    );
  };
});

describe('Notifications Component', () => {
  const mockUseNotificationManagement = useNotificationManagement;

  const defaultMockData = {
    notifications: [
      { id: 1, title: 'notification1', message: 'message1' },
      { id: 2, title: 'notification2', message: 'message2' }
    ],
    loading: false,
    showModal: false,
    modalMode: 'add',
    formData: {
      title: '',
      type: 'info',
      message: '',
      isRead: false
    },
    fetchNotifications: jest.fn(),
    handleAddNotification: jest.fn(),
    handleEditNotification: jest.fn(),
    handleDeleteNotification: jest.fn(),
    handleSubmit: jest.fn(),
    handleInputChange: jest.fn(),
    handleCloseModal: jest.fn(),
    markAsRead: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNotificationManagement.mockReturnValue(defaultMockData);
  });

  it('renders loading spinner when loading is true', () => {
    mockUseNotificationManagement.mockReturnValue({
      ...defaultMockData,
      loading: true
    });

    render(<Notifications />);
    
    const loadingSpinner = screen.getByTestId('loading-spinner');
    expect(loadingSpinner).toBeInTheDocument();
    expect(loadingSpinner).toHaveAttribute('data-size', 'large');
    expect(loadingSpinner).toHaveAttribute('data-variant', 'info');
    expect(loadingSpinner).toHaveAttribute('data-text', '');
    expect(loadingSpinner).toHaveAttribute('data-show-dots', 'false');
  });

  it('renders main content when not loading', () => {
    render(<Notifications />);
    
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Add Notification')).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
    expect(screen.getByText('Notifications (2)')).toBeInTheDocument();
  });

  it('renders notification table with correct props', () => {
    render(<Notifications />);
    
    const notificationTable = screen.getByTestId('notification-table');
    expect(notificationTable).toBeInTheDocument();
    expect(screen.getByText('Notifications: 2')).toBeInTheDocument();
  });

  it('renders notification modal with correct props', () => {
    mockUseNotificationManagement.mockReturnValue({
      ...defaultMockData,
      showModal: true,
      modalMode: 'edit'
    });

    render(<Notifications />);
    
    const notificationModal = screen.getByTestId('notification-modal');
    expect(notificationModal).toBeInTheDocument();
    expect(notificationModal).toHaveAttribute('data-mode', 'edit');
  });

  it('does not render modal when showModal is false', () => {
    render(<Notifications />);
    
    expect(screen.queryByTestId('notification-modal')).not.toBeInTheDocument();
  });

  it('calls handleAddNotification when Add Notification button is clicked', async () => {
    const user = userEvent.setup();
    render(<Notifications />);
    
    const addButton = screen.getByRole('button', { name: /add notification/i });
    await user.click(addButton);
    
    expect(defaultMockData.handleAddNotification).toHaveBeenCalledTimes(1);
  });

  it('calls fetchNotifications when Refresh button is clicked', async () => {
    const user = userEvent.setup();
    render(<Notifications />);
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    await user.click(refreshButton);
    
    expect(defaultMockData.fetchNotifications).toHaveBeenCalledTimes(1);
  });

  it('calls handleEditNotification when edit is triggered from NotificationTable', async () => {
    const user = userEvent.setup();
    render(<Notifications />);
    
    const editButton = screen.getByRole('button', { name: /edit notification/i });
    await user.click(editButton);
    
    expect(defaultMockData.handleEditNotification).toHaveBeenCalledWith({ id: 1, title: 'test' });
  });

  it('calls markAsRead when mark as read is triggered from NotificationTable', async () => {
    const user = userEvent.setup();
    render(<Notifications />);
    
    const markReadButton = screen.getByRole('button', { name: /mark as read/i });
    await user.click(markReadButton);
    
    expect(defaultMockData.markAsRead).toHaveBeenCalledWith({ id: 1, title: 'test' });
  });

  it('calls handleDeleteNotification when delete is triggered from NotificationTable', async () => {
    const user = userEvent.setup();
    render(<Notifications />);
    
    const deleteButton = screen.getByRole('button', { name: /delete notification/i });
    await user.click(deleteButton);
    
    expect(defaultMockData.handleDeleteNotification).toHaveBeenCalledWith({ id: 1, title: 'test' });
  });

  it('displays correct notification count', () => {
    mockUseNotificationManagement.mockReturnValue({
      ...defaultMockData,
      notifications: [
        { id: 1, title: 'notification1' },
        { id: 2, title: 'notification2' },
        { id: 3, title: 'notification3' }
      ]
    });

    render(<Notifications />);
    
    expect(screen.getByText('Notifications (3)')).toBeInTheDocument();
  });

  it('renders with correct CSS classes', () => {
    render(<Notifications />);
    
    const mainDiv = screen.getByText('Notifications').closest('.p-4');
    expect(mainDiv).toBeInTheDocument();
    
    const card = screen.getByText('Notifications (2)').closest('.card');
    expect(card).toBeInTheDocument();
    
    const cardHeader = screen.getByText('Notifications (2)').closest('.card-header');
    expect(cardHeader).toBeInTheDocument();
    
    const cardBody = screen.getByTestId('notification-table').closest('.card-body');
    expect(cardBody).toBeInTheDocument();
  });

  it('renders correct icons', () => {
    render(<Notifications />);
    
    const bellIcon = screen.getByText('Notifications').querySelector('.fas.fa-bell');
    expect(bellIcon).toBeInTheDocument();
    
    const addIcon = screen.getByRole('button', { name: /add notification/i }).querySelector('.fas.fa-plus');
    expect(addIcon).toBeInTheDocument();
    
    const refreshIcon = screen.getByRole('button', { name: /refresh/i }).querySelector('.fas.fa-sync-alt');
    expect(refreshIcon).toBeInTheDocument();
  });

  it('handles empty notifications array', () => {
    mockUseNotificationManagement.mockReturnValue({
      ...defaultMockData,
      notifications: []
    });

    render(<Notifications />);
    
    expect(screen.getByText('Notifications (0)')).toBeInTheDocument();
  });

  it('passes correct props to NotificationModal', () => {
    const formData = {
      title: 'Test Notification',
      type: 'warning',
      message: 'Test message',
      isRead: true
    };

    mockUseNotificationManagement.mockReturnValue({
      ...defaultMockData,
      showModal: true,
      modalMode: 'add',
      formData
    });

    render(<Notifications />);
    
    const notificationModal = screen.getByTestId('notification-modal');
    expect(notificationModal).toBeInTheDocument();
    expect(notificationModal).toHaveAttribute('data-mode', 'add');
  });

  it('handles different modal modes', () => {
    mockUseNotificationManagement.mockReturnValue({
      ...defaultMockData,
      showModal: true,
      modalMode: 'edit'
    });

    render(<Notifications />);
    
    const notificationModal = screen.getByTestId('notification-modal');
    expect(notificationModal).toHaveAttribute('data-mode', 'edit');
  });

  it('renders header section correctly', () => {
    render(<Notifications />);
    
    const headerSection = screen.getByText('Notifications').closest('.d-flex');
    expect(headerSection).toHaveClass('d-flex', 'justify-content-between', 'align-items-center', 'mb-4');
    
    const title = screen.getByText('Notifications');
    expect(title).toHaveClass('mb-0');
  });

  it('renders button section correctly', () => {
    render(<Notifications />);
    
    const addButton = screen.getByRole('button', { name: /add notification/i });
    expect(addButton).toHaveClass('btn', 'btn-primary', 'me-2');
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    expect(refreshButton).toHaveClass('btn', 'btn-outline-primary');
  });

  it('handles loading state transition', () => {
    const { rerender } = render(<Notifications />);
    
    // Initially not loading
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    
    // Switch to loading
    mockUseNotificationManagement.mockReturnValue({
      ...defaultMockData,
      loading: true
    });
    
    rerender(<Notifications />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
  });

  it('handles modal interactions correctly', async () => {
    const user = userEvent.setup();
    mockUseNotificationManagement.mockReturnValue({
      ...defaultMockData,
      showModal: true,
      modalMode: 'add'
    });

    render(<Notifications />);
    
    const notificationModal = screen.getByTestId('notification-modal');
    expect(notificationModal).toBeInTheDocument();
    
    // Test close modal
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    expect(defaultMockData.handleCloseModal).toHaveBeenCalledTimes(1);
    
    // Test submit modal
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    expect(defaultMockData.handleSubmit).toHaveBeenCalledTimes(1);
    
    // Test input change
    const input = screen.getByRole('textbox');
    await user.type(input, 'test');
    expect(defaultMockData.handleInputChange).toHaveBeenCalled();
  });

  it('maintains component state correctly', () => {
    const { rerender } = render(<Notifications />);
    
    // Initially with 2 notifications
    expect(screen.getByText('Notifications (2)')).toBeInTheDocument();
    
    // Update with different notifications
    mockUseNotificationManagement.mockReturnValue({
      ...defaultMockData,
      notifications: [
        { id: 1, title: 'notification1' },
        { id: 2, title: 'notification2' },
        { id: 3, title: 'notification3' },
        { id: 4, title: 'notification4' }
      ]
    });
    
    rerender(<Notifications />);
    
    expect(screen.getByText('Notifications (4)')).toBeInTheDocument();
  });
});
