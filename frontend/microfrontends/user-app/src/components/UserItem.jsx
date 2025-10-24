import React from 'react';

const UserItem = React.memo(({ user, onEdit }) => {
  return (
    <tr className="align-middle">
      <td>
        <div className="d-flex align-items-center">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
               style={{ width: '32px', height: '32px', fontSize: '12px' }}>
            {user.firstName && user.firstName.charAt ? user.firstName.charAt(0).toUpperCase() : 
             user.name && user.name.charAt ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="fw-bold">
              {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 
               user.name || 'Unknown User'}
            </div>
            <div className="text-muted small">
              @{user.username || 'no-username'}
            </div>
          </div>
        </div>
      </td>
      <td className="text-center">
        <div className="small">
          {user.email || 'No email'}
        </div>
      </td>
      <td className="text-center">
        <span className={`badge rounded-pill ${
          user.role === 'admin' ? 'bg-danger' : 
          user.role === 'moderator' ? 'bg-warning text-dark' : 'bg-secondary'
        }`}>
          {user.role || 'user'}
        </span>
      </td>
      <td className="text-center">
        <span className={`badge rounded-pill ${
          user.isActive ? 'bg-success' : 'bg-secondary'
        }`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="text-center">
        <div className="small">
          <div className="fw-semibold">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</div>
          <div className="text-muted">{user.createdAt ? new Date(user.createdAt).toLocaleTimeString() : ''}</div>
        </div>
      </td>
      <td className="text-center">
        <button 
          className="btn btn-outline-primary btn-sm"
          onClick={() => onEdit(user)}
          title="Edit User"
          type="button"
        >
          <i className="fas fa-edit me-1"></i>
          Edit
        </button>
      </td>
    </tr>
  );
});

UserItem.displayName = 'UserItem';

export default UserItem;
