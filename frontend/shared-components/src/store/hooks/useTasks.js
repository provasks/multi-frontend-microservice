import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  getTaskById,
  setFilters,
  clearFilters,
  setPagination,
  clearError 
} from '../slices/tasksSlice';

/**
 * Custom hook for tasks management
 * Provides tasks state and actions
 */
export const useTasks = () => {
  const dispatch = useAppDispatch();
  const { 
    items: tasks, 
    currentTask, 
    filters, 
    pagination, 
    isLoading, 
    isCreating, 
    isUpdating, 
    isDeleting, 
    error 
  } = useAppSelector((state) => state.tasks);

  const getTasks = (params) => dispatch(fetchTasks(params));
  const createNewTask = (taskData) => dispatch(createTask(taskData));
  const updateExistingTask = (id, taskData) => dispatch(updateTask({ id, taskData }));
  const deleteExistingTask = (id) => dispatch(deleteTask(id));
  const getTask = (id) => dispatch(getTaskById(id));
  const setTaskFilters = (newFilters) => dispatch(setFilters(newFilters));
  const clearTaskFilters = () => dispatch(clearFilters());
  const setTaskPagination = (newPagination) => dispatch(setPagination(newPagination));
  const clearTaskError = () => dispatch(clearError());

  return {
    // State
    tasks,
    currentTask,
    filters,
    pagination,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    
    // Actions
    getTasks,
    createTask: createNewTask,
    updateTask: updateExistingTask,
    deleteTask: deleteExistingTask,
    getTask,
    setFilters: setTaskFilters,
    clearFilters: clearTaskFilters,
    setPagination: setTaskPagination,
    clearError: clearTaskError,
  };
};
