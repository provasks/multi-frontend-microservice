/**
 * Storage utility for handling localStorage operations
 * Separates storage concerns from Redux state management
 */

class Storage {
  static getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  static setToken(token) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
  }

  static clearToken() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
  }

  static getTheme() {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('theme') || 'light';
  }

  static setTheme(theme) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('theme', theme);
  }

  static clearAll() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('theme');
  }
}

module.exports = Storage;
