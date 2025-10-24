import React from 'react';
import ReactDOM from 'react-dom/client';
import TaskManagement from './TaskManagement';

// For standalone development
if (document.getElementById('root')) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<TaskManagement />);
}
