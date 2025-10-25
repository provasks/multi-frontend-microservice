import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  theme: 'light',
  sidebarOpen: true,
  modals: {
    taskModal: false,
    notificationModal: false,
    userModal: false,
    confirmModal: false,
  },
  loading: {
    global: false,
    tasks: false,
    notifications: false,
    users: false,
  },
  notifications: {
    show: true,
    position: 'top-right',
    duration: 5000,
  },
  layout: {
    isMobile: false,
    sidebarCollapsed: false,
  },
  errors: {
    global: null,
    tasks: null,
    notifications: null,
    users: null,
  },
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setModal: (state, action) => {
      const { modal, isOpen } = action.payload;
      state.modals[modal] = isOpen;
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = false;
      });
    },
    setLoading: (state, action) => {
      const { key, isLoading } = action.payload;
      if (key === 'global') {
        state.loading.global = isLoading;
      } else {
        state.loading[key] = isLoading;
      }
    },
    setNotifications: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    setLayout: (state, action) => {
      state.layout = { ...state.layout, ...action.payload };
    },
    setError: (state, action) => {
      const { key, error } = action.payload;
      state.errors[key] = error;
    },
    clearError: (state, action) => {
      if (action.payload) {
        state.errors[action.payload] = null;
      } else {
        // Clear all errors
        Object.keys(state.errors).forEach(key => {
          state.errors[key] = null;
        });
      }
    },
    resetUI: (state) => {
      return {
        ...initialState,
        theme: state.theme, // Keep theme preference
      };
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setModal,
  openModal,
  closeModal,
  closeAllModals,
  setLoading,
  setNotifications,
  setLayout,
  setError,
  clearError,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
