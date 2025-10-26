/**
 * Idle Timeout Utility
 * Handles automatic logout after user inactivity
 */

const IDLE_TIMEOUT_CONFIG = require('../config/idleTimeout');

class IdleTimeout {
  constructor(options = {}) {
    // Get default values from configuration
    const defaultTimeout = IDLE_TIMEOUT_CONFIG.DEFAULT_TIMEOUT;
    const defaultWarningTime = IDLE_TIMEOUT_CONFIG.DEFAULT_WARNING_TIME;
    
    this.timeout = options.timeout || defaultTimeout;
    this.warningTime = options.warningTime || defaultWarningTime;
    this.events = options.events || IDLE_TIMEOUT_CONFIG.ACTIVITY_EVENTS;
    this.onTimeout = options.onTimeout || (() => {});
    this.onWarning = options.onWarning || (() => {});
    this.onReset = options.onReset || (() => {});
    
    this.timer = null;
    this.warningTimer = null;
    this.isActive = false;
    this.isWarning = false;
    this.lastActivity = null;
    this.startTime = null; // Track when the timer was started
    this.minimumSessionTime = 5 * 60 * 1000; // 5 minutes minimum session time
    
    this.init();
  }

  init() {
    // IdleTimeout initialized
    this.reset();
    this.bindEvents();
  }

  bindEvents() {
    // Binding activity events
    this.events.forEach(event => {
      document.addEventListener(event, this.handleActivity.bind(this), true);
    });
    
    // Also bind to window events for better coverage
    window.addEventListener('focus', this.handleActivity.bind(this), true);
    window.addEventListener('blur', this.handleActivity.bind(this), true);
  }

  handleActivity(event) {
    // Throttle activity detection to prevent excessive resets
    const now = Date.now();
    if (this.lastActivity && (now - this.lastActivity) < 2000) {
      return; // Skip if activity was detected less than 2 seconds ago (increased from 1s)
    }
    
    this.lastActivity = now;
    
    // Enhanced logging for touchpad detection
    const eventType = event?.type || 'unknown';
    const isTouchpad = eventType.includes('pointer') || eventType.includes('touch') || eventType.includes('wheel');
    const isMouse = eventType.includes('mouse');
    const isKeyboard = eventType.includes('key');
    
    // User activity detected - resetting idle timeout
    
    // Only reset if we're actually active and not already in warning state
    if (this.isActive && !this.isWarning) {
      this.onReset();
      this.reset();
    }
  }

  reset() {
    this.clearTimers();
    this.isActive = true;
    this.isWarning = false;
    this.startTime = Date.now(); // Track when the timer was started
    
    // IdleTimeout reset
    
    // Set warning timer
    this.warningTimer = setTimeout(() => {
      // IdleTimeout warning triggered
      this.isWarning = true;
      this.onWarning();
    }, this.timeout - this.warningTime);
    
    // Set timeout timer
    this.timer = setTimeout(() => {
      // Check if minimum session time has passed
      const sessionTime = Date.now() - (this.startTime || Date.now());
      if (sessionTime < this.minimumSessionTime) {
        // IdleTimeout prevented - minimum session time not reached
        this.reset(); // Reset the timer instead of timing out
        return;
      }
      
      // IdleTimeout timeout triggered
      this.isActive = false;
      this.onTimeout();
    }, this.timeout);
  }

  clearTimers() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
  }

  destroy() {
    // Destroying idle timeout
    this.clearTimers();
    this.events.forEach(event => {
      document.removeEventListener(event, this.handleActivity.bind(this), true);
    });
    
    // Clean up window events
    window.removeEventListener('focus', this.handleActivity.bind(this), true);
    window.removeEventListener('blur', this.handleActivity.bind(this), true);
    
    this.isActive = false;
    this.isWarning = false;
  }

  // Manual methods
  pause() {
    this.clearTimers();
    this.isActive = false;
  }

  resume() {
    if (!this.isActive) {
      this.reset();
    }
  }

  // Getters
  getTimeRemaining() {
    if (!this.isActive) return 0;
    
    // Calculate actual time remaining based on when the timer was started
    const now = Date.now();
    const timeElapsed = now - (this.startTime || now);
    const timeRemaining = Math.max(0, this.timeout - timeElapsed);
    
    return timeRemaining;
  }

  getIsWarning() {
    return this.isWarning;
  }

  getIsActive() {
    return this.isActive;
  }
}

module.exports = IdleTimeout;
