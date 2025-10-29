import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
  const defaultProps = {
    searchTerm: '',
    onSearchChange: jest.fn(),
    onClearSearch: jest.fn(),
    totalCount: 100,
    filteredCount: 50
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Showing 50 of 100 items')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<SearchBar {...defaultProps} placeholder="Custom search..." />);
    expect(screen.getByPlaceholderText('Custom search...')).toBeInTheDocument();
  });

  it('displays search term in input', () => {
    render(<SearchBar {...defaultProps} searchTerm="test search" />);
    expect(screen.getByDisplayValue('test search')).toBeInTheDocument();
  });

  it('calls onSearchChange when input changes', () => {
    const onSearchChange = jest.fn();
    render(<SearchBar {...defaultProps} onSearchChange={onSearchChange} />);
    
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'new search' } });
    
    expect(onSearchChange).toHaveBeenCalledWith('new search');
  });

  it('shows clear button when search term exists', () => {
    render(<SearchBar {...defaultProps} searchTerm="test" />);
    expect(screen.getByTitle('Clear search')).toBeInTheDocument();
  });

  it('hides clear button when search term is empty', () => {
    render(<SearchBar {...defaultProps} searchTerm="" />);
    expect(screen.queryByTitle('Clear search')).not.toBeInTheDocument();
  });

  it('calls onClearSearch when clear button is clicked', () => {
    const onClearSearch = jest.fn();
    render(<SearchBar {...defaultProps} searchTerm="test" onClearSearch={onClearSearch} />);
    
    const clearButton = screen.getByTitle('Clear search');
    fireEvent.click(clearButton);
    
    expect(onClearSearch).toHaveBeenCalledTimes(1);
  });

  it('focuses input after clearing search', () => {
    const onClearSearch = jest.fn();
    render(<SearchBar {...defaultProps} searchTerm="test" onClearSearch={onClearSearch} />);
    
    const input = screen.getByPlaceholderText('Search...');
    const clearButton = screen.getByTitle('Clear search');
    
    // Mock focus method
    const focusSpy = jest.spyOn(input, 'focus');
    
    fireEvent.click(clearButton);
    
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('shows loading spinner when searchLoading is true', () => {
    render(<SearchBar {...defaultProps} searchLoading={true} />);
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('shows search icon when not loading', () => {
    render(<SearchBar {...defaultProps} searchLoading={false} />);
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('displays correct count information', () => {
    render(<SearchBar {...defaultProps} totalCount={200} filteredCount={75} />);
    expect(screen.getByText('Showing 75 of 200 items')).toBeInTheDocument();
  });

  it('hides count when showCount is false', () => {
    render(<SearchBar {...defaultProps} showCount={false} />);
    expect(screen.queryByText(/Showing.*items/)).not.toBeInTheDocument();
  });

  it('shows count when showCount is true', () => {
    render(<SearchBar {...defaultProps} showCount={true} />);
    expect(screen.getByText('Showing 50 of 100 items')).toBeInTheDocument();
  });

  it('handles zero counts correctly', () => {
    render(<SearchBar {...defaultProps} totalCount={0} filteredCount={0} />);
    expect(screen.getByText('Showing 0 of 0 items')).toBeInTheDocument();
  });

  it('handles undefined counts gracefully', () => {
    render(<SearchBar {...defaultProps} totalCount={undefined} filteredCount={undefined} />);
    expect(screen.getByText(/Showing.*of.*items/)).toBeInTheDocument();
  });

  it('has correct display name', () => {
    expect(SearchBar.displayName).toBe('SearchBar');
  });

  it('is memoized', () => {
    expect(SearchBar.$$typeof).toBe(Symbol.for('react.memo'));
  });

  it('handles multiple input changes', () => {
    const onSearchChange = jest.fn();
    render(<SearchBar {...defaultProps} onSearchChange={onSearchChange} />);
    
    const input = screen.getByPlaceholderText('Search...');
    
    fireEvent.change(input, { target: { value: 'first' } });
    fireEvent.change(input, { target: { value: 'second' } });
    fireEvent.change(input, { target: { value: 'third' } });
    
    expect(onSearchChange).toHaveBeenCalledTimes(3);
    expect(onSearchChange).toHaveBeenNthCalledWith(1, 'first');
    expect(onSearchChange).toHaveBeenNthCalledWith(2, 'second');
    expect(onSearchChange).toHaveBeenNthCalledWith(3, 'third');
  });

  it('handles clear button click multiple times', () => {
    const onClearSearch = jest.fn();
    render(<SearchBar {...defaultProps} searchTerm="test" onClearSearch={onClearSearch} />);
    
    const clearButton = screen.getByTitle('Clear search');
    
    fireEvent.click(clearButton);
    fireEvent.click(clearButton);
    
    expect(onClearSearch).toHaveBeenCalledTimes(2);
  });

  it('renders with all props provided', () => {
    const props = {
      searchTerm: 'test search',
      onSearchChange: jest.fn(),
      onClearSearch: jest.fn(),
      totalCount: 150,
      filteredCount: 25,
      placeholder: 'Custom placeholder',
      showCount: true,
      searchLoading: false
    };
    
    render(<SearchBar {...props} />);
    
    expect(screen.getByDisplayValue('test search')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
    expect(screen.getByText('Showing 25 of 150 items')).toBeInTheDocument();
    expect(screen.getByTitle('Clear search')).toBeInTheDocument();
  });
});
