import React from 'react';

const NotificationModal = React.memo(({ 
  show, 
  mode, 
  formData, 
  onClose, 
  onSubmit, 
  onInputChange 
}) => {
  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-bell me-2"></i>
              {mode === 'add' ? 'Add New Notification' : 'Edit Notification'}
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
                    placeholder="Notification title"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="type" className="form-label">Type</label>
                  <select
                    className="form-select"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={onInputChange}
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">
                  <label htmlFor="message" className="form-label">Message *</label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={onInputChange}
                    placeholder="Enter notification message"
                    rows="4"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isRead"
                      name="isRead"
                      checked={formData.isRead}
                      onChange={onInputChange}
                    />
                    <label className="form-check-label" htmlFor="isRead">
                      Mark as Read
                    </label>
                  </div>
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
                {mode === 'add' ? 'Create Notification' : 'Update Notification'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

NotificationModal.displayName = 'NotificationModal';

export default NotificationModal;
