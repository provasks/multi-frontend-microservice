const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  mode: 'development',
  entry: './src/index.jsx',
  devServer: {
    port: 4000,
    historyApiFallback: true,
    hot: false,
    liveReload: false,
    webSocketServer: false,
    client: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:4001 http://localhost:4002 http://localhost:4003 http://localhost:4004; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; font-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; img-src 'self' data: https:; connect-src 'self' http://localhost:* ws://localhost:* https://cdn.jsdelivr.net; frame-ancestors 'none';",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
    },
    // Disable webpack error overlay
    client: {
      overlay: false,
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 20,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
          priority: 5,
        },
        shared: {
          test: /[\\/]node_modules[\\/]/,
          name: 'shared',
          chunks: 'all',
          priority: 1,
        }
      }
    },
    usedExports: true,
    sideEffects: false,
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
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        userApp: 'userApp@http://localhost:4001/remoteEntry.js',
        taskApp: 'taskApp@http://localhost:4002/remoteEntry.js',
        notificationApp: 'notificationApp@http://localhost:4003/remoteEntry.js',
        sharedComponents: 'sharedComponents@http://localhost:4004/remoteEntry.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.2.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.2.0',
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: '^6.8.0',
        },
        'react-redux': {
          singleton: true,
          requiredVersion: '^9.0.4',
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
