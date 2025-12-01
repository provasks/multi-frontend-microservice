import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserAutocomplete from '../UserAutocomplete';
import { apiHelpers, hasCachedUsers, getCachedUsers } from 'sharedComponents/unifiedApiClient';
import { useDebounce } from '../../hooks/useDebounce';

// Mock the shared components and hooks
const mockFetchUsers = jest.fn();
const mockHasCachedUsers = jest.fn();
const mockGetCachedUsers = jest.fn();
const mockUseDebounce = jest.fn();

jest.mock('sharedComponents/unifiedApiClient', () => ({
  apiHelpers: {
    fetchUsers: jest.fn()
  },
  hasCachedUsers: jest.fn(),
  getCachedUsers: jest.fn()
}));

jest.mock('../../hooks/useDebounce', () => ({
  useDebounce: jest.fn()
}));

describe('UserAutocomplete Component', () => {
  const mockOnChange = jest.fn();
  const user = userEvent.setup();

  const mockUsers = [
    { 
      _id: '1', 
      firstName: 'John', 
      lastName: 'Doe', 
      username: 'johndoe',
      email: 'john.doe@example.com',
      role: 'user'
    },
    { 
      _id: '2', 
      firstName: 'Jane', 
      lastName: 'Smith', 
      username: 'janesmith',
      email: 'jane.smith@example.com',
      role: 'admin'
    },
    { 
      _id: '3', 
      firstName: 'Bob', 
      lastName: 'Johnson', 
      username: 'bobjohnson',
      email: 'bob.johnson@example.com',
      role: 'moderator'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    hasCachedUsers.mockReturnValue(false);
    getCachedUsers.mockReturnValue(null);
    apiHelpers.fetchUsers.mockResolvedValue({ users: mockUsers });
    useDebounce.mockImplementation((value) => value);
  });

  it('renders with default props', () => {
    render(<UserAutocomplete value="" onChange={mockOnChange} />);
    
    expect(screen.getByPlaceholderText('Select user...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(
      <UserAutocomplete 
        value="" 
        onChange={mockOnChange} 
        placeholder="Search users..."
      />
    );
    
    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <UserAutocomplete 
        value="" 
        onChange={mockOnChange} 
        className="custom-class"
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders as disabled when disabled prop is true', () => {
    render(
      <UserAutocomplete 
        value="" 
        onChange={mockOnChange} 
        disabled={true}
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('fetches users on mount when no cached data', async () => {
    render(<UserAutocomplete value="" onChange={mockOnChange} />);
    
    await waitFor(() => {
      expect(mockFetchUsers).toHaveBeenCalled();
    });
  });

  it('uses cached data when available', () => {
    mockGetCachedUsers.mockReturnValue({ users: mockUsers });
    
    render(<UserAutocomplete value="" onChange={mockOnChange} />);
    
    expect(mockFetchUsers).not.toHaveBeenCalled();
  });

  it('opens dropdown when input is focused', async () => {
    render(<UserAutocomplete value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.click(input);
    
    await waitFor(() => {
      expect(screen.getByText('Loading users...')).toBeInTheDocument();
    });
  });

  it('displays users in dropdown when loaded', async () => {
    render(<UserAutocomplete value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.click(input);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });
  });

  it('filters users based on search term', async () => {
    render(<UserAutocomplete value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.click(input);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    await user.type(input, 'john');
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('calls onChange when user is selected', async () => {
    render(<UserAutocomplete value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.click(input);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    const userOption = screen.getByText('John Doe');
    await user.click(userOption);
    
    expect(mockOnChange).toHaveBeenCalledWith('1');
  });

  it('displays selected user name in input', async () => {
    render(<UserAutocomplete value="1" onChange={mockOnChange} />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });
  });

  it('clears selection when input is cleared', async () => {
    render(<UserAutocomplete value="1" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.clear(input);
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('closes dropdown when escape key is pressed', async () => {
    render(<UserAutocomplete value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.click(input);
    
    await waitFor(() => {
      expect(screen.getByText('Loading users...')).toBeInTheDocument();
    });
    
    await user.keyboard('{Escape}');
    
    await waitFor(() => {
      expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
    });
  });

  it('shows no users found when no matches', async () => {
    render(<UserAutocomplete value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.click(input);
    
    await waitFor(() => {
      expect(screen.getByText('Loading users...')).toBeInTheDocument();
    });
    
    await user.type(input, 'nonexistent');
    
    await waitFor(() => {
      expect(screen.getByText('No users found')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    mockFetchUsers.mockRejectedValue(new Error('API Error'));
    
    render(<UserAutocomplete value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.click(input);
    
    await waitFor(() => {
      expect(screen.getByText('No users found')).toBeInTheDocument();
    });
  });

  it('handles debounced search correctly', async () => {
    mockHasCachedUsers.mockReturnValue(true);
    mockGetCachedUsers.mockReturnValue({ users: mockUsers });

    // Mock debounce to return value after delay
    mockUseDebounce.mockImplementation((value) => {
      return new Promise(resolve => setTimeout(() => resolve(value), 100));
    });

    render(<UserAutocomplete value="" onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.type(input, 'john');

    // Should show searching indicator
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('handles user selection with different event types', async () => {
    mockHasCachedUsers.mockReturnValue(true);
    mockGetCachedUsers.mockReturnValue({ users: mockUsers });

    render(<UserAutocomplete value="" onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    const userOption = screen.getByText('John Doe');

    // Test mouseDown event
    fireEvent.mouseDown(userOption);
    expect(mockOnChange).toHaveBeenCalledWith('1');

    // Reset mock
    mockOnChange.mockClear();

    // Test touchStart event
    fireEvent.touchStart(userOption);
    expect(mockOnChange).toHaveBeenCalledWith('1');
  });

  it('handles blur event with delay', async () => {
    mockHasCachedUsers.mockReturnValue(true);
    mockGetCachedUsers.mockReturnValue({ users: mockUsers });

    render(<UserAutocomplete value="" onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    // Blur the input
    fireEvent.blur(input);

    // Should close after delay
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('handles value change after component mount', async () => {
    mockHasCachedUsers.mockReturnValue(true);
    mockGetCachedUsers.mockReturnValue({ users: mockUsers });

    const { rerender } = render(<UserAutocomplete value="" onChange={mockOnChange} />);

    // Change value after mount
    rerender(<UserAutocomplete value="1" onChange={mockOnChange} />);

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });

  it('handles user not found in cached data', async () => {
    mockHasCachedUsers.mockReturnValue(true);
    mockGetCachedUsers.mockReturnValue({ users: mockUsers });

    render(<UserAutocomplete value="nonexistent" onChange={mockOnChange} />);

    expect(screen.getByDisplayValue('User ID: nonexistent')).toBeInTheDocument();
  });

  it('handles empty search term correctly', async () => {
    mockHasCachedUsers.mockReturnValue(true);
    mockGetCachedUsers.mockReturnValue({ users: mockUsers });

    render(<UserAutocomplete value="" onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.type(input, '');

    // Should show all users
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('handles API response with different data structure', async () => {
    mockFetchUsers.mockResolvedValue(mockUsers); // Direct array instead of { users: [...] }

    render(<UserAutocomplete value="" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('handles disabled state correctly', async () => {
    render(<UserAutocomplete value="" onChange={mockOnChange} disabled={true} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();

    // Should not open dropdown when disabled
    await user.click(input);
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('displays user roles correctly', async () => {
    mockHasCachedUsers.mockReturnValue(true);
    mockGetCachedUsers.mockReturnValue({ users: mockUsers });

    render(<UserAutocomplete value="" onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('moderator')).toBeInTheDocument();
      expect(screen.getByText('user')).toBeInTheDocument();
    });
  });

  it('shows loading spinner when fetching users', async () => {
    render(<UserAutocomplete value="" onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('Loading users...')).toBeInTheDocument();
    });
  });

  it('shows searching spinner when filtering', async () => {
    mockHasCachedUsers.mockReturnValue(true);
    mockGetCachedUsers.mockReturnValue({ users: mockUsers });
    mockUseDebounce.mockImplementation((value) => value);

    render(<UserAutocomplete value="" onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.type(input, 'john');

    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('handles user selection with keyboard navigation', async () => {
    mockHasCachedUsers.mockReturnValue(true);
    mockGetCachedUsers.mockReturnValue({ users: mockUsers });

    render(<UserAutocomplete value="" onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Test keyboard navigation
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(mockOnChange).toHaveBeenCalledWith('1');
  });

  it('handles multiple rapid selections', async () => {
    mockHasCachedUsers.mockReturnValue(true);
    mockGetCachedUsers.mockReturnValue({ users: mockUsers });

    render(<UserAutocomplete value="" onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Select first user
    const userOption1 = screen.getByText('John Doe');
    await user.click(userOption1);
    expect(mockOnChange).toHaveBeenCalledWith('1');

    // Open dropdown again
    await user.click(input);
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    // Select second user
    const userOption2 = screen.getByText('Jane Smith');
    await user.click(userOption2);
    expect(mockOnChange).toHaveBeenCalledWith('2');
  });

  it('handles empty users array gracefully', async () => {
    mockFetchUsers.mockResolvedValue({ users: [] });

    render(<UserAutocomplete value="" onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('No users found')).toBeInTheDocument();
    });
  });

  it('handles null users response gracefully', async () => {
    mockFetchUsers.mockResolvedValue(null);

    render(<UserAutocomplete value="" onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('No users found')).toBeInTheDocument();
    });
  });

  it('handles users with missing names gracefully', async () => {
    const usersWithMissingNames = [
      { 
        _id: '1', 
        firstName: '', 
        lastName: '', 
        username: 'johndoe',
        email: 'john.doe@example.com',
        role: 'user'
      }
    ];

    mockHasCachedUsers.mockReturnValue(true);
    mockGetCachedUsers.mockReturnValue({ users: usersWithMissingNames });

    render(<UserAutocomplete value="" onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('johndoe')).toBeInTheDocument();
    });
  });

  it('handles rapid input changes without errors', async () => {
    mockHasCachedUsers.mockReturnValue(true);
    mockGetCachedUsers.mockReturnValue({ users: mockUsers });

    render(<UserAutocomplete value="" onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    // Rapid typing
    await user.type(input, 'j');
    await user.type(input, 'o');
    await user.type(input, 'h');
    await user.type(input, 'n');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});