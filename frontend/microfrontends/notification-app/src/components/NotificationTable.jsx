import React from 'react';
import NotificationItem from './NotificationItem';

const NotificationTable = React.memo(({ notifications, onEdit, onMarkAsRead, onDelete }) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="fas fa-bell fa-3x text-muted mb-3"></i>
        <p className="text-muted">No notifications found.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th className="text-center" style={{ width: '20%' }}>Title</th>
            <th className="text-center" style={{ width: '35%' }}>Message</th>
            <th className="text-center" style={{ width: '10%' }}>Type</th>
            <th className="text-center" style={{ width: '10%' }}>Status</th>
            <th className="text-center" style={{ width: '15%' }}>Created</th>
            <th className="text-center" style={{ width: '10%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification, index) => (
            <NotificationItem 
              key={notification._id || index} 
              notification={notification} 
              onEdit={onEdit}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

NotificationTable.displayName = 'NotificationTable';

export default NotificationTable;
