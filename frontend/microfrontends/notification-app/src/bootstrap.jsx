import React from 'react';
import ReactDOM from 'react-dom/client';
import Notifications from './Notifications';

// For standalone development
if (document.getElementById('root')) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Notifications />);
}
