const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const WebpackEnvPlugin = require('./src/config/webpackEnvPlugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    port: 4004,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:4000 http://localhost:4001 http://localhost:4002 http://localhost:4003; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; font-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; img-src 'self' data: https:; connect-src 'self' http://localhost:* ws://localhost:* https://cdn.jsdelivr.net; frame-ancestors 'none';",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    },
    // Disable webpack error overlay
    client: {
      overlay: false,
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new WebpackEnvPlugin(),
    new ModuleFederationPlugin({
      name: 'sharedComponents',
      filename: 'remoteEntry.js',
      exposes: {
        './LoadingSpinner': './src/components/LoadingSpinner',
        './LoadingSkeleton': './src/components/LoadingSkeleton',
        './ErrorState': './src/components/ErrorState',
        './PerformanceMonitor': './src/components/PerformanceMonitor',
        './SearchBar': './src/components/SearchBar',
        './Modal': './src/components/Modal',
        './Button': './src/components/Button',
        './Badge': './src/components/Badge',
        './Tooltip': './src/components/Tooltip',
        './IdleTimeoutWarning': './src/components/IdleTimeoutWarning',
        './IdleTimeoutConfig': './src/components/IdleTimeoutConfig',
        './IdleTimeoutDebug': './src/components/IdleTimeoutDebug',
        './TouchpadDebug': './src/components/TouchpadDebug',
        './useAuth': './src/hooks/useAuth',
        './useGlobalErrorHandler': './src/hooks/useGlobalErrorHandler',
        './useRateLimit': './src/hooks/useRateLimit',
        './security': './src/utils/security',
        './unifiedApiClient': './src/utils/unifiedApiClient',
        './constants': './src/constants',
        './frontendConfig': './src/config/frontendConfig',
        './storage': './src/utils/storage',
        './logout': './src/utils/logout',
        './ReduxStore': './src/store/simpleStore',
        './ReduxHooks': './src/store/simpleHooks',
        './ReduxSelectors': './src/store/selectors/authSelectors'
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.2.0',
          eager: false,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.2.0',
          eager: false,
        },
        '@reduxjs/toolkit': {
          singleton: true,
          requiredVersion: '^2.0.1',
          eager: false,
        },
        'react-redux': {
          singleton: true,
          requiredVersion: '^9.0.4',
          eager: false,
        },
        'redux-persist': {
          singleton: true,
          requiredVersion: '^6.0.0',
          eager: false,
        },
        'reselect': {
          singleton: true,
          requiredVersion: '^5.0.1',
          eager: false,
        },
      },
    }),
  ],
};
