import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskTable from '../TaskTable';

// Mock TaskItem component
jest.mock('../TaskItem', () => {
  return function MockTaskItem({ task, onEdit, onDelete }) {
    return (
      <tr data-testid={`task-item-${task._id}`}>
        <td>{task.title}</td>
        <td>{task.description}</td>
        <td>
          <span className={`badge bg-${task.priority === 'high' ? 'danger' : 'secondary'}`}>
            {task.priority}
          </span>
        </td>
        <td>
          <span className={`badge bg-${task.status === 'completed' ? 'success' : 'warning'}`}>
            {task.status}
          </span>
        </td>
        <td>{task.assignedTo}</td>
        <td>{new Date(task.dueDate).toLocaleDateString()}</td>
        <td>{new Date(task.createdAt).toLocaleDateString()}</td>
        <td>
          <button 
            data-testid={`edit-${task._id}`}
            onClick={() => onEdit(task)}
            className="btn btn-sm btn-outline-primary me-2"
          >
            Edit
          </button>
          <button 
            data-testid={`delete-${task._id}`}
            onClick={() => onDelete(task._id)}
            className="btn btn-sm btn-outline-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  };
});

describe('TaskTable Component (Real)', () => {
  const mockTasks = [
    {
      _id: '1',
      title: 'Task 1',
      description: 'Description 1',
      priority: 'high',
      status: 'pending',
      assignedTo: 'user1@example.com',
      dueDate: '2024-12-31T23:59:59.000Z',
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '2',
      title: 'Task 2',
      description: 'Description 2',
      priority: 'medium',
      status: 'in_progress',
      assignedTo: 'user2@example.com',
      dueDate: '2024-12-30T23:59:59.000Z',
      createdAt: '2024-01-02T00:00:00.000Z'
    },
    {
      _id: '3',
      title: 'Task 3',
      description: 'Description 3',
      priority: 'low',
      status: 'completed',
      assignedTo: 'user3@example.com',
      dueDate: '2024-12-29T23:59:59.000Z',
      createdAt: '2024-01-03T00:00:00.000Z'
    }
  ];

  const defaultProps = {
    tasks: mockTasks,
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with tasks when tasks are provided', () => {
    render(<TaskTable {...defaultProps} />);
    
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Assigned To')).toBeInTheDocument();
    expect(screen.getByText('Due Date')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders all task items', () => {
    render(<TaskTable {...defaultProps} />);
    
    expect(screen.getByTestId('task-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('task-item-3')).toBeInTheDocument();
  });

  it('displays task data correctly', () => {
    render(<TaskTable {...defaultProps} />);
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
  });

  it('shows empty state when no tasks', () => {
    render(<TaskTable {...defaultProps} tasks={[]} />);
    
    expect(screen.getByText('No tasks found. Create your first task!')).toBeInTheDocument();
    expect(screen.getByText('fas fa-tasks fa-3x text-muted mb-3')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskTable {...defaultProps} />);
    
    const editButton = screen.getByTestId('edit-1');
    await user.click(editButton);
    
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskTable {...defaultProps} />);
    
    const deleteButton = screen.getByTestId('delete-1');
    await user.click(deleteButton);
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith('1');
  });

  it('renders table with correct classes', () => {
    render(<TaskTable {...defaultProps} />);
    
    const table = screen.getByRole('table');
    expect(table).toHaveClass('table', 'table-striped', 'table-hover', 'table-bordered');
  });

  it('renders table header with correct classes', () => {
    render(<TaskTable {...defaultProps} />);
    
    const thead = screen.getByRole('rowgroup');
    expect(thead).toHaveClass('table-dark');
  });

  it('renders table container with correct classes', () => {
    render(<TaskTable {...defaultProps} />);
    
    const container = screen.getByRole('table').closest('div');
    expect(container).toHaveClass('table-responsive', 'task-table');
  });

  it('displays priority badges with correct styling', () => {
    render(<TaskTable {...defaultProps} />);
    
    const highPriorityBadge = screen.getByText('high');
    const mediumPriorityBadge = screen.getByText('medium');
    
    expect(highPriorityBadge).toHaveClass('badge', 'bg-danger');
    expect(mediumPriorityBadge).toHaveClass('badge', 'bg-secondary');
  });

  it('displays status badges with correct styling', () => {
    render(<TaskTable {...defaultProps} />);
    
    const completedStatusBadge = screen.getByText('completed');
    const pendingStatusBadge = screen.getByText('pending');
    
    expect(completedStatusBadge).toHaveClass('badge', 'bg-success');
    expect(pendingStatusBadge).toHaveClass('badge', 'bg-warning');
  });

  it('formats dates correctly', () => {
    render(<TaskTable {...defaultProps} />);
    
    // Check that dates are formatted (exact format may vary by locale)
    const dueDates = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
    expect(dueDates.length).toBeGreaterThan(0);
  });

  it('renders action buttons with correct classes', () => {
    render(<TaskTable {...defaultProps} />);
    
    const editButton = screen.getByTestId('edit-1');
    const deleteButton = screen.getByTestId('delete-1');
    
    expect(editButton).toHaveClass('btn', 'btn-sm', 'btn-outline-primary', 'me-2');
    expect(deleteButton).toHaveClass('btn', 'btn-sm', 'btn-outline-danger');
  });

  it('handles multiple tasks correctly', () => {
    const manyTasks = Array.from({ length: 10 }, (_, i) => ({
      _id: `task-${i + 1}`,
      title: `Task ${i + 1}`,
      description: `Description ${i + 1}`,
      priority: 'medium',
      status: 'pending',
      assignedTo: `user${i + 1}@example.com`,
      dueDate: '2024-12-31T23:59:59.000Z',
      createdAt: '2024-01-01T00:00:00.000Z'
    }));
    
    render(<TaskTable {...defaultProps} tasks={manyTasks} />);
    
    expect(screen.getByTestId('task-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-item-10')).toBeInTheDocument();
    expect(screen.getAllByTestId(/task-item-/)).toHaveLength(10);
  });
});
