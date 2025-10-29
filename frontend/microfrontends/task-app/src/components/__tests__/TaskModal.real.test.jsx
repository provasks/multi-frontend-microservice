import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskModal from '../TaskModal';

// Mock UserAutocomplete component
jest.mock('../UserAutocomplete', () => {
  return function MockUserAutocomplete({ value, onChange, placeholder }) {
    return (
      <input
        data-testid="user-autocomplete"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    );
  };
});

describe('TaskModal Component (Real)', () => {
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
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    onInputChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when show is true', () => {
    render(<TaskModal {...defaultProps} />);
    
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders edit mode when mode is edit', () => {
    render(<TaskModal {...defaultProps} mode="edit" />);
    
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });

  it('does not render when show is false', () => {
    render(<TaskModal {...defaultProps} show={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
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

  it('displays form data values correctly', () => {
    const formData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high',
      status: 'in_progress',
      assignedTo: 'user@example.com',
      dueDate: '2024-12-31',
      tags: 'test,example'
    };
    
    render(<TaskModal {...defaultProps} formData={formData} />);
    
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('high')).toBeInTheDocument();
    expect(screen.getByDisplayValue('in_progress')).toBeInTheDocument();
    expect(screen.getByDisplayValue('user@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test,example')).toBeInTheDocument();
  });

  it('calls onInputChange when form fields are changed', async () => {
    const user = userEvent.setup();
    render(<TaskModal {...defaultProps} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'New Task');
    
    expect(defaultProps.onInputChange).toHaveBeenCalled();
  });

  it('calls onSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    render(<TaskModal {...defaultProps} />);
    
    const form = screen.getByRole('form');
    await user.submit(form);
    
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskModal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('has correct priority options', () => {
    render(<TaskModal {...defaultProps} />);
    
    const prioritySelect = screen.getByLabelText(/priority/i);
    const options = screen.getAllByRole('option');
    const priorityOptions = options.filter(option => 
      ['low', 'medium', 'high', 'urgent'].includes(option.value)
    );
    expect(priorityOptions).toHaveLength(4);
  });

  it('has correct status options', () => {
    render(<TaskModal {...defaultProps} />);
    
    const statusSelect = screen.getByLabelText(/status/i);
    const options = screen.getAllByRole('option');
    const statusOptions = options.filter(option => 
      ['pending', 'in_progress', 'completed', 'cancelled'].includes(option.value)
    );
    expect(statusOptions).toHaveLength(4);
  });

  it('shows required field indicators', () => {
    render(<TaskModal {...defaultProps} />);
    
    expect(screen.getByText('Title *')).toBeInTheDocument();
    expect(screen.getByText('Description *')).toBeInTheDocument();
  });

  it('renders UserAutocomplete component', () => {
    render(<TaskModal {...defaultProps} />);
    
    expect(screen.getByTestId('user-autocomplete')).toBeInTheDocument();
  });

  it('handles form validation', async () => {
    const user = userEvent.setup();
    render(<TaskModal {...defaultProps} />);
    
    const form = screen.getByRole('form');
    await user.submit(form);
    
    // Form should prevent submission due to required fields
    expect(screen.getByLabelText(/title/i)).toBeRequired();
    expect(screen.getByLabelText(/description/i)).toBeRequired();
  });

  it('displays modal with correct classes', () => {
    render(<TaskModal {...defaultProps} />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('modal', 'show', 'd-block', 'task-modal');
  });

  it('renders modal header with icon', () => {
    render(<TaskModal {...defaultProps} />);
    
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });
});
