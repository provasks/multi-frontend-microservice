import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { useAuth } from 'sharedComponents/useAuth';

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
  const { makeAuthenticatedRequest, isAuthenticated } = useAuth();

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

      const response = await makeAuthenticatedRequest('http://localhost:3001/api/tasks');
      
      if (response.ok) {
        const data = await response.json();
        const tasksData = data.tasks || data || [];
        const serverTasks = Array.isArray(tasksData) ? tasksData : [];
        
        setTasks(serverTasks);
        setApiStatus('connected');
      } else {
        setApiStatus('error');
        setTasks([]);
        if (window.showError) {
          window.showError('Failed to fetch tasks. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setApiStatus('error');
      setTasks([]);
      if (window.showError) {
        window.showError('Error fetching tasks. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  }, [makeAuthenticatedRequest, isAuthenticated]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      const url = modalMode === 'add' 
        ? 'http://localhost:3001/api/tasks'
        : `http://localhost:3001/api/tasks/${editingTask._id}`;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      const response = await makeAuthenticatedRequest(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        if (window.showSuccess) {
          window.showSuccess(
            modalMode === 'add' 
              ? 'Task created successfully!' 
              : 'Task updated successfully!'
          );
        }
        fetchTasks();
        setShowModal(false);
      } else {
        const errorData = await response.json();
        if (window.showError) {
          window.showError(errorData.error || 'Failed to save task');
        }
      }
    } catch (error) {
      console.error('Error saving task:', error);
      if (window.showError) {
        window.showError('Error saving task. Please try again.');
      }
    }
  }, [formData, modalMode, editingTask, makeAuthenticatedRequest, fetchTasks]);

  const handleDelete = useCallback(async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await makeAuthenticatedRequest(
        `http://localhost:3001/api/tasks/${taskId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        if (window.showSuccess) {
          window.showSuccess('Task deleted successfully!');
        }
        fetchTasks();
      } else {
        if (window.showError) {
          window.showError('Failed to delete task');
        }
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      if (window.showError) {
        window.showError('Error deleting task. Please try again.');
      }
    }
  }, [makeAuthenticatedRequest, fetchTasks]);

  // ... rest of the hook logic remains the same

  return {
    // State
    tasks,
    loading,
    apiStatus,
    showModal,
    editingTask,
    modalMode,
    formData,
    
    // Actions
    fetchTasks,
    handleSubmit,
    handleDelete,
    // ... other handlers
  };
};
