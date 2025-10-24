import React from 'react';
import ReactDOM from 'react-dom/client';
import UserManagement from './UserManagement';

// For standalone development
if (document.getElementById('root')) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<UserManagement />);
}
