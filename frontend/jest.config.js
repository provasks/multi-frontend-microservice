module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module name mapping for microfrontend architecture
  moduleNameMapper: {
    '^sharedComponents/(.*)$': '<rootDir>/shared-components/src/$1',
    '^@/(.*)$': '<rootDir>/$1',
    '^userApp/(.*)$': '<rootDir>/microfrontends/user-app/src/$1',
    '^taskApp/(.*)$': '<rootDir>/microfrontends/task-app/src/$1',
    '^notificationApp/(.*)$': '<rootDir>/microfrontends/notification-app/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub'
  },
  
  // Module directories
  moduleDirectories: [
    'node_modules', 
    '<rootDir>/shared-components/src',
    '<rootDir>/shell-app/src',
    '<rootDir>/microfrontends/task-app/src',
    '<rootDir>/microfrontends/user-app/src',
    '<rootDir>/microfrontends/notification-app/src'
  ],
  
  // Test file patterns - include all frontend components
  testMatch: [
    '<rootDir>/shell-app/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/shell-app/src/**/*.{test,spec}.{js,jsx}',
    '<rootDir>/shared-components/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/shared-components/src/**/*.{test,spec}.{js,jsx}',
    '<rootDir>/microfrontends/task-app/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/microfrontends/task-app/src/**/*.{test,spec}.{js,jsx}',
    '<rootDir>/microfrontends/user-app/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/microfrontends/user-app/src/**/*.{test,spec}.{js,jsx}',
    '<rootDir>/microfrontends/notification-app/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/microfrontends/notification-app/src/**/*.{test,spec}.{js,jsx}'
  ],
  
  // Coverage configuration - DISABLED at root level to prevent duplication
  collectCoverage: false,
  
  // Coverage thresholds for the entire frontend
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html', 'json', 'clover'],
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'json'],
  
  // Test timeout
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Projects configuration for better organization
  projects: [
    {
      displayName: 'shell-app',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/shell-app/src/setupTests.js'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub'
      },
      transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
      },
      testMatch: ['<rootDir>/shell-app/src/**/*.{test,spec}.{js,jsx}', '<rootDir>/shell-app/src/**/__tests__/**/*.{js,jsx}'],
      collectCoverageFrom: [
        'shell-app/src/**/*.{js,jsx}',
        '!shell-app/src/index.jsx',
        '!shell-app/src/bootstrap.jsx',
        '!shell-app/src/**/*.test.{js,jsx}',
        '!shell-app/src/**/*.spec.{js,jsx}',
        '!shell-app/src/**/__tests__/**'
      ],
      coverageDirectory: '<rootDir>/shell-app/coverage'
    },
    {
      displayName: 'shared-components',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/shared-components/src/setupTests.js'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub'
      },
      transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
      },
      testMatch: ['<rootDir>/shared-components/src/**/*.{test,spec}.{js,jsx}', '<rootDir>/shared-components/src/**/__tests__/**/*.{js,jsx}'],
      collectCoverageFrom: [
        'shared-components/src/**/*.{js,jsx}',
        '!shared-components/src/index.js',
        '!shared-components/src/**/*.test.{js,jsx}',
        '!shared-components/src/**/*.spec.{js,jsx}',
        '!shared-components/src/**/__tests__/**'
      ],
      coverageDirectory: '<rootDir>/shared-components/coverage'
    },
    {
      displayName: 'task-app',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/microfrontends/task-app/src/setupTests.js'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub'
      },
      transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
      },
      testMatch: ['<rootDir>/microfrontends/task-app/src/**/*.{test,spec}.{js,jsx}', '<rootDir>/microfrontends/task-app/src/**/__tests__/**/*.{js,jsx}'],
      collectCoverageFrom: [
        'microfrontends/task-app/src/**/*.{js,jsx}',
        '!microfrontends/task-app/src/index.jsx',
        '!microfrontends/task-app/src/bootstrap.jsx',
        '!microfrontends/task-app/src/setupTests.js',
        '!microfrontends/task-app/src/**/*.test.{js,jsx}',
        '!microfrontends/task-app/src/**/*.spec.{js,jsx}',
        '!microfrontends/task-app/src/**/__tests__/**',
        '!microfrontends/task-app/src/**/__mocks__/**'
      ],
      coverageDirectory: '<rootDir>/microfrontends/task-app/coverage'
    },
    {
      displayName: 'user-app',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/microfrontends/user-app/src/setupTests.js'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub'
      },
      transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
      },
      testMatch: ['<rootDir>/microfrontends/user-app/src/**/*.{test,spec}.{js,jsx}', '<rootDir>/microfrontends/user-app/src/**/__tests__/**/*.{js,jsx}'],
      collectCoverageFrom: [
        'microfrontends/user-app/src/**/*.{js,jsx}',
        '!microfrontends/user-app/src/index.jsx',
        '!microfrontends/user-app/src/bootstrap.jsx',
        '!microfrontends/user-app/src/setupTests.js',
        '!microfrontends/user-app/src/**/*.test.{js,jsx}',
        '!microfrontends/user-app/src/**/*.spec.{js,jsx}',
        '!microfrontends/user-app/src/**/__tests__/**'
      ],
      coverageDirectory: '<rootDir>/microfrontends/user-app/coverage'
    },
    {
      displayName: 'notification-app',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/microfrontends/notification-app/src/setupTests.js'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub'
      },
      transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
      },
      testMatch: ['<rootDir>/microfrontends/notification-app/src/**/*.{test,spec}.{js,jsx}', '<rootDir>/microfrontends/notification-app/src/**/__tests__/**/*.{js,jsx}'],
      collectCoverageFrom: [
        'microfrontends/notification-app/src/**/*.{js,jsx}',
        '!microfrontends/notification-app/src/index.jsx',
        '!microfrontends/notification-app/src/bootstrap.jsx',
        '!microfrontends/notification-app/src/setupTests.js',
        '!microfrontends/notification-app/src/**/*.test.{js,jsx}',
        '!microfrontends/notification-app/src/**/*.spec.{js,jsx}',
        '!microfrontends/notification-app/src/**/__tests__/**'
      ],
      coverageDirectory: '<rootDir>/microfrontends/notification-app/coverage'
    }
  ]
};

