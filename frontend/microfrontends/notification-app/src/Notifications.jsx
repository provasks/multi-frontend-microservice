import React from 'react';
import { useNotificationManagement } from './hooks/useNotificationManagement';
import NotificationTable from './components/NotificationTable';
import NotificationModal from './components/NotificationModal';
import LoadingSpinner from 'sharedComponents/LoadingSpinner';

const Notifications = () => {
  const {
    // State
    notifications,
    loading,
    showModal,
    modalMode,
    formData,
    
    // Actions
    fetchNotifications,
    handleAddNotification,
    handleEditNotification,
    handleDeleteNotification,
    handleSubmit,
    handleInputChange,
    handleCloseModal,
    markAsRead
  } = useNotificationManagement();

  if (loading) {
    return (
      <LoadingSpinner 
        size="large" 
        variant="info" 
        text=""
        showDots={false}
      />
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">
            <i className="fas fa-bell me-2"></i>
            Notifications
          </h2>
        </div>
        <div>
          <button className="btn btn-primary me-2" onClick={handleAddNotification}>
            <i className="fas fa-plus me-1"></i>
            Add Notification
          </button>
          <button className="btn btn-outline-primary" onClick={fetchNotifications}>
            <i className="fas fa-sync-alt me-1"></i>
            Refresh
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Notifications ({notifications.length})</h5>
        </div>
        <div className="card-body">
          <NotificationTable
            notifications={notifications}
            onEdit={handleEditNotification}
            onMarkAsRead={markAsRead}
            onDelete={handleDeleteNotification}
          />
        </div>
      </div>

      <NotificationModal
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

export default Notifications;