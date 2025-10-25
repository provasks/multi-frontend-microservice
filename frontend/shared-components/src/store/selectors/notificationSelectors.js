import { createSelector } from 'reselect';

// Basic selectors
const selectNotificationsState = (state) => state.notifications;

// Memoized selectors
export const selectAllNotifications = createSelector(
  [selectNotificationsState],
  (notifications) => notifications.items
);

export const selectUnreadCount = createSelector(
  [selectNotificationsState],
  (notifications) => notifications.unreadCount
);

export const selectNotificationsLoading = createSelector(
  [selectNotificationsState],
  (notifications) => notifications.isLoading
);

export const selectNotificationsError = createSelector(
  [selectNotificationsState],
  (notifications) => notifications.error
);

export const selectNotificationsFilters = createSelector(
  [selectNotificationsState],
  (notifications) => notifications.filters
);

export const selectNotificationsPagination = createSelector(
  [selectNotificationsState],
  (notifications) => notifications.pagination
);

export const selectNotificationById = (id) => createSelector(
  [selectAllNotifications],
  (notifications) => notifications.find(notification => notification.id === id)
);

export const selectUnreadNotifications = createSelector(
  [selectAllNotifications],
  (notifications) => notifications.filter(notification => !notification.isRead)
);

export const selectReadNotifications = createSelector(
  [selectAllNotifications],
  (notifications) => notifications.filter(notification => notification.isRead)
);

export const selectNotificationsByType = (type) => createSelector(
  [selectAllNotifications],
  (notifications) => notifications.filter(notification => notification.type === type)
);

export const selectNotificationsByUser = (userId) => createSelector(
  [selectAllNotifications],
  (notifications) => notifications.filter(notification => notification.userId === userId)
);

export const selectFilteredNotifications = createSelector(
  [selectAllNotifications, selectNotificationsFilters],
  (notifications, filters) => {
    return notifications.filter(notification => {
      if (filters.type !== 'all' && notification.type !== filters.type) return false;
      if (filters.isRead !== false && notification.isRead !== filters.isRead) return false;
      if (filters.search && !notification.title.toLowerCase().includes(filters.search.toLowerCase()) && 
          !notification.message.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }
);

export const selectNotificationsStats = createSelector(
  [selectAllNotifications],
  (notifications) => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;
    const read = notifications.filter(n => n.isRead).length;
    const info = notifications.filter(n => n.type === 'info').length;
    const warning = notifications.filter(n => n.type === 'warning').length;
    const error = notifications.filter(n => n.type === 'error').length;
    const success = notifications.filter(n => n.type === 'success').length;

    return {
      total,
      unread,
      read,
      info,
      warning,
      error,
      success,
      unreadRate: total > 0 ? Math.round((unread / total) * 100) : 0
    };
  }
);

export const selectNotificationsByDateRange = (startDate, endDate) => createSelector(
  [selectAllNotifications],
  (notifications) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return notifications.filter(notification => {
      const notificationDate = new Date(notification.createdAt);
      return notificationDate >= start && notificationDate <= end;
    });
  }
);

export const selectRecentNotifications = (limit = 5) => createSelector(
  [selectAllNotifications],
  (notifications) => {
    return notifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }
);
