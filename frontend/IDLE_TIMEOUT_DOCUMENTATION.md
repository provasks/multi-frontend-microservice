# Idle Timeout Security Feature Documentation

## Overview

The Idle Timeout feature provides automatic session management by logging out users after a period of inactivity. This is a crucial security feature that prevents unauthorized access to user sessions when they leave their devices unattended.

## Features

### 🔒 **Security Benefits**
- **Automatic Logout**: Users are automatically logged out after configurable inactivity period
- **Warning System**: Users receive advance warning before logout
- **Configurable Timeouts**: Administrators can set custom timeout periods
- **Activity Tracking**: Monitors user interactions to detect activity
- **Session Protection**: Prevents unauthorized access to unattended sessions

### ⚙️ **Configuration Options**
- **Timeout Duration**: 1 minute to 60 minutes (configurable)
- **Warning Time**: 5 seconds to 5 minutes before timeout
- **Activity Events**: Mouse, keyboard, scroll, touch, and focus events
- **Enable/Disable**: Can be turned on/off per user or globally
- **Preset Options**: Quick configuration with common timeout values

### 🎯 **User Experience**
- **Visual Warning**: Modal dialog with countdown timer
- **User Control**: Options to stay logged in or pause timeout
- **Activity Reset**: Timer resets automatically on user activity
- **Non-Intrusive**: Only shows warning when timeout is approaching
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

### **Components Structure**
```
frontend/shared-components/src/
├── utils/
│   └── idleTimeout.js              # Core idle timeout logic
├── store/
│   ├── slices/
│   │   └── idleTimeoutSlice.js     # Redux slice for state management
│   └── hooks/
│       └── useIdleTimeout.js       # Custom hook for idle timeout
├── components/
│   ├── IdleTimeoutWarning.jsx      # Warning modal component
│   └── IdleTimeoutConfig.jsx       # Configuration component
└── config/
    └── idleTimeout.js              # Configuration constants
```

### **Redux Integration**
- **State Management**: Centralized idle timeout state in Redux store
- **Actions**: Dispatch actions for timeout control
- **Selectors**: Access timeout state and configuration
- **Middleware**: Automatic state synchronization

### **Event Tracking**
The system tracks the following user activities:
- **Mouse Events**: `mousedown`, `mousemove`, `click`
- **Keyboard Events**: `keypress`, `keydown`
- **Scroll Events**: `scroll`
- **Touch Events**: `touchstart`
- **Focus Events**: `focus`, `blur`

## Implementation

### **1. Core Idle Timeout Class**
```javascript
// frontend/shared-components/src/utils/idleTimeout.js
class IdleTimeout {
  constructor(options = {}) {
    this.timeout = options.timeout || 2 * 60 * 1000; // 2 minutes
    this.warningTime = options.warningTime || 30 * 1000; // 30 seconds
    this.events = options.events || ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    this.onTimeout = options.onTimeout || (() => {});
    this.onWarning = options.onWarning || (() => {});
    this.onReset = options.onReset || (() => {});
  }
}
```

### **2. Redux Slice**
```javascript
// frontend/shared-components/src/store/slices/idleTimeoutSlice.js
const idleTimeoutSlice = createSlice({
  name: 'idleTimeout',
  initialState: {
    isActive: false,
    isWarning: false,
    timeRemaining: 0,
    timeout: 2 * 60 * 1000,
    warningTime: 30 * 1000,
    isEnabled: true,
    lastActivity: Date.now()
  },
  reducers: {
    setIdleTimeout: (state, action) => { /* ... */ },
    setActive: (state, action) => { /* ... */ },
    setWarning: (state, action) => { /* ... */ },
    // ... more reducers
  }
});
```

### **3. Custom Hook**
```javascript
// frontend/shared-components/src/store/hooks/useIdleTimeout.js
const useIdleTimeout = () => {
  const dispatch = useDispatch();
  const idleTimeout = useSelector(state => state.idleTimeout);
  
  // Initialize idle timeout
  useEffect(() => {
    if (!isEnabled) return;
    
    const idleTimeoutInstance = new IdleTimeout({
      timeout,
      warningTime,
      onTimeout: handleTimeout,
      onWarning: handleWarning,
      onReset: handleReset
    });
    
    return () => idleTimeoutInstance.destroy();
  }, [timeout, warningTime, isEnabled]);
  
  return {
    // State and actions
  };
};
```

### **4. Warning Component**
```javascript
// frontend/shared-components/src/components/IdleTimeoutWarning.jsx
const IdleTimeoutWarning = () => {
  const { isWarning, formattedTimeRemaining, resetIdleTimeout, pauseIdleTimeout } = useIdleTimeout();
  
  if (!isWarning) return null;
  
  return (
    <div className="idle-timeout-warning">
      <div className="idle-timeout-warning__modal">
        <h3>Session Timeout Warning</h3>
        <p>You will be automatically logged out in {formattedTimeRemaining}</p>
        <button onClick={resetIdleTimeout}>Stay Logged In</button>
        <button onClick={pauseIdleTimeout}>Pause Timeout</button>
      </div>
    </div>
  );
};
```

## Usage

### **1. Basic Implementation**
```javascript
// In your main App component
import { IdleTimeoutWarning, IdleTimeoutConfig } from 'sharedComponents';

const App = () => {
  return (
    <div>
      {/* Your app content */}
      <IdleTimeoutWarning />
      <IdleTimeoutConfig />
    </div>
  );
};
```

### **2. Using the Hook**
```javascript
import { useIdleTimeout } from 'sharedComponents/ReduxHooks';

const MyComponent = () => {
  const {
    isActive,
    isWarning,
    timeRemaining,
    formattedTimeRemaining,
    resetIdleTimeout,
    pauseIdleTimeout
  } = useIdleTimeout();
  
  return (
    <div>
      {isWarning && (
        <div>Warning: You will be logged out in {formattedTimeRemaining}</div>
      )}
      <button onClick={resetIdleTimeout}>Reset Timer</button>
    </div>
  );
};
```

### **3. Configuration**
```javascript
import { useIdleTimeout } from 'sharedComponents/ReduxHooks';

const ConfigComponent = () => {
  const { setIdleTimeout } = useIdleTimeout();
  
  const handleSave = () => {
    setIdleTimeout({
      timeout: 5 * 60 * 1000, // 5 minutes
      warningTime: 60 * 1000, // 1 minute warning
      isEnabled: true
    });
  };
  
  return <button onClick={handleSave}>Save Configuration</button>;
};
```

## Configuration

### **Environment-Based Configuration**
```javascript
// Environment variables control the configuration
const IDLE_TIMEOUT_CONFIG = {
  // Production: 15 minutes timeout, 2 minutes warning
  // Development: 2 minutes timeout, 30 seconds warning
  DEFAULT_TIMEOUT: process.env.IDLE_TIMEOUT_DURATION * 60 * 1000 || defaultValue,
  DEFAULT_WARNING_TIME: process.env.IDLE_TIMEOUT_WARNING * 1000 || defaultValue,
  ENABLED: process.env.IDLE_TIMEOUT_ENABLED !== 'false',
  
  // Validation limits
  MIN_TIMEOUT: 1 * 60 * 1000, // 1 minute
  MAX_TIMEOUT: 60 * 60 * 1000, // 60 minutes
  MIN_WARNING_TIME: 5 * 1000, // 5 seconds
  MAX_WARNING_TIME: 5 * 60 * 1000, // 5 minutes
};
```

### **Environment Variables**
```bash
# Core configuration
IDLE_TIMEOUT_ENABLED=true
IDLE_TIMEOUT_DURATION=2        # minutes
IDLE_TIMEOUT_WARNING=30        # seconds

# Development/testing
IDLE_TIMEOUT_TEST_DURATION=30  # seconds
IDLE_TIMEOUT_TEST_WARNING=10   # seconds
IDLE_TIMEOUT_LOG_ACTIVITY=false
```

### **Preset Options**
```javascript
const PRESETS = [
  { label: '1 minute', value: 1, timeout: 1 * 60 * 1000 },
  { label: '2 minutes', value: 2, timeout: 2 * 60 * 1000 },
  { label: '5 minutes', value: 5, timeout: 5 * 60 * 1000 },
  { label: '10 minutes', value: 10, timeout: 10 * 60 * 1000 },
  { label: '15 minutes', value: 15, timeout: 15 * 60 * 1000 },
  { label: '30 minutes', value: 30, timeout: 30 * 60 * 1000 }
];
```

