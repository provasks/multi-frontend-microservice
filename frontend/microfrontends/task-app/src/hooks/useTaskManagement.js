import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { useAuth } from 'sharedComponents/useAuth';
import { apiHelpers } from 'sharedComponents/unifiedApiClient';
import { TASK_CONSTANTS } from 'sharedComponents/constants';

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiStatus, setApiStatus] = useState('unknown');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState(TASK_CONSTANTS.DEFAULT_FORM);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    hasNext: false,
    hasPrev: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { isAuthenticated } = useAuth();

  const fetchTasks = useCallback(async (isRefresh = false, page = currentPage, limit = pageSize) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setApiStatus('loading');
      
      if (!isAuthenticated()) {
        setApiStatus('error');
        setLoading(false);
        setRefreshing(false);
        if (window.showError) {
          window.showError('Please log in to view tasks');
        }
        return;
      }

      // Prepare filters
      const filters = {};
      if (debouncedSearchTerm) {
        filters.search = debouncedSearchTerm;
      }

      // Use unified API client with pagination
      const data = await apiHelpers.fetchTasks(page, limit, filters);
      const tasksData = data.tasks || data || [];
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      
      // Update pagination state
      if (data.pagination) {
        setPagination(data.pagination);
      }
      
      setApiStatus('connected');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setApiStatus('error');
      setTasks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated, currentPage, pageSize, debouncedSearchTerm]);

  useEffect(() => {
    fetchTasks();
  }, [currentPage, pageSize, debouncedSearchTerm]);

  const handleAddTask = useCallback(() => {
    setModalMode('add');
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      assignedTo: '',
      dueDate: '',
      tags: ''
    });
    setShowModal(true);
  }, []);

  const handleEditTask = useCallback((task) => {
    setModalMode('edit');
    setEditingTask(task);
    
    // Format dueDate for datetime-local input (YYYY-MM-DDTHH:MM)
    let formattedDueDate = '';
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      formattedDueDate = dueDate.toISOString().slice(0, 16);
    }
    
    // Format tags array as comma-separated string
    let formattedTags = '';
    if (task.tags && Array.isArray(task.tags)) {
      formattedTags = task.tags.join(', ');
    }
    
    setFormData({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      assignedTo: task.assignedTo || '',
      dueDate: formattedDueDate,
      tags: formattedTags
    });
    setShowModal(true);
  }, []);

  const handleDeleteTask = useCallback(async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      if (!isAuthenticated()) {
        setTasks(tasks.filter(task => task._id !== taskId));
        if (window.showSuccess) {
          window.showSuccess('Task deleted successfully (demo mode)!');
        }
        return;
      }

      // Use unified API client
      await apiHelpers.deleteTask(taskId);
      if (window.showSuccess) {
        window.showSuccess('Task deleted successfully!');
      }
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      
      // Handle backend errors
      if (error.response?.data?.error) {
        if (window.showError) {
          window.showError(error.response.data.error);
        }
      } else {
        if (window.showError) {
          window.showError(error.message || 'Failed to delete task. Please try again.');
        }
      }
    }
  }, [tasks, fetchTasks, isAuthenticated]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      if (!isAuthenticated()) {
        if (modalMode === 'add') {
          const newTask = {
            _id: Date.now().toString(),
            ...formData,
            createdAt: new Date()
          };
          setTasks([...tasks, newTask]);
          if (window.showSuccess) {
            window.showSuccess('Task created successfully (demo mode)!');
          }
        } else {
          setTasks(tasks.map(task => 
            task._id === editingTask._id 
              ? { ...task, ...formData }
              : task
          ));
          if (window.showSuccess) {
            window.showSuccess('Task updated successfully (demo mode)!');
          }
        }
        setShowModal(false);
        return;
      }

      const apiData = { ...formData };
      
      // Handle assignedTo field
      if (!apiData.assignedTo || apiData.assignedTo.trim() === '') {
        const currentUserId = sessionStorage.getItem('userId') || '68f8370ab2ce0e1946772c30';
        apiData.assignedTo = currentUserId;
      } else {
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!objectIdRegex.test(apiData.assignedTo.trim())) {
          if (window.showError) {
            window.showError('Invalid User ID format. Please enter a valid 24-character ID or leave empty.');
          }
          return;
        }
        apiData.assignedTo = apiData.assignedTo.trim();
      }

      // Handle dueDate field - set default to 6 hours from assignment time if not provided
      if (apiData.dueDate && apiData.dueDate.trim() !== '') {
        // Convert datetime-local format to ISO string
        const dueDate = new Date(apiData.dueDate);
        apiData.dueDate = dueDate.toISOString();
      } else {
        // Set default due date to 6 hours from now (assignment time)
        const defaultDueDate = new Date();
        defaultDueDate.setHours(defaultDueDate.getHours() + 6);
        apiData.dueDate = defaultDueDate.toISOString();
      }

      // Handle tags field - convert string to array if provided
      if (apiData.tags && typeof apiData.tags === 'string') {
        if (apiData.tags.trim() === '') {
          // Remove tags field entirely if empty
          delete apiData.tags;
        } else {
          apiData.tags = apiData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
      } else if (!apiData.tags || (Array.isArray(apiData.tags) && apiData.tags.length === 0)) {
        // Remove tags field if it's empty or undefined
        delete apiData.tags;
      }

      // Debug: Log the data being sent
      console.log('Sending task data:', {
        mode: modalMode,
        taskId: editingTask?._id,
        data: apiData
      });

      // Use unified API client
      if (modalMode === 'add') {
        await apiHelpers.createTask(apiData);
      } else {
        await apiHelpers.updateTask(editingTask._id, apiData);
      }
      
      if (window.showSuccess) {
        window.showSuccess(modalMode === 'add' ? 'Task created successfully!' : 'Task updated successfully!');
      }
      
      // Reset form data
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        assignedTo: '',
        dueDate: '',
        tags: ''
      });
      setEditingTask(null);
      
      fetchTasks();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving task:', error);
      
      // Handle validation errors from backend
      if (error.response?.status === 400 && error.response?.data?.errors) {
        // Extract validation error messages
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        if (window.showError) {
          window.showError(`Validation Error: ${errorMessages}`);
        }
      } else if (error.response?.data?.error) {
        // Handle other backend errors
        if (window.showError) {
          window.showError(error.response.data.error);
        }
      } else {
        // Handle network or other errors
        if (window.showError) {
          window.showError(error.message || 'An error occurred. Please try again.');
        }
      }
    }
  }, [formData, modalMode, editingTask, fetchTasks, tasks, isAuthenticated]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Memoized calculations
  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter(task => task.status === 'pending').length,
      inProgress: tasks.filter(task => task.status === 'in_progress').length,
      completed: tasks.filter(task => task.status === 'completed').length,
      highPriority: tasks.filter(task => task.priority === 'high' || task.priority === 'urgent').length
    };
  }, [tasks]);

  // No client-side filtering needed since we're using server-side pagination
  const filteredTasks = tasks;

  // Separate refresh function that doesn't cause flickering
  const refreshTasks = useCallback(() => {
    fetchTasks(true);
  }, [fetchTasks]);

  // Pagination control functions
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    fetchTasks(false, newPage, pageSize);
  }, [fetchTasks, pageSize]);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
    fetchTasks(false, 1, newPageSize);
  }, [fetchTasks]);

  const goToNextPage = useCallback(() => {
    if (pagination.hasNext) {
      handlePageChange(currentPage + 1);
    }
  }, [pagination.hasNext, currentPage, handlePageChange]);

  const goToPrevPage = useCallback(() => {
    if (pagination.hasPrev) {
      handlePageChange(currentPage - 1);
    }
  }, [pagination.hasPrev, currentPage, handlePageChange]);

  return {
    // State
    tasks,
    loading,
    refreshing,
    apiStatus,
    showModal,
    editingTask,
    modalMode,
    searchTerm,
    formData,
    filteredTasks,
    taskStats,
    pagination,
    currentPage,
    pageSize,
    
    // Actions
    fetchTasks,
    refreshTasks,
    handleAddTask,
    handleEditTask,
    handleDeleteTask,
    handleSubmit,
    handleInputChange,
    handleCloseModal,
    handleSearchChange,
    handleClearSearch,
    
    // Pagination actions
    handlePageChange,
    handlePageSizeChange,
    goToNextPage,
    goToPrevPage
  };
};
