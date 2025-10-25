/**
 * Storage middleware for Redux
 * Handles localStorage operations as side effects of Redux actions
 */

const Storage = require('../../utils/storage');

const storageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Handle storage operations based on action type
  switch (action.type) {
    case 'auth/loginSuccess':
      if (action.payload.token) {
        Storage.setToken(action.payload.token);
      }
      break;
      
    case 'auth/logout':
      Storage.clearToken();
      break;
      
    case 'ui/setTheme':
      if (action.payload) {
        Storage.setTheme(action.payload);
      }
      break;
      
    default:
      // No storage operations needed
      break;
  }
  
  return result;
};

module.exports = storageMiddleware;
