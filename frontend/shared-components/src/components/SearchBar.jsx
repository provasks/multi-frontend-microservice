import React, { useCallback, useRef } from 'react';

const SearchBar = React.memo(({ 
  searchTerm, 
  onSearchChange, 
  onClearSearch, 
  totalCount, 
  filteredCount,
  placeholder = "Search...",
  showCount = true,
  searchLoading = false
}) => {
  const inputRef = useRef(null);

  const handleInputChange = useCallback((e) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  const handleClearClick = useCallback(() => {
    onClearSearch();
    // Maintain focus after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [onClearSearch]);
  return (
    <div className="row mb-3">
      <div className="col-md-6">
        <div className="input-group">
                 <span className="input-group-text">
                   {searchLoading ? (
                     <div className="spinner-border spinner-border-sm" role="status">
                       <span className="visually-hidden">Searching...</span>
                     </div>
                   ) : (
                     <i className="fas fa-search" data-testid="search-icon"></i>
                   )}
                 </span>
          <input
            ref={inputRef}
            type="text"
            className="form-control"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
          />
          {searchTerm && (
            <button 
              className="btn btn-outline-secondary" 
              onClick={handleClearClick}
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
