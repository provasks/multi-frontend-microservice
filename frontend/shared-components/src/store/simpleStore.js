const { configureStore, createSlice } = require('@reduxjs/toolkit');
const Storage = require('../utils/storage');
const storageMiddleware = require('./middleware/storageMiddleware');

// Simple auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: Storage.getToken(),
    isAuthenticated: !!Storage.getToken(),
    isLoading: false,
    error: null
  },
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

// Simple tasks slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    isLoading: false,
    error: null
  },
  reducers: {
    setTasks: (state, action) => {
      state.items = action.payload;
    },
    addTask: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.items.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter(task => task.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

// Simple notifications slice
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    isLoading: false,
    error: null
  },
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

// Simple UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: Storage.getTheme(),
    sidebarOpen: true,
    loading: {
      global: false,
      tasks: false,
      notifications: false
    }
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setLoading: (state, action) => {
      const { key, isLoading } = action.payload;
      if (key === 'global') {
        state.loading.global = isLoading;
      } else {
        state.loading[key] = isLoading;
      }
    }
  }
});

// Configure store
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    tasks: tasksSlice.reducer,
    notifications: notificationsSlice.reducer,
    ui: uiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(storageMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

// Export actions
const authActions = authSlice.actions;
const tasksActions = tasksSlice.actions;
const notificationsActions = notificationsSlice.actions;
const uiActions = uiSlice.actions;

module.exports = {
  store,
  authActions,
  tasksActions,
  notificationsActions,
  uiActions
};
