import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { 
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
  resetUI
} from '../slices/uiSlice';

/**
 * Custom hook for UI management
 * Provides UI state and actions
 */
export const useUI = () => {
  const dispatch = useAppDispatch();
  const { 
    theme, 
    sidebarOpen, 
    modals, 
    loading, 
    notifications, 
    layout, 
    errors 
  } = useAppSelector((state) => state.ui);

  const setThemeMode = (newTheme) => dispatch(setTheme(newTheme));
  const toggleThemeMode = () => dispatch(toggleTheme());
  const setSidebarState = (isOpen) => dispatch(setSidebarOpen(isOpen));
  const toggleSidebarState = () => dispatch(toggleSidebar());
  const setModalState = (modal, isOpen) => dispatch(setModal({ modal, isOpen }));
  const openModalState = (modal) => dispatch(openModal(modal));
  const closeModalState = (modal) => dispatch(closeModal(modal));
  const closeAllModalStates = () => dispatch(closeAllModals());
  const setLoadingState = (key, isLoading) => dispatch(setLoading({ key, isLoading }));
  const setNotificationSettings = (settings) => dispatch(setNotifications(settings));
  const setLayoutSettings = (settings) => dispatch(setLayout(settings));
  const setErrorState = (key, error) => dispatch(setError({ key, error }));
  const clearErrorState = (key) => dispatch(clearError(key));
  const resetUIState = () => dispatch(resetUI());

  return {
    // State
    theme,
    sidebarOpen,
    modals,
    loading,
    notifications,
    layout,
    errors,
    
    // Actions
    setTheme: setThemeMode,
    toggleTheme: toggleThemeMode,
    setSidebarOpen: setSidebarState,
    toggleSidebar: toggleSidebarState,
    setModal: setModalState,
    openModal: openModalState,
    closeModal: closeModalState,
    closeAllModals: closeAllModalStates,
    setLoading: setLoadingState,
    setNotifications: setNotificationSettings,
    setLayout: setLayoutSettings,
    setError: setErrorState,
    clearError: clearErrorState,
    resetUI: resetUIState,
  };
};
