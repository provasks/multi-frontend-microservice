import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from 'sharedComponents/useAuth';
import axios from 'axios';

export const useNotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('unknown');
  const [showModal, setShowModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    isRead: false
  });

  const { makeAuthenticatedRequest, isAuthenticated } = useAuth();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setApiStatus('loading');
      
      if (!isAuthenticated()) {
        setApiStatus('error');
        setLoading(false);
        if (window.showError) {
          window.showError('Please log in to view notifications');
        }
        return;
      }

      const response = await makeAuthenticatedRequest('http://localhost:3003/api/notifications');
      
      if (response.ok) {
        const data = await response.json();
        const notificationsData = data.notifications || data || [];
        const serverNotifications = Array.isArray(notificationsData) ? notificationsData : [];
        
        setNotifications(prevNotifications => {
          const merged = serverNotifications.map(serverNotification => {
            const localNotification = prevNotifications.find(n => n._id === serverNotification._id);
            if (localNotification && localNotification.isRead !== serverNotification.isRead) {
              return { ...serverNotification, isRead: localNotification.isRead };
            }
            return serverNotification;
          });
          return merged;
        });
        
        setApiStatus('connected');
      } else {
        setApiStatus('error');
        setNotifications([]);
        if (window.showError) {
          window.showError('Failed to fetch notifications. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setApiStatus('error');
      setNotifications([]);
      if (window.showError) {
        window.showError('Error fetching notifications. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  }, [makeAuthenticatedRequest, isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleAddNotification = useCallback(() => {
    setModalMode('add');
    setEditingNotification(null);
    setFormData({
      title: '',
      message: '',
      type: 'info',
      isRead: false
    });
    setShowModal(true);
  }, []);

  const handleEditNotification = useCallback((notification) => {
    setModalMode('edit');
    setEditingNotification(notification);
    setFormData({
      title: notification.title || '',
      message: notification.message || '',
      type: notification.type || 'info',
      isRead: notification.isRead || false
    });
    setShowModal(true);
  }, []);

  const handleDeleteNotification = useCallback(async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setNotifications(notifications.filter(notification => notification._id !== notificationId));
        if (window.showSuccess) {
          window.showSuccess('Notification deleted successfully (demo mode)!');
        }
        return;
      }

      const response = await axios.delete(`http://localhost:3003/api/notifications/${notificationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        if (window.showSuccess) {
          window.showSuccess('Notification deleted successfully!');
        }
        fetchNotifications();
      } else {
        console.error('Failed to delete notification');
        if (window.showError) {
          window.showError('Failed to delete notification');
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [notifications, fetchNotifications]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        if (modalMode === 'add') {
          const newNotification = {
            _id: Date.now().toString(),
            ...formData,
            createdAt: new Date()
          };
          setNotifications([...notifications, newNotification]);
          if (window.showSuccess) {
            window.showSuccess('Notification created successfully (demo mode)!');
          }
        } else {
          setNotifications(notifications.map(notification => 
            notification._id === editingNotification._id 
              ? { ...notification, ...formData }
              : notification
          ));
          if (window.showSuccess) {
            window.showSuccess('Notification updated successfully (demo mode)!');
          }
        }
        setShowModal(false);
        return;
      }

      if (window.showInfo) {
        window.showInfo('Notification creation/editing is not supported by the API. Notifications are created automatically by the system. This feature works in demo mode only.');
      } else {
        alert('Notification creation/editing is not supported by the API. Notifications are created automatically by the system. This feature works in demo mode only.');
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  }, [formData, modalMode, editingNotification, notifications]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      setNotifications(prevNotifications => {
        const updated = prevNotifications.map(notification => {
          if (notification._id === notificationId) {
            return { ...notification, isRead: true };
          }
          return notification;
        });
        return updated;
      });

      if (!isAuthenticated()) {
        return;
      }

      const response = await makeAuthenticatedRequest(`http://localhost:3003/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.notification && result.notification.isRead === true) {
          if (window.showSuccess) {
            window.showSuccess('Notification marked as read!');
          }
          fetchNotifications();
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to mark notification as read:', response.status, errorText);
        
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification._id === notificationId 
              ? { ...notification, isRead: false }
              : notification
          )
        );
        
        if (window.showError) {
          window.showError(`Failed to mark notification as read: ${errorText}`);
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: false }
            : notification
        )
      );
    }
  }, [fetchNotifications, isAuthenticated, makeAuthenticatedRequest]);

  // Memoized calculations
  const notificationStats = useMemo(() => {
    return {
      total: notifications.length,
      unread: notifications.filter(notification => !notification.isRead).length,
      read: notifications.filter(notification => notification.isRead).length,
      byType: {
        info: notifications.filter(n => n.type === 'info').length,
        success: notifications.filter(n => n.type === 'success').length,
        warning: notifications.filter(n => n.type === 'warning').length,
        error: notifications.filter(n => n.type === 'error').length
      }
    };
  }, [notifications]);

  return {
    // State
    notifications,
    loading,
    apiStatus,
    showModal,
    editingNotification,
    modalMode,
    formData,
    notificationStats,
    
    // Actions
    fetchNotifications,
    handleAddNotification,
    handleEditNotification,
    handleDeleteNotification,
    handleSubmit,
    handleInputChange,
    handleCloseModal,
    markAsRead
  };
};
