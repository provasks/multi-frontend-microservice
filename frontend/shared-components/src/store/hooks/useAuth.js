import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getCurrentUser,
  clearError 
} from '../slices/authSlice';

/**
 * Custom hook for authentication
 * Provides auth state and actions
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error, lastLogin } = useAppSelector(
    (state) => state.auth
  );

  const login = (credentials) => dispatch(loginUser(credentials));
  const register = (userData) => dispatch(registerUser(userData));
  const logout = () => dispatch(logoutUser());
  const getCurrentUserData = () => dispatch(getCurrentUser());
  const clearAuthError = () => dispatch(clearError());

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    lastLogin,
    
    // Actions
    login,
    register,
    logout,
    getCurrentUser: getCurrentUserData,
    clearError: clearAuthError,
  };
};
