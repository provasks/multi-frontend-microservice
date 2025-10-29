import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserManagement from '../UserManagement';
import { useUserManagement } from '../hooks/useUserManagement';

// Mock the useUserManagement hook
jest.mock('../hooks/useUserManagement');

// Shared components are mocked in __mocks__/sharedComponents.js

// Mock the child components
jest.mock('../components/UserTable', () => {
  return function MockUserTable({ users, onEdit }) {
    return (
      <div data-testid="user-table">
        <div>Users: {users.length}</div>
        <button onClick={() => onEdit({ id: 1, username: 'test' })}>Edit User</button>
      </div>
    );
  };
});

jest.mock('../components/UserModal', () => {
  return function MockUserModal({ show, mode, formData, onClose, onSubmit, onInputChange }) {
    if (!show) return null;
    return (
      <div data-testid="user-modal" data-mode={mode}>
        <div>Modal Content</div>
        <button onClick={onClose}>Close</button>
        <button onClick={onSubmit}>Submit</button>
        <input onChange={onInputChange} />
      </div>
    );
  };
});

describe('UserManagement Component', () => {
  const mockUseUserManagement = useUserManagement;

  const defaultMockData = {
    users: [
      { id: 1, username: 'user1', email: 'user1@test.com' },
      { id: 2, username: 'user2', email: 'user2@test.com' }
    ],
    loading: false,
    showModal: false,
    modalMode: 'add',
    formData: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'user',
      isActive: true
    },
    fetchUsers: jest.fn(),
    handleAddUser: jest.fn(),
    handleEditUser: jest.fn(),
    handleSubmit: jest.fn(),
    handleInputChange: jest.fn(),
    handleCloseModal: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUserManagement.mockReturnValue(defaultMockData);
  });

  it('renders loading spinner when loading is true', () => {
    mockUseUserManagement.mockReturnValue({
      ...defaultMockData,
      loading: true
    });

    render(<UserManagement />);
    
    const loadingSpinner = screen.getByTestId('loading-spinner');
    expect(loadingSpinner).toBeInTheDocument();
    expect(loadingSpinner).toHaveAttribute('data-size', 'large');
    expect(loadingSpinner).toHaveAttribute('data-variant', 'success');
    expect(loadingSpinner).toHaveAttribute('data-text', '');
    expect(loadingSpinner).toHaveAttribute('data-show-dots', 'false');
  });

  it('renders main content when not loading', () => {
    render(<UserManagement />);
    
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Add User')).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
    expect(screen.getByText('Users (2)')).toBeInTheDocument();
  });

  it('renders user table with correct props', () => {
    render(<UserManagement />);
    
    const userTable = screen.getByTestId('user-table');
    expect(userTable).toBeInTheDocument();
    expect(screen.getByText('Users: 2')).toBeInTheDocument();
  });

  it('renders user modal with correct props', () => {
    mockUseUserManagement.mockReturnValue({
      ...defaultMockData,
      showModal: true,
      modalMode: 'edit'
    });

    render(<UserManagement />);
    
    const userModal = screen.getByTestId('user-modal');
    expect(userModal).toBeInTheDocument();
    expect(userModal).toHaveAttribute('data-mode', 'edit');
  });

  it('does not render modal when showModal is false', () => {
    render(<UserManagement />);
    
    expect(screen.queryByTestId('user-modal')).not.toBeInTheDocument();
  });

  it('calls handleAddUser when Add User button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserManagement />);
    
    const addButton = screen.getByRole('button', { name: /add user/i });
    await user.click(addButton);
    
    expect(defaultMockData.handleAddUser).toHaveBeenCalledTimes(1);
  });

  it('calls fetchUsers when Refresh button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserManagement />);
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    await user.click(refreshButton);
    
    expect(defaultMockData.fetchUsers).toHaveBeenCalledTimes(1);
  });

  it('calls handleEditUser when edit is triggered from UserTable', async () => {
    const user = userEvent.setup();
    render(<UserManagement />);
    
    const editButton = screen.getByRole('button', { name: /edit user/i });
    await user.click(editButton);
    
    expect(defaultMockData.handleEditUser).toHaveBeenCalledWith({ id: 1, username: 'test' });
  });

  it('displays correct user count', () => {
    mockUseUserManagement.mockReturnValue({
      ...defaultMockData,
      users: [
        { id: 1, username: 'user1' },
        { id: 2, username: 'user2' },
        { id: 3, username: 'user3' }
      ]
    });

    render(<UserManagement />);
    
    expect(screen.getByText('Users (3)')).toBeInTheDocument();
  });

  it('renders with correct CSS classes', () => {
    render(<UserManagement />);
    
    const mainDiv = screen.getByText('User Management').closest('.p-4');
    expect(mainDiv).toBeInTheDocument();
    
    const card = screen.getByText('Users (2)').closest('.card');
    expect(card).toBeInTheDocument();
    
    const cardHeader = screen.getByText('Users (2)').closest('.card-header');
    expect(cardHeader).toBeInTheDocument();
    
    const cardBody = screen.getByTestId('user-table').closest('.card-body');
    expect(cardBody).toBeInTheDocument();
  });

  it('renders correct icons', () => {
    render(<UserManagement />);
    
    const userIcon = screen.getByText('User Management').querySelector('.fas.fa-users');
    expect(userIcon).toBeInTheDocument();
    
    const addIcon = screen.getByRole('button', { name: /add user/i }).querySelector('.fas.fa-plus');
    expect(addIcon).toBeInTheDocument();
    
    const refreshIcon = screen.getByRole('button', { name: /refresh/i }).querySelector('.fas.fa-sync-alt');
    expect(refreshIcon).toBeInTheDocument();
  });

  it('handles empty users array', () => {
    mockUseUserManagement.mockReturnValue({
      ...defaultMockData,
      users: []
    });

    render(<UserManagement />);
    
    expect(screen.getByText('Users (0)')).toBeInTheDocument();
  });

  it('passes correct props to UserModal', () => {
    const formData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      isActive: false
    };

    mockUseUserManagement.mockReturnValue({
      ...defaultMockData,
      showModal: true,
      modalMode: 'add',
      formData
    });

    render(<UserManagement />);
    
    const userModal = screen.getByTestId('user-modal');
    expect(userModal).toBeInTheDocument();
    expect(userModal).toHaveAttribute('data-mode', 'add');
  });

  it('handles different modal modes', () => {
    mockUseUserManagement.mockReturnValue({
      ...defaultMockData,
      showModal: true,
      modalMode: 'edit'
    });

    render(<UserManagement />);
    
    const userModal = screen.getByTestId('user-modal');
    expect(userModal).toHaveAttribute('data-mode', 'edit');
  });

  it('renders header section correctly', () => {
    render(<UserManagement />);
    
    const headerSection = screen.getByText('User Management').closest('.d-flex');
    expect(headerSection).toHaveClass('d-flex', 'justify-content-between', 'align-items-center', 'mb-4');
    
    const title = screen.getByText('User Management');
    expect(title).toHaveClass('mb-0');
  });

  it('renders button section correctly', () => {
    render(<UserManagement />);
    
    const addButton = screen.getByRole('button', { name: /add user/i });
    expect(addButton).toHaveClass('btn', 'btn-primary', 'me-2');
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    expect(refreshButton).toHaveClass('btn', 'btn-outline-primary');
  });

  it('handles loading state transition', () => {
    const { rerender } = render(<UserManagement />);
    
    // Initially not loading
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
    
    // Switch to loading
    mockUseUserManagement.mockReturnValue({
      ...defaultMockData,
      loading: true
    });
    
    rerender(<UserManagement />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('User Management')).not.toBeInTheDocument();
  });
});
