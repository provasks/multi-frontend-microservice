/**
 * Shell App Configuration (Port 4000)
 * Configuration specific to the shell application
 */

// Import shared configuration
import { SHARED_COMPONENTS_CONFIG, FRONTEND_MESSAGES } from 'sharedComponents/frontendConfig';

// ============================================================================
// SHELL APP SPECIFIC CONFIGURATION
// ============================================================================

const SHELL_CONFIG = {
  // Application metadata
  APP: {
    NAME: 'Task Management Shell',
    VERSION: '1.0.0',
    DESCRIPTION: 'Main shell application for task management system'
  },
  
  // Shell-specific settings
  SHELL: {
    // Default route
    DEFAULT_ROUTE: '/dashboard',
    
    // Navigation configuration
    NAVIGATION: {
      MAIN_MENU: [
        { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
        { id: 'tasks', label: 'Tasks', icon: 'fas fa-tasks', route: '/tasks' },
        { id: 'users', label: 'Users', icon: 'fas fa-users', route: '/users' },
        { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell', route: '/notifications' }
      ],
      
      USER_MENU: [
        { id: 'profile', label: 'Profile', icon: 'fas fa-user', route: '/profile' },
        { id: 'settings', label: 'Settings', icon: 'fas fa-cog', route: '/settings' },
        { id: 'logout', label: 'Logout', icon: 'fas fa-sign-out-alt', action: 'logout' }
      ]
    },
    
    // Layout configuration
    LAYOUT: {
      SIDEBAR_WIDTH: 250,
      HEADER_HEIGHT: 60,
      FOOTER_HEIGHT: 40
    }
  },
  
  // Authentication configuration
  AUTH: {
    LOGIN_REDIRECT: '/dashboard',
    LOGOUT_REDIRECT: '/login',
    SESSION_CHECK_INTERVAL: 30000 // 30 seconds
  },
  
  // Error handling
  ERROR_HANDLING: {
    GLOBAL_ERROR_BOUNDARY: true,
    SHOW_ERROR_DETAILS: process.env.NODE_ENV === 'development',
    ERROR_REPORTING: true
  }
};

// ============================================================================
// SHELL-SPECIFIC MESSAGES
// ============================================================================

const SHELL_MESSAGES = {
  // Shell-specific error messages
  ERROR: {
    MICROFRONTEND_LOAD_FAILED: 'Failed to load microfrontend',
    NAVIGATION_FAILED: 'Navigation failed',
    AUTHENTICATION_REQUIRED: 'Please log in to access this feature'
  },
  
  // Shell-specific success messages
  SUCCESS: {
    MICROFRONTEND_LOADED: 'Microfrontend loaded successfully',
    NAVIGATION_SUCCESS: 'Navigation successful'
  }
};

// ============================================================================
// EXPORT CONFIGURATION
// ============================================================================

export default {
  // Shell-specific configuration
  SHELL_CONFIG,
  SHELL_MESSAGES,
  
  // Re-export shared configuration
  SHARED: SHARED_COMPONENTS_CONFIG,
  MESSAGES: FRONTEND_MESSAGES
};
