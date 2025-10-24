import React from 'react';

const NotificationItem = React.memo(({ notification, onEdit, onMarkAsRead, onDelete }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return 'fas fa-check-circle text-success';
      case 'error': return 'fas fa-exclamation-circle text-danger';
      case 'warning': return 'fas fa-exclamation-triangle text-warning';
      case 'info': return 'fas fa-info-circle text-info';
      default: return 'fas fa-bell text-secondary';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'bg-success';
      case 'error': return 'bg-danger';
      case 'warning': return 'bg-warning text-dark';
      case 'info': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  return (
    <tr className="align-middle">
      <td>
        <div className="d-flex align-items-center">
          <i className={`${getTypeIcon(notification.type)} me-2`}></i>
          <div>
            <div className="fw-bold">
              {notification.title || 'Untitled Notification'}
            </div>
            <div className="text-muted small">
              {notification.type || 'info'}
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className="text-truncate" style={{ maxWidth: '500px' }} title={notification.message || 'No message'}>
          {notification.message || 'No message'}
        </div>
      </td>
      <td className="text-center">
        <span className={`badge rounded-pill ${getTypeColor(notification.type)}`}>
          {notification.type || 'info'}
        </span>
      </td>
      <td className="text-center">
        <span className={`badge rounded-pill ${
          notification.isRead ? 'bg-success' : 'bg-warning text-dark'
        }`}>
          {notification.isRead ? 'Read' : 'Unread'}
        </span>
      </td>
      <td className="text-center">
        <div className="small">
          <div className="fw-semibold">{notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'Unknown'}</div>
          <div className="text-muted">{notification.createdAt ? new Date(notification.createdAt).toLocaleTimeString() : ''}</div>
        </div>
      </td>
      <td className="text-center">
        <div className="btn-group btn-group-sm" role="group">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={() => onEdit(notification)}
            title="Edit Notification"
            type="button"
          >
            <i className="fas fa-edit"></i>
          </button>
          {!notification.isRead && (
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => onMarkAsRead(notification._id)}
              title="Mark as Read"
              type="button"
            >
              <i className="fas fa-check"></i>
            </button>
          )}
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete(notification._id)}
            title="Delete Notification"
            type="button"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
});

NotificationItem.displayName = 'NotificationItem';

export default NotificationItem;
