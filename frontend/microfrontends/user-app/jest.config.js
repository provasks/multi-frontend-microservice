module.exports = {
  // Use jsdom for browser-like environment
  testEnvironment: 'jsdom',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // Module name mapping for microfrontend architecture
  moduleNameMapper: {
    '^sharedComponents/(.*)$': '<rootDir>/src/__mocks__/sharedComponents.js',
    '^sharedComponents$': '<rootDir>/src/__mocks__/sharedComponents.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub'
  },

  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>/src', '<rootDir>/../../shared-components/src'],

  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}'
  ],

  // Coverage settings
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.jsx', // Exclude entry file
    '!src/bootstrap.jsx', // Exclude bootstrap file
    '!src/setupTests.js', // Exclude setup file
    '!src/__mocks__/**' // Exclude mock files
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['json', 'lcov', 'text', 'clover'],

  // Transform settings for Babel
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(sharedComponents)/)' // Transform sharedComponents
  ],
};
