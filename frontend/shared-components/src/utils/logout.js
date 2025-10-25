/**
 * Global Logout Utility
 * Provides a centralized logout function that can be called from anywhere
 */

/**
 * Perform a complete logout
 * Clears all storage, dispatches logout actions, and redirects to login
 */
const performLogout = (reason = 'User logout') => {
  console.log(`🚪 Performing logout: ${reason}`);
  
  // Clear session storage only
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.clear();
      console.log('✅ Session storage cleared');
    } catch (error) {
      console.error('❌ Error clearing session storage:', error);
    }
  }
  
  // Dispatch logout message to parent window if in iframe
  if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
    try {
      window.parent.postMessage({ 
        type: 'LOGOUT', 
        reason: reason,
        timestamp: Date.now()
      }, '*');
      console.log('📤 Logout message sent to parent window');
    } catch (error) {
      console.error('❌ Error notifying parent window:', error);
    }
  }
  
  // Force redirect to login page
  if (typeof window !== 'undefined') {
    console.log('🔄 Redirecting to login page');
    
    // Use replace to prevent back button issues
    window.location.replace('/login');
    
    // Force reload after a delay to ensure clean state
    setTimeout(() => {
      console.log('🔄 Force reloading page to ensure logout');
      window.location.reload();
    }, 1000);
  }
};

/**
 * Perform idle timeout logout
 * Special logout for idle timeout with additional cleanup
 */
const performIdleTimeoutLogout = () => {
  console.log('🕐 Performing idle timeout logout');
  
  // Clear session storage only
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.clear();
      console.log('✅ Session storage cleared for idle timeout');
    } catch (error) {
      console.error('❌ Error clearing session storage:', error);
    }
  }
  
  // Dispatch idle timeout logout message
  if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
    try {
      window.parent.postMessage({ 
        type: 'IDLE_TIMEOUT_LOGOUT',
        timestamp: Date.now()
      }, '*');
      console.log('📤 Idle timeout logout message sent to parent window');
    } catch (error) {
      console.error('❌ Error notifying parent window:', error);
    }
  }
  
  // Force redirect to login page
  if (typeof window !== 'undefined') {
    console.log('🔄 Redirecting to login page due to idle timeout');
    
    // Use replace to prevent back button issues
    window.location.replace('/login');
    
    // Force reload after a delay to ensure clean state
    setTimeout(() => {
      console.log('🔄 Force reloading page to ensure idle timeout logout');
      window.location.reload();
    }, 1500);
  }
};

module.exports = {
  performLogout,
  performIdleTimeoutLogout
};
