import React from 'react';

const UserModal = React.memo(({ 
  show, 
  mode, 
  formData, 
  onClose, 
  onSubmit, 
  onInputChange 
}) => {
  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" aria-labelledby="userModalTitle" aria-modal="true" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="userModalTitle">
              <i className="fas fa-user me-2"></i>
              {mode === 'add' ? 'Add New User' : 'Edit User'}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={onSubmit} role="form">
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="username" className="form-label">Username *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={onInputChange}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="password" className="form-label">
                    Password {mode === 'add' ? '*' : ''}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={onInputChange}
                    placeholder={mode === 'add' ? 'Enter password (min 6 characters)' : 'Leave empty to keep current password'}
                    required={mode === 'add'}
                    minLength={mode === 'add' ? 6 : 0}
                  />
                  {mode === 'edit' && (
                    <div className="form-text">Leave empty to keep current password</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="firstName" className="form-label">First Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={onInputChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="lastName" className="form-label">Last Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={onInputChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="role" className="form-label">Role</label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={onInputChange}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={onInputChange}
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      Active User
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
                {mode === 'add' ? 'Create User' : 'Update User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

UserModal.displayName = 'UserModal';

export default UserModal;
