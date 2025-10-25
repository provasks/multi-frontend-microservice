const { configureStore } = require('@reduxjs/toolkit');
const { persistStore, persistReducer } = require('redux-persist');
const storage = require('redux-persist/lib/storage');
const { combineReducers } = require('@reduxjs/toolkit');

// Import slices
const authSlice = require('./slices/authSlice');
const tasksSlice = require('./slices/tasksSlice');
const notificationsSlice = require('./slices/notificationsSlice');
const uiSlice = require('./slices/uiSlice');

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'], // Only persist auth and UI state
  blacklist: ['tasks', 'notifications'], // Don't persist these as they're fetched fresh
};

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice.default,
  tasks: tasksSlice.default,
  notifications: notificationsSlice.default,
  ui: uiSlice.default,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Persistor
const persistor = persistStore(store);

// Export types for TypeScript support (commented out for now)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// Export store for microfrontends
if (typeof window !== 'undefined') {
  window.__REDUX_STORE__ = store;
  window.__REDUX_PERSISTOR__ = persistor;
}

// Export for CommonJS
module.exports = {
  store,
  persistor
};
