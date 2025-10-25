import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { 
  fetchNotifications, 
  createNotification, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  getUnreadCount,
  setFilters,
  clearFilters,
  setPagination,
  clearError 
} from '../slices/notificationsSlice';

/**
 * Custom hook for notifications management
 * Provides notifications state and actions
 */
export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const { 
    items: notifications, 
    unreadCount, 
    filters, 
    pagination, 
    isLoading, 
    isCreating, 
    isUpdating, 
    isDeleting, 
    error 
  } = useAppSelector((state) => state.notifications);

  const getNotifications = (params) => dispatch(fetchNotifications(params));
  const createNewNotification = (notificationData) => dispatch(createNotification(notificationData));
  const markNotificationAsRead = (notificationIds) => dispatch(markAsRead(notificationIds));
  const markAllNotificationsAsRead = () => dispatch(markAllAsRead());
  const deleteExistingNotification = (id) => dispatch(deleteNotification(id));
  const getUnreadCountData = () => dispatch(getUnreadCount());
  const setNotificationFilters = (newFilters) => dispatch(setFilters(newFilters));
  const clearNotificationFilters = () => dispatch(clearFilters());
  const setNotificationPagination = (newPagination) => dispatch(setPagination(newPagination));
  const clearNotificationError = () => dispatch(clearError());

  return {
    // State
    notifications,
    unreadCount,
    filters,
    pagination,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    
    // Actions
    getNotifications,
    createNotification: createNewNotification,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    deleteNotification: deleteExistingNotification,
    getUnreadCount: getUnreadCountData,
    setFilters: setNotificationFilters,
    clearFilters: clearNotificationFilters,
    setPagination: setNotificationPagination,
    clearError: clearNotificationError,
  };
};
