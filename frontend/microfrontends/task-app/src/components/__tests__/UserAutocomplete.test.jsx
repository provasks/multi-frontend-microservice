import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserAutocomplete from '../UserAutocomplete';

// Mock the API call
jest.mock('../../services/userService', () => ({
  searchUsers: jest.fn()
}));

import { searchUsers } from '../../services/userService';

describe('UserAutocomplete Component', () => {
  const mockOnChange = jest.fn();
  const mockOnSelect = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    value: '',
    onChange: mockOnChange,
    onSelect: mockOnSelect,
    placeholder: 'Search users...',
    disabled: false
  };

  const mockUsers = [
    { _id: '1', username: 'john.doe', email: 'john.doe@example.com', firstName: 'John', lastName: 'Doe' },
    { _id: '2', username: 'jane.smith', email: 'jane.smith@example.com', firstName: 'Jane', lastName: 'Smith' },
    { _id: '3', username: 'bob.wilson', email: 'bob.wilson@example.com', firstName: 'Bob', lastName: 'Wilson' }
  ];

  it('renders input field with correct placeholder', () => {
    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('renders with custom placeholder', () => {
    render(<UserAutocomplete {...defaultProps} placeholder="Find user..." />);

    expect(screen.getByPlaceholderText('Find user...')).toBeInTheDocument();
  });

  it('displays initial value', () => {
    render(<UserAutocomplete {...defaultProps} value="john.doe@example.com" />);

    const input = screen.getByDisplayValue('john.doe@example.com');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    await user.type(input, 'john');

    expect(mockOnChange).toHaveBeenCalledWith('j');
    expect(mockOnChange).toHaveBeenCalledWith('jo');
    expect(mockOnChange).toHaveBeenCalledWith('joh');
    expect(mockOnChange).toHaveBeenCalledWith('john');
  });

  it('shows loading state when searching', async () => {
    searchUsers.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    await user.type(input, 'john');

    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('displays search results', async () => {
    searchUsers.mockResolvedValue(mockUsers);

    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    await user.type(input, 'john');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });
  });

  it('calls onSelect when user is selected', async () => {
    searchUsers.mockResolvedValue(mockUsers);

    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    await user.type(input, 'john');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const userOption = screen.getByText('John Doe');
    await user.click(userOption);

    expect(mockOnSelect).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('hides dropdown when input is cleared', async () => {
    searchUsers.mockResolvedValue(mockUsers);

    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    await user.type(input, 'john');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    await user.clear(input);

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('handles empty search results', async () => {
    searchUsers.mockResolvedValue([]);

    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    await user.type(input, 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText('No users found')).toBeInTheDocument();
    });
  });

  it('handles search error', async () => {
    searchUsers.mockRejectedValue(new Error('Search failed'));

    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    await user.type(input, 'john');

    await waitFor(() => {
      expect(screen.getByText('Error searching users')).toBeInTheDocument();
    });
  });

  it('debounces search requests', async () => {
    searchUsers.mockResolvedValue(mockUsers);

    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    
    // Type quickly
    await user.type(input, 'j');
    await user.type(input, 'o');
    await user.type(input, 'h');
    await user.type(input, 'n');

    // Wait for debounce
    await waitFor(() => {
      expect(searchUsers).toHaveBeenCalledTimes(1);
    });
  });

  it('filters results based on search term', async () => {
    searchUsers.mockResolvedValue(mockUsers);

    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    await user.type(input, 'jane');

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  it('handles disabled state', () => {
    render(<UserAutocomplete {...defaultProps} disabled={true} />);

    const input = screen.getByPlaceholderText('Search users...');
    expect(input).toBeDisabled();
  });

  it('handles keyboard navigation', async () => {
    searchUsers.mockResolvedValue(mockUsers);

    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    await user.type(input, 'john');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Press down arrow
    await user.keyboard('{ArrowDown}');
    
    // Press enter
    await user.keyboard('{Enter}');

    expect(mockOnSelect).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('handles escape key to close dropdown', async () => {
    searchUsers.mockResolvedValue(mockUsers);

    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    await user.type(input, 'john');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Press escape
    await user.keyboard('{Escape}');

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('handles click outside to close dropdown', async () => {
    searchUsers.mockResolvedValue(mockUsers);

    render(
      <div>
        <UserAutocomplete {...defaultProps} />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const input = screen.getByPlaceholderText('Search users...');
    await user.type(input, 'john');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click outside
    const outside = screen.getByTestId('outside');
    await user.click(outside);

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('displays user information correctly', async () => {
    searchUsers.mockResolvedValue(mockUsers);

    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    await user.type(input, 'john');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });
  });

  it('handles users with missing names', async () => {
    const usersWithMissingNames = [
      { _id: '1', username: 'john.doe', email: 'john.doe@example.com', firstName: null, lastName: null },
      { _id: '2', username: 'jane.smith', email: 'jane.smith@example.com', firstName: 'Jane', lastName: null }
    ];

    searchUsers.mockResolvedValue(usersWithMissingNames);

    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    await user.type(input, 'john');

    await waitFor(() => {
      expect(screen.getByText('john.doe')).toBeInTheDocument();
      expect(screen.getByText('jane.smith')).toBeInTheDocument();
    });
  });

  it('handles very long search terms', async () => {
    searchUsers.mockResolvedValue([]);

    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    const longSearchTerm = 'a'.repeat(100);
    await user.type(input, longSearchTerm);

    await waitFor(() => {
      expect(searchUsers).toHaveBeenCalledWith(longSearchTerm);
    });
  });

  it('handles special characters in search', async () => {
    searchUsers.mockResolvedValue([]);

    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    await user.type(input, 'user@example.com');

    await waitFor(() => {
      expect(searchUsers).toHaveBeenCalledWith('user@example.com');
    });
  });

  it('maintains focus after selection', async () => {
    searchUsers.mockResolvedValue(mockUsers);

    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    await user.type(input, 'john');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const userOption = screen.getByText('John Doe');
    await user.click(userOption);

    expect(input).toHaveFocus();
  });

  it('handles rapid typing and selection', async () => {
    searchUsers.mockResolvedValue(mockUsers);

    render(<UserAutocomplete {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search users...');
    
    // Type quickly and select
    await user.type(input, 'john');
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const userOption = screen.getByText('John Doe');
    await user.click(userOption);

    expect(mockOnSelect).toHaveBeenCalledWith(mockUsers[0]);
  });
});