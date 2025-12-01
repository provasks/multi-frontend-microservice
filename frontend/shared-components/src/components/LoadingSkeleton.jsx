import React from 'react';
import './LoadingSkeleton.css';

/**
 * Loading skeleton component for better UX
 */
const LoadingSkeleton = ({ type = 'text', lines = 3, width = '100%', height = '20px' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className="skeleton-text" style={{ width, height }} data-testid="skeleton-text">
            {Array.from({ length: lines }).map((_, index) => (
              <div key={index} className="skeleton-line" data-testid="skeleton-line" />
            ))}
          </div>
        );
      
      case 'table':
        return (
          <div className="skeleton-table" data-testid="skeleton-table">
            {Array.from({ length: lines }).map((_, index) => (
              <div key={index} className="skeleton-row" data-testid="skeleton-row">
                <div className="skeleton-cell" style={{ width: '20%' }} />
                <div className="skeleton-cell" style={{ width: '30%' }} />
                <div className="skeleton-cell" style={{ width: '20%' }} />
                <div className="skeleton-cell" style={{ width: '15%' }} />
                <div className="skeleton-cell" style={{ width: '15%' }} />
              </div>
            ))}
          </div>
        );
      
      case 'card':
        return (
          <div className="skeleton-card" style={{ width, height }} data-testid="skeleton-card">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-content" />
            <div className="skeleton-line skeleton-content" />
          </div>
        );
      
      case 'button':
        return (
          <div className="skeleton-button" style={{ width, height }} data-testid="skeleton-button" />
        );
      
      case 'avatar':
        return (
          <div className="skeleton-avatar" style={{ width, height }} data-testid="skeleton-avatar" />
        );
      
      default:
        return <div className="skeleton-default" style={{ width, height }} data-testid="skeleton-default" />;
    }
  };

  return (
    <div className="loading-skeleton" data-testid="loading-skeleton">
      {renderSkeleton()}
    </div>
  );
};

/**
 * Table skeleton for data tables
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="table-skeleton" data-testid="table-skeleton">
    <div className="skeleton-header">
      {Array.from({ length: columns }).map((_, index) => (
        <div key={index} className="skeleton-header-cell" data-testid="skeleton-header-cell" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="skeleton-row" data-testid="skeleton-row">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={colIndex} className="skeleton-cell" data-testid="skeleton-cell" />
        ))}
      </div>
    ))}
  </div>
);

/**
 * Card skeleton for content cards
 */
export const CardSkeleton = ({ count = 3 }) => (
  <div className="card-skeleton-container" data-testid="card-skeleton-container">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="skeleton-card" data-testid="skeleton-card">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-content" />
        <div className="skeleton-line skeleton-content" />
        <div className="skeleton-line skeleton-content" />
      </div>
    ))}
  </div>
);

/**
 * List skeleton for data lists
 */
export const ListSkeleton = ({ items = 5 }) => (
  <div className="list-skeleton" data-testid="list-skeleton">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="skeleton-list-item" data-testid="skeleton-list-item">
        <div className="skeleton-avatar" />
        <div className="skeleton-content">
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-subtitle" />
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;
