import React from 'react';
import UserItem from './UserItem';

const UserTable = React.memo(({ users, onEdit }) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="fas fa-users fa-3x text-muted mb-3"></i>
        <p className="text-muted">No users found. Create your first user!</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th className="text-center" style={{ width: '25%' }}>User</th>
            <th className="text-center" style={{ width: '25%' }}>Email</th>
            <th className="text-center" style={{ width: '15%' }}>Role</th>
            <th className="text-center" style={{ width: '15%' }}>Status</th>
            <th className="text-center" style={{ width: '15%' }}>Created</th>
            <th className="text-center" style={{ width: '5%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <UserItem 
              key={user._id || index} 
              user={user} 
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

UserTable.displayName = 'UserTable';

export default UserTable;
