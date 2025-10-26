import React from 'react';
import TaskItem from './TaskItem';
import './TaskTable.css';

const TaskTable = React.memo(({ tasks, onEdit, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-tasks fa-3x text-muted mb-3"></i>
        <p className="text-muted">No tasks found. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="table-responsive task-table">
      <table className="table table-striped table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th className="text-center col-title">Title</th>
            <th className="text-center col-description">Description</th>
            <th className="text-center col-priority">Priority</th>
            <th className="text-center col-status">Status</th>
            <th className="text-center col-assigned">Assigned To</th>
            <th className="text-center col-due">Due Date</th>
            <th className="text-center col-created">Created</th>
            <th className="text-center col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <TaskItem 
              key={task._id || index} 
              task={task} 
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

TaskTable.displayName = 'TaskTable';

export default TaskTable;
