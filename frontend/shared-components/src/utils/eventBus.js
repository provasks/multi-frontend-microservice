/**
 * Centralized Event Bus for Microfrontend Communication
 * Provides type-safe, decoupled event communication
 * 
 * Usage:
 *   import eventBus from 'sharedComponents/utils/eventBus';
 *   import { EVENT_TYPES } from 'sharedComponents/utils/eventTypes';
 * 
 *   // Emit event
 *   eventBus.emit(EVENT_TYPES.TASK_CREATED, { task: {...} });
 * 
 *   // Listen to event
 *   const unsubscribe = eventBus.on(EVENT_TYPES.TASK_CREATED, (payload) => {
 *     console.log('Task created:', payload);
 *   });
 * 
 *   // Cleanup
 *   unsubscribe();
 */

class EventBus {
  constructor() {
    this.listeners = new Map();
    this.eventHistory = []; // For debugging
    this.maxHistorySize = 100; // Limit history size
  }

  /**
   * Subscribe to an event
   * @param {string} eventType - The event type to listen for
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(eventType, callback) {
    if (typeof callback !== 'function') {
      console.warn(`EventBus.on: callback must be a function for event "${eventType}"`);
      return () => {}; // Return no-op unsubscribe
    }

    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    
    this.listeners.get(eventType).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Subscribe to an event once
   * @param {string} eventType - The event type to listen for
   * @param {Function} callback - Callback function
   */
  once(eventType, callback) {
    const unsubscribe = this.on(eventType, (...args) => {
      callback(...args);
      unsubscribe();
    });
    return unsubscribe;
  }

  /**
   * Emit an event
   * @param {string} eventType - The event type
   * @param {*} payload - Event data
   */
  emit(eventType, payload = {}) {
    if (!eventType || typeof eventType !== 'string') {
      console.warn('EventBus.emit: eventType must be a non-empty string');
      return;
    }

    // Store in history (for debugging)
    this.eventHistory.push({
      type: eventType,
      payload,
      timestamp: Date.now()
    });

    // Limit history size
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Notify all listeners
    const callbacks = this.listeners.get(eventType) || [];
    callbacks.forEach(callback => {
      try {
        callback(payload);
      } catch (error) {
        console.error(`Error in event listener for "${eventType}":`, error);
      }
    });

    // Also dispatch as CustomEvent for native event listeners
    if (typeof window !== 'undefined') {
      try {
        const customEvent = new CustomEvent(eventType, {
          detail: payload,
          bubbles: true,
          cancelable: true
        });
        window.dispatchEvent(customEvent);
      } catch (error) {
        console.warn('Failed to dispatch CustomEvent:', error);
      }
    }
  }

  /**
   * Remove all listeners for an event type
   * @param {string} eventType - The event type
   */
  off(eventType) {
    this.listeners.delete(eventType);
  }

  /**
   * Remove all listeners
   */
  clear() {
    this.listeners.clear();
    this.eventHistory = [];
  }

  /**
   * Get event history (for debugging)
   * @param {number} limit - Maximum number of events to return
   * @returns {Array} Event history
   */
  getHistory(limit = 50) {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Get listener count for an event type
   * @param {string} eventType - The event type
   * @returns {number} Number of listeners
   */
  getListenerCount(eventType) {
    const callbacks = this.listeners.get(eventType);
    return callbacks ? callbacks.length : 0;
  }

  /**
   * Get all registered event types
   * @returns {Array} List of event types
   */
  getEventTypes() {
    return Array.from(this.listeners.keys());
  }
}

// Create singleton instance
const eventBus = new EventBus();

// Expose globally for microfrontends (optional, for debugging)
if (typeof window !== 'undefined') {
  window.__EVENT_BUS__ = eventBus;
  
  // Expose in development for debugging
  if (process.env.NODE_ENV === 'development') {
    window.__EVENT_BUS_DEBUG__ = {
      getHistory: () => eventBus.getHistory(),
      getEventTypes: () => eventBus.getEventTypes(),
      getListenerCount: (type) => eventBus.getListenerCount(type),
      clear: () => eventBus.clear(),
    };
  }
}

export default eventBus;

