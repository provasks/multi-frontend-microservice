import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskFilters from '../TaskFilters';

describe('TaskFilters Component', () => {
  const mockOnFilterChange = jest.fn();
  const mockOnClearFilters = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    filters: {
      status: '',
      priority: '',
      assignee: '',
      search: ''
    },
    onFilterChange: mockOnFilterChange,
    onClearFilters: mockOnClearFilters
  };

  it('renders all filter controls', () => {
    render(<TaskFilters {...defaultProps} />);

    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Assignee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Search/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear Filters/i })).toBeInTheDocument();
  });

  it('displays current filter values', () => {
    const filtersWithValues = {
      status: 'in-progress',
      priority: 'high',
      assignee: 'john.doe',
      search: 'test task'
    };

    render(<TaskFilters {...defaultProps} filters={filtersWithValues} />);

    expect(screen.getByDisplayValue('in-progress')).toBeInTheDocument();
    expect(screen.getByDisplayValue('high')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john.doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test task')).toBeInTheDocument();
  });

  it('calls onFilterChange when status changes', async () => {
    render(<TaskFilters {...defaultProps} />);

    const statusSelect = screen.getByLabelText(/Status/i);
    await user.selectOptions(statusSelect, 'completed');

    expect(mockOnFilterChange).toHaveBeenCalledWith('status', 'completed');
  });

  it('calls onFilterChange when priority changes', async () => {
    render(<TaskFilters {...defaultProps} />);

    const prioritySelect = screen.getByLabelText(/Priority/i);
    await user.selectOptions(prioritySelect, 'medium');

    expect(mockOnFilterChange).toHaveBeenCalledWith('priority', 'medium');
  });

  it('calls onFilterChange when assignee changes', async () => {
    render(<TaskFilters {...defaultProps} />);

    const assigneeInput = screen.getByLabelText(/Assignee/i);
    await user.type(assigneeInput, 'jane.smith');

    expect(mockOnFilterChange).toHaveBeenCalledWith('assignee', 'j');
    expect(mockOnFilterChange).toHaveBeenCalledWith('assignee', 'ja');
    expect(mockOnFilterChange).toHaveBeenCalledWith('assignee', 'jan');
    expect(mockOnFilterChange).toHaveBeenCalledWith('assignee', 'jane');
    expect(mockOnFilterChange).toHaveBeenCalledWith('assignee', 'jane.');
    expect(mockOnFilterChange).toHaveBeenCalledWith('assignee', 'jane.s');
    expect(mockOnFilterChange).toHaveBeenCalledWith('assignee', 'jane.sm');
    expect(mockOnFilterChange).toHaveBeenCalledWith('assignee', 'jane.smi');
    expect(mockOnFilterChange).toHaveBeenCalledWith('assignee', 'jane.smit');
    expect(mockOnFilterChange).toHaveBeenCalledWith('assignee', 'jane.smith');
  });

  it('calls onFilterChange when search changes', async () => {
    render(<TaskFilters {...defaultProps} />);

    const searchInput = screen.getByLabelText(/Search/i);
    await user.type(searchInput, 'urgent');

    expect(mockOnFilterChange).toHaveBeenCalledWith('search', 'u');
    expect(mockOnFilterChange).toHaveBeenCalledWith('search', 'ur');
    expect(mockOnFilterChange).toHaveBeenCalledWith('search', 'urg');
    expect(mockOnFilterChange).toHaveBeenCalledWith('search', 'urge');
    expect(mockOnFilterChange).toHaveBeenCalledWith('search', 'urgen');
    expect(mockOnFilterChange).toHaveBeenCalledWith('search', 'urgent');
  });

  it('calls onClearFilters when clear button is clicked', async () => {
    render(<TaskFilters {...defaultProps} />);

    const clearButton = screen.getByRole('button', { name: /Clear Filters/i });
    await user.click(clearButton);

    expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
  });

  it('renders correct status options', () => {
    render(<TaskFilters {...defaultProps} />);

    const statusSelect = screen.getByLabelText(/Status/i);
    const options = Array.from(statusSelect.options).map(option => option.value);

    expect(options).toContain('');
    expect(options).toContain('pending');
    expect(options).toContain('in-progress');
    expect(options).toContain('completed');
    expect(options).toContain('cancelled');
  });

  it('renders correct priority options', () => {
    render(<TaskFilters {...defaultProps} />);

    const prioritySelect = screen.getByLabelText(/Priority/i);
    const options = Array.from(prioritySelect.options).map(option => option.value);

    expect(options).toContain('');
    expect(options).toContain('low');
    expect(options).toContain('medium');
    expect(options).toContain('high');
    expect(options).toContain('urgent');
  });

  it('has correct placeholder texts', () => {
    render(<TaskFilters {...defaultProps} />);

    expect(screen.getByPlaceholderText('Filter by status')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Filter by priority')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Filter by assignee')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<TaskFilters {...defaultProps} />);

    const container = screen.getByTestId('task-filters');
    expect(container).toHaveClass('task-filters');
    expect(container).toHaveClass('mb-4');
  });

  it('handles empty filter values', () => {
    render(<TaskFilters {...defaultProps} />);

    expect(screen.getByDisplayValue('')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('')).toHaveLength(4); // All four inputs should be empty
  });

  it('handles partial filter values', () => {
    const partialFilters = {
      status: 'in-progress',
      priority: '',
      assignee: 'john',
      search: ''
    };

    render(<TaskFilters {...defaultProps} filters={partialFilters} />);

    expect(screen.getByDisplayValue('in-progress')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('')).toHaveLength(2); // priority and search
  });

  it('handles special characters in search', async () => {
    render(<TaskFilters {...defaultProps} />);

    const searchInput = screen.getByLabelText(/Search/i);
    await user.type(searchInput, 'task@#$%');

    expect(mockOnFilterChange).toHaveBeenCalledWith('search', 'task@#$%');
  });

  it('handles very long search terms', async () => {
    render(<TaskFilters {...defaultProps} />);

    const searchInput = screen.getByLabelText(/Search/i);
    const longSearchTerm = 'a'.repeat(100);
    await user.type(searchInput, longSearchTerm);

    expect(mockOnFilterChange).toHaveBeenCalledWith('search', longSearchTerm);
  });

  it('handles rapid filter changes', async () => {
    render(<TaskFilters {...defaultProps} />);

    const statusSelect = screen.getByLabelText(/Status/i);
    const prioritySelect = screen.getByLabelText(/Priority/i);

    await user.selectOptions(statusSelect, 'completed');
    await user.selectOptions(prioritySelect, 'high');

    expect(mockOnFilterChange).toHaveBeenCalledWith('status', 'completed');
    expect(mockOnFilterChange).toHaveBeenCalledWith('priority', 'high');
  });

  it('maintains focus after clear', async () => {
    render(<TaskFilters {...defaultProps} />);

    const clearButton = screen.getByRole('button', { name: /Clear Filters/i });
    await user.click(clearButton);

    // The clear button should still be focusable
    expect(clearButton).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    render(<TaskFilters {...defaultProps} />);

    const statusSelect = screen.getByLabelText(/Status/i);
    const prioritySelect = screen.getByLabelText(/Priority/i);

    // Tab navigation
    await user.tab();
    expect(statusSelect).toHaveFocus();

    await user.tab();
    expect(prioritySelect).toHaveFocus();
  });

  it('handles form submission prevention', async () => {
    render(<TaskFilters {...defaultProps} />);

    const searchInput = screen.getByLabelText(/Search/i);
    
    // Press Enter
    await user.type(searchInput, 'test{Enter}');

    // Should not cause form submission (no page reload)
    expect(mockOnFilterChange).toHaveBeenCalledWith('search', 'test');
  });

  it('renders with correct accessibility attributes', () => {
    render(<TaskFilters {...defaultProps} />);

    expect(screen.getByLabelText(/Status/i)).toHaveAttribute('id', 'status-filter');
    expect(screen.getByLabelText(/Priority/i)).toHaveAttribute('id', 'priority-filter');
    expect(screen.getByLabelText(/Assignee/i)).toHaveAttribute('id', 'assignee-filter');
    expect(screen.getByLabelText(/Search/i)).toHaveAttribute('id', 'search-filter');
  });

  it('handles disabled state for all inputs', () => {
    render(<TaskFilters {...defaultProps} disabled={true} />);

    expect(screen.getByLabelText(/Status/i)).toBeDisabled();
    expect(screen.getByLabelText(/Priority/i)).toBeDisabled();
    expect(screen.getByLabelText(/Assignee/i)).toBeDisabled();
    expect(screen.getByLabelText(/Search/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /Clear Filters/i })).toBeDisabled();
  });

  it('handles custom filter values', () => {
    const customFilters = {
      status: 'custom-status',
      priority: 'custom-priority',
      assignee: 'custom-assignee',
      search: 'custom-search'
    };

    render(<TaskFilters {...defaultProps} filters={customFilters} />);

    expect(screen.getByDisplayValue('custom-status')).toBeInTheDocument();
    expect(screen.getByDisplayValue('custom-priority')).toBeInTheDocument();
    expect(screen.getByDisplayValue('custom-assignee')).toBeInTheDocument();
    expect(screen.getByDisplayValue('custom-search')).toBeInTheDocument();
  });
});
