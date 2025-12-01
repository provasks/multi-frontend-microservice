import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IdleTimeoutWarning from '../IdleTimeoutWarning';

// Mock the useIdleTimeout hook
jest.mock('../store/simpleHooks', () => ({
  useIdleTimeout: jest.fn()
}));

import { useIdleTimeout } from '../store/simpleHooks';

describe('IdleTimeoutWarning Component', () => {
  const mockResetIdleTimeout = jest.fn();
  const mockPauseIdleTimeout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when not in warning state', () => {
    useIdleTimeout.mockReturnValue({
      isWarning: false,
      timeRemaining: 0,
      formattedTimeRemaining: '0:00',
      resetIdleTimeout: mockResetIdleTimeout,
      pauseIdleTimeout: mockPauseIdleTimeout
    });

    const { container } = render(<IdleTimeoutWarning />);
    expect(container.firstChild).toBeNull();
  });

  it('renders warning modal when in warning state', () => {
    useIdleTimeout.mockReturnValue({
      isWarning: true,
      timeRemaining: 120,
      formattedTimeRemaining: '2:00',
      resetIdleTimeout: mockResetIdleTimeout,
      pauseIdleTimeout: mockPauseIdleTimeout
    });

    render(<IdleTimeoutWarning />);
    
    expect(screen.getByText('Session Timeout Warning')).toBeInTheDocument();
    expect(screen.getByText(/You will be automatically logged out due to inactivity in/)).toBeInTheDocument();
    expect(screen.getByText('2:00')).toBeInTheDocument();
    expect(screen.getByText('Stay Logged In')).toBeInTheDocument();
    expect(screen.getByText('Pause Timeout')).toBeInTheDocument();
  });

  it('calls resetIdleTimeout when Stay Logged In button is clicked', () => {
    useIdleTimeout.mockReturnValue({
      isWarning: true,
      timeRemaining: 120,
      formattedTimeRemaining: '2:00',
      resetIdleTimeout: mockResetIdleTimeout,
      pauseIdleTimeout: mockPauseIdleTimeout
    });

    render(<IdleTimeoutWarning />);
    
    const stayLoggedInButton = screen.getByText('Stay Logged In');
    fireEvent.click(stayLoggedInButton);
    
    expect(mockResetIdleTimeout).toHaveBeenCalledTimes(1);
  });

  it('calls pauseIdleTimeout when Pause Timeout button is clicked', () => {
    useIdleTimeout.mockReturnValue({
      isWarning: true,
      timeRemaining: 120,
      formattedTimeRemaining: '2:00',
      resetIdleTimeout: mockResetIdleTimeout,
      pauseIdleTimeout: mockPauseIdleTimeout
    });

    render(<IdleTimeoutWarning />);
    
    const pauseTimeoutButton = screen.getByText('Pause Timeout');
    fireEvent.click(pauseTimeoutButton);
    
    expect(mockPauseIdleTimeout).toHaveBeenCalledTimes(1);
  });

  it('displays correct time remaining', () => {
    useIdleTimeout.mockReturnValue({
      isWarning: true,
      timeRemaining: 45,
      formattedTimeRemaining: '0:45',
      resetIdleTimeout: mockResetIdleTimeout,
      pauseIdleTimeout: mockPauseIdleTimeout
    });

    render(<IdleTimeoutWarning />);
    
    expect(screen.getByText('0:45')).toBeInTheDocument();
  });

  it('displays correct time remaining for longer durations', () => {
    useIdleTimeout.mockReturnValue({
      isWarning: true,
      timeRemaining: 3661, // 1 hour, 1 minute, 1 second
      formattedTimeRemaining: '1:01:01',
      resetIdleTimeout: mockResetIdleTimeout,
      pauseIdleTimeout: mockPauseIdleTimeout
    });

    render(<IdleTimeoutWarning />);
    
    expect(screen.getByText('1:01:01')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    useIdleTimeout.mockReturnValue({
      isWarning: true,
      timeRemaining: 120,
      formattedTimeRemaining: '2:00',
      resetIdleTimeout: mockResetIdleTimeout,
      pauseIdleTimeout: mockPauseIdleTimeout
    });

    render(<IdleTimeoutWarning />);
    
    expect(screen.getByText('Session Timeout Warning').closest('.idle-timeout-warning')).toBeInTheDocument();
    expect(screen.getByText('Stay Logged In').closest('.btn-primary')).toBeInTheDocument();
    expect(screen.getByText('Pause Timeout').closest('.btn-secondary')).toBeInTheDocument();
  });

  it('renders with correct icons', () => {
    useIdleTimeout.mockReturnValue({
      isWarning: true,
      timeRemaining: 120,
      formattedTimeRemaining: '2:00',
      resetIdleTimeout: mockResetIdleTimeout,
      pauseIdleTimeout: mockPauseIdleTimeout
    });

    render(<IdleTimeoutWarning />);
    
    // Check for clock icon
    expect(screen.getByText('Session Timeout Warning').closest('.idle-timeout-warning__content').querySelector('.fas.fa-clock')).toBeInTheDocument();
    
    // Check for refresh icon
    expect(screen.getByText('Stay Logged In').querySelector('.fas.fa-refresh')).toBeInTheDocument();
    
    // Check for pause icon
    expect(screen.getByText('Pause Timeout').querySelector('.fas.fa-pause')).toBeInTheDocument();
  });

  it('handles zero time remaining', () => {
    useIdleTimeout.mockReturnValue({
      isWarning: true,
      timeRemaining: 0,
      formattedTimeRemaining: '0:00',
      resetIdleTimeout: mockResetIdleTimeout,
      pauseIdleTimeout: mockPauseIdleTimeout
    });

    render(<IdleTimeoutWarning />);
    
    expect(screen.getByText('0:00')).toBeInTheDocument();
  });

  it('handles negative time remaining', () => {
    useIdleTimeout.mockReturnValue({
      isWarning: true,
      timeRemaining: -10,
      formattedTimeRemaining: '-0:10',
      resetIdleTimeout: mockResetIdleTimeout,
      pauseIdleTimeout: mockPauseIdleTimeout
    });

    render(<IdleTimeoutWarning />);
    
    expect(screen.getByText('-0:10')).toBeInTheDocument();
  });
});
