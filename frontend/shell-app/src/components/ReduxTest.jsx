import React from 'react';

const ReduxTest = () => {
  // Try to use Redux hooks if available
  let useAuth, useTasks, useUI;
  let auth, tasks, ui;
  
  try {
    const ReduxHooks = require('sharedComponents/ReduxHooks');
    useAuth = ReduxHooks.useAuth;
    useTasks = ReduxHooks.useTasks;
    useUI = ReduxHooks.useUI;
    
    // Use Redux hooks
    auth = useAuth();
    tasks = useTasks();
    ui = useUI();
    
    console.log('✅ Redux hooks loaded successfully');
    console.log('Auth state:', auth);
    console.log('Tasks state:', tasks);
    console.log('UI state:', ui);
  } catch (error) {
    console.warn('Redux hooks not available:', error.message);
    return (
      <div className="alert alert-warning">
        <h5>Redux Test</h5>
        <p>Redux hooks not available: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="alert alert-success">
      <h5>Redux Test - Success!</h5>
      <div className="row">
        <div className="col-md-4">
          <h6>Auth State:</h6>
          <ul>
            <li>User: {auth.user ? auth.user.name || 'Unknown' : 'Not logged in'}</li>
            <li>Authenticated: {auth.isAuthenticated ? 'Yes' : 'No'}</li>
            <li>Loading: {auth.isLoading ? 'Yes' : 'No'}</li>
          </ul>
        </div>
        <div className="col-md-4">
          <h6>Tasks State:</h6>
          <ul>
            <li>Tasks Count: {tasks.items ? tasks.items.length : 0}</li>
            <li>Loading: {tasks.isLoading ? 'Yes' : 'No'}</li>
            <li>Error: {tasks.error || 'None'}</li>
          </ul>
        </div>
        <div className="col-md-4">
          <h6>UI State:</h6>
          <ul>
            <li>Theme: {ui.theme}</li>
            <li>Sidebar Open: {ui.sidebarOpen ? 'Yes' : 'No'}</li>
            <li>Global Loading: {ui.loading.global ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      </div>
      <div className="mt-3">
        <button 
          className="btn btn-primary me-2"
          onClick={() => {
            console.log('Testing Redux actions...');
            // Test Redux actions
            if (tasks.setTasks) {
              tasks.setTasks([
                { id: 1, title: 'Test Task 1', status: 'pending' },
                { id: 2, title: 'Test Task 2', status: 'completed' }
              ]);
            }
            if (ui.setTheme) {
              ui.setTheme(ui.theme === 'light' ? 'dark' : 'light');
            }
          }}
        >
          Test Redux Actions
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            console.log('Current Redux state:');
            console.log('Auth:', auth);
            console.log('Tasks:', tasks);
            console.log('UI:', ui);
          }}
        >
          Log State
        </button>
      </div>
    </div>
  );
};

export default ReduxTest;
