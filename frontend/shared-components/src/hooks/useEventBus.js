import { useEffect, useRef, useCallback } from 'react';
import eventBus from '../utils/eventBus';
import { EVENT_TYPES } from '../utils/eventTypes';

/**
 * React Hook for Event Bus
 * Automatically cleans up listeners on unmount
 * 
 * @param {string} eventType - Event type to listen for
 * @param {Function} callback - Callback function
 * @param {Array} deps - Dependencies array (optional)
 * 
 * @example
 *   useEventBus(EVENT_TYPES.TASK_CREATED, (payload) => {
 *     console.log('Task created:', payload);
 *   });
 */
export const useEventBus = (eventType, callback, deps = []) => {
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!eventType) {
      console.warn('useEventBus: eventType is required');
      return;
    }

    const wrappedCallback = (payload) => {
      callbackRef.current(payload);
    };

    const unsubscribe = eventBus.on(eventType, wrappedCallback);

    return () => {
      unsubscribe();
    };
  }, [eventType, ...deps]);
};

/**
 * Hook to emit events
 * Returns a function to emit events
 * 
 * @returns {Function} Function to emit events
 * 
 * @example
 *   const emitEvent = useEmitEvent();
 *   emitEvent(EVENT_TYPES.TASK_CREATED, { task: {...} });
 */
export const useEmitEvent = () => {
  return useCallback((eventType, payload) => {
    eventBus.emit(eventType, payload);
  }, []);
};

/**
 * Hook to emit events once (fire and forget)
 * 
 * @param {string} eventType - Event type
 * @param {*} payload - Event payload
 * 
 * @example
 *   useEmitEventOnce(EVENT_TYPES.APPLICATION_READY, { timestamp: Date.now() });
 */
export const useEmitEventOnce = (eventType, payload) => {
  useEffect(() => {
    if (eventType) {
      eventBus.emit(eventType, payload);
    }
  }, []); // Only run once on mount
};

// Export event types for convenience
export { EVENT_TYPES };

