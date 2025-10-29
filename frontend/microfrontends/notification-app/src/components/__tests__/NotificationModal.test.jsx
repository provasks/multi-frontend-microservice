import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationModal from '../NotificationModal';

describe('NotificationModal Component', () => {
  const defaultProps = {
    show: true,
    mode: 'add',
    formData: {
      title: '',
      type: 'info',
      message: '',
      isRead: false
    },
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    onInputChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when show is false', () => {
    render(<NotificationModal {...defaultProps} show={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal when show is true', () => {
    render(<NotificationModal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders add mode correctly', () => {
    render(<NotificationModal {...defaultProps} mode="add" />);
    
    expect(screen.getByText('Add New Notification')).toBeInTheDocument();
    expect(screen.getByText('Create Notification')).toBeInTheDocument();
  });

  it('renders edit mode correctly', () => {
    render(<NotificationModal {...defaultProps} mode="edit" />);
    
    expect(screen.getByText('Edit Notification')).toBeInTheDocument();
    expect(screen.getByText('Update Notification')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<NotificationModal {...defaultProps} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mark as read/i)).toBeInTheDocument();
  });

  it('displays form data correctly', () => {
    const formData = {
      title: 'Test Notification',
      type: 'warning',
      message: 'This is a test message',
      isRead: true
    };

    render(<NotificationModal {...defaultProps} formData={formData} />);
    
    expect(screen.getByDisplayValue('Test Notification')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Warning')).toBeInTheDocument();
    expect(screen.getByDisplayValue('This is a test message')).toBeInTheDocument();
    expect(screen.getByLabelText(/mark as read/i)).toBeChecked();
  });

  it('calls onInputChange when input values change', async () => {
    const user = userEvent.setup();
    render(<NotificationModal {...defaultProps} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'New Title');
    
    expect(defaultProps.onInputChange).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<NotificationModal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /Close/i });
    await user.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<NotificationModal {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    render(<NotificationModal {...defaultProps} />);
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility attributes', () => {
    render(<NotificationModal {...defaultProps} />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('tabIndex', '-1');
    
    const closeButton = screen.getByRole('button', { name: /Close/i });
    expect(closeButton).toHaveAttribute('aria-label', 'Close');
  });

  it('validates required fields', () => {
    render(<NotificationModal {...defaultProps} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const messageInput = screen.getByLabelText(/message/i);
    
    expect(titleInput).toBeRequired();
    expect(messageInput).toBeRequired();
  });

  it('renders correct type options', () => {
    render(<NotificationModal {...defaultProps} />);
    
    const typeSelect = screen.getByLabelText(/type/i);
    expect(typeSelect).toBeInTheDocument();
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
    expect(screen.getByRole('option', { name: 'Info' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Success' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Warning' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Error' })).toBeInTheDocument();
  });

  it('handles type selection correctly', async () => {
    const user = userEvent.setup();
    render(<NotificationModal {...defaultProps} />);
    
    const typeSelect = screen.getByLabelText(/type/i);
    await user.selectOptions(typeSelect, 'error');
    
    expect(defaultProps.onInputChange).toHaveBeenCalled();
  });

  it('handles checkbox toggle correctly', async () => {
    const user = userEvent.setup();
    render(<NotificationModal {...defaultProps} />);
    
    const readCheckbox = screen.getByLabelText(/mark as read/i);
    await user.click(readCheckbox);
    
    expect(defaultProps.onInputChange).toHaveBeenCalled();
  });

  it('renders with correct CSS classes', () => {
    render(<NotificationModal {...defaultProps} />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('modal', 'show', 'd-block');
    
    const modalDialog = modal.querySelector('.modal-dialog');
    expect(modalDialog).toHaveClass('modal-dialog', 'modal-lg');
  });

  it('has correct form structure', () => {
    render(<NotificationModal {...defaultProps} />);
    
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
    
    const modalBody = screen.getByRole('dialog').querySelector('.modal-body');
    expect(modalBody).toBeInTheDocument();
    
    const modalFooter = screen.getByRole('dialog').querySelector('.modal-footer');
    expect(modalFooter).toBeInTheDocument();
  });

  it('displays correct icons', () => {
    render(<NotificationModal {...defaultProps} />);
    
    const bellIcon = screen.getByRole('dialog').querySelector('.fas.fa-bell');
    expect(bellIcon).toBeInTheDocument();
    
    const saveIcon = screen.getByRole('button', { name: /create notification/i }).querySelector('.fas.fa-save');
    expect(saveIcon).toBeInTheDocument();
  });

  it('handles form submission with preventDefault', async () => {
    const mockSubmit = jest.fn((e) => e.preventDefault());
    
    render(<NotificationModal {...defaultProps} onSubmit={mockSubmit} />);
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('renders with different form data values', () => {
    const formData = {
      title: 'Important Alert',
      type: 'error',
      message: 'This is an important error message that needs attention.',
      isRead: true
    };

    render(<NotificationModal {...defaultProps} formData={formData} mode="edit" />);
    
    expect(screen.getByDisplayValue('Important Alert')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Error')).toBeInTheDocument();
    expect(screen.getByDisplayValue('This is an important error message that needs attention.')).toBeInTheDocument();
    expect(screen.getByLabelText(/mark as read/i)).toBeChecked();
  });

  it('handles textarea input correctly', async () => {
    const user = userEvent.setup();
    render(<NotificationModal {...defaultProps} />);
    
    const messageTextarea = screen.getByLabelText(/message/i);
    await user.type(messageTextarea, 'This is a long message');
    
    expect(defaultProps.onInputChange).toHaveBeenCalled();
  });

  it('has correct textarea attributes', () => {
    render(<NotificationModal {...defaultProps} />);
    
    const messageTextarea = screen.getByLabelText(/message/i);
    expect(messageTextarea).toHaveAttribute('rows', '4');
    expect(messageTextarea).toHaveAttribute('placeholder', 'Enter notification message');
  });

  it('renders with correct placeholder text', () => {
    render(<NotificationModal {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Notification title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter notification message')).toBeInTheDocument();
  });

  it('handles different notification types', () => {
    const types = [
      { value: 'info', label: 'Info' },
      { value: 'success', label: 'Success' },
      { value: 'warning', label: 'Warning' },
      { value: 'error', label: 'Error' }
    ];
    
    types.forEach(({ value, label }) => {
      const { unmount } = render(
        <NotificationModal 
          {...defaultProps} 
          formData={{ ...defaultProps.formData, type: value }} 
        />
      );
      
      expect(screen.getByDisplayValue(label)).toBeInTheDocument();
      unmount();
    });
  });

  it('maintains form state correctly', () => {
    const { rerender } = render(<NotificationModal {...defaultProps} />);
    
    // Initially empty
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/message/i)).toHaveValue('');
    
    // Update form data
    const newFormData = {
      title: 'Updated Title',
      type: 'success',
      message: 'Updated message',
      isRead: true
    };
    
    rerender(<NotificationModal {...defaultProps} formData={newFormData} />);
    
    expect(screen.getByDisplayValue('Updated Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Success')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Updated message')).toBeInTheDocument();
    expect(screen.getByLabelText(/mark as read/i)).toBeChecked();
  });
});
