import { createSelector } from 'reselect';

// Basic selectors
const selectAuthState = (state) => state.auth;

// Memoized selectors
export const selectUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

export const selectAuthToken = createSelector(
  [selectAuthState],
  (auth) => auth.token
);

export const selectAuthLoading = createSelector(
  [selectAuthState],
  (auth) => auth.isLoading
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (auth) => auth.error
);

export const selectLastLogin = createSelector(
  [selectAuthState],
  (auth) => auth.lastLogin
);

export const selectUserRole = createSelector(
  [selectUser],
  (user) => user?.role || 'user'
);

export const selectUserId = createSelector(
  [selectUser],
  (user) => user?.id
);

export const selectUserName = createSelector(
  [selectUser],
  (user) => user ? `${user.firstName} ${user.lastName}` : null
);

export const selectUserEmail = createSelector(
  [selectUser],
  (user) => user?.email
);

export const selectIsAdmin = createSelector(
  [selectUserRole],
  (role) => role === 'admin'
);

export const selectIsModerator = createSelector(
  [selectUserRole],
  (role) => role === 'moderator' || role === 'admin'
);
