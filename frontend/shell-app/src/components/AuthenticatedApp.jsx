import React, { useState, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import ErrorTesting from './ErrorTesting';
import ReduxTest from './ReduxTest';
import IdleTimeoutTest from './IdleTimeoutTest';
import shellConfig from '../config/shellConfig';
import './TestDropdown.css';

// Lazy load micro-frontends with error handling
const UserManagement = React.lazy(() => import('userApp/UserManagement').catch(() => ({ default: () => <div className="alert alert-danger">Failed to load User Management</div> })));
const TaskManagement = React.lazy(() => import('taskApp/TaskManagement').catch(() => ({ default: () => <div className="alert alert-danger">Failed to load Task Management</div> })));
const Notifications = React.lazy(() => import('notificationApp/Notifications').catch(() => ({ default: () => <div className="alert alert-danger">Failed to load Notifications</div> })));

// ErrorBoundary for microfrontends
class MicrofrontendErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Microfrontend Error:', error);
    console.error('Error Info:', errorInfo);
    
    if (window.showError) {
      window.showError(`Microfrontend failed to load: ${error.message}`);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger">
          <h6>Microfrontend Error</h6>
          <p>There was an error loading this microfrontend.</p>
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const AuthenticatedApp = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current tab from URL path
  const getCurrentTab = () => {
    const path = location.pathname;
    
    // Check main menu routes
    const mainMenuRoutes = shellConfig.SHELL_CONFIG.SHELL.NAVIGATION.MAIN_MENU;
    for (const menuItem of mainMenuRoutes) {
      if (path === menuItem.route) {
        return menuItem.id;
      }
    }
    
    // Check user menu routes
    const userMenuRoutes = shellConfig.SHELL_CONFIG.SHELL.NAVIGATION.USER_MENU;
    for (const menuItem of userMenuRoutes) {
      if (path === menuItem.route) {
        return menuItem.id;
      }
    }
    
    // Check test routes
    if (path === '/error-testing') return 'error-testing';
    if (path === '/redux-test') return 'redux-test';
    if (path === '/idle-timeout-test') return 'idle-timeout-test';
    
    return 'tasks'; // default to tasks
  };
  
  const activeTab = getCurrentTab();

  const handleLogout = () => {
    onLogout();
  };

  // Helper function to render navigation button
  const renderNavButton = (menuItem) => {
    const isActive = activeTab === menuItem.id;
    return (
      <button
        key={menuItem.id}
        className={`nav-link btn btn-link text-light px-3 py-2 rounded ${isActive ? 'bg-dark' : ''}`}
        onClick={() => navigate(menuItem.route)}
        style={{
          transition: 'all 0.3s ease',
          border: 'none',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.target.style.backgroundColor = 'transparent';
          }
        }}
      >
        <i className={`${menuItem.icon} me-2`}></i>
        {menuItem.label}
      </button>
    );
  };

  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <i className="fas fa-tasks me-2"></i>
            Task Management System
          </a>
          
          {/* Navigation Menu */}
          <div className="navbar-nav me-auto">
            {/* Main Menu Items from Configuration */}
            {shellConfig.SHELL_CONFIG.SHELL.NAVIGATION.MAIN_MENU.map(renderNavButton)}
            {/* Test Menu Dropdown */}
            <div className="dropdown">
              <button
                className={`nav-link btn btn-link text-light px-3 py-2 rounded dropdown-toggle ${['error-testing', 'redux-test', 'idle-timeout-test'].includes(activeTab) ? 'bg-dark' : ''}`}
                type="button"
                id="testDropdown"
                data-bs-toggle="dropdown"
                data-test-active={['error-testing', 'redux-test', 'idle-timeout-test'].includes(activeTab)}
                aria-expanded="false"
                style={{
                  transition: 'all 0.3s ease',
                  border: 'none',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!['error-testing', 'redux-test', 'idle-timeout-test'].includes(activeTab)) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!['error-testing', 'redux-test', 'idle-timeout-test'].includes(activeTab)) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <i className="fas fa-flask me-2"></i>
                Test
              </button>
              <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="testDropdown">
                <li><h6 className="dropdown-header text-light"><i className="fas fa-flask me-2"></i>Testing Tools</h6></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button
                    className={`dropdown-item ${activeTab === 'error-testing' ? 'active' : ''}`}
                    onClick={() => navigate('/error-testing')}
                    style={{ border: 'none', background: 'transparent' }}
                  >
                    <i className="fas fa-bug me-2"></i>
                    Error Testing
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item ${activeTab === 'redux-test' ? 'active' : ''}`}
                    onClick={() => navigate('/redux-test')}
                    style={{ border: 'none', background: 'transparent' }}
                  >
                    <i className="fas fa-cogs me-2"></i>
                    Redux Test
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item ${activeTab === 'idle-timeout-test' ? 'active' : ''}`}
                    onClick={() => navigate('/idle-timeout-test')}
                    style={{ border: 'none', background: 'transparent' }}
                  >
                    <i className="fas fa-clock me-2"></i>
                    Idle Timeout Test
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="navbar-nav">
            {/* User Menu Dropdown */}
            <div className="dropdown">
              <button
                className={`nav-link btn btn-link text-light px-3 py-2 rounded dropdown-toggle ${['profile', 'settings'].includes(activeTab) ? 'bg-dark' : ''}`}
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                data-user-active={['profile', 'settings'].includes(activeTab)}
                aria-expanded="false"
                style={{
                  transition: 'all 0.3s ease',
                  border: 'none',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!['profile', 'settings'].includes(activeTab)) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!['profile', 'settings'].includes(activeTab)) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <i className="fas fa-user me-2"></i>
                User
              </button>
              <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="userDropdown">
                <li><h6 className="dropdown-header text-light"><i className="fas fa-user me-2"></i>User Menu</h6></li>
                <li><hr className="dropdown-divider" /></li>
                {shellConfig.SHELL_CONFIG.SHELL.NAVIGATION.USER_MENU.map((menuItem) => (
                  <li key={menuItem.id}>
                    <button
                      className={`dropdown-item ${activeTab === menuItem.id ? 'active' : ''}`}
                      onClick={() => {
                        if (menuItem.action === 'logout') {
                          handleLogout();
                        } else {
                          navigate(menuItem.route);
                        }
                      }}
                      style={{ border: 'none', background: 'transparent' }}
                    >
                      <i className={`${menuItem.icon} me-2`}></i>
                      {menuItem.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid p-4">
        <MicrofrontendErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<TaskManagement />} />
              <Route path="/dashboard" element={<TaskManagement />} />
              <Route path="/tasks" element={<TaskManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<div className="alert alert-info"><h4>Profile Page</h4><p>User profile management coming soon...</p></div>} />
              <Route path="/settings" element={<div className="alert alert-info"><h4>Settings Page</h4><p>Application settings coming soon...</p></div>} />
              <Route path="/error-testing" element={<ErrorTesting />} />
              <Route path="/redux-test" element={<ReduxTest />} />
              <Route path="/idle-timeout-test" element={<IdleTimeoutTest />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </MicrofrontendErrorBoundary>
      </div>
    </div>
  );
};

export default AuthenticatedApp;
