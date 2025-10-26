import React from 'react';
import UserAutocomplete from './UserAutocomplete';
import './TaskModal.css';

const TaskModal = React.memo(({ 
  show, 
  mode, 
  formData, 
  onClose, 
  onSubmit, 
  onInputChange 
}) => {
  if (!show) return null;
  

  return (
    <div className="modal show d-block task-modal" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-tasks me-2"></i>
              {mode === 'add' ? 'Add New Task' : 'Edit Task'}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="title" className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={onInputChange}
                    placeholder="Task title"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="priority" className="form-label">Priority</label>
                  <select
                    className="form-select"
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
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select
                    className="form-select"
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
                <div className="col-md-6 mb-3">
                  <label htmlFor="assignedTo" className="form-label">Assigned To</label>
                  <UserAutocomplete
                    value={formData.assignedTo}
                    onChange={(userId) => {
                      onInputChange({ target: { name: 'assignedTo', value: userId } });
                    }}
                    placeholder="Search users..."
                    className="mb-2"
                  />
                  <div className="form-text">Leave empty to assign to yourself (current user)</div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="dueDate" className="form-label">Due Date</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate || ''}
                    onChange={onInputChange}
                    min={(() => {
                      const now = new Date();
                      const year = now.getFullYear();
                      const month = String(now.getMonth() + 1).padStart(2, '0');
                      const day = String(now.getDate()).padStart(2, '0');
                      const hours = String(now.getHours()).padStart(2, '0');
                      const minutes = String(now.getMinutes()).padStart(2, '0');
                      return `${year}-${month}-${day}T${hours}:${minutes}`;
                    })()}
                  />
                  <div className="form-text">Optional - if not specified, due date will be set to 6 hours from assignment time</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="tags" className="form-label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tags"
                    name="tags"
                    value={formData.tags || ''}
                    onChange={onInputChange}
                    placeholder="e.g., urgent, bug, documentation"
                  />
                  <div className="form-text">Separate multiple tags with commas</div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">
                  <label htmlFor="description" className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={onInputChange}
                    placeholder="Enter task description"
                    rows="3"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-save me-1"></i>
                {mode === 'add' ? 'Create Task' : 'Update Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

TaskModal.displayName = 'TaskModal';

export default TaskModal;
