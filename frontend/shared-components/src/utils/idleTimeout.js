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
    
    this.init();
  }

  init() {
    console.log('🔄 IdleTimeout init:', { timeout: this.timeout / 1000, warningTime: this.warningTime / 1000 });
    this.reset();
    this.bindEvents();
  }

  bindEvents() {
    console.log('🔗 Binding activity events:', this.events);
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
    if (this.lastActivity && (now - this.lastActivity) < 1000) {
      return; // Skip if activity was detected less than 1 second ago
    }
    
    this.lastActivity = now;
    
    // Enhanced logging for touchpad detection
    const eventType = event?.type || 'unknown';
    const isTouchpad = eventType.includes('pointer') || eventType.includes('touch') || eventType.includes('wheel');
    const isMouse = eventType.includes('mouse');
    const isKeyboard = eventType.includes('key');
    
    console.log('🔄 User activity detected - resetting idle timeout', {
      eventType,
      isTouchpad,
      isMouse,
      isKeyboard,
      timestamp: new Date().toLocaleTimeString()
    });
    
    // Always call onReset when user is active
    this.onReset();
    
    // Reset the timers
    this.reset();
  }

  reset() {
    this.clearTimers();
    this.isActive = true;
    this.isWarning = false;
    
    console.log('🔄 IdleTimeout reset:', { 
      timeout: this.timeout / 1000, 
      warningTime: this.warningTime / 1000,
      warningIn: (this.timeout - this.warningTime) / 1000 
    });
    
    // Set warning timer
    this.warningTimer = setTimeout(() => {
      console.log('⚠️ IdleTimeout warning triggered');
      this.isWarning = true;
      this.onWarning();
    }, this.timeout - this.warningTime);
    
    // Set timeout timer
    this.timer = setTimeout(() => {
      console.log('🕐 IdleTimeout timeout triggered');
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
    console.log('🛑 Destroying idle timeout');
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
    return this.timeout;
  }

  getIsWarning() {
    return this.isWarning;
  }

  getIsActive() {
    return this.isActive;
  }
}

module.exports = IdleTimeout;
