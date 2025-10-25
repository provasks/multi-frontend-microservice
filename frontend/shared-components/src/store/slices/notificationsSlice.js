import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { unifiedApiClient } from '../utils/unifiedApiClient';

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await unifiedApiClient.get('/notifications', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await unifiedApiClient.post('/notifications', notificationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create notification');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationIds, { rejectWithValue }) => {
    try {
      const response = await unifiedApiClient.patch('/notifications/mark-read', {
        notificationIds: Array.isArray(notificationIds) ? notificationIds : [notificationIds]
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await unifiedApiClient.patch('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id, { rejectWithValue }) => {
    try {
      await unifiedApiClient.delete(`/notifications/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  'notifications/getUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await unifiedApiClient.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get unread count');
    }
  }
);

// Initial state
const initialState = {
  items: [],
  unreadCount: 0,
  filters: {
    type: 'all',
    isRead: false,
    search: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  lastFetch: null,
};

// Notifications slice
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        type: 'all',
        isRead: false,
        search: '',
      };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
      state.error = null;
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    updateNotification: (state, action) => {
      const index = state.items.findIndex(notification => notification.id === action.payload.id);
      if (index !== -1) {
        const wasRead = state.items[index].isRead;
        state.items[index] = action.payload;
        if (!wasRead && action.payload.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        } else if (wasRead && !action.payload.isRead) {
          state.unreadCount += 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.notifications || action.payload;
        state.pagination = {
          ...state.pagination,
          total: action.payload.total || action.payload.length,
          totalPages: action.payload.totalPages || Math.ceil((action.payload.total || action.payload.length) / state.pagination.limit),
        };
        state.lastFetch = new Date().toISOString();
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create notification
      .addCase(createNotification.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.isCreating = false;
        state.items.unshift(action.payload);
        if (!action.payload.isRead) {
          state.unreadCount += 1;
        }
        state.pagination.total += 1;
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const updatedIds = action.payload.updatedIds || action.payload;
        state.items = state.items.map(notification => {
          if (updatedIds.includes(notification.id)) {
            if (!notification.isRead) {
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
            return { ...notification, isRead: true };
          }
          return notification;
        });
      })
      
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items = state.items.map(notification => ({ ...notification, isRead: true }));
        state.unreadCount = 0;
      })
      
      // Delete notification
      .addCase(deleteNotification.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedNotification = state.items.find(n => n.id === action.payload);
        if (deletedNotification && !deletedNotification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.items = state.items.filter(notification => notification.id !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      })
      
      // Get unread count
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.count || action.payload;
      });
  },
});

export const {
  setNotifications,
  setUnreadCount,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
  clearNotifications,
  addNotification,
  updateNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
