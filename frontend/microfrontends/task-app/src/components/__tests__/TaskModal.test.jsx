import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockTask } from '../../test-utils';
import TaskModal from '../TaskModal';

// Mock the useTaskManagement hook
const mockHandleSubmit = jest.fn();
const mockHandleClose = jest.fn();
const mockHandleInputChange = jest.fn();

jest.mock('../../hooks/useTaskManagement', () => ({
  useTaskManagement: () => ({
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
    handleSubmit: mockHandleSubmit,
    handleCloseModal: mockHandleClose,
    handleInputChange: mockHandleInputChange,
  })
}));

describe('TaskModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when showModal is true', () => {
    render(<TaskModal />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<TaskModal />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assigned to/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
  });

  it('shows correct title for add mode', () => {
    render(<TaskModal />);
    
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('shows correct title for edit mode', () => {
    jest.doMock('../../hooks/useTaskManagement', () => ({
      useTaskManagement: () => ({
        showModal: true,
        modalMode: 'edit',
        editingTask: createMockTask(),
        formData: createMockTask(),
        handleSubmit: mockHandleSubmit,
        handleCloseModal: mockHandleClose,
        handleInputChange: mockHandleInputChange,
      })
    }));
    
    render(<TaskModal />);
    
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });

  it('calls handleInputChange when form fields are changed', async () => {
    const user = userEvent.setup();
    render(<TaskModal />);
    
    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'New Task');
    
    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it('calls handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    render(<TaskModal />);
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);
    
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('calls handleCloseModal when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskModal />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('calls handleCloseModal when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskModal />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('calls handleCloseModal when backdrop is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskModal />);
    
    const backdrop = screen.getByTestId('modal-backdrop');
    await user.click(backdrop);
    
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('does not close modal when modal content is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskModal />);
    
    const modalContent = screen.getByTestId('modal-content');
    await user.click(modalContent);
    
    expect(mockHandleClose).not.toHaveBeenCalled();
  });

  it('has correct priority options', () => {
    render(<TaskModal />);
    
    const prioritySelect = screen.getByLabelText(/priority/i);
    expect(prioritySelect).toBeInTheDocument();
    
    const options = screen.getAllByRole('option');
    const priorityOptions = options.filter(option => 
      ['low', 'medium', 'high', 'urgent'].includes(option.value)
    );
    expect(priorityOptions).toHaveLength(4);
  });

  it('has correct status options', () => {
    render(<TaskModal />);
    
    const statusSelect = screen.getByLabelText(/status/i);
    expect(statusSelect).toBeInTheDocument();
    
    const options = screen.getAllByRole('option');
    const statusOptions = options.filter(option => 
      ['pending', 'in_progress', 'completed', 'cancelled'].includes(option.value)
    );
    expect(statusOptions).toHaveLength(4);
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<TaskModal />);
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);
    
    // Check if validation errors are shown
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });

  it('populates form fields with editing task data', () => {
    const editingTask = createMockTask({
      title: 'Edit This Task',
      description: 'Task to be edited',
      priority: 'high',
      status: 'in_progress'
    });
    
    jest.doMock('../../hooks/useTaskManagement', () => ({
      useTaskManagement: () => ({
        showModal: true,
        modalMode: 'edit',
        editingTask: editingTask,
        formData: editingTask,
        handleSubmit: mockHandleSubmit,
        handleCloseModal: mockHandleClose,
        handleInputChange: mockHandleInputChange,
      })
    }));
    
    render(<TaskModal />);
    
    expect(screen.getByDisplayValue(editingTask.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(editingTask.description)).toBeInTheDocument();
    expect(screen.getByDisplayValue(editingTask.priority)).toBeInTheDocument();
    expect(screen.getByDisplayValue(editingTask.status)).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    const user = userEvent.setup();
    
    // Mock form data with valid values
    jest.doMock('../../hooks/useTaskManagement', () => ({
      useTaskManagement: () => ({
        showModal: true,
        modalMode: 'add',
        editingTask: null,
        formData: {
          title: 'Valid Task',
          description: 'Valid Description',
          priority: 'medium',
          status: 'pending',
          assignedTo: 'user123',
          dueDate: '2024-12-31',
          tags: 'test,valid'
        },
        handleSubmit: mockHandleSubmit,
        handleCloseModal: mockHandleClose,
        handleInputChange: mockHandleInputChange,
      })
    }));
    
    render(<TaskModal />);
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);
    
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('closes modal on escape key press', async () => {
    const user = userEvent.setup();
    render(<TaskModal />);
    
    await user.keyboard('{Escape}');
    
    expect(mockHandleClose).toHaveBeenCalled();
  });
});
