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
          <div className="skeleton-text" style={{ width, height }}>
            {Array.from({ length: lines }).map((_, index) => (
              <div key={index} className="skeleton-line" />
            ))}
          </div>
        );
      
      case 'table':
        return (
          <div className="skeleton-table">
            {Array.from({ length: lines }).map((_, index) => (
              <div key={index} className="skeleton-row">
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
          <div className="skeleton-card" style={{ width, height }}>
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-content" />
            <div className="skeleton-line skeleton-content" />
          </div>
        );
      
      case 'button':
        return (
          <div className="skeleton-button" style={{ width, height }} />
        );
      
      case 'avatar':
        return (
          <div className="skeleton-avatar" style={{ width, height }} />
        );
      
      default:
        return <div className="skeleton-default" style={{ width, height }} />;
    }
  };

  return (
    <div className="loading-skeleton">
      {renderSkeleton()}
    </div>
  );
};

/**
 * Table skeleton for data tables
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
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

/**
 * Card skeleton for content cards
 */
export const CardSkeleton = ({ count = 3 }) => (
  <div className="card-skeleton-container">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="skeleton-card">
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
  <div className="list-skeleton">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="skeleton-list-item">
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
