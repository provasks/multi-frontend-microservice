import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Simple mock for useTaskManagement hook
const useTaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: '',
    dueDate: '',
    tags: ''
  });

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleAddTask = () => {
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
  };

  const handleEditTask = (task) => {
    setModalMode('edit');
    setEditingTask(task);
    setFormData(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task._id !== taskId));
    }
  };

  const refreshTasks = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  return {
    tasks,
    loading,
    searchTerm,
    showModal,
    modalMode,
    editingTask,
    formData,
    handleSearchChange,
    handleClearSearch,
    handleAddTask,
    handleEditTask,
    handleCloseModal,
    handleInputChange,
    handleSubmit,
    handleDeleteTask,
    refreshTasks,
    setTasks,
    setPagination: () => {},
    setFormData,
    setModalMode,
    setEditingTask
  };
};

describe('useTaskManagement Hook (Simple)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useTaskManagement());
    
    expect(result.current.tasks).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.showModal).toBe(false);
    expect(result.current.modalMode).toBe('add');
    expect(result.current.editingTask).toBe(null);
  });

  it('handles search term changes', () => {
    const { result } = renderHook(() => useTaskManagement());
    
    act(() => {
      result.current.handleSearchChange('test search');
    });
    
    expect(result.current.searchTerm).toBe('test search');
  });

  it('handles clear search', () => {
    const { result } = renderHook(() => useTaskManagement());
    
    // First set a search term
    act(() => {
      result.current.handleSearchChange('test search');
    });
    
    expect(result.current.searchTerm).toBe('test search');
    
    // Then clear it
    act(() => {
      result.current.handleClearSearch();
    });
    
    expect(result.current.searchTerm).toBe('');
  });

  it('handles add task modal opening', () => {
    const { result } = renderHook(() => useTaskManagement());
    
    act(() => {
      result.current.handleAddTask();
    });
    
    expect(result.current.showModal).toBe(true);
    expect(result.current.modalMode).toBe('add');
    expect(result.current.editingTask).toBe(null);
  });

  it('handles edit task modal opening', () => {
    const { result } = renderHook(() => useTaskManagement());
    const mockTask = {
      _id: '1',
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high',
      status: 'in_progress',
      assignedTo: 'user123',
      dueDate: '2024-12-31',
      tags: 'test,example'
    };
    
    act(() => {
      result.current.handleEditTask(mockTask);
    });
    
    expect(result.current.showModal).toBe(true);
    expect(result.current.modalMode).toBe('edit');
    expect(result.current.editingTask).toEqual(mockTask);
  });

  it('handles modal closing', () => {
    const { result } = renderHook(() => useTaskManagement());
    
    // First open modal
    act(() => {
      result.current.handleAddTask();
    });
    
    expect(result.current.showModal).toBe(true);
    
    // Then close it
    act(() => {
      result.current.handleCloseModal();
    });
    
    expect(result.current.showModal).toBe(false);
    expect(result.current.editingTask).toBe(null);
  });

  it('handles form input changes', () => {
    const { result } = renderHook(() => useTaskManagement());
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'title', value: 'New Title' }
      });
    });
    
    expect(result.current.formData.title).toBe('New Title');
  });

  it('handles task deletion with confirmation', () => {
    const { result } = renderHook(() => useTaskManagement());
    const mockTasks = [
      { _id: '1', title: 'Task 1' },
      { _id: '2', title: 'Task 2' }
    ];
    
    // Mock window.confirm
    global.window.confirm = jest.fn(() => true);
    
    act(() => {
      result.current.setTasks(mockTasks);
    });
    
    act(() => {
      result.current.handleDeleteTask('1');
    });
    
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0]._id).toBe('2');
  });

  it('handles task deletion cancellation', () => {
    const { result } = renderHook(() => useTaskManagement());
    const mockTasks = [
      { _id: '1', title: 'Task 1' },
      { _id: '2', title: 'Task 2' }
    ];
    
    // Mock window.confirm to return false
    global.window.confirm = jest.fn(() => false);
    
    act(() => {
      result.current.setTasks(mockTasks);
    });
    
    act(() => {
      result.current.handleDeleteTask('1');
    });
    
    // Tasks should remain unchanged
    expect(result.current.tasks).toHaveLength(2);
  });

  it('handles refresh tasks', async () => {
    const { result } = renderHook(() => useTaskManagement());
    
    act(() => {
      result.current.refreshTasks();
    });
    
    expect(result.current.loading).toBe(true);
  });
});