## Security Considerations

### **1. Session Protection**
- **Automatic Logout**: Prevents unauthorized access to unattended sessions
- **Token Invalidation**: Clears authentication tokens on timeout
- **Redirect to Login**: Forces user to re-authenticate

### **2. Activity Detection**
- **Multiple Events**: Tracks various user interactions
- **Real-time Monitoring**: Continuous activity detection
- **Reset on Activity**: Timer resets on any user interaction

### **3. User Control**
- **Warning System**: Gives users chance to stay logged in
- **Pause Option**: Allows temporary timeout suspension
- **Configuration**: Users can adjust timeout settings

## Testing

### **1. Manual Testing**
- Navigate to `/idle-timeout-test` in the application
- Configure timeout settings
- Test warning and logout functionality
- Verify activity tracking

### **2. Test Scenarios**
- **Normal Flow**: User activity resets timer
- **Warning Flow**: Warning appears before timeout
- **Timeout Flow**: User is logged out after timeout
- **Pause Flow**: Timer can be paused and resumed
- **Configuration Flow**: Settings can be changed

### **3. Edge Cases**
- **Rapid Activity**: Multiple events don't cause issues
- **Browser Focus**: Works when tab is not active
- **Mobile Devices**: Touch events are properly tracked
- **Network Issues**: Works offline

## Browser Compatibility

### **Supported Events**
- **Mouse Events**: All modern browsers
- **Keyboard Events**: All modern browsers
- **Touch Events**: Mobile browsers
- **Focus Events**: All modern browsers

### **Fallback Support**
- **Event Listeners**: Graceful degradation for unsupported events
- **Timer Fallback**: Uses setTimeout as fallback
- **Storage Fallback**: localStorage for configuration persistence

## Performance

### **Optimizations**
- **Event Throttling**: Prevents excessive event handling
- **Memory Management**: Proper cleanup of event listeners
- **Timer Efficiency**: Single timer for timeout management
- **State Updates**: Minimal Redux state updates

### **Resource Usage**
- **Memory**: Minimal memory footprint
- **CPU**: Low CPU usage for event tracking
- **Network**: No network requests for timeout functionality
- **Storage**: Minimal localStorage usage

## Troubleshooting

### **Common Issues**

#### **1. Timeout Not Working**
- Check if idle timeout is enabled
- Verify event listeners are attached
- Ensure Redux store is properly configured

#### **2. Warning Not Showing**
- Check if warning time is configured
- Verify component is rendered
- Check for CSS conflicts

#### **3. Timer Not Resetting**
- Verify activity events are being tracked
- Check for event listener conflicts
- Ensure proper cleanup of old timers

### **Debug Mode**
```javascript
// Enable debug logging
const IDLE_TIMEOUT_CONFIG = {
  DEV: {
    ENABLED: true,
    LOG_ACTIVITY: true, // Enable activity logging
    SHORT_TIMEOUT: 30 * 1000, // 30 seconds for testing
    SHORT_WARNING: 10 * 1000 // 10 seconds for testing
  }
};
```

## Future Enhancements

### **Planned Features**
- **Server-side Timeout**: Synchronize with backend session timeout
- **User Preferences**: Per-user timeout settings
- **Admin Dashboard**: Global timeout configuration
- **Analytics**: Timeout statistics and reporting
- **Mobile Optimization**: Enhanced mobile experience

### **Advanced Features**
- **Smart Timeout**: Adjust timeout based on user behavior
- **Activity Patterns**: Learn user activity patterns
- **Integration**: Integrate with other security features
- **Notifications**: Push notifications for timeout warnings

## Conclusion

The Idle Timeout feature provides comprehensive session security through automatic logout after user inactivity. It offers flexible configuration, excellent user experience, and robust security protection. The implementation is modular, testable, and easily extensible for future enhancements.

### **Key Benefits**
- ✅ **Enhanced Security**: Prevents unauthorized access
- ✅ **User-Friendly**: Clear warnings and controls
- ✅ **Configurable**: Flexible timeout settings
- ✅ **Performant**: Efficient resource usage
- ✅ **Testable**: Comprehensive testing capabilities
- ✅ **Extensible**: Easy to add new features

This feature significantly improves the security posture of the application while maintaining a positive user experience.
