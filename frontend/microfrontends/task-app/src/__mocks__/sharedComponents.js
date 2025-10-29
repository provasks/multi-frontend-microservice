// Mock shared components for testing
export const SearchBar = ({ searchTerm, onSearchChange, onClearSearch, totalCount, filteredCount, searchLoading }) => (
  <div data-testid="search-bar">
    <input
      data-testid="search-input"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search..."
    />
    <button data-testid="clear-search" onClick={onClearSearch}>
      Clear
    </button>
    <span data-testid="search-count">
      {filteredCount} of {totalCount}
    </span>
    {searchLoading && <span data-testid="search-loading">Loading...</span>}
  </div>
);

export const LoadingSpinner = () => (
  <div data-testid="loading-spinner">Loading...</div>
);

export const useAuth = () => ({
  isAuthenticated: jest.fn(() => true),
  user: { id: 'user123', name: 'Test User' },
  login: jest.fn(),
  logout: jest.fn(),
});

export const apiHelpers = {
  fetchTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  fetchUsers: jest.fn(),
};

export const TASK_CONSTANTS = {
  DEFAULT_FORM: {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: '',
    dueDate: '',
    tags: ''
  },
  PRIORITIES: ['low', 'medium', 'high', 'urgent'],
  STATUSES: ['pending', 'in_progress', 'completed', 'cancelled']
};
