import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskStats from '../TaskStats';

describe('TaskStats Component', () => {
  const defaultProps = {
    stats: {
      total: 100,
      pending: 25,
      inProgress: 30,
      completed: 40,
      cancelled: 5
    }
  };

  it('renders all stat cards', () => {
    render(<TaskStats {...defaultProps} />);

    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('displays correct stat values', () => {
    render(<TaskStats {...defaultProps} />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders with zero values', () => {
    const zeroStats = {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0
    };

    render(<TaskStats stats={zeroStats} />);

    expect(screen.getAllByText('0')).toHaveLength(5);
  });

  it('renders with large numbers', () => {
    const largeStats = {
      total: 999999,
      pending: 250000,
      inProgress: 300000,
      completed: 400000,
      cancelled: 49999
    };

    render(<TaskStats stats={largeStats} />);

    expect(screen.getByText('999999')).toBeInTheDocument();
    expect(screen.getByText('250000')).toBeInTheDocument();
    expect(screen.getByText('300000')).toBeInTheDocument();
    expect(screen.getByText('400000')).toBeInTheDocument();
    expect(screen.getByText('49999')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<TaskStats {...defaultProps} />);

    const container = screen.getByTestId('task-stats');
    expect(container).toHaveClass('task-stats');
    expect(container).toHaveClass('mb-4');

    // Check individual stat cards
    const statCards = screen.getAllByTestId(/stat-card-/);
    expect(statCards).toHaveLength(5);

    statCards.forEach(card => {
      expect(card).toHaveClass('stat-card');
    });
  });

  it('renders correct icons for each stat', () => {
    render(<TaskStats {...defaultProps} />);

    // Check for icon classes
    expect(screen.getByText('Total Tasks').closest('.stat-card')).toHaveClass('stat-card');
    expect(screen.getByText('Pending').closest('.stat-card')).toHaveClass('stat-card');
    expect(screen.getByText('In Progress').closest('.stat-card')).toHaveClass('stat-card');
    expect(screen.getByText('Completed').closest('.stat-card')).toHaveClass('stat-card');
    expect(screen.getByText('Cancelled').closest('.stat-card')).toHaveClass('stat-card');
  });

  it('handles missing stats gracefully', () => {
    const incompleteStats = {
      total: 50,
      pending: 10
      // Missing other stats
    };

    render(<TaskStats stats={incompleteStats} />);

    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    // Other stats should show 0 or undefined
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles undefined stats', () => {
    render(<TaskStats stats={undefined} />);

    // Should render with default values or handle gracefully
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
  });

  it('handles null stats', () => {
    render(<TaskStats stats={null} />);

    // Should render with default values or handle gracefully
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<TaskStats {...defaultProps} className="custom-stats" />);

    const container = screen.getByTestId('task-stats');
    expect(container).toHaveClass('custom-stats');
  });

  it('renders with custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    render(<TaskStats {...defaultProps} style={customStyle} />);

    const container = screen.getByTestId('task-stats');
    expect(container).toHaveStyle('background-color: red');
  });

  it('handles decimal values', () => {
    const decimalStats = {
      total: 100.5,
      pending: 25.3,
      inProgress: 30.7,
      completed: 40.2,
      cancelled: 4.3
    };

    render(<TaskStats stats={decimalStats} />);

    expect(screen.getByText('100.5')).toBeInTheDocument();
    expect(screen.getByText('25.3')).toBeInTheDocument();
    expect(screen.getByText('30.7')).toBeInTheDocument();
    expect(screen.getByText('40.2')).toBeInTheDocument();
    expect(screen.getByText('4.3')).toBeInTheDocument();
  });

  it('handles negative values', () => {
    const negativeStats = {
      total: -10,
      pending: -5,
      inProgress: -3,
      completed: -2,
      cancelled: 0
    };

    render(<TaskStats stats={negativeStats} />);

    expect(screen.getByText('-10')).toBeInTheDocument();
    expect(screen.getByText('-5')).toBeInTheDocument();
    expect(screen.getByText('-3')).toBeInTheDocument();
    expect(screen.getByText('-2')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders with correct accessibility attributes', () => {
    render(<TaskStats {...defaultProps} />);

    const container = screen.getByTestId('task-stats');
    expect(container).toHaveAttribute('role', 'region');
    expect(container).toHaveAttribute('aria-label', 'Task Statistics');
  });

  it('renders individual stat cards with correct structure', () => {
    render(<TaskStats {...defaultProps} />);

    const totalCard = screen.getByTestId('stat-card-total');
    expect(totalCard).toHaveClass('stat-card');
    expect(totalCard).toHaveClass('stat-card-total');

    const pendingCard = screen.getByTestId('stat-card-pending');
    expect(pendingCard).toHaveClass('stat-card');
    expect(pendingCard).toHaveClass('stat-card-pending');
  });

  it('handles very small numbers', () => {
    const smallStats = {
      total: 0.001,
      pending: 0.0001,
      inProgress: 0.0002,
      completed: 0.0003,
      cancelled: 0.0004
    };

    render(<TaskStats stats={smallStats} />);

    expect(screen.getByText('0.001')).toBeInTheDocument();
    expect(screen.getByText('0.0001')).toBeInTheDocument();
    expect(screen.getByText('0.0002')).toBeInTheDocument();
    expect(screen.getByText('0.0003')).toBeInTheDocument();
    expect(screen.getByText('0.0004')).toBeInTheDocument();
  });

  it('renders with correct data attributes', () => {
    render(<TaskStats {...defaultProps} />);

    const totalCard = screen.getByTestId('stat-card-total');
    expect(totalCard).toHaveAttribute('data-stat-type', 'total');
    expect(totalCard).toHaveAttribute('data-stat-value', '100');
  });

  it('handles string numbers', () => {
    const stringStats = {
      total: '100',
      pending: '25',
      inProgress: '30',
      completed: '40',
      cancelled: '5'
    };

    render(<TaskStats stats={stringStats} />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders with correct order of stat cards', () => {
    render(<TaskStats {...defaultProps} />);

    const statCards = screen.getAllByTestId(/stat-card-/);
    const expectedOrder = ['total', 'pending', 'in-progress', 'completed', 'cancelled'];
    
    statCards.forEach((card, index) => {
      expect(card).toHaveAttribute('data-testid', `stat-card-${expectedOrder[index]}`);
    });
  });
});
