import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserModal from '../UserModal';

describe('UserModal Component', () => {
  const defaultProps = {
    show: true,
    mode: 'add',
    formData: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'user',
      isActive: true
    },
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    onInputChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when show is false', () => {
    render(<UserModal {...defaultProps} show={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal when show is true', () => {
    render(<UserModal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders add mode correctly', () => {
    render(<UserModal {...defaultProps} mode="add" />);
    
    expect(screen.getByText('Add New User')).toBeInTheDocument();
    expect(screen.getByText('Create User')).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeRequired();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
  });

  it('renders edit mode correctly', () => {
    render(<UserModal {...defaultProps} mode="edit" />);
    
    expect(screen.getByText('Edit User')).toBeInTheDocument();
    expect(screen.getByText('Update User')).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).not.toBeRequired();
    expect(screen.getByPlaceholderText(/leave empty to keep current password/i)).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<UserModal {...defaultProps} />);
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/active user/i)).toBeInTheDocument();
  });

  it('displays form data correctly', () => {
    const formData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      isActive: false
    };

    render(<UserModal {...defaultProps} formData={formData} />);
    
    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('password123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Admin')).toBeInTheDocument();
    expect(screen.getByLabelText(/active user/i)).not.toBeChecked();
  });

  it('calls onInputChange when input values change', async () => {
    const user = userEvent.setup();
    render(<UserModal {...defaultProps} />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    await user.type(usernameInput, 'newuser');
    
    expect(defaultProps.onInputChange).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserModal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserModal {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when form is submitted', () => {
    render(<UserModal {...defaultProps} />);
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility attributes', () => {
    render(<UserModal {...defaultProps} />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('tabIndex', '-1');
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toHaveAttribute('type', 'button');
  });

  it('validates required fields in add mode', () => {
    render(<UserModal {...defaultProps} mode="add" />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    
    expect(usernameInput).toBeRequired();
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
    expect(firstNameInput).toBeRequired();
    expect(lastNameInput).toBeRequired();
  });

  it('has correct password requirements in add mode', () => {
    render(<UserModal {...defaultProps} mode="add" />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('minLength', '6');
    expect(passwordInput).toBeRequired();
  });

  it('shows password help text in edit mode', () => {
    render(<UserModal {...defaultProps} mode="edit" />);
    
    expect(screen.getByText('Leave empty to keep current password')).toBeInTheDocument();
  });

  it('handles role selection correctly', async () => {
    const user = userEvent.setup();
    render(<UserModal {...defaultProps} />);
    
    const roleSelect = screen.getByLabelText(/role/i);
    await user.selectOptions(roleSelect, 'admin');
    
    expect(defaultProps.onInputChange).toHaveBeenCalled();
  });

  it('handles checkbox toggle correctly', async () => {
    const user = userEvent.setup();
    render(<UserModal {...defaultProps} />);
    
    const activeCheckbox = screen.getByLabelText(/active user/i);
    await user.click(activeCheckbox);
    
    expect(defaultProps.onInputChange).toHaveBeenCalled();
  });

  it('renders with correct CSS classes', () => {
    render(<UserModal {...defaultProps} />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('modal', 'show', 'd-block');
    
    const modalDialog = modal.querySelector('.modal-dialog');
    expect(modalDialog).toHaveClass('modal-dialog', 'modal-lg');
  });

  it('has correct form structure', () => {
    render(<UserModal {...defaultProps} />);
    
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
    
    const modalBody = screen.getByRole('dialog').querySelector('.modal-body');
    expect(modalBody).toBeInTheDocument();
    
    const modalFooter = screen.getByRole('dialog').querySelector('.modal-footer');
    expect(modalFooter).toBeInTheDocument();
  });

  it('displays correct icons', () => {
    render(<UserModal {...defaultProps} />);
    
    const userIcon = screen.getByRole('dialog').querySelector('.fas.fa-user');
    expect(userIcon).toBeInTheDocument();
    
    const saveIcon = screen.getByRole('button', { name: /create user/i }).querySelector('.fas.fa-save');
    expect(saveIcon).toBeInTheDocument();
  });

  it('handles form submission with preventDefault', () => {
    const mockSubmit = jest.fn((e) => e.preventDefault());
    
    render(<UserModal {...defaultProps} onSubmit={mockSubmit} />);
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('renders with different form data values', () => {
    const formData = {
      username: 'admin',
      email: 'admin@test.com',
      password: '',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true
    };

    render(<UserModal {...defaultProps} formData={formData} mode="edit" />);
    
    expect(screen.getByDisplayValue('admin')).toBeInTheDocument();
    expect(screen.getByDisplayValue('admin@test.com')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('Admin')).toHaveLength(2);
    expect(screen.getByDisplayValue('User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('admin')).toBeInTheDocument();
    expect(screen.getByLabelText(/active user/i)).toBeChecked();
  });
});
