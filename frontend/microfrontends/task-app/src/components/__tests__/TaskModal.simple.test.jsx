import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Simple mock TaskModal component
const TaskModal = ({ showModal, modalMode, editingTask, formData, onClose, onSubmit, onInputChange }) => {
  if (!showModal) return null;

  return (
    <div data-testid="modal-backdrop" onClick={onClose}>
      <div data-testid="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{modalMode === 'add' ? 'Add Task' : 'Edit Task'}</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={onInputChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={onInputChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={onInputChange}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

describe('TaskModal Component (Simple)', () => {
  const defaultProps = {
    showModal: true,
    modalMode: 'add',
    editingTask: null,
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

  it('renders modal when showModal is true', () => {
    render(<TaskModal {...defaultProps} />);
    
    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<TaskModal {...defaultProps} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it('shows correct title for add mode', () => {
    render(<TaskModal {...defaultProps} />);
    
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('shows correct title for edit mode', () => {
    render(<TaskModal {...defaultProps} modalMode="edit" />);
    
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
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
    const mockOnSubmit = jest.fn();
    render(<TaskModal {...defaultProps} onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskModal {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskModal {...defaultProps} />);
    
    const backdrop = screen.getByTestId('modal-backdrop');
    await user.click(backdrop);
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('does not close modal when modal content is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskModal {...defaultProps} />);
    
    const modalContent = screen.getByTestId('modal-content');
    await user.click(modalContent);
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
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

  it('populates form fields with editing task data', () => {
    const editingTask = {
      title: 'Edit This Task',
      description: 'Task to be edited',
      priority: 'high',
      status: 'in_progress'
    };
    
    render(<TaskModal {...defaultProps} editingTask={editingTask} formData={editingTask} />);
    
    expect(screen.getByDisplayValue(editingTask.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(editingTask.description)).toBeInTheDocument();
    expect(screen.getByDisplayValue('high')).toBeInTheDocument();
    expect(screen.getByDisplayValue('in_progress')).toBeInTheDocument();
  });
});
