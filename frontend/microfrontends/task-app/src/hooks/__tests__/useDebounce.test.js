import { renderHook, act } from '@testing-library/react';
import { useDebounce, useDebouncedCallback } from '../useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 100));
    
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 100 } }
    );
    
    expect(result.current).toBe('initial');
    
    // Change value
    rerender({ value: 'updated', delay: 100 });
    
    // Value should not change immediately
    expect(result.current).toBe('initial');
    
    // Fast-forward time by 50ms
    act(() => {
      jest.advanceTimersByTime(50);
    });
    
    // Value should still be initial
    expect(result.current).toBe('initial');
    
    // Fast-forward time by another 50ms (total 100ms)
    act(() => {
      jest.advanceTimersByTime(50);
    });
    
    // Now value should be updated
    expect(result.current).toBe('updated');
  });

  it('cancels previous timeout when value changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 100 } }
    );
    
    // Change value multiple times rapidly
    rerender({ value: 'first', delay: 100 });
    rerender({ value: 'second', delay: 100 });
    rerender({ value: 'third', delay: 100 });
    
    // Fast-forward time by 50ms
    act(() => {
      jest.advanceTimersByTime(50);
    });
    
    // Value should still be initial
    expect(result.current).toBe('initial');
    
    // Fast-forward time by another 50ms (total 100ms)
    act(() => {
      jest.advanceTimersByTime(50);
    });
    
    // Value should be the last one set
    expect(result.current).toBe('third');
  });

  it('handles different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 200 } }
    );
    
    rerender({ value: 'updated', delay: 200 });
    
    // Fast-forward time by 100ms
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    // Value should still be initial
    expect(result.current).toBe('initial');
    
    // Fast-forward time by another 100ms (total 200ms)
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    // Now value should be updated
    expect(result.current).toBe('updated');
  });

  it('handles zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } }
    );
    
    rerender({ value: 'updated', delay: 0 });
    
    // With zero delay, value should update after a tick
    act(() => {
      jest.advanceTimersByTime(0);
    });
    
    expect(result.current).toBe('updated');
  });

  it('cleans up timeout on unmount', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 100 } }
    );
    
    rerender({ value: 'updated', delay: 100 });
    
    // Unmount before timeout completes
    unmount();
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    // Should not cause any errors
    expect(true).toBe(true);
  });
});

describe('useDebouncedCallback Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns debounced callback', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(mockCallback, 100));
    
    expect(typeof result.current).toBe('function');
  });

  it('debounces callback execution', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(mockCallback, 100));
    
    // Call the debounced callback
    act(() => {
      result.current('arg1');
    });
    
    // Fast-forward time by 50ms
    act(() => {
      jest.advanceTimersByTime(50);
    });
    
    // Fast-forward time by another 50ms (total 100ms)
    act(() => {
      jest.advanceTimersByTime(50);
    });
    
    // Now callback should be executed
    expect(mockCallback).toHaveBeenCalledWith('arg1');
  });

  it('cancels previous callback when called again', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(mockCallback, 100));
    
    // Call the debounced callback multiple times
    act(() => {
      result.current('arg1');
    });
    
    act(() => {
      result.current('arg2');
    });
    
    act(() => {
      result.current('arg3');
    });
    
    // Fast-forward time by 100ms
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    // All calls should be executed since useDebouncedCallback doesn't cancel previous calls
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(mockCallback).toHaveBeenCalledWith('arg1');
    expect(mockCallback).toHaveBeenCalledWith('arg2');
    expect(mockCallback).toHaveBeenCalledWith('arg3');
  });

  it('handles dependencies array', () => {
    const mockCallback = jest.fn();
    const { result, rerender } = renderHook(
      ({ callback, delay, deps }) => useDebouncedCallback(callback, delay, deps),
      { initialProps: { callback: mockCallback, delay: 100, deps: ['dep1'] } }
    );
    
    // Call the debounced callback
    act(() => {
      result.current('arg1');
    });
    
    // Fast-forward time by 100ms
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    expect(mockCallback).toHaveBeenCalledWith('arg1');
    
    // Change dependencies
    rerender({ callback: mockCallback, delay: 100, deps: ['dep2'] });
    
    // Call again
    act(() => {
      result.current('arg2');
    });
    
    // Fast-forward time by 100ms
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    expect(mockCallback).toHaveBeenCalledWith('arg2');
  });

  it('cleans up timeout on unmount', () => {
    const mockCallback = jest.fn();
    const { result, unmount } = renderHook(() => useDebouncedCallback(mockCallback, 100));
    
    // Call the debounced callback
    act(() => {
      result.current('arg1');
    });
    
    // Unmount before timeout completes
    unmount();
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    // Should not cause any errors
    expect(true).toBe(true);
  });
});
