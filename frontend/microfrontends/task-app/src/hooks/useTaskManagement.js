import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { useAuth } from 'sharedComponents/useAuth';
import { apiHelpers } from 'sharedComponents/unifiedApiClient';

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('unknown');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: ''
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { isAuthenticated } = useAuth();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setApiStatus('loading');
      
      if (!isAuthenticated()) {
        setApiStatus('error');
        setLoading(false);
        if (window.showError) {
          window.showError('Please log in to view tasks');
        }
        return;
      }

      // Use unified API client
      const data = await apiHelpers.fetchTasks();
      const tasksData = data.tasks || data || [];
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setApiStatus('connected');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setApiStatus('error');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = useCallback(() => {
    setModalMode('add');
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      assignedTo: ''
    });
    setShowModal(true);
  }, []);

  const handleEditTask = useCallback((task) => {
    setModalMode('edit');
    setEditingTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      assignedTo: task.assignedTo || ''
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

      // Use unified API client
      if (modalMode === 'add') {
        await apiHelpers.createTask(apiData);
      } else {
        await apiHelpers.updateTask(editingTask._id, apiData);
      }
      
      if (window.showSuccess) {
        window.showSuccess(modalMode === 'add' ? 'Task created successfully!' : 'Task updated successfully!');
      }
      fetchTasks();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving task:', error);
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

  const filteredTasks = useMemo(() => {
    if (!debouncedSearchTerm) return tasks;
    
    return tasks.filter(task => 
      task.title?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      task.status?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      task.priority?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [tasks, debouncedSearchTerm]);

  return {
    // State
    tasks,
    loading,
    apiStatus,
    showModal,
    editingTask,
    modalMode,
    searchTerm,
    formData,
    filteredTasks,
    taskStats,
    
    // Actions
    fetchTasks,
    handleAddTask,
    handleEditTask,
    handleDeleteTask,
    handleSubmit,
    handleInputChange,
    handleCloseModal,
    handleSearchChange,
    handleClearSearch
  };
};
