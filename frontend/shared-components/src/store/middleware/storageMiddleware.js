/**
 * Storage middleware for Redux
 * Simplified to handle only session storage operations
 */

const Storage = require('../../utils/storage');

const storageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Handle session storage operations based on action type
  switch (action.type) {
    case 'auth/loginSuccess':
      // Store user data in session storage
      if (action.payload.user) {
        Storage.setSessionData('user', action.payload.user);
      }
      break;
      
    case 'auth/logout':
      // Clear session data on logout
      Storage.clearAll();
      break;
      
    default:
      // No storage operations needed
      break;
  }
  
  return result;
};

module.exports = storageMiddleware;
