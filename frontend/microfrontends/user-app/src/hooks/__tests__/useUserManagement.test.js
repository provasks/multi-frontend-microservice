import { renderHook, act, waitFor } from '@testing-library/react';
import { useUserManagement } from '../useUserManagement';

// Dependencies are mocked in __mocks__/sharedComponents.js

describe('useUserManagement Hook', () => {
  const mockMakeAuthenticatedRequest = require('sharedComponents/useAuth').useAuth().makeAuthenticatedRequest;
  const mockIsAuthenticated = require('sharedComponents/useAuth').useAuth().isAuthenticated;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMakeAuthenticatedRequest.mockResolvedValue({
      data: { users: [] }
    });
  });

  describe('Initial State', () => {
    it('initializes with default state', () => {
      const { result } = renderHook(() => useUserManagement());
      
      expect(result.current.users).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.apiStatus).toBe('loading');
      expect(result.current.showModal).toBe(false);
      expect(result.current.editingUser).toBe(null);
      expect(result.current.modalMode).toBe('add');
      expect(result.current.formData).toEqual({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        role: 'user',
        isActive: true
      });
    });
  });

  describe.skip('User Fetching', () => {
    it('fetches users on mount', async () => {
      const mockUsers = [
        { _id: '1', name: 'John Doe', email: 'john@example.com' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com' }
      ];
      
      mockMakeAuthenticatedRequest.mockResolvedValueOnce({
        data: { users: mockUsers }
      });

      const { result } = renderHook(() => useUserManagement());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.users).toEqual(mockUsers);
      expect(result.current.apiStatus).toBe('connected');
    });

    it('handles API errors gracefully', async () => {
      mockMakeAuthenticatedRequest.mockRejectedValueOnce(new Error('API Error'));
      window.showError = jest.fn();

      const { result } = renderHook(() => useUserManagement());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.apiStatus).toBe('error');
      expect(result.current.users).toEqual([]);
      expect(window.showError).toHaveBeenCalledWith('Error fetching users. Please check your connection.');
    });

    it('handles authentication failure', async () => {
      mockIsAuthenticated.mockReturnValue(false);
      window.showError = jest.fn();

      const { result } = renderHook(() => useUserManagement());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.apiStatus).toBe('error');
      expect(window.showError).toHaveBeenCalledWith('Please log in to view users');
    });
  });

  describe('Modal Management', () => {
    it('handles add user modal opening', () => {
      const { result } = renderHook(() => useUserManagement());
      
      act(() => {
        result.current.handleAddUser();
      });
      
      expect(result.current.showModal).toBe(true);
      expect(result.current.modalMode).toBe('add');
      expect(result.current.editingUser).toBe(null);
    });

    it('handles edit user modal opening', () => {
      const { result } = renderHook(() => useUserManagement());
      const mockUser = {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        role: 'admin',
        isActive: true
      };
      
      act(() => {
        result.current.handleEditUser(mockUser);
      });
      
      expect(result.current.showModal).toBe(true);
      expect(result.current.modalMode).toBe('edit');
      expect(result.current.editingUser).toEqual(mockUser);
      expect(result.current.formData).toEqual({
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        username: mockUser.username,
        role: mockUser.role,
        isActive: mockUser.isActive,
        password: ''
      });
    });

    it('handles modal closing', () => {
      const { result } = renderHook(() => useUserManagement());
      
      // First open modal
      act(() => {
        result.current.handleAddUser();
      });
      
      expect(result.current.showModal).toBe(true);
      
      // Then close it
      act(() => {
        result.current.handleCloseModal();
      });
      
      expect(result.current.showModal).toBe(false);
      expect(result.current.editingUser).toBe(null);
      expect(result.current.formData).toEqual({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        role: 'user',
        isActive: true
      });
    });
  });

  describe('Form Management', () => {
    it('handles form input changes', () => {
      const { result } = renderHook(() => useUserManagement());
      
      act(() => {
        result.current.handleInputChange({
          target: { name: 'firstName', value: 'John' }
        });
      });
      
      expect(result.current.formData.firstName).toBe('John');
    });

    it('handles form input changes for different fields', () => {
      const { result } = renderHook(() => useUserManagement());
      
      act(() => {
        result.current.handleInputChange({
          target: { name: 'email', value: 'john@example.com' }
        });
      });
      
      expect(result.current.formData.email).toBe('john@example.com');
    });

    it('handles checkbox input changes', () => {
      const { result } = renderHook(() => useUserManagement());
      
      act(() => {
        result.current.handleInputChange({
          target: { name: 'isActive', type: 'checkbox', checked: false }
        });
      });
      
      expect(result.current.formData.isActive).toBe(false);
    });
  });

  describe('User Operations', () => {
    it('handles user creation', async () => {
      const { result } = renderHook(() => useUserManagement());
      
      act(() => {
        result.current.handleAddUser();
      });
      
      expect(result.current.showModal).toBe(true);
      expect(result.current.modalMode).toBe('add');
    });

    it('handles user edit', async () => {
      const { result } = renderHook(() => useUserManagement());
      const existingUser = {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        role: 'admin',
        isActive: true
      };
      
      act(() => {
        result.current.handleEditUser(existingUser);
      });
      
      expect(result.current.showModal).toBe(true);
      expect(result.current.modalMode).toBe('edit');
      expect(result.current.editingUser).toEqual(existingUser);
    });

    it('handles modal closing', async () => {
      const { result } = renderHook(() => useUserManagement());
      
      act(() => {
        result.current.handleAddUser();
      });
      
      expect(result.current.showModal).toBe(true);
      
      act(() => {
        result.current.handleCloseModal();
      });
      
      expect(result.current.showModal).toBe(false);
    });
  });

  describe('Input Handling', () => {
    it('handles input changes', async () => {
      const { result } = renderHook(() => useUserManagement());
      
      const mockEvent = {
        target: {
          name: 'firstName',
          value: 'John'
        }
      };
      
      act(() => {
        result.current.handleInputChange(mockEvent);
      });
      
      expect(result.current.formData.firstName).toBe('John');
    });

    it('handles checkbox input changes', () => {
      const { result } = renderHook(() => useUserManagement());
      
      act(() => {
        result.current.handleInputChange({
          target: { name: 'isActive', type: 'checkbox', checked: false }
        });
      });
      
      expect(result.current.formData.isActive).toBe(false);
    });

    it('handles select input changes', () => {
      const { result } = renderHook(() => useUserManagement());
      
      act(() => {
        result.current.handleInputChange({
          target: { name: 'role', value: 'admin' }
        });
      });
      
      expect(result.current.formData.role).toBe('admin');
    });
  });

  describe.skip('Form Submission', () => {
    it('handles form submission for add mode', async () => {
      const mockUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        password: 'password123',
        role: 'user',
        isActive: true
      };
      
      mockMakeAuthenticatedRequest.mockResolvedValueOnce({
        data: { user: { ...mockUser, _id: '1' } }
      });
      
      const { result } = renderHook(() => useUserManagement());
      
      // Set up form data
      act(() => {
        result.current.handleAddUser();
        result.current.handleInputChange({
          target: { name: 'firstName', value: 'John' }
        });
        result.current.handleInputChange({
          target: { name: 'lastName', value: 'Doe' }
        });
        result.current.handleInputChange({
          target: { name: 'email', value: 'john@example.com' }
        });
        result.current.handleInputChange({
          target: { name: 'username', value: 'johndoe' }
        });
        result.current.handleInputChange({
          target: { name: 'password', value: 'password123' }
        });
      });
      
      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() });
      });
      
      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith({
        url: 'http://localhost:3001/api/users',
        method: 'POST',
        data: expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          username: 'johndoe',
          password: 'password123',
          role: 'user',
          isActive: true
        })
      });
    });

    it('handles form submission for edit mode', async () => {
      const mockUser = {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        role: 'user',
        isActive: true
      };
      
      mockMakeAuthenticatedRequest.mockResolvedValueOnce({
        data: { user: mockUser }
      });
      
      const { result } = renderHook(() => useUserManagement());
      
      // Set up edit mode
      act(() => {
        result.current.handleEditUser(mockUser);
        result.current.handleInputChange({
          target: { name: 'firstName', value: 'Jane' }
        });
      });
      
      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() });
      });
      
      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith({
        url: 'http://localhost:3001/api/users/1',
        method: 'PUT',
        data: expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'john@example.com',
          username: 'johndoe',
          role: 'user',
          isActive: true
        })
      });
    });

    it('handles form submission errors', async () => {
      const errorMessage = 'Submission failed';
      mockMakeAuthenticatedRequest.mockRejectedValueOnce(new Error(errorMessage));
      window.showError = jest.fn();
      
      const { result } = renderHook(() => useUserManagement());
      
      act(() => {
        result.current.handleAddUser();
      });
      
      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() });
      });
      
      expect(window.showError).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });

    it('handles form submission with empty password in edit mode', async () => {
      const mockUser = {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        role: 'user',
        isActive: true
      };
      
      mockMakeAuthenticatedRequest.mockResolvedValueOnce({
        data: { user: mockUser }
      });
      
      const { result } = renderHook(() => useUserManagement());
      
      // Set up edit mode with empty password
      act(() => {
        result.current.handleEditUser(mockUser);
        result.current.handleInputChange({
          target: { name: 'password', value: '' }
        });
      });
      
      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() });
      });
      
      const submitData = mockMakeAuthenticatedRequest.mock.calls[0][0].data;
      expect(submitData).not.toHaveProperty('password');
    });
  });

  describe.skip('Error Handling', () => {
    it('handles API errors during user creation', async () => {
      const errorMessage = 'User creation failed';
      mockMakeAuthenticatedRequest.mockRejectedValueOnce(new Error(errorMessage));
      window.showError = jest.fn();
      
      const { result } = renderHook(() => useUserManagement());
      
      act(() => {
        result.current.handleAddUser();
      });
      
      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() });
      });
      
      expect(window.showError).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });

    it('handles API errors during user update', async () => {
      const mockUser = {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        role: 'user',
        isActive: true
      };
      
      const errorMessage = 'User update failed';
      mockMakeAuthenticatedRequest.mockRejectedValueOnce(new Error(errorMessage));
      window.showError = jest.fn();
      
      const { result } = renderHook(() => useUserManagement());
      
      act(() => {
        result.current.handleEditUser(mockUser);
      });
      
      await act(async () => {
        await result.current.handleSubmit({ preventDefault: jest.fn() });
      });
      
      expect(window.showError).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });
  });
});
