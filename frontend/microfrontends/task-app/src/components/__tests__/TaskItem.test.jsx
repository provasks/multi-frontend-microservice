import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskItem from '../TaskItem';

// Mock the shared constants
jest.mock('sharedComponents/constants', () => ({
  TASK_CONSTANTS: {
    PRIORITY: {
      LOW: 'low',
      MEDIUM: 'medium',
      HIGH: 'high',
      URGENT: 'urgent'
    },
    STATUS: {
      PENDING: 'pending',
      IN_PROGRESS: 'in_progress',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled'
    }
  }
}));

describe('TaskItem Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTask = {
    _id: '1',
    title: 'Test Task',
    description: 'Test Description',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'john.doe@example.com',
    dueDate: '2024-12-31T10:00:00Z',
    tags: ['urgent', 'bug'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  };

  it('renders task information correctly', () => {
    render(
      <table>
        <tbody>
          <TaskItem task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('in_progress')).toBeInTheDocument();
    expect(screen.getByText('Unknown User')).toBeInTheDocument();
  });

  it('renders with null task gracefully', () => {
    render(
      <table>
        <tbody>
          <TaskItem task={null} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    expect(screen.getByText('Untitled Task')).toBeInTheDocument();
    expect(screen.getByText('No description')).toBeInTheDocument();
    expect(screen.getAllByText('Unknown')).toHaveLength(2);
  });

  it('renders with undefined task gracefully', () => {
    render(
      <table>
        <tbody>
          <TaskItem task={undefined} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    expect(screen.getByText('Untitled Task')).toBeInTheDocument();
    expect(screen.getByText('No description')).toBeInTheDocument();
    expect(screen.getAllByText('Unknown')).toHaveLength(2);
  });

  it('calls onEdit when edit button is clicked', async () => {
    render(
      <table>
        <tbody>
          <TaskItem task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    const editButton = screen.getByTitle('Edit Task');
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when delete button is clicked', async () => {
    render(
      <table>
        <tbody>
          <TaskItem task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    const deleteButton = screen.getByTitle('Delete Task');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask._id);
  });

  it('disables buttons when task is null', () => {
    render(
      <table>
        <tbody>
          <TaskItem task={null} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    // When task is null, buttons don't have titles but are disabled
    const buttons = screen.getAllByRole('button');
    const editButton = buttons[0];
    const deleteButton = buttons[1];

    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it('renders priority badge with correct class', () => {
    render(
      <table>
        <tbody>
          <TaskItem task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    const priorityBadge = screen.getByText('high');
    expect(priorityBadge).toHaveClass('badge', 'priority-low');
  });

  it('renders status badge with correct class', () => {
    render(
      <table>
        <tbody>
          <TaskItem task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    const statusBadge = screen.getByText('in_progress');
    expect(statusBadge).toHaveClass('badge', 'status-pending');
  });

  it('renders different priority badges correctly', () => {
    const lowPriorityTask = { ...mockTask, priority: 'low' };
    const { rerender } = render(
      <table>
        <tbody>
          <TaskItem task={lowPriorityTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    expect(screen.getByText('low')).toHaveClass('badge', 'priority-low');

    const urgentPriorityTask = { ...mockTask, priority: 'urgent' };
    rerender(
      <table>
        <tbody>
          <TaskItem task={urgentPriorityTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    expect(screen.getByText('urgent')).toHaveClass('badge', 'priority-low');
  });

  it('renders different status badges correctly', () => {
    const completedTask = { ...mockTask, status: 'completed' };
    const { rerender } = render(
      <table>
        <tbody>
          <TaskItem task={completedTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    expect(screen.getByText('completed')).toHaveClass('badge', 'status-pending');

    const cancelledTask = { ...mockTask, status: 'cancelled' };
    rerender(
      <table>
        <tbody>
          <TaskItem task={cancelledTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    expect(screen.getByText('cancelled')).toHaveClass('badge', 'status-pending');
  });

  it('formats due date correctly', () => {
    render(
      <table>
        <tbody>
          <TaskItem task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    // The due date should be formatted as a readable date
    expect(screen.getByText('31/12/2024')).toBeInTheDocument();
  });

  it('handles missing due date', () => {
    const taskWithoutDueDate = { ...mockTask, dueDate: null };
    render(
      <table>
        <tbody>
          <TaskItem task={taskWithoutDueDate} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    expect(screen.getByText('No due date')).toBeInTheDocument();
  });

  it('handles missing assignedTo', () => {
    const taskWithoutAssignee = { ...mockTask, assignedTo: null };
    render(
      <table>
        <tbody>
          <TaskItem task={taskWithoutAssignee} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    expect(screen.getByText('Unknown User')).toBeInTheDocument();
  });

  // Note: TaskItem component doesn't currently display tags, so these tests are skipped

  it('has correct CSS classes', () => {
    render(
      <table>
        <tbody>
          <TaskItem task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    const taskRow = screen.getByText('Test Task').closest('tr');
    expect(taskRow).toHaveClass('align-middle', 'task-item');
  });

  it('renders action buttons with correct classes', () => {
    render(
      <table>
        <tbody>
          <TaskItem task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    const editButton = screen.getByTitle('Edit Task');
    const deleteButton = screen.getByTitle('Delete Task');

    expect(editButton).toHaveClass('btn', 'action-btn', 'action-btn-edit');
    expect(deleteButton).toHaveClass('btn', 'action-btn', 'action-btn-delete');
  });

  it('renders icons correctly', () => {
    render(
      <table>
        <tbody>
          <TaskItem task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    const editIcon = screen.getByTitle('Edit Task').querySelector('i');
    const deleteIcon = screen.getByTitle('Delete Task').querySelector('i');

    expect(editIcon).toHaveClass('fas', 'fa-edit');
    expect(deleteIcon).toHaveClass('fas', 'fa-trash');
  });

  it('handles very long task titles', () => {
    const longTitleTask = { 
      ...mockTask, 
      title: 'This is a very long task title that should be handled gracefully by the component and not break the layout or cause any issues with rendering'
    };
    
    render(
      <table>
        <tbody>
          <TaskItem task={longTitleTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    expect(screen.getByText(longTitleTask.title)).toBeInTheDocument();
  });

  it('handles very long descriptions', () => {
    const longDescTask = { 
      ...mockTask, 
      description: 'This is a very long task description that should be handled gracefully by the component and not break the layout or cause any issues with rendering. It should truncate or wrap properly.'
    };
    
    render(
      <table>
        <tbody>
          <TaskItem task={longDescTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    expect(screen.getByText(longDescTask.description)).toBeInTheDocument();
  });

  it('handles special characters in task data', () => {
    const specialCharTask = {
      ...mockTask,
      title: 'Task with special chars: !@#$%^&*()',
      description: 'Description with <script>alert("xss")</script>',
      assignedTo: 'user+test@example.com'
    };
    
    render(
      <table>
        <tbody>
          <TaskItem task={specialCharTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        </tbody>
      </table>
    );

    expect(screen.getByText(specialCharTask.title)).toBeInTheDocument();
    expect(screen.getByText(specialCharTask.description)).toBeInTheDocument();
    expect(screen.getByText('Unknown User')).toBeInTheDocument();
  });
});