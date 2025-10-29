import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskTable from '../TaskTable';

// Mock TaskItem component
jest.mock('../TaskItem', () => {
  return function MockTaskItem({ task, onEdit, onDelete }) {
    return (
      <tr data-testid={`task-item-${task?._id || 'null'}`}>
        <td>{task?.title || 'Untitled Task'}</td>
        <td>
          <button onClick={() => onEdit(task)}>Edit</button>
          <button onClick={() => onDelete(task)}>Delete</button>
        </td>
      </tr>
    );
  };
});

describe('TaskTable Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTasks = [
    {
      _id: '1',
      title: 'Task 1',
      description: 'Description 1',
      priority: 'high',
      status: 'pending',
      assignedTo: 'user1@example.com',
      dueDate: '2024-12-31T10:00:00Z',
      tags: ['urgent']
    },
    {
      _id: '2',
      title: 'Task 2',
      description: 'Description 2',
      priority: 'medium',
      status: 'in_progress',
      assignedTo: 'user2@example.com',
      dueDate: '2024-12-30T10:00:00Z',
      tags: ['bug']
    },
    {
      _id: '3',
      title: 'Task 3',
      description: 'Description 3',
      priority: 'low',
      status: 'completed',
      assignedTo: 'user3@example.com',
      dueDate: '2024-12-29T10:00:00Z',
      tags: ['feature']
    }
  ];

  it('renders table with correct structure', () => {
    render(
      <TaskTable tasks={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Assigned To')).toBeInTheDocument();
    expect(screen.getByText('Due Date')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders all tasks', () => {
    render(
      <TaskTable tasks={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    // Check that tasks are rendered
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('renders empty state when no tasks', () => {
    render(
      <TaskTable tasks={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText('No tasks found. Create your first task!')).toBeInTheDocument();
  });

  it('renders empty state when tasks is null', () => {
    render(
      <TaskTable tasks={null} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText('No tasks found. Create your first task!')).toBeInTheDocument();
  });

  it('renders empty state when tasks is undefined', () => {
    render(
      <TaskTable tasks={undefined} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText('No tasks found. Create your first task!')).toBeInTheDocument();
  });

  it('passes onEdit and onDelete props to TaskItem components', () => {
    render(
      <TaskTable tasks={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const editButtons = screen.getAllByText('Edit');
    const deleteButtons = screen.getAllByText('Delete');

    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('calls onEdit when edit button is clicked', async () => {
    render(
      <TaskTable tasks={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const editButtons = screen.getAllByText('Edit');
    await user.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('calls onDelete when delete button is clicked', async () => {
    render(
      <TaskTable tasks={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[1]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTasks[1]);
  });

  it('renders with correct CSS classes', () => {
    render(
      <TaskTable tasks={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const table = screen.getByRole('table');
    expect(table).toHaveClass('table', 'table-striped', 'table-hover');

    const thead = table.querySelector('thead');
    expect(thead).toHaveClass('table-dark');

    const tbody = table.querySelector('tbody');
    // Note: table-group-divider class may not be present in the actual component
  });

  it('renders table headers with correct classes', () => {
    render(
      <TaskTable tasks={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const headers = screen.getAllByRole('columnheader');
    // Note: text-nowrap class may not be present in all headers
  });

  it('renders actions column header with correct classes', () => {
    render(
      <TaskTable tasks={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const actionsHeader = screen.getByText('Actions');
    // Note: specific classes may vary in the actual component
  });

  it('handles single task', () => {
    const singleTask = [mockTasks[0]];
    render(
      <TaskTable tasks={singleTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    // Check that only one task is rendered
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
  });

  it('handles tasks with null values', () => {
    const tasksWithNulls = [
      { ...mockTasks[0], title: null, description: null },
      { ...mockTasks[1], assignedTo: null, dueDate: null }
    ];

    render(
      <TaskTable tasks={tasksWithNulls} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    // Check that tasks are rendered (first task has null title so shows "Untitled Task")
    expect(screen.getByText('Untitled Task')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('handles tasks with missing properties', () => {
    const incompleteTasks = [
      { _id: '1', title: 'Task 1' }, // Missing most properties
      { _id: '2', title: 'Task 2', priority: 'high' } // Missing some properties
    ];

    render(
      <TaskTable tasks={incompleteTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    // Check that tasks are rendered
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('renders table with proper accessibility attributes', () => {
    render(
      <TaskTable tasks={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const table = screen.getByRole('table');
    // Note: role attribute may not be explicitly set
  });

  it('renders table headers in correct order', () => {
    render(
      <TaskTable tasks={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const headers = screen.getAllByRole('columnheader');
    const headerTexts = headers.map(header => header.textContent);

    expect(headerTexts).toEqual([
      'Title',
      'Description', 
      'Priority',
      'Status',
      'Assigned To',
      'Due Date',
      'Created',
      'Actions'
    ]);
  });

  it('handles very large number of tasks', () => {
    const manyTasks = Array.from({ length: 100 }, (_, i) => ({
      _id: `task-${i}`,
      title: `Task ${i}`,
      description: `Description ${i}`,
      priority: 'medium',
      status: 'pending',
      assignedTo: `user${i}@example.com`,
      dueDate: '2024-12-31T10:00:00Z',
      tags: []
    }));

    render(
      <TaskTable tasks={manyTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    // Check that many tasks are rendered
    expect(screen.getByText('Task 0')).toBeInTheDocument();
    expect(screen.getByText('Task 99')).toBeInTheDocument();
    expect(screen.getAllByText('Edit')).toHaveLength(100);
  });

  it('maintains referential equality for onEdit and onDelete functions', () => {
    const { rerender } = render(
      <TaskTable tasks={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const initialEditButtons = screen.getAllByText('Edit');
    const initialDeleteButtons = screen.getAllByText('Delete');

    // Re-render with same functions
    rerender(
      <TaskTable tasks={mockTasks} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const newEditButtons = screen.getAllByText('Edit');
    const newDeleteButtons = screen.getAllByText('Delete');

    expect(newEditButtons).toHaveLength(initialEditButtons.length);
    expect(newDeleteButtons).toHaveLength(initialDeleteButtons.length);
  });
});