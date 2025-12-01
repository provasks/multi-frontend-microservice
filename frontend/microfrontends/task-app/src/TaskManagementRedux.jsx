import React, { useEffect } from 'react';
import TaskTable from './components/TaskTable';
import TaskModal from './components/TaskModal';
import SearchBar from 'sharedComponents/SearchBar';
import LoadingSpinner from 'sharedComponents/LoadingSpinner';
import './TaskManagement.css';

// Temporary inline skeleton component
const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="table-skeleton">
    <div className="skeleton-header">
      {Array.from({ length: columns }).map((_, index) => (
        <div key={index} className="skeleton-header-cell" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="skeleton-row">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={colIndex} className="skeleton-cell" />
        ))}
      </div>
    ))}
  </div>
);

const TaskManagementRedux = () => {
  // Try to use Redux hooks if available
  let useTasks, useAuth, useUI;
  let tasks, auth, ui;
  let taskActions, authActions, uiActions;
  
  try {
    const ReduxHooks = require('sharedComponents/store/hooks');
    useTasks = ReduxHooks.useTasks;
    useAuth = ReduxHooks.useAuth;
    useUI = ReduxHooks.useUI;
    
    // Use Redux hooks
    tasks = useTasks();
    auth = useAuth();
    ui = useUI();
    
    console.log('✅ Using Redux for state management');
  } catch (error) {
    console.warn('Redux not available, falling back to local state:', error.message);
    // Fallback to local state
    const [localTasks, setLocalTasks] = React.useState([]);
    const [localLoading, setLocalLoading] = React.useState(false);
    const [localError, setLocalError] = React.useState(null);
    
    tasks = {
      items: localTasks,
      isLoading: localLoading,
      error: localError,
      setTasks: setLocalTasks,
      setLoading: setLocalLoading,
      setError: setLocalError,
      addTask: (task) => setLocalTasks(prev => [task, ...prev]),
      updateTask: (updatedTask) => setLocalTasks(prev => 
        prev.map(task => task.id === updatedTask.id ? updatedTask : task)
      ),
      deleteTask: (taskId) => setLocalTasks(prev => 
        prev.filter(task => task.id !== taskId)
      )
    };
    
    auth = { isAuthenticated: true, user: { id: 1, name: 'User' } };
    ui = { theme: 'light', sidebarOpen: true };
  }

  // Local state for modal and search
  const [showModal, setShowModal] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [filterPriority, setFilterPriority] = React.useState('all');

  // Load tasks on component mount
  useEffect(() => {
    if (tasks.setLoading) {
      tasks.setLoading(true);
    }
    
    // Simulate API call
    setTimeout(() => {
      const mockTasks = [
        {
          id: 1,
          title: 'Complete project documentation',
          description: 'Write comprehensive documentation for the project',
          status: 'in-progress',
          priority: 'high',
          assignedTo: 'John Doe',
          dueDate: '2024-01-20',
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          title: 'Review code changes',
          description: 'Review all pending code changes',
          status: 'pending',
          priority: 'medium',
          assignedTo: 'Jane Smith',
          dueDate: '2024-01-18',
          createdAt: '2024-01-14'
        },
        {
          id: 3,
          title: 'Update dependencies',
          description: 'Update all project dependencies to latest versions',
          status: 'completed',
          priority: 'low',
          assignedTo: 'Mike Johnson',
          dueDate: '2024-01-16',
          createdAt: '2024-01-13'
        }
      ];
      
      if (tasks.setTasks) {
        tasks.setTasks(mockTasks);
      }
      if (tasks.setLoading) {
        tasks.setLoading(false);
      }
    }, 1000);
  }, []);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.items?.filter(task => {
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];

  const handleAddTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      // Update existing task
      if (tasks.updateTask) {
        tasks.updateTask({ ...taskData, id: editingTask.id });
      }
    } else {
      // Add new task
      if (tasks.addTask) {
        tasks.addTask({ ...taskData, id: Date.now() });
      }
    }
    setShowModal(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      if (tasks.deleteTask) {
        tasks.deleteTask(taskId);
      }
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };

  const handlePriorityFilter = (priority) => {
    setFilterPriority(priority);
  };

  if (tasks.isLoading) {
    return (
      <div className="p-4">
        <div className="d-flex justify-content-center align-items-center loading-container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (tasks.error) {
    return (
      <div className="p-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{tasks.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Task Management {tasks.items ? `(${tasks.items.length})` : ''}</h2>
            <button 
              className="btn btn-primary"
              onClick={handleAddTask}
            >
              Add Task
            </button>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search tasks..."
              />
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filterStatus}
                onChange={(e) => handleStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filterPriority}
                onChange={(e) => handlePriorityFilter(e.target.value)}
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          {filteredTasks.length === 0 ? (
            <div className="text-center py-5">
              <h5>No tasks found</h5>
              <p className="text-muted">
                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first task'
                }
              </p>
            </div>
          ) : (
            <TaskTable 
              tasks={filteredTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
        </div>
      </div>
      
      {showModal && (
        <TaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default TaskManagementRedux;
