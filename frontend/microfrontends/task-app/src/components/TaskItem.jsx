import React from 'react';
import './TaskItem.css';

// Safe Tooltip component that handles module federation errors
const SafeTooltip = ({ children, content, position = 'top', maxWidth = '300px' }) => {
  try {
    // Try to import Tooltip dynamically
    const Tooltip = React.lazy(() => 
      import('sharedComponents/Tooltip').catch(() => ({
        default: ({ children }) => <>{children}</>
      }))
    );
    
    return (
      <React.Suspense fallback={<>{children}</>}>
        <Tooltip content={content} position={position} maxWidth={maxWidth}>
          {children}
        </Tooltip>
      </React.Suspense>
    );
  } catch (error) {
    console.warn('Tooltip component not available, falling back to native title attribute');
    return (
      <span title={content}>
        {children}
      </span>
    );
  }
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
          task.priority === 'urgent' ? 'priority-urgent' :
          task.priority === 'high' ? 'priority-high' :
          task.priority === 'medium' ? 'priority-medium' : 'priority-low'
        }`}>
          {task.priority || 'low'}
        </span>
      </td>
      <td className="text-center">
        <span className={`badge rounded-pill status-badge ${
          task.status === 'completed' ? 'status-completed' :
          task.status === 'in_progress' ? 'status-in-progress' :
          task.status === 'cancelled' ? 'status-cancelled' : 'status-pending'
        }`}>
          {task.status || 'pending'}
        </span>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="user-avatar me-2">
            {task.assignedToUser && task.assignedToUser.user && task.assignedToUser.user.firstName ? task.assignedToUser.user.firstName.charAt(0) : 'U'}
          </div>
          <div className="user-info">
            <SafeTooltip 
              content={task.assignedToUser && task.assignedToUser.user ? `${task.assignedToUser.user.firstName || ''} ${task.assignedToUser.user.lastName || ''}` : 'Unknown User'}
              position="top"
              maxWidth="200px"
            >
              <div className="user-name">
                {task.assignedToUser && task.assignedToUser.user ? `${task.assignedToUser.user.firstName || ''} ${task.assignedToUser.user.lastName || ''}` : 'Unknown User'}
              </div>
            </SafeTooltip>
            <SafeTooltip 
              content={task.assignedToUser && task.assignedToUser.user ? task.assignedToUser.user.email : 'No email'}
              position="top"
              maxWidth="250px"
            >
              <div className="user-email">
                {task.assignedToUser && task.assignedToUser.user ? task.assignedToUser.user.email : 'No email'}
              </div>
            </SafeTooltip>
          </div>
        </div>
      </td>
      <td className="text-center">
        <div className="task-date">
          <div className="date-primary">{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Unknown'}</div>
          <div className="date-secondary">{task.createdAt ? new Date(task.createdAt).toLocaleTimeString() : ''}</div>
        </div>
      </td>
      <td className="text-center">
        <div className="action-buttons">
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
