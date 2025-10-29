import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../TaskForm';

describe('TaskForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    task: null,
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel
  };

  const sampleTask = {
    _id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    priority: 'medium',
    assignee: 'john.doe@example.com',
    dueDate: '2024-12-31',
    tags: ['urgent', 'important']
  };

  it('renders form fields for new task', () => {
    render(<TaskForm {...defaultProps} />);

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Assignee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tags/i)).toBeInTheDocument();
  });

  it('renders form fields for editing existing task', () => {
    render(<TaskForm {...defaultProps} task={sampleTask} />);

    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('pending')).toBeInTheDocument();
    expect(screen.getByDisplayValue('medium')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument();
    expect(screen.getByDisplayValue('urgent,important')).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    await user.type(titleInput, 'New Task');

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Task'
    }));
  });

  it('calls onCancel when cancel button is clicked', async () => {
    render(<TaskForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('validates required fields', async () => {
    render(<TaskForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles form input changes', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    await user.type(titleInput, 'New Task');

    expect(titleInput).toHaveValue('New Task');
  });

  it('handles select field changes', async () => {
    render(<TaskForm {...defaultProps} />);

    const statusSelect = screen.getByLabelText(/Status/i);
    await user.selectOptions(statusSelect, 'in-progress');

    expect(statusSelect).toHaveValue('in-progress');
  });

  it('handles date input changes', async () => {
    render(<TaskForm {...defaultProps} />);

    const dueDateInput = screen.getByLabelText(/Due Date/i);
    await user.type(dueDateInput, '2024-12-31');

    expect(dueDateInput).toHaveValue('2024-12-31');
  });

  it('handles tags input changes', async () => {
    render(<TaskForm {...defaultProps} />);

    const tagsInput = screen.getByLabelText(/Tags/i);
    await user.type(tagsInput, 'urgent,important');

    expect(tagsInput).toHaveValue('urgent,important');
  });

  it('renders correct button text for new task', () => {
    render(<TaskForm {...defaultProps} />);

    expect(screen.getByRole('button', { name: /Create Task/i })).toBeInTheDocument();
  });

  it('renders correct button text for editing task', () => {
    render(<TaskForm {...defaultProps} task={sampleTask} />);

    expect(screen.getByRole('button', { name: /Update Task/i })).toBeInTheDocument();
  });

  it('handles form validation errors', async () => {
    render(<TaskForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.getByText('Status is required')).toBeInTheDocument();
    expect(screen.getByText('Priority is required')).toBeInDocument();
  });

  it('clears validation errors when user starts typing', async () => {
    render(<TaskForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(screen.getByText('Title is required')).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/Title/i);
    await user.type(titleInput, 'New Task');

    expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const statusSelect = screen.getByLabelText(/Status/i);
    const prioritySelect = screen.getByLabelText(/Priority/i);

    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'New Description');
    await user.selectOptions(statusSelect, 'pending');
    await user.selectOptions(prioritySelect, 'high');

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Task',
      description: 'New Description',
      status: 'pending',
      priority: 'high'
    }));
  });

  it('handles form reset', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    await user.type(titleInput, 'New Task');

    const resetButton = screen.getByRole('button', { name: /Reset/i });
    await user.click(resetButton);

    expect(titleInput).toHaveValue('');
  });

  it('handles form submission with tags', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const tagsInput = screen.getByLabelText(/Tags/i);

    await user.type(titleInput, 'New Task');
    await user.type(tagsInput, 'urgent,important,test');

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Task',
      tags: ['urgent', 'important', 'test']
    }));
  });

  it('handles form submission with assignee', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const assigneeInput = screen.getByLabelText(/Assignee/i);

    await user.type(titleInput, 'New Task');
    await user.type(assigneeInput, 'john.doe@example.com');

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Task',
      assignee: 'john.doe@example.com'
    }));
  });

  it('handles form submission with due date', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const dueDateInput = screen.getByLabelText(/Due Date/i);

    await user.type(titleInput, 'New Task');
    await user.type(dueDateInput, '2024-12-31');

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Task',
      dueDate: '2024-12-31'
    }));
  });

  it('handles form submission with all fields', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const statusSelect = screen.getByLabelText(/Status/i);
    const prioritySelect = screen.getByLabelText(/Priority/i);
    const assigneeInput = screen.getByLabelText(/Assignee/i);
    const dueDateInput = screen.getByLabelText(/Due Date/i);
    const tagsInput = screen.getByLabelText(/Tags/i);

    await user.type(titleInput, 'Complete Task');
    await user.type(descriptionInput, 'Complete Description');
    await user.selectOptions(statusSelect, 'in-progress');
    await user.selectOptions(prioritySelect, 'urgent');
    await user.type(assigneeInput, 'jane.smith@example.com');
    await user.type(dueDateInput, '2024-12-31');
    await user.type(tagsInput, 'urgent,important,deadline');

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Complete Task',
      description: 'Complete Description',
      status: 'in-progress',
      priority: 'urgent',
      assignee: 'jane.smith@example.com',
      dueDate: '2024-12-31',
      tags: ['urgent', 'important', 'deadline']
    }));
  });

  it('handles form submission with empty optional fields', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const statusSelect = screen.getByLabelText(/Status/i);
    const prioritySelect = screen.getByLabelText(/Priority/i);

    await user.type(titleInput, 'Minimal Task');
    await user.type(descriptionInput, 'Minimal Description');
    await user.selectOptions(statusSelect, 'pending');
    await user.selectOptions(prioritySelect, 'low');

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Minimal Task',
      description: 'Minimal Description',
      status: 'pending',
      priority: 'low',
      assignee: '',
      dueDate: '',
      tags: []
    }));
  });

  it('handles form submission with invalid data', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    await user.type(titleInput, 'a'); // Too short

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles form submission with invalid email', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const assigneeInput = screen.getByLabelText(/Assignee/i);

    await user.type(titleInput, 'Valid Task');
    await user.type(assigneeInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles form submission with invalid date', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const dueDateInput = screen.getByLabelText(/Due Date/i);

    await user.type(titleInput, 'Valid Task');
    await user.type(dueDateInput, 'invalid-date');

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(screen.getByText('Please enter a valid date')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles form submission with past date', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const dueDateInput = screen.getByLabelText(/Due Date/i);

    await user.type(titleInput, 'Valid Task');
    await user.type(dueDateInput, '2020-01-01'); // Past date

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(screen.getByText('Due date cannot be in the past')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles form submission with future date', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const dueDateInput = screen.getByLabelText(/Due Date/i);

    await user.type(titleInput, 'Valid Task');
    await user.type(dueDateInput, '2025-12-31'); // Future date

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Valid Task',
      dueDate: '2025-12-31'
    }));
  });

  it('handles form submission with today date', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const dueDateInput = screen.getByLabelText(/Due Date/i);

    const today = new Date().toISOString().split('T')[0];

    await user.type(titleInput, 'Valid Task');
    await user.type(dueDateInput, today);

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Valid Task',
      dueDate: today
    }));
  });

  it('handles form submission with tags containing spaces', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const tagsInput = screen.getByLabelText(/Tags/i);

    await user.type(titleInput, 'Valid Task');
    await user.type(tagsInput, 'urgent task, important, test case');

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Valid Task',
      tags: ['urgent task', 'important', 'test case']
    }));
  });

  it('handles form submission with empty tags', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const tagsInput = screen.getByLabelText(/Tags/i);

    await user.type(titleInput, 'Valid Task');
    await user.type(tagsInput, '');

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Valid Task',
      tags: []
    }));
  });

  it('handles form submission with whitespace-only tags', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const tagsInput = screen.getByLabelText(/Tags/i);

    await user.type(titleInput, 'Valid Task');
    await user.type(tagsInput, '   ,  ,  ');

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Valid Task',
      tags: []
    }));
  });

  it('handles form submission with duplicate tags', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const tagsInput = screen.getByLabelText(/Tags/i);

    await user.type(titleInput, 'Valid Task');
    await user.type(tagsInput, 'urgent,important,urgent,test');

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Valid Task',
      tags: ['urgent', 'important', 'urgent', 'test']
    }));
  });

  it('handles form submission with special characters in tags', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const tagsInput = screen.getByLabelText(/Tags/i);

    await user.type(titleInput, 'Valid Task');
    await user.type(tagsInput, 'urgent@task, important#1, test$case');

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Valid Task',
      tags: ['urgent@task', 'important#1', 'test$case']
    }));
  });

  it('handles form submission with very long title', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const longTitle = 'a'.repeat(1000); // Very long title

    await user.type(titleInput, longTitle);

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(screen.getByText('Title must be less than 200 characters')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles form submission with very long description', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const longDescription = 'a'.repeat(10000); // Very long description

    await user.type(titleInput, 'Valid Task');
    await user.type(descriptionInput, longDescription);

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(screen.getByText('Description must be less than 5000 characters')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles form submission with very long assignee', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const assigneeInput = screen.getByLabelText(/Assignee/i);
    const longAssignee = 'a'.repeat(1000) + '@example.com'; // Very long assignee

    await user.type(titleInput, 'Valid Task');
    await user.type(assigneeInput, longAssignee);

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(screen.getByText('Assignee must be less than 100 characters')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles form submission with very long tags', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const tagsInput = screen.getByLabelText(/Tags/i);
    const longTags = 'a'.repeat(1000) + ',b,c'; // Very long tags

    await user.type(titleInput, 'Valid Task');
    await user.type(tagsInput, longTags);

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(screen.getByText('Tags must be less than 500 characters')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles form submission with very many tags', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const tagsInput = screen.getByLabelText(/Tags/i);
    const manyTags = Array.from({ length: 100 }, (_, i) => `tag${i}`).join(','); // 100 tags

    await user.type(titleInput, 'Valid Task');
    await user.type(tagsInput, manyTags);

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(screen.getByText('Maximum 50 tags allowed')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles form submission with valid data and all edge cases', async () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const statusSelect = screen.getByLabelText(/Status/i);
    const prioritySelect = screen.getByLabelText(/Priority/i);
    const assigneeInput = screen.getByLabelText(/Assignee/i);
    const dueDateInput = screen.getByLabelText(/Due Date/i);
    const tagsInput = screen.getByLabelText(/Tags/i);

    await user.type(titleInput, 'Complete Task');
    await user.type(descriptionInput, 'Complete Description');
    await user.selectOptions(statusSelect, 'in-progress');
    await user.selectOptions(prioritySelect, 'urgent');
    await user.type(assigneeInput, 'jane.smith@example.com');
    await user.type(dueDateInput, '2025-12-31');
    await user.type(tagsInput, 'urgent,important,deadline');

    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Complete Task',
      description: 'Complete Description',
      status: 'in-progress',
      priority: 'urgent',
      assignee: 'jane.smith@example.com',
      dueDate: '2025-12-31',
      tags: ['urgent', 'important', 'deadline']
    }));
  });
});
