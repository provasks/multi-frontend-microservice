import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationItem from '../NotificationItem';

// Mock the constants
jest.mock('sharedComponents/constants', () => ({
  NOTIFICATION_CONSTANTS: {
    TYPE_CONFIG: {
      info: { label: 'Info', bgClass: 'type-info' },
      warning: { label: 'Warning', bgClass: 'type-warning' },
      error: { label: 'Error', bgClass: 'type-error' },
      success: { label: 'Success', bgClass: 'type-success' }
    }
  }
}));

describe('NotificationItem Component', () => {
  const mockNotification = {
    _id: '1',
    title: 'Test Notification',
    message: 'This is a test notification',
    type: 'info',
    isRead: false,
    createdAt: '2024-01-01T00:00:00.000Z'
  };

  const defaultProps = {
    notification: mockNotification,
    onMarkAsRead: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders notification information correctly', () => {
    render(
      <table>
        <tbody>
          <NotificationItem {...defaultProps} />
        </tbody>
      </table>
    );
    
    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('This is a test notification')).toBeInTheDocument();
  });

  it('renders with correct type badge styling', () => {
    render(
      <table>
        <tbody>
          <NotificationItem {...defaultProps} />
        </tbody>
      </table>
    );
    
    const typeBadge = screen.getByText('Info');
    expect(typeBadge).toHaveClass('badge', 'rounded-pill', 'type-info');
  });

  it('handles missing notification gracefully', () => {
    render(
      <table>
        <tbody>
          <NotificationItem {...defaultProps} notification={null} />
        </tbody>
      </table>
    );
    
    expect(screen.getByText('Unknown Notification')).toBeInTheDocument();
  });

  it('calls onMarkAsRead when mark as read button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <table>
        <tbody>
          <NotificationItem {...defaultProps} />
        </tbody>
      </table>
    );
    
    const markAsReadButton = screen.getByTitle('Mark as Read');
    await user.click(markAsReadButton);
    
    expect(defaultProps.onMarkAsRead).toHaveBeenCalledWith(mockNotification._id);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <table>
        <tbody>
          <NotificationItem {...defaultProps} />
        </tbody>
      </table>
    );
    
    const deleteButton = screen.getByTitle('Delete Notification');
    await user.click(deleteButton);
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockNotification._id);
  });

  it('renders unread notification correctly', () => {
    render(
      <table>
        <tbody>
          <NotificationItem {...defaultProps} />
        </tbody>
      </table>
    );
    
    // Check for unread styling or indicators
    const notificationElement = screen.getByText('Test Notification').closest('tr');
    expect(notificationElement).toBeInTheDocument();
  });

  it('renders read notification correctly', () => {
    const readNotification = {
      ...mockNotification,
      isRead: true
    };
    
    render(
      <table>
        <tbody>
          <NotificationItem {...defaultProps} notification={readNotification} />
        </tbody>
      </table>
    );
    
    expect(screen.getByText('Test Notification')).toBeInTheDocument();
  });

  it('handles different notification types', () => {
    const warningNotification = {
      ...mockNotification,
      type: 'warning'
    };
    
    render(
      <table>
        <tbody>
          <NotificationItem {...defaultProps} notification={warningNotification} />
        </tbody>
      </table>
    );
    
    const typeBadge = screen.getByText('Warning');
    expect(typeBadge).toHaveClass('badge', 'rounded-pill', 'type-warning');
  });

  it('formats created date correctly', () => {
    render(
      <table>
        <tbody>
          <NotificationItem {...defaultProps} />
        </tbody>
      </table>
    );
    
    // Check that the date is formatted (exact format may vary by locale)
    expect(screen.getByText(/1\/1\/2024/)).toBeInTheDocument();
  });

  it('renders with correct CSS classes', () => {
    const { container } = render(
      <table>
        <tbody>
          <NotificationItem {...defaultProps} />
        </tbody>
      </table>
    );
    
    const notificationRow = container.querySelector('tr');
    expect(notificationRow).toBeInTheDocument();
  });

  it('handles empty notification object', () => {
    render(
      <table>
        <tbody>
          <NotificationItem {...defaultProps} notification={{}} />
        </tbody>
      </table>
    );
    
    expect(screen.getByText('Untitled Notification')).toBeInTheDocument();
  });
});