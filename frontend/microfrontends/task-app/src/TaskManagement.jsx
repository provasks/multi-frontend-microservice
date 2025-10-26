import React from 'react';
import { useTaskManagement } from './hooks/useTaskManagement';
import TaskTable from './components/TaskTable';
import TaskModal from './components/TaskModal';
import Pagination from './components/Pagination';
import SearchBar from 'sharedComponents/SearchBar';
import LoadingSpinner from 'sharedComponents/LoadingSpinner';
import './components/TableSkeleton.css';

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

const TaskManagement = () => {
  const {
    // State
    tasks,
    loading,
    refreshing,
    showModal,
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
  } = useTaskManagement();

  if (loading) {
    return (
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-0">
              <i className="fas fa-tasks me-2"></i>
              Task Management
            </h2>
          </div>
        </div>
        <TableSkeleton rows={5} columns={5} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
              <h2 className="mb-0">
                <i className="fas fa-tasks me-2"></i>
                Task Management
              </h2>
        </div>
        <div>
          <button className="btn btn-primary me-2" onClick={handleAddTask}>
            <i className="fas fa-plus me-1"></i>
            Add Task
          </button>
          <button 
            className="btn btn-outline-primary" 
            onClick={refreshTasks}
            disabled={refreshing}
          >
            <i className={`fas fa-sync-alt me-1 ${refreshing ? 'fa-spin' : ''}`}></i>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        totalCount={pagination.totalTasks || 0}
        filteredCount={tasks.length}
      />

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            Tasks ({pagination.totalTasks || tasks.length})
            {pagination.totalPages > 1 && (
              <span className="text-muted ms-2">
                - Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            )}
          </h5>
        </div>
        <div className="card-body">
          <TaskTable
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
          
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalTasks}
            pageSize={pageSize}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>

      <TaskModal
        show={showModal}
        mode={modalMode}
        formData={formData}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
      />
    </div>
  );
};

export default TaskManagement;