import React from 'react';
import { useUserManagement } from './hooks/useUserManagement';
import UserTable from './components/UserTable';
import UserModal from './components/UserModal';
import LoadingSpinner from 'sharedComponents/LoadingSpinner';

const UserManagement = () => {
  const {
    // State
    users,
    loading,
    showModal,
    modalMode,
    formData,
    
    // Actions
    fetchUsers,
    handleAddUser,
    handleEditUser,
    handleSubmit,
    handleInputChange,
    handleCloseModal
  } = useUserManagement();

  if (loading) {
    return (
      <LoadingSpinner 
        size="large" 
        variant="success" 
        text=""
        showDots={false}
      />
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">
            <i className="fas fa-users me-2"></i>
            User Management
          </h2>
        </div>
        <div>
          <button className="btn btn-primary me-2" onClick={handleAddUser}>
            <i className="fas fa-plus me-1"></i>
            Add User
          </button>
          <button className="btn btn-outline-primary" onClick={fetchUsers}>
            <i className="fas fa-sync-alt me-1"></i>
            Refresh
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Users ({users.length})</h5>
        </div>
        <div className="card-body">
          <UserTable
            users={users}
            onEdit={handleEditUser}
          />
        </div>
      </div>

      <UserModal
        show={showModal}
        mode={modalMode}
        formData={formData}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
      />
    </div>
  );
};

export default UserManagement;