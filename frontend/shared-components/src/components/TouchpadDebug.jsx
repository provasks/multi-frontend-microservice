/**
 * Touchpad Debug Component
 * Helps debug touchpad event detection for idle timeout
 */

import React, { useState, useEffect } from 'react';
import './TouchpadDebug.css';

const TouchpadDebug = () => {
  const [events, setEvents] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleEvent = (event) => {
      const eventInfo = {
        type: event.type,
        timestamp: new Date().toLocaleTimeString(),
        isTouchpad: event.type.includes('pointer') || event.type.includes('touch') || event.type.includes('wheel'),
        isMouse: event.type.includes('mouse'),
        isKeyboard: event.type.includes('key'),
        target: event.target?.tagName || 'unknown',
        clientX: event.clientX,
        clientY: event.clientY,
        pointerType: event.pointerType || 'unknown'
      };

      setEvents(prev => [eventInfo, ...prev.slice(0, 19)]); // Keep last 20 events
    };

    // Listen to all the same events as idle timeout
    const eventTypes = [
      'mousedown', 'mousemove', 'mouseup', 'mouseenter', 'mouseleave',
      'mouseover', 'mouseout', 'keypress', 'keydown', 'keyup',
      'touchstart', 'touchend', 'touchmove', 'touchcancel',
      'pointerdown', 'pointerup', 'pointermove', 'pointerenter', 'pointerleave',
      'pointerover', 'pointerout', 'pointercancel', 'gotpointercapture', 'lostpointercapture',
      'wheel', 'scroll', 'click', 'dblclick', 'contextmenu',
      'focus', 'blur', 'focusin', 'focusout',
      'input', 'change', 'submit', 'reset',
      'resize', 'orientationchange',
      'dragstart', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'drop',
      'gesturestart', 'gesturechange', 'gestureend', 'gesturecancel',
      'select', 'selectstart', 'selectend',
      'play', 'pause', 'seeked', 'volumechange',
      'visibilitychange', 'pageshow', 'pagehide'
    ];

    eventTypes.forEach(eventType => {
      document.addEventListener(eventType, handleEvent, true);
    });

    return () => {
      eventTypes.forEach(eventType => {
        document.removeEventListener(eventType, handleEvent, true);
      });
    };
  }, []);

  if (!isVisible) {
    return (
      <button 
        className="touchpad-debug-toggle"
        onClick={() => setIsVisible(true)}
        title="Show Touchpad Debug"
      >
        🐛 Debug
      </button>
    );
  }

  return (
    <div className="touchpad-debug">
      <div className="touchpad-debug-header">
        <h3>🐛 Touchpad Debug</h3>
        <button onClick={() => setIsVisible(false)}>✕</button>
      </div>
      
      <div className="touchpad-debug-stats">
        <div className="stat">
          <span className="label">Total Events:</span>
          <span className="value">{events.length}</span>
        </div>
        <div className="stat">
          <span className="label">Touchpad Events:</span>
          <span className="value">{events.filter(e => e.isTouchpad).length}</span>
        </div>
        <div className="stat">
          <span className="label">Mouse Events:</span>
          <span className="value">{events.filter(e => e.isMouse).length}</span>
        </div>
        <div className="stat">
          <span className="label">Keyboard Events:</span>
          <span className="value">{events.filter(e => e.isKeyboard).length}</span>
        </div>
      </div>

      <div className="touchpad-debug-events">
        <h4>Recent Events:</h4>
        <div className="events-list">
          {events.map((event, index) => (
            <div 
              key={index} 
              className={`event-item ${event.isTouchpad ? 'touchpad' : event.isMouse ? 'mouse' : event.isKeyboard ? 'keyboard' : 'other'}`}
            >
              <span className="event-type">{event.type}</span>
              <span className="event-time">{event.timestamp}</span>
              <span className="event-target">{event.target}</span>
              {event.pointerType && <span className="event-pointer">({event.pointerType})</span>}
              {event.clientX && <span className="event-coords">({event.clientX}, {event.clientY})</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TouchpadDebug;
