# Idle Timeout Environment Configuration

## Environment Variables

Configure idle timeout behavior using the following environment variables:

### **Core Configuration**

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `IDLE_TIMEOUT_ENABLED` | Enable/disable idle timeout | `true` | `IDLE_TIMEOUT_ENABLED=true` |
| `IDLE_TIMEOUT_DURATION` | Timeout duration in minutes | `2` (dev), `15` (prod) | `IDLE_TIMEOUT_DURATION=5` |
| `IDLE_TIMEOUT_WARNING` | Warning time in seconds | `30` (dev), `120` (prod) | `IDLE_TIMEOUT_WARNING=60` |

### **Development/Testing Configuration**

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `IDLE_TIMEOUT_TEST_DURATION` | Test timeout in seconds | `30` | `IDLE_TIMEOUT_TEST_DURATION=10` |
| `IDLE_TIMEOUT_TEST_WARNING` | Test warning in seconds | `10` | `IDLE_TIMEOUT_TEST_WARNING=5` |
| `IDLE_TIMEOUT_LOG_ACTIVITY` | Enable activity logging | `false` | `IDLE_TIMEOUT_LOG_ACTIVITY=true` |

## Configuration Examples

### **Production Configuration**
```bash
# 15-minute timeout with 2-minute warning
IDLE_TIMEOUT_DURATION=15
IDLE_TIMEOUT_WARNING=120
IDLE_TIMEOUT_ENABLED=true
```

### **Development Configuration**
```bash
# 2-minute timeout with 30-second warning
IDLE_TIMEOUT_DURATION=2
IDLE_TIMEOUT_WARNING=30
IDLE_TIMEOUT_ENABLED=true
```

### **Testing Configuration**
```bash
# 30-second timeout for quick testing
IDLE_TIMEOUT_DURATION=0.5
IDLE_TIMEOUT_WARNING=10
IDLE_TIMEOUT_TEST_DURATION=30
IDLE_TIMEOUT_TEST_WARNING=10
IDLE_TIMEOUT_LOG_ACTIVITY=true
```

### **Disabled Configuration**
```bash
# Disable idle timeout completely
IDLE_TIMEOUT_ENABLED=false
```

## Environment-Specific Defaults

### **Development Environment**
- **Timeout**: 2 minutes
- **Warning**: 30 seconds
- **Test Timeout**: 30 seconds
- **Test Warning**: 10 seconds
- **Logging**: Disabled

### **Production Environment**
- **Timeout**: 15 minutes
- **Warning**: 2 minutes
- **Test Timeout**: 30 seconds
- **Test Warning**: 10 seconds
- **Logging**: Disabled

## Implementation

The configuration is automatically loaded from environment variables:

```javascript
// In config/idleTimeout.js
const getEnvConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') {
    return {
      DEFAULT_TIMEOUT: parseInt(process.env.IDLE_TIMEOUT_DURATION) * 60 * 1000 || 15 * 60 * 1000,
      DEFAULT_WARNING_TIME: parseInt(process.env.IDLE_TIMEOUT_WARNING) * 1000 || 2 * 60 * 1000,
      ENABLED: process.env.IDLE_TIMEOUT_ENABLED !== 'false'
    };
  }
  
  return {
    DEFAULT_TIMEOUT: parseInt(process.env.IDLE_TIMEOUT_DURATION) * 60 * 1000 || 2 * 60 * 1000,
    DEFAULT_WARNING_TIME: parseInt(process.env.IDLE_TIMEOUT_WARNING) * 1000 || 30 * 1000,
    ENABLED: process.env.IDLE_TIMEOUT_ENABLED !== 'false'
  };
};
```

## Validation

The configuration includes validation for minimum and maximum values:

- **Minimum Timeout**: 1 minute
- **Maximum Timeout**: 60 minutes
- **Minimum Warning**: 5 seconds
- **Maximum Warning**: 5 minutes

## Usage in Code

```javascript
// Access configuration
const IDLE_TIMEOUT_CONFIG = require('./config/idleTimeout');

// Use in components
const timeout = IDLE_TIMEOUT_CONFIG.DEFAULT_TIMEOUT;
const warningTime = IDLE_TIMEOUT_CONFIG.DEFAULT_WARNING_TIME;
const isEnabled = IDLE_TIMEOUT_CONFIG.ENABLED;
```

## Docker Configuration

For Docker deployments, set environment variables in your Dockerfile or docker-compose.yml:

```yaml
# docker-compose.yml
environment:
  - IDLE_TIMEOUT_DURATION=15
  - IDLE_TIMEOUT_WARNING=120
  - IDLE_TIMEOUT_ENABLED=true
```

## Security Considerations

- **Production Timeouts**: Use longer timeouts in production (15+ minutes)
- **Development Timeouts**: Use shorter timeouts for testing (1-2 minutes)
- **Warning Times**: Ensure adequate warning time for users
- **Environment Separation**: Keep dev and prod configurations separate

## Troubleshooting

### **Configuration Not Loading**
- Check environment variable names (case-sensitive)
- Verify variable values are valid numbers
- Ensure variables are set before application startup

### **Timeout Not Working**
- Verify `IDLE_TIMEOUT_ENABLED=true`
- Check timeout values are reasonable
- Ensure proper environment detection

### **Development Issues**
- Use test configuration for quick testing
- Enable activity logging for debugging
- Check console for configuration values
