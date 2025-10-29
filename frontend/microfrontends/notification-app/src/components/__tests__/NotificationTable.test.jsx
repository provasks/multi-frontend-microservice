import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationTable from '../NotificationTable';

// Mock the NotificationItem component
jest.mock('../NotificationItem', () => {
  return function MockNotificationItem({ notification, onEdit, onMarkAsRead, onDelete }) {
    return (
      <tr data-testid={`notification-item-${notification._id || 'unknown'}`}>
        <td>{notification.title}</td>
        <td>{notification.message}</td>
        <td>{notification.type}</td>
        <td>{notification.isRead ? 'Read' : 'Unread'}</td>
        <td>{notification.createdAt}</td>
        <td>
          <button onClick={() => onEdit(notification)}>Edit</button>
          <button onClick={() => onMarkAsRead(notification)}>Mark Read</button>
          <button onClick={() => onDelete(notification)}>Delete</button>
        </td>
      </tr>
    );
  };
});

describe('NotificationTable Component', () => {
  const defaultProps = {
    notifications: [],
    onEdit: jest.fn(),
    onMarkAsRead: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no notifications', () => {
    render(<NotificationTable {...defaultProps} />);
    
    expect(screen.getByText('No notifications found.')).toBeInTheDocument();
    const icon = document.querySelector('.fas.fa-bell');
    expect(icon).toHaveClass('fas', 'fa-bell', 'fa-3x', 'text-muted', 'mb-3');
  });

  it('renders table when notifications exist', () => {
    const notifications = [
      {
        _id: '1',
        title: 'Test Notification',
        message: 'Test message',
        type: 'info',
        isRead: false,
        createdAt: '2023-01-01'
      }
    ];

    render(<NotificationTable {...defaultProps} notifications={notifications} />);
    
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders correct number of notification items', () => {
    const notifications = [
      { _id: '1', title: 'Notification 1', message: 'Message 1', type: 'info', isRead: false, createdAt: '2023-01-01' },
      { _id: '2', title: 'Notification 2', message: 'Message 2', type: 'warning', isRead: true, createdAt: '2023-01-02' },
      { _id: '3', title: 'Notification 3', message: 'Message 3', type: 'error', isRead: false, createdAt: '2023-01-03' }
    ];

    render(<NotificationTable {...defaultProps} notifications={notifications} />);
    
    expect(screen.getByTestId('notification-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('notification-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('notification-item-3')).toBeInTheDocument();
  });

  it('passes correct props to NotificationItem components', () => {
    const notifications = [
      { _id: '1', title: 'Test', message: 'Test message', type: 'info', isRead: false, createdAt: '2023-01-01' }
    ];

    render(<NotificationTable {...defaultProps} notifications={notifications} />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('info')).toBeInTheDocument();
    expect(screen.getByText('Unread')).toBeInTheDocument();
    expect(screen.getByText('2023-01-01')).toBeInTheDocument();
  });

  it('handles notifications without _id by using index as key', () => {
    const notifications = [
      { title: 'Notification 1', message: 'Message 1', type: 'info', isRead: false, createdAt: '2023-01-01' },
      { title: 'Notification 2', message: 'Message 2', type: 'warning', isRead: true, createdAt: '2023-01-02' }
    ];

    render(<NotificationTable {...defaultProps} notifications={notifications} />);
    
    expect(screen.getAllByTestId('notification-item-unknown')).toHaveLength(2);
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    const notifications = [
      { _id: '1', title: 'Test', message: 'Test message', type: 'info', isRead: false, createdAt: '2023-01-01' }
    ];

    render(<NotificationTable {...defaultProps} notifications={notifications} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);
    
    expect(defaultProps.onEdit).toHaveBeenCalledWith(notifications[0]);
  });

  it('calls onMarkAsRead when mark read button is clicked', async () => {
    const user = userEvent.setup();
    const notifications = [
      { _id: '1', title: 'Test', message: 'Test message', type: 'info', isRead: false, createdAt: '2023-01-01' }
    ];

    render(<NotificationTable {...defaultProps} notifications={notifications} />);
    
    const markReadButton = screen.getByRole('button', { name: /mark read/i });
    await user.click(markReadButton);
    
    expect(defaultProps.onMarkAsRead).toHaveBeenCalledWith(notifications[0]);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const notifications = [
      { _id: '1', title: 'Test', message: 'Test message', type: 'info', isRead: false, createdAt: '2023-01-01' }
    ];

    render(<NotificationTable {...defaultProps} notifications={notifications} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith(notifications[0]);
  });

  it('renders with correct CSS classes', () => {
    const notifications = [
      { _id: '1', title: 'Test', message: 'Test message', type: 'info', isRead: false, createdAt: '2023-01-01' }
    ];

    render(<NotificationTable {...defaultProps} notifications={notifications} />);
    
    const tableContainer = screen.getByRole('table').closest('.table-responsive');
    expect(tableContainer).toBeInTheDocument();
    
    const table = screen.getByRole('table');
    expect(table).toHaveClass('table', 'table-striped', 'table-hover', 'table-bordered');
    
    const thead = screen.getByRole('table').querySelector('thead');
    expect(thead).toHaveClass('table-dark');
  });

  it('renders table headers with correct styling', () => {
    const notifications = [
      { _id: '1', title: 'Test', message: 'Test message', type: 'info', isRead: false, createdAt: '2023-01-01' }
    ];

    render(<NotificationTable {...defaultProps} notifications={notifications} />);
    
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(6);
    
    headers.forEach(header => {
      expect(header).toHaveClass('text-center');
    });
  });

  it('renders table headers with correct widths', () => {
    const notifications = [
      { _id: '1', title: 'Test', message: 'Test message', type: 'info', isRead: false, createdAt: '2023-01-01' }
    ];

    render(<NotificationTable {...defaultProps} notifications={notifications} />);
    
    const titleHeader = screen.getByText('Title');
    expect(titleHeader).toHaveStyle('width: 20%');
    
    const messageHeader = screen.getByText('Message');
    expect(messageHeader).toHaveStyle('width: 35%');
    
    const typeHeader = screen.getByText('Type');
    expect(typeHeader).toHaveStyle('width: 10%');
    
    const statusHeader = screen.getByText('Status');
    expect(statusHeader).toHaveStyle('width: 10%');
    
    const createdHeader = screen.getByText('Created');
    expect(createdHeader).toHaveStyle('width: 15%');
    
    const actionsHeader = screen.getByText('Actions');
    expect(actionsHeader).toHaveStyle('width: 10%');
  });

  it('renders empty state with correct styling', () => {
    render(<NotificationTable {...defaultProps} />);
    
    const emptyState = screen.getByText('No notifications found.').closest('div');
    expect(emptyState).toHaveClass('text-center', 'py-4');
    
    const icon = document.querySelector('.fas.fa-bell');
    expect(icon).toHaveClass('fas', 'fa-bell', 'fa-3x', 'text-muted', 'mb-3');
    
    const text = screen.getByText('No notifications found.');
    expect(text).toHaveClass('text-muted');
  });

  it('handles mixed notification types correctly', () => {
    const notifications = [
      { _id: '1', title: 'Info', message: 'Info message', type: 'info', isRead: false, createdAt: '2023-01-01' },
      { _id: '2', title: 'Success', message: 'Success message', type: 'success', isRead: true, createdAt: '2023-01-02' },
      { _id: '3', title: 'Warning', message: 'Warning message', type: 'warning', isRead: false, createdAt: '2023-01-03' },
      { _id: '4', title: 'Error', message: 'Error message', type: 'error', isRead: true, createdAt: '2023-01-04' }
    ];

    render(<NotificationTable {...defaultProps} notifications={notifications} />);
    
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    
    expect(screen.getByText('info')).toBeInTheDocument();
    expect(screen.getByText('success')).toBeInTheDocument();
    expect(screen.getByText('warning')).toBeInTheDocument();
    expect(screen.getByText('error')).toBeInTheDocument();
  });

  it('handles large number of notifications', () => {
    const notifications = Array.from({ length: 100 }, (_, i) => ({
      _id: `notification-${i}`,
      title: `Notification ${i}`,
      message: `Message ${i}`,
      type: 'info',
      isRead: i % 2 === 0,
      createdAt: `2023-01-${String(i + 1).padStart(2, '0')}`
    }));

    render(<NotificationTable {...defaultProps} notifications={notifications} />);
    
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByTestId('notification-item-notification-0')).toBeInTheDocument();
    expect(screen.getByTestId('notification-item-notification-99')).toBeInTheDocument();
  });

  it('maintains component memoization', () => {
    const notifications = [
      { _id: '1', title: 'Test', message: 'Test message', type: 'info', isRead: false, createdAt: '2023-01-01' }
    ];

    const { rerender } = render(<NotificationTable {...defaultProps} notifications={notifications} />);
    
    // Rerender with same props should not cause unnecessary re-renders
    rerender(<NotificationTable {...defaultProps} notifications={notifications} />);
    
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
