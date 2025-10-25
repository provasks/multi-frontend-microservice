const { createSlice } = require('@reduxjs/toolkit');
const IDLE_TIMEOUT_CONFIG = require('../../config/idleTimeout');

// Initial state
const initialState = {
  isActive: false, // Start inactive - only activate after login
  isWarning: false,
  timeRemaining: IDLE_TIMEOUT_CONFIG.DEFAULT_TIMEOUT,
  timeout: IDLE_TIMEOUT_CONFIG.DEFAULT_TIMEOUT,
  warningTime: IDLE_TIMEOUT_CONFIG.DEFAULT_WARNING_TIME,
  isEnabled: IDLE_TIMEOUT_CONFIG.ENABLED,
  lastActivity: Date.now()
};

// Idle timeout slice
const idleTimeoutSlice = createSlice({
  name: 'idleTimeout',
  initialState,
  reducers: {
    setIdleTimeout: (state, action) => {
      state.timeout = action.payload.timeout || state.timeout;
      state.warningTime = action.payload.warningTime || state.warningTime;
      state.isEnabled = action.payload.isEnabled !== undefined ? action.payload.isEnabled : state.isEnabled;
    },
    setActive: (state, action) => {
      state.isActive = action.payload;
      if (action.payload) {
        state.lastActivity = Date.now();
      }
    },
    setWarning: (state, action) => {
      state.isWarning = action.payload;
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
      state.isWarning = false;
    },
    resetIdleTimeout: (state) => {
      state.isActive = true;
      state.isWarning = false;
      state.lastActivity = Date.now();
      state.timeRemaining = state.timeout;
    },
    pauseIdleTimeout: (state) => {
      state.isActive = false;
      state.isWarning = false;
    },
    resumeIdleTimeout: (state) => {
      state.isActive = true;
      state.lastActivity = Date.now();
    },
    disableIdleTimeout: (state) => {
      state.isEnabled = false;
      state.isActive = false;
      state.isWarning = false;
    },
    enableIdleTimeout: (state) => {
      state.isEnabled = true;
      state.isActive = true;
      state.lastActivity = Date.now();
    },
    loginUser: (state) => {
      // Activate idle timeout when user logs in
      state.isActive = state.isEnabled;
      state.lastActivity = Date.now();
      state.isWarning = false;
      state.timeRemaining = state.timeout;
    },
    logoutUser: (state) => {
      // Deactivate idle timeout when user logs out
      state.isActive = false;
      state.isWarning = false;
      state.lastActivity = Date.now();
    }
  },
  extraReducers: (builder) => {
    builder
      // Listen for auth login success
      .addCase('auth/loginUser/fulfilled', (state) => {
        // Activate idle timeout when user logs in
        state.isActive = state.isEnabled;
        state.lastActivity = Date.now();
        state.isWarning = false;
        state.timeRemaining = state.timeout;
      })
      // Listen for auth logout
      .addCase('auth/logoutUser/fulfilled', (state) => {
        // Deactivate idle timeout when user logs out
        state.isActive = false;
        state.isWarning = false;
        state.lastActivity = Date.now();
      })
      // Listen for auth logout action
      .addCase('auth/logout', (state) => {
        // Deactivate idle timeout when user logs out
        state.isActive = false;
        state.isWarning = false;
        state.lastActivity = Date.now();
      });
  }
});

module.exports = idleTimeoutSlice;
