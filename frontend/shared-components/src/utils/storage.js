/**
 * Storage utility for handling session storage operations
 * Simplified to use only sessionStorage for temporary data
 */

class Storage {
  static getSessionData(key) {
    if (typeof window === 'undefined') return null;
    try {
      const data = sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting session data:', error);
      return null;
    }
  }

  static setSessionData(key, data) {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting session data:', error);
    }
  }

  static clearSessionData(key) {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing session data:', error);
    }
  }

  static clearAll() {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing session storage:', error);
    }
  }
}

module.exports = Storage;
