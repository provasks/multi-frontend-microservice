import React from 'react';
import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  pageSize, 
  hasNext, 
  hasPrev, 
  onPageChange, 
  onPageSizeChange 
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalPages <= 1) {
    return (
      <div className="pagination-info">
        <span className="text-muted">
          Showing {totalItems} of {totalItems} items
        </span>
      </div>
    );
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span className="text-muted">
          Showing {startItem}-{endItem} of {totalItems} items
        </span>
        <div className="page-size-selector">
          <label htmlFor="pageSize" className="form-label me-2">Items per page:</label>
          <select
            id="pageSize"
            className="form-select form-select-sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            style={{ width: 'auto' }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      
      <nav aria-label="Task pagination">
        <ul className="pagination">
          <li className={`page-item ${!hasPrev ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!hasPrev}
              aria-label="Previous page"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          </li>
          
          {pageNumbers.map((page, index) => (
            <li key={index} className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
              {page === '...' ? (
                <span className="page-link">...</span>
              ) : (
                <button
                  className="page-link"
                  onClick={() => onPageChange(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </li>
          ))}
          
          <li className={`page-item ${!hasNext ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasNext}
              aria-label="Next page"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
