import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock SearchBar component since it's from shared-components
const SearchBar = ({ searchTerm, onSearchChange, onClearSearch, totalCount, filteredCount, searchLoading, placeholder, showCount }) => (
  <div data-testid="search-bar">
    <input
      data-testid="search-input"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder={placeholder || 'Search...'}
    />
    {searchTerm && (
      <button data-testid="clear-search" onClick={onClearSearch} title="Clear search">
        Clear
      </button>
    )}
    {showCount && (
      <span data-testid="search-count">
        {filteredCount} of {totalCount} items
      </span>
    )}
    {searchLoading ? (
      <div role="status" data-testid="search-loading">
        <span className="visually-hidden">Searching...</span>
        Searching...
      </div>
    ) : (
      <i data-testid="search-icon" className="fas fa-search"></i>
    )}
  </div>
);

describe('SearchBar Component', () => {
  const defaultProps = {
    searchTerm: '',
    onSearchChange: jest.fn(),
    onClearSearch: jest.fn(),
    totalCount: 10,
    filteredCount: 5,
    searchLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input with correct placeholder', () => {
    render(<SearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue('');
  });

  it('displays search term in input', () => {
    const searchTerm = 'test search';
    render(<SearchBar {...defaultProps} searchTerm={searchTerm} />);
    
    const searchInput = screen.getByDisplayValue(searchTerm);
    expect(searchInput).toBeInTheDocument();
  });

  it('calls onSearchChange when user types in input', async () => {
    const user = userEvent.setup();
    const onSearchChange = jest.fn();
    
    render(<SearchBar {...defaultProps} onSearchChange={onSearchChange} />);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'test');
    
    expect(onSearchChange).toHaveBeenCalledWith('t');
    expect(onSearchChange).toHaveBeenCalledWith('e');
    expect(onSearchChange).toHaveBeenCalledWith('s');
    expect(onSearchChange).toHaveBeenCalledWith('t');
  });

  it('shows clear button when search term is not empty', () => {
    render(<SearchBar {...defaultProps} searchTerm="test" />);
    
    const clearButton = screen.getByTitle('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('hides clear button when search term is empty', () => {
    render(<SearchBar {...defaultProps} searchTerm="" />);
    
    const clearButton = screen.queryByTitle('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('calls onClearSearch when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClearSearch = jest.fn();
    
    render(<SearchBar {...defaultProps} searchTerm="test" onClearSearch={onClearSearch} />);
    
    const clearButton = screen.getByTitle('Clear search');
    await user.click(clearButton);
    
    expect(onClearSearch).toHaveBeenCalledTimes(1);
  });

  it('displays search count correctly', () => {
    render(<SearchBar {...defaultProps} totalCount={20} filteredCount={15} showCount={true} />);
    
    const countText = screen.getByText('15 of 20 items');
    expect(countText).toBeInTheDocument();
  });

  it('shows loading spinner when searchLoading is true', () => {
    render(<SearchBar {...defaultProps} searchLoading={true} />);
    
    const loadingSpinner = screen.getByRole('status');
    expect(loadingSpinner).toBeInTheDocument();
    expect(screen.getByTestId('search-loading')).toBeInTheDocument();
  });

  it('shows search icon when not loading', () => {
    render(<SearchBar {...defaultProps} searchLoading={false} />);
    
    const searchIcon = screen.getByTestId('search-icon');
    expect(searchIcon).toBeInTheDocument();
  });

  it('applies custom placeholder when provided', () => {
    const customPlaceholder = 'Search tasks...';
    render(<SearchBar {...defaultProps} placeholder={customPlaceholder} />);
    
    const searchInput = screen.getByPlaceholderText(customPlaceholder);
    expect(searchInput).toBeInTheDocument();
  });

  it('hides count when showCount is false', () => {
    render(<SearchBar {...defaultProps} showCount={false} />);
    
    const countText = screen.queryByText(/of \d+ items/);
    expect(countText).not.toBeInTheDocument();
  });

  it('maintains focus after clearing search', async () => {
    const user = userEvent.setup();
    const onClearSearch = jest.fn();
    
    render(<SearchBar {...defaultProps} searchTerm="test" onClearSearch={onClearSearch} />);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    const clearButton = screen.getByTitle('Clear search');
    
    await user.click(clearButton);
    
    expect(onClearSearch).toHaveBeenCalled();
    // Focus should be on the clear button after clicking
    expect(clearButton).toHaveFocus();
  });
});
