import React, { useState, useEffect } from 'react';

const FloatingMessageManager = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Create global functions for showing messages
    window.showSuccess = (message) => {
      addMessage(message, 'success');
    };

    window.showError = (message) => {
      addMessage(message, 'danger');
    };

    window.showWarning = (message) => {
      addMessage(message, 'warning');
    };

    window.showInfo = (message) => {
      addMessage(message, 'info');
    };

    return () => {
      // Cleanup global functions
      delete window.showSuccess;
      delete window.showError;
      delete window.showWarning;
      delete window.showInfo;
    };
  }, []);

  const addMessage = (text, type) => {
    const id = Date.now() + Math.random();
    const message = { id, text, type };
    
    setMessages(prev => [...prev, message]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== id));
    }, 4000);
  };

  const removeMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return (
    <div className="position-fixed" style={{ top: '20px', right: '20px', zIndex: 9999 }}>
      {messages.map(message => (
        <div
          key={message.id}
          className={`alert alert-${message.type} alert-dismissible fade show`}
          role="alert"
          style={{ minWidth: '300px', marginBottom: '10px' }}
        >
          {message.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => removeMessage(message.id)}
          ></button>
        </div>
      ))}
    </div>
  );
};

export default FloatingMessageManager;
