import React from 'react';

const SearchBar = React.memo(({ 
  searchTerm, 
  onSearchChange, 
  onClearSearch, 
  totalCount, 
  filteredCount,
  placeholder = "Search...",
  showCount = true
}) => {
  return (
    <div className="row mb-3">
      <div className="col-md-6">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="btn btn-outline-secondary" 
              onClick={onClearSearch}
              title="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>
      {showCount && (
        <div className="col-md-6">
          <div className="d-flex justify-content-end align-items-center">
            <small className="text-muted">
              Showing {filteredCount} of {totalCount} items
            </small>
          </div>
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
