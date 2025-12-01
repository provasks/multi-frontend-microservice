import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from 'sharedComponents/useAuth';
import { notificationApi, apiHelpers } from 'sharedComponents/unifiedApiClient';

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

  const { isAuthenticated, loading: authLoading, checkAuth } = useAuth();

  // Check auth status when component mounts or becomes visible
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setApiStatus('loading');
      
      // Wait for auth check to complete before proceeding
      if (authLoading) {
        // Auth check is still in progress, wait a bit
        await new Promise(resolve => setTimeout(resolve, 100));
        // Re-check auth status
        await checkAuth();
      }
      
      // Don't check isAuthenticated here - let the API call handle authentication
      // If the cookie is valid, the API will work; if not, it will return 401

      console.log('Fetching notifications using apiHelpers.fetchNotifications()...');
      
      // Use apiHelpers.fetchNotifications() - same as Dashboard uses
      const data = await apiHelpers.fetchNotifications();
      
      console.log('Notification API response data:', data);
      
      // apiHelpers.fetchNotifications() returns { notifications: [...], pagination: {...} }
      let notificationsData = [];
      if (data && data.notifications && Array.isArray(data.notifications)) {
        notificationsData = data.notifications;
      } else if (Array.isArray(data)) {
        notificationsData = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        notificationsData = data.data;
      }
      
      console.log('Processed notifications data:', notificationsData);
      console.log('Number of notifications:', notificationsData.length);
      
      // Update notifications state - merge with previous to preserve read status
      setNotifications(prevNotifications => {
        // If no notifications from server, return empty array (not previous)
        if (notificationsData.length === 0) {
          return [];
        }
        
        // Merge: preserve local read status if it differs from server
        const merged = notificationsData.map(serverNotification => {
          const localNotification = prevNotifications.find(n => 
            (n._id && serverNotification._id && n._id.toString() === serverNotification._id.toString()) ||
            (n.id && serverNotification.id && n.id.toString() === serverNotification.id.toString())
          );
          if (localNotification && localNotification.isRead !== serverNotification.isRead) {
            return { ...serverNotification, isRead: localNotification.isRead };
          }
          return serverNotification;
        });
        
        console.log('Setting notifications to:', merged);
        return merged;
      });
      
      setApiStatus('connected');
    } catch (error) {
      console.error('Error fetching notifications:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      setApiStatus('error');
      setNotifications([]);
      
      // Handle 401 errors gracefully - user might not be authenticated
      if (error.response?.status === 401) {
        if (window.showError) {
          window.showError('Please log in to view notifications');
        }
      } else if (error.response?.status === 403) {
        if (window.showError) {
          window.showError('Access denied. You do not have permission to view notifications.');
        }
      } else {
        if (window.showError) {
          window.showError('Failed to load notifications');
        }
      }
    } finally {
      setLoading(false);
    }
  }, [authLoading, checkAuth]);

  // Track if we've already fetched to prevent infinite loops
  const hasFetchedRef = useRef(false);
  
  useEffect(() => {
    // Only fetch once when auth loading completes
    if (!authLoading && !hasFetchedRef.current) {
      console.log('Auth loading complete, fetching notifications...');
      hasFetchedRef.current = true;
      fetchNotifications();
    }
  }, [authLoading]); // Only depend on authLoading, not fetchNotifications or checkAuth

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
      const response = await axios.delete(`http://localhost:3003/api/notifications/${notificationId}`, {
        withCredentials: true,  // CRITICAL: Send cookies with requests
        headers: {
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
      // Cookie is sent automatically with withCredentials
      if (modalMode === 'add') {
        // This is a fallback for demo mode - should use API in production
        const newNotification = {
          _id: Date.now().toString(),
          ...formData,
          createdAt: new Date()
        };
        setNotifications([...notifications, newNotification]);
        if (window.showSuccess) {
          window.showSuccess('Notification created successfully (demo mode)!');
        }
        setShowModal(false);
        return;
      } else {
        setNotifications(notifications.map(notification => 
          notification._id === editingNotification._id 
            ? { ...notification, ...formData }
            : notification
        ));
        if (window.showSuccess) {
          window.showSuccess('Notification updated successfully (demo mode)!');
        }
        setShowModal(false);
        return;
      }
    } catch (error) {
      console.error('Error saving notification:', error);
      if (window.showError) {
        window.showError('Failed to save notification');
      }
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

      if (!isAuthenticated) {
        return;
      }

      const response = await axios.patch(`http://localhost:3003/api/notifications/${notificationId}/read`, {}, {
        withCredentials: true  // CRITICAL: Send cookies
      });
      
      // Axios response has data property, not ok/json like fetch
      const result = response.data;
      if (result.notification && result.notification.isRead === true) {
        if (window.showSuccess) {
          window.showSuccess('Notification marked as read!');
        }
        fetchNotifications();
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
  }, [fetchNotifications, isAuthenticated]);

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
