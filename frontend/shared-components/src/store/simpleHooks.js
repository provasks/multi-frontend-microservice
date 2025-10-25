const { useDispatch, useSelector } = require('react-redux');
const useIdleTimeout = require('./hooks/useIdleTimeout');

// Simple auth hook
const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  
  const login = (credentials) => {
    dispatch({ type: 'auth/loginStart' });
    // Simulate API call
    setTimeout(() => {
      dispatch({ 
        type: 'auth/loginSuccess', 
        payload: { 
          user: { id: 1, name: credentials.email }, 
          token: 'mock-token' 
        } 
      });
    }, 1000);
  };
  
  const logout = () => {
    dispatch({ type: 'auth/logout' });
  };
  
  const clearError = () => {
    dispatch({ type: 'auth/clearError' });
  };
  
  return {
    ...auth,
    login,
    logout,
    clearError
  };
};

// Simple tasks hook
const useTasks = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks);
  
  const setTasks = (tasksList) => {
    dispatch({ type: 'tasks/setTasks', payload: tasksList });
  };
  
  const addTask = (task) => {
    dispatch({ type: 'tasks/addTask', payload: task });
  };
  
  const updateTask = (task) => {
    dispatch({ type: 'tasks/updateTask', payload: task });
  };
  
  const deleteTask = (taskId) => {
    dispatch({ type: 'tasks/deleteTask', payload: taskId });
  };
  
  const setLoading = (isLoading) => {
    dispatch({ type: 'tasks/setLoading', payload: isLoading });
  };
  
  const setError = (error) => {
    dispatch({ type: 'tasks/setError', payload: error });
  };
  
  return {
    ...tasks,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    setLoading,
    setError
  };
};

// Simple notifications hook
const useNotifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications);
  
  const setNotifications = (notificationsList) => {
    dispatch({ type: 'notifications/setNotifications', payload: notificationsList });
  };
  
  const addNotification = (notification) => {
    dispatch({ type: 'notifications/addNotification', payload: notification });
  };
  
  const markAsRead = (notificationId) => {
    dispatch({ type: 'notifications/markAsRead', payload: notificationId });
  };
  
  const setLoading = (isLoading) => {
    dispatch({ type: 'notifications/setLoading', payload: isLoading });
  };
  
  const setError = (error) => {
    dispatch({ type: 'notifications/setError', payload: error });
  };
  
  return {
    ...notifications,
    setNotifications,
    addNotification,
    markAsRead,
    setLoading,
    setError
  };
};

// Simple UI hook
const useUI = () => {
  const dispatch = useDispatch();
  const ui = useSelector(state => state.ui);
  
  const setTheme = (theme) => {
    dispatch({ type: 'ui/setTheme', payload: theme });
  };
  
  const toggleSidebar = () => {
    dispatch({ type: 'ui/toggleSidebar' });
  };
  
  const setLoading = (key, isLoading) => {
    dispatch({ type: 'ui/setLoading', payload: { key, isLoading } });
  };
  
  return {
    ...ui,
    setTheme,
    toggleSidebar,
    setLoading
  };
};

module.exports = {
  useAuth,
  useTasks,
  useNotifications,
  useUI,
  useIdleTimeout
};
