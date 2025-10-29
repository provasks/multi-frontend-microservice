import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSkeleton, { TableSkeleton, CardSkeleton, ListSkeleton } from '../LoadingSkeleton';

describe('LoadingSkeleton Component', () => {
  it('renders with default props', () => {
    render(<LoadingSkeleton />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders text skeleton by default', () => {
    render(<LoadingSkeleton />);
    expect(screen.getByTestId('loading-skeleton')).toHaveClass('loading-skeleton');
  });

  it('renders text skeleton with custom lines', () => {
    render(<LoadingSkeleton type="text" lines={5} />);
    const skeletonLines = screen.getAllByTestId('skeleton-line');
    expect(skeletonLines).toHaveLength(5);
  });

  it('renders text skeleton with custom width and height', () => {
    render(<LoadingSkeleton type="text" width="200px" height="30px" />);
    const skeletonText = screen.getByTestId('skeleton-text');
    expect(skeletonText).toHaveStyle({ width: '200px', height: '30px' });
  });

  it('renders table skeleton', () => {
    render(<LoadingSkeleton type="table" lines={3} />);
    expect(screen.getByTestId('skeleton-table')).toBeInTheDocument();
    const skeletonRows = screen.getAllByTestId('skeleton-row');
    expect(skeletonRows).toHaveLength(3);
  });

  it('renders card skeleton', () => {
    render(<LoadingSkeleton type="card" width="300px" height="200px" />);
    expect(screen.getByTestId('skeleton-card')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-card')).toHaveStyle({ width: '300px', height: '200px' });
  });

  it('renders button skeleton', () => {
    render(<LoadingSkeleton type="button" width="100px" height="40px" />);
    expect(screen.getByTestId('skeleton-button')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-button')).toHaveStyle({ width: '100px', height: '40px' });
  });

  it('renders avatar skeleton', () => {
    render(<LoadingSkeleton type="avatar" width="50px" height="50px" />);
    expect(screen.getByTestId('skeleton-avatar')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-avatar')).toHaveStyle({ width: '50px', height: '50px' });
  });

  it('renders default skeleton for unknown type', () => {
    render(<LoadingSkeleton type="unknown" />);
    expect(screen.getByTestId('skeleton-default')).toBeInTheDocument();
  });

  it('renders with custom width and height for all types', () => {
    const { rerender } = render(<LoadingSkeleton type="text" width="150px" height="25px" />);
    expect(screen.getByTestId('skeleton-text')).toHaveStyle({ width: '150px', height: '25px' });

    rerender(<LoadingSkeleton type="card" width="250px" height="150px" />);
    expect(screen.getByTestId('skeleton-card')).toHaveStyle({ width: '250px', height: '150px' });

    rerender(<LoadingSkeleton type="button" width="80px" height="35px" />);
    expect(screen.getByTestId('skeleton-button')).toHaveStyle({ width: '80px', height: '35px' });

    rerender(<LoadingSkeleton type="avatar" width="40px" height="40px" />);
    expect(screen.getByTestId('skeleton-avatar')).toHaveStyle({ width: '40px', height: '40px' });
  });
});

describe('TableSkeleton Component', () => {
  it('renders with default props', () => {
    render(<TableSkeleton />);
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
  });

  it('renders with custom rows and columns', () => {
    render(<TableSkeleton rows={3} columns={5} />);
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
    
    const skeletonRows = screen.getAllByTestId('skeleton-row');
    expect(skeletonRows).toHaveLength(3);
    
    const skeletonCells = screen.getAllByTestId('skeleton-cell');
    expect(skeletonCells).toHaveLength(3 * 5); // 3 rows * 5 columns
  });

  it('renders header cells', () => {
    render(<TableSkeleton columns={4} />);
    const headerCells = screen.getAllByTestId('skeleton-header-cell');
    expect(headerCells).toHaveLength(4);
  });
});

describe('CardSkeleton Component', () => {
  it('renders with default props', () => {
    render(<CardSkeleton />);
    expect(screen.getByTestId('card-skeleton-container')).toBeInTheDocument();
  });

  it('renders with custom count', () => {
    render(<CardSkeleton count={5} />);
    const skeletonCards = screen.getAllByTestId('skeleton-card');
    expect(skeletonCards).toHaveLength(5);
  });

  it('renders multiple cards with proper structure', () => {
    render(<CardSkeleton count={2} />);
    const skeletonCards = screen.getAllByTestId('skeleton-card');
    expect(skeletonCards).toHaveLength(2);
    
    // Each card should have title and content lines
    skeletonCards.forEach(card => {
      expect(card.querySelector('.skeleton-title')).toBeInTheDocument();
      expect(card.querySelectorAll('.skeleton-content')).toHaveLength(3);
    });
  });
});

describe('ListSkeleton Component', () => {
  it('renders with default props', () => {
    render(<ListSkeleton />);
    expect(screen.getByTestId('list-skeleton')).toBeInTheDocument();
  });

  it('renders with custom items count', () => {
    render(<ListSkeleton items={7} />);
    const skeletonItems = screen.getAllByTestId('skeleton-list-item');
    expect(skeletonItems).toHaveLength(7);
  });

  it('renders list items with proper structure', () => {
    render(<ListSkeleton items={3} />);
    const skeletonItems = screen.getAllByTestId('skeleton-list-item');
    expect(skeletonItems).toHaveLength(3);
    
    skeletonItems.forEach(item => {
      expect(item.querySelector('.skeleton-avatar')).toBeInTheDocument();
      expect(item.querySelector('.skeleton-content')).toBeInTheDocument();
      expect(item.querySelector('.skeleton-title')).toBeInTheDocument();
      expect(item.querySelector('.skeleton-subtitle')).toBeInTheDocument();
    });
  });
});

describe('LoadingSkeleton Edge Cases', () => {
  it('handles zero lines gracefully', () => {
    render(<LoadingSkeleton type="text" lines={0} />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('skeleton-line')).not.toBeInTheDocument();
  });

  it('handles negative lines gracefully', () => {
    render(<LoadingSkeleton type="text" lines={-1} />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('handles undefined width and height', () => {
    render(<LoadingSkeleton width={undefined} height={undefined} />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('handles null width and height', () => {
    render(<LoadingSkeleton width={null} height={null} />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });
});
