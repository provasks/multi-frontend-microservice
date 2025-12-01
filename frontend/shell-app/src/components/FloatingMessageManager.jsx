import React, { useState, useEffect } from 'react';
import './FloatingMessageManager.css';

// Try to import event bus (may not be available in all environments)
let eventBus, EVENT_TYPES;
try {
  const eventBusModule = require('sharedComponents/utils/eventBus');
  const eventTypesModule = require('sharedComponents/utils/eventTypes');
  eventBus = eventBusModule.default || eventBusModule;
  EVENT_TYPES = eventTypesModule.EVENT_TYPES;
} catch (error) {
  // Event bus not available, will use window functions only
  // This is fine - we'll use window functions as fallback
}

const FloatingMessageManager = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Create global functions for showing messages (backward compatibility)
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

    // Listen to event bus for event-based communication (new approach)
    if (eventBus && EVENT_TYPES) {
      const unsubscribeNotification = eventBus.on(EVENT_TYPES.NOTIFICATION_RECEIVED, (payload) => {
        const { type, message } = payload;
        
        // Map event types to message types
        const typeMap = {
          'success': 'success',
          'error': 'danger',
          'warning': 'warning',
          'info': 'info',
        };
        
        const messageType = typeMap[type] || 'info';
        addMessage(message, messageType);
      });

      const unsubscribeError = eventBus.on(EVENT_TYPES.ERROR_OCCURRED, (payload) => {
        const { message, type } = payload;
        const errorMessage = message || 'An error occurred';
        addMessage(errorMessage, 'danger');
      });

      return () => {
        // Cleanup global functions
        delete window.showSuccess;
        delete window.showError;
        delete window.showWarning;
        delete window.showInfo;
        
        // Cleanup event listeners
        if (unsubscribeNotification) unsubscribeNotification();
        if (unsubscribeError) unsubscribeError();
      };
    }

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
    <div className="position-fixed floating-message-container" data-testid="floating-message-container">
      {messages.map(message => (
        <div
          key={message.id}
          className={`alert alert-${message.type} alert-dismissible fade show floating-message`}
          role="alert"
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
