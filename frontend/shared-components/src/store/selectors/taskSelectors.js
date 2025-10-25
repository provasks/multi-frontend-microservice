import { createSelector } from 'reselect';

// Basic selectors
const selectTasksState = (state) => state.tasks;

// Memoized selectors
export const selectAllTasks = createSelector(
  [selectTasksState],
  (tasks) => tasks.items
);

export const selectCurrentTask = createSelector(
  [selectTasksState],
  (tasks) => tasks.currentTask
);

export const selectTasksLoading = createSelector(
  [selectTasksState],
  (tasks) => tasks.isLoading
);

export const selectTasksError = createSelector(
  [selectTasksState],
  (tasks) => tasks.error
);

export const selectTasksFilters = createSelector(
  [selectTasksState],
  (tasks) => tasks.filters
);

export const selectTasksPagination = createSelector(
  [selectTasksState],
  (tasks) => tasks.pagination
);

export const selectTaskById = (id) => createSelector(
  [selectAllTasks],
  (tasks) => tasks.find(task => task.id === id)
);

export const selectTasksByStatus = (status) => createSelector(
  [selectAllTasks],
  (tasks) => tasks.filter(task => task.status === status)
);

export const selectTasksByPriority = (priority) => createSelector(
  [selectAllTasks],
  (tasks) => tasks.filter(task => task.priority === priority)
);

export const selectTasksByUser = (userId) => createSelector(
  [selectAllTasks],
  (tasks) => tasks.filter(task => task.assignedTo === userId)
);

export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectTasksFilters],
  (tasks, filters) => {
    return tasks.filter(task => {
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.assignedTo !== 'all' && task.assignedTo !== filters.assignedTo) return false;
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) && 
          !task.description?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }
);

export const selectTasksStats = createSelector(
  [selectAllTasks],
  (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const highPriority = tasks.filter(task => task.priority === 'high').length;
    const overdue = tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
    ).length;

    return {
      total,
      completed,
      pending,
      inProgress,
      highPriority,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }
);

export const selectTasksByDateRange = (startDate, endDate) => createSelector(
  [selectAllTasks],
  (tasks) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= start && taskDate <= end;
    });
  }
);
