import React from 'react';
import './TaskItem.css';
import { TASK_CONSTANTS } from 'sharedComponents/constants';

// Simple tooltip fallback that uses native title attribute
const SafeTooltip = ({ children, content, position = 'top', maxWidth = '300px' }) => {
  // For now, just use native title attribute to avoid module federation issues
  // TODO: Implement proper tooltip when module federation is stable
  return (
    <span title={content} className="d-inline-block w-100">
      {children}
    </span>
  );
};

const TaskItem = React.memo(({ task, onEdit, onDelete }) => {
  return (
    <tr className="align-middle task-item">
      <td className="task-title">
        <SafeTooltip 
          content={task.title || 'Untitled Task'}
          position="top"
          maxWidth="300px"
        >
          <span className="title-text">
            {task.title || 'Untitled Task'}
          </span>
        </SafeTooltip>
      </td>
      <td>
        <SafeTooltip 
          content={task.description || 'No description'}
          position="top"
          maxWidth="400px"
        >
          <div className="task-description">
            {task.description || 'No description'}
          </div>
        </SafeTooltip>
      </td>
      <td className="text-center">
        <span className={`badge rounded-pill priority-badge ${
          TASK_CONSTANTS.PRIORITY_CONFIG[task.priority]?.bgClass || 'priority-low'
        }`}>
          {TASK_CONSTANTS.PRIORITY_CONFIG[task.priority]?.label || task.priority || 'low'}
        </span>
      </td>
      <td className="text-center">
        <span className={`badge rounded-pill status-badge ${
          TASK_CONSTANTS.STATUS_CONFIG[task.status]?.bgClass || 'status-pending'
        }`}>
          {TASK_CONSTANTS.STATUS_CONFIG[task.status]?.label || task.status || 'pending'}
        </span>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="user-avatar me-2">
            {task.assignedToUser && task.assignedToUser.user && task.assignedToUser.user.firstName ? task.assignedToUser.user.firstName.charAt(0) : 'U'}
          </div>
          <div className="user-info flex-grow-1">
            <SafeTooltip 
              content={task.assignedToUser && task.assignedToUser.user ? `${task.assignedToUser.user.firstName || ''} ${task.assignedToUser.user.lastName || ''}` : 'Unknown User'}
              position="top"
              maxWidth="200px"
            >
              <div className="user-name mb-0">
                {task.assignedToUser && task.assignedToUser.user ? `${task.assignedToUser.user.firstName || ''} ${task.assignedToUser.user.lastName || ''}` : 'Unknown User'}
              </div>
            </SafeTooltip>
            <SafeTooltip 
              content={task.assignedToUser && task.assignedToUser.user ? task.assignedToUser.user.email : 'No email'}
              position="top"
              maxWidth="250px"
            >
              <div className="user-email mb-0">
                {task.assignedToUser && task.assignedToUser.user ? task.assignedToUser.user.email : 'No email'}
              </div>
            </SafeTooltip>
          </div>
        </div>
      </td>
      <td className="text-center">
        {task.dueDate ? (
          <div className="task-date">
            <div className={`date-primary ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-danger fw-bold' : ''}`}>
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
            <div className="date-secondary">
              {new Date(task.dueDate).toLocaleTimeString()}
            </div>
            {new Date(task.dueDate) < new Date() && task.status !== 'completed' && (
              <div className="text-danger small">Overdue!</div>
            )}
          </div>
        ) : (
          <span className="text-muted">No due date</span>
        )}
      </td>
      <td className="text-center">
        <div className="task-date">
          <div className="date-primary">{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Unknown'}</div>
          <div className="date-secondary">{task.createdAt ? new Date(task.createdAt).toLocaleTimeString() : ''}</div>
        </div>
      </td>
      <td className="text-center">
        <div className="d-flex action-buttons">
          <button 
            className="btn action-btn action-btn-edit"
            onClick={() => onEdit(task)}
            title="Edit Task"
            type="button"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn action-btn action-btn-delete"
            onClick={() => onDelete(task._id)}
            title="Delete Task"
            type="button"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
});

TaskItem.displayName = 'TaskItem';

export default TaskItem;
