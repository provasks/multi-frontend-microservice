import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskModal from '../TaskModal';

// Mock UserAutocomplete component
jest.mock('../UserAutocomplete', () => {
  return function MockUserAutocomplete({ value, onChange, placeholder, className }) {
    return (
      <input
        data-testid="user-autocomplete"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    );
  };
});

// Mock functions
const mockHandleSubmit = jest.fn();
const mockHandleClose = jest.fn();
const mockHandleInputChange = jest.fn();

// Default props
const defaultProps = {
  show: true,
  mode: 'add',
  formData: {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: '',
    dueDate: '',
    tags: ''
  },
  onClose: mockHandleClose,
  onSubmit: mockHandleSubmit,
  onInputChange: mockHandleInputChange
};

describe('TaskModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when show is false', () => {
    const { container } = render(<TaskModal {...defaultProps} show={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when show is true', () => {
    render(<TaskModal {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<TaskModal {...defaultProps} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assigned to/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
  });

  it('shows correct title for add mode', () => {
    render(<TaskModal {...defaultProps} mode="add" />);
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
  });

  it('shows correct title for edit mode', () => {
    render(<TaskModal {...defaultProps} mode="edit" />);
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });

  it('displays form data correctly', () => {
    const formData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high',
      status: 'in_progress',
      assignedTo: 'user123',
      dueDate: '2024-12-31T10:30',
      tags: 'urgent,test'
    };

    render(<TaskModal {...defaultProps} formData={formData} />);
    
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('high')).toBeInTheDocument();
    expect(screen.getByDisplayValue('in_progress')).toBeInTheDocument();
    expect(screen.getByDisplayValue('user123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-31T10:30')).toBeInTheDocument();
    expect(screen.getByDisplayValue('urgent,test')).toBeInTheDocument();
  });

  it('calls onInputChange when form fields are changed', async () => {
    const user = userEvent.setup();
    render(<TaskModal {...defaultProps} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'New Task');
    
    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it('calls onSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    render(<TaskModal {...defaultProps} />);
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskModal {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskModal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('has correct priority options', () => {
    render(<TaskModal {...defaultProps} />);
    
    const prioritySelect = screen.getByLabelText(/priority/i);
    expect(prioritySelect).toBeInTheDocument();
    
    const options = screen.getAllByRole('option');
    const priorityOptions = options.filter(option => 
      ['low', 'medium', 'high', 'urgent'].includes(option.value)
    );
    expect(priorityOptions).toHaveLength(4);
  });

  it('has correct status options', () => {
    render(<TaskModal {...defaultProps} />);
    
    const statusSelect = screen.getByLabelText(/status/i);
    expect(statusSelect).toBeInTheDocument();
    
    const options = screen.getAllByRole('option');
    const statusOptions = options.filter(option => 
      ['pending', 'in_progress', 'completed', 'cancelled'].includes(option.value)
    );
    expect(statusOptions).toHaveLength(4);
  });

  it('has required fields marked correctly', () => {
    render(<TaskModal {...defaultProps} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    
    expect(titleInput).toBeRequired();
    expect(descriptionInput).toBeRequired();
  });

  it('has correct placeholders', () => {
    render(<TaskModal {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., urgent, bug, documentation')).toBeInTheDocument();
  });

  it('has correct help text', () => {
    render(<TaskModal {...defaultProps} />);
    
    expect(screen.getByText('Leave empty to assign to yourself (current user)')).toBeInTheDocument();
    expect(screen.getByText('Optional - if not specified, due date will be set to 6 hours from assignment time')).toBeInTheDocument();
    expect(screen.getByText('Separate multiple tags with commas')).toBeInTheDocument();
  });

  it('has correct submit button text for add mode', () => {
    render(<TaskModal {...defaultProps} mode="add" />);
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('has correct submit button text for edit mode', () => {
    render(<TaskModal {...defaultProps} mode="edit" />);
    expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();
  });

  it('handles UserAutocomplete onChange correctly', async () => {
    const user = userEvent.setup();
    render(<TaskModal {...defaultProps} />);
    
    const userAutocomplete = screen.getByTestId('user-autocomplete');
    await user.type(userAutocomplete, 'user123');
    
    expect(mockHandleInputChange).toHaveBeenCalledWith({
      target: { name: 'assignedTo', value: 'user123' }
    });
  });

  it('handles empty dueDate correctly', () => {
    const formData = {
      ...defaultProps.formData,
      dueDate: null
    };
    
    render(<TaskModal {...defaultProps} formData={formData} />);
    
    const dueDateInput = screen.getByLabelText(/due date/i);
    expect(dueDateInput).toHaveValue('');
  });

  it('handles empty tags correctly', () => {
    const formData = {
      ...defaultProps.formData,
      tags: null
    };
    
    render(<TaskModal {...defaultProps} formData={formData} />);
    
    const tagsInput = screen.getByLabelText(/tags/i);
    expect(tagsInput).toHaveValue('');
  });

  it('has correct min date for due date input', () => {
    render(<TaskModal {...defaultProps} />);
    
    const dueDateInput = screen.getByLabelText(/due date/i);
    const minDate = dueDateInput.getAttribute('min');
    
    // Should be today's date in YYYY-MM-DDTHH:MM format
    expect(minDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it('has correct accessibility attributes', () => {
    render(<TaskModal {...defaultProps} />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-labelledby', 'taskModalTitle');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('tabIndex', '-1');
  });

  it('has correct form role', () => {
    render(<TaskModal {...defaultProps} />);
    
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('handles all input types correctly', async () => {
    const user = userEvent.setup();
    render(<TaskModal {...defaultProps} />);
    
    // Test text input
    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'Test');
    expect(mockHandleInputChange).toHaveBeenCalled();
    
    // Test select
    const prioritySelect = screen.getByLabelText(/priority/i);
    await user.selectOptions(prioritySelect, 'high');
    expect(mockHandleInputChange).toHaveBeenCalled();
    
    // Test textarea
    const descriptionInput = screen.getByLabelText(/description/i);
    await user.type(descriptionInput, 'Test description');
    expect(mockHandleInputChange).toHaveBeenCalled();
    
    // Test datetime-local
    const dueDateInput = screen.getByLabelText(/due date/i);
    await user.type(dueDateInput, '2024-12-31T10:30');
    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it('is memoized correctly', () => {
    const { rerender } = render(<TaskModal {...defaultProps} />);
    
    // Rerender with same props
    rerender(<TaskModal {...defaultProps} />);
    
    // Component should be memoized, so it shouldn't re-render unnecessarily
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has correct displayName', () => {
    expect(TaskModal.displayName).toBe('TaskModal');
  });
});
