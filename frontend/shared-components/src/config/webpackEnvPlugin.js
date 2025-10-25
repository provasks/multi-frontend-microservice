/**
 * Webpack Environment Plugin
 * Injects environment variables at build time for browser compatibility
 */

const webpack = require('webpack');

class WebpackEnvPlugin {
  constructor(options = {}) {
    this.options = {
      // Default environment variables to inject
      IDLE_TIMEOUT_ENABLED: process.env.IDLE_TIMEOUT_ENABLED || 'true',
      IDLE_TIMEOUT_DURATION: process.env.IDLE_TIMEOUT_DURATION || '2',
      IDLE_TIMEOUT_WARNING: process.env.IDLE_TIMEOUT_WARNING || '30',
      IDLE_TIMEOUT_TEST_DURATION: process.env.IDLE_TIMEOUT_TEST_DURATION || '30',
      IDLE_TIMEOUT_TEST_WARNING: process.env.IDLE_TIMEOUT_TEST_WARNING || '10',
      IDLE_TIMEOUT_LOG_ACTIVITY: process.env.IDLE_TIMEOUT_LOG_ACTIVITY || 'false',
      NODE_ENV: process.env.NODE_ENV || 'development',
      ...options
    };
  }

  apply(compiler) {
    new webpack.DefinePlugin({
      'process.env.IDLE_TIMEOUT_ENABLED': JSON.stringify(this.options.IDLE_TIMEOUT_ENABLED),
      'process.env.IDLE_TIMEOUT_DURATION': JSON.stringify(this.options.IDLE_TIMEOUT_DURATION),
      'process.env.IDLE_TIMEOUT_WARNING': JSON.stringify(this.options.IDLE_TIMEOUT_WARNING),
      'process.env.IDLE_TIMEOUT_TEST_DURATION': JSON.stringify(this.options.IDLE_TIMEOUT_TEST_DURATION),
      'process.env.IDLE_TIMEOUT_TEST_WARNING': JSON.stringify(this.options.IDLE_TIMEOUT_TEST_WARNING),
      'process.env.IDLE_TIMEOUT_LOG_ACTIVITY': JSON.stringify(this.options.IDLE_TIMEOUT_LOG_ACTIVITY),
      'process.env.NODE_ENV': JSON.stringify(this.options.NODE_ENV),
      
      // Also inject into window object for runtime access
      'window.IDLE_TIMEOUT_ENABLED': JSON.stringify(this.options.IDLE_TIMEOUT_ENABLED),
      'window.IDLE_TIMEOUT_DURATION': JSON.stringify(this.options.IDLE_TIMEOUT_DURATION),
      'window.IDLE_TIMEOUT_WARNING': JSON.stringify(this.options.IDLE_TIMEOUT_WARNING),
      'window.IDLE_TIMEOUT_TEST_DURATION': JSON.stringify(this.options.IDLE_TIMEOUT_TEST_DURATION),
      'window.IDLE_TIMEOUT_TEST_WARNING': JSON.stringify(this.options.IDLE_TIMEOUT_TEST_WARNING),
      'window.IDLE_TIMEOUT_LOG_ACTIVITY': JSON.stringify(this.options.IDLE_TIMEOUT_LOG_ACTIVITY),
      'window.NODE_ENV': JSON.stringify(this.options.NODE_ENV)
    }).apply(compiler);
  }
}

module.exports = WebpackEnvPlugin;
