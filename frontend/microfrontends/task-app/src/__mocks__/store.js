// Mock Redux store for testing
import { configureStore } from '@reduxjs/toolkit';

// Mock slices
const mockTasksSlice = {
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalTasks: 0,
      hasNext: false,
      hasPrev: false
    }
  },
  reducers: {
    setTasks: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addTask: (state, action) => {
      state.items.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.items.findIndex(task => task._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter(task => task._id !== action.payload);
    }
  }
};

const mockAuthSlice = {
  name: 'auth',
  initialState: {
    isAuthenticated: true,
    user: { id: 'user123', name: 'Test User' },
    token: 'mock-token'
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    }
  }
};

const mockUiSlice = {
  name: 'ui',
  initialState: {
    showModal: false,
    modalMode: 'add',
    editingTask: null,
    searchTerm: '',
    searchLoading: false
  },
  reducers: {
    setShowModal: (state, action) => {
      state.showModal = action.payload;
    },
    setModalMode: (state, action) => {
      state.modalMode = action.payload;
    },
    setEditingTask: (state, action) => {
      state.editingTask = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSearchLoading: (state, action) => {
      state.searchLoading = action.payload;
    }
  }
};

// Create mock store
export const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      tasks: (state = mockTasksSlice.initialState, action) => {
        const reducer = mockTasksSlice.reducers[action.type];
        if (reducer) {
          reducer(state, action);
        }
        return state;
      },
      auth: (state = mockAuthSlice.initialState, action) => {
        const reducer = mockAuthSlice.reducers[action.type];
        if (reducer) {
          reducer(state, action);
        }
        return state;
      },
      ui: (state = mockUiSlice.initialState, action) => {
        const reducer = mockUiSlice.reducers[action.type];
        if (reducer) {
          reducer(state, action);
        }
        return state;
      }
    },
    preloadedState
  });
};

export default createMockStore;
