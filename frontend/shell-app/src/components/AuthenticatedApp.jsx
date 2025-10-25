import React, { useState, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import ErrorTesting from './ErrorTesting';
import ReduxTest from './ReduxTest';
import IdleTimeoutTest from './IdleTimeoutTest';

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
    if (path === '/users') return 'users';
    if (path === '/notifications') return 'notifications';
    if (path === '/error-testing') return 'error-testing';
    if (path === '/redux-test') return 'redux-test';
    if (path === '/idle-timeout-test') return 'idle-timeout-test';
    return 'tasks'; // default to tasks
  };
  
  const activeTab = getCurrentTab();

  const handleLogout = () => {
    onLogout();
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
            <button
              className={`nav-link btn btn-link text-light px-3 py-2 rounded ${activeTab === 'tasks' ? 'bg-dark' : ''}`}
              onClick={() => navigate('/')}
              style={{
                transition: 'all 0.3s ease',
                border: 'none',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'tasks') {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'tasks') {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <i className="fas fa-tasks me-2"></i>
              Tasks
            </button>
            <button
              className={`nav-link btn btn-link text-light px-3 py-2 rounded ${activeTab === 'users' ? 'bg-dark' : ''}`}
              onClick={() => navigate('/users')}
              style={{
                transition: 'all 0.3s ease',
                border: 'none',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'users') {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'users') {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <i className="fas fa-users me-2"></i>
              Users
            </button>
            <button
              className={`nav-link btn btn-link text-light px-3 py-2 rounded ${activeTab === 'notifications' ? 'bg-dark' : ''}`}
              onClick={() => navigate('/notifications')}
              style={{
                transition: 'all 0.3s ease',
                border: 'none',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'notifications') {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'notifications') {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <i className="fas fa-bell me-2"></i>
              Notifications
            </button>
            <button
              className={`nav-link btn btn-link text-light px-3 py-2 rounded ${activeTab === 'error-testing' ? 'bg-dark' : ''}`}
              onClick={() => navigate('/error-testing')}
              style={{
                transition: 'all 0.3s ease',
                border: 'none',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'error-testing') {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'error-testing') {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <i className="fas fa-bug me-2"></i>
              Error Testing
            </button>
            <button
              className={`nav-link btn btn-link text-light px-3 py-2 rounded ${activeTab === 'redux-test' ? 'bg-dark' : ''}`}
              onClick={() => navigate('/redux-test')}
              style={{
                transition: 'all 0.3s ease',
                border: 'none',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'redux-test') {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'redux-test') {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <i className="fas fa-cogs me-2"></i>
              Redux Test
            </button>
            <button
              className={`nav-link btn btn-link text-light px-3 py-2 rounded ${activeTab === 'idle-timeout-test' ? 'bg-dark' : ''}`}
              onClick={() => navigate('/idle-timeout-test')}
              style={{
                transition: 'all 0.3s ease',
                border: 'none',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'idle-timeout-test') {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'idle-timeout-test') {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <i className="fas fa-clock me-2"></i>
              Idle Timeout Test
            </button>
          </div>
          
          <div className="navbar-nav">
            <button 
              className="btn btn-outline-light"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt me-1"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid p-4">
        <MicrofrontendErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<TaskManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/notifications" element={<Notifications />} />
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
