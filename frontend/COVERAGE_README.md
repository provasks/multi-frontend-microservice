# Frontend Coverage System

This document explains how to use the unified coverage system for the entire frontend project.

## Overview

The frontend project now supports unified coverage reporting that combines test coverage from all components:
- **Shell App** (`shell-app/`)
- **Shared Components** (`shared-components/`)
- **Task App** (`microfrontends/task-app/`)
- **User App** (`microfrontends/user-app/`)
- **Notification App** (`microfrontends/notification-app/`)

## Available Commands

### Unified Coverage Commands

```bash
# Run unified coverage for entire frontend
npm run test:unified

# Run all tests with individual coverage reports
npm run test:all

# Run Jest with unified configuration
npm run test:coverage
```

### Individual Component Commands

```bash
# Test individual components
npm run test:shell
npm run test:shared
npm run test:task
npm run test:user
npm run test:notification

# Watch mode for individual components
cd shell-app && npm run test:watch
cd shared-components && npm run test:watch
# ... etc
```

## Coverage Reports

### Unified Coverage Report
- **Location**: `frontend/coverage/index.html`
- **Description**: Beautiful HTML report showing coverage for all components
- **Features**:
  - Overall coverage summary
  - Per-component breakdown
  - Color-coded metrics (green/yellow/red)
  - Interactive navigation

### Individual Coverage Reports
- **Location**: `frontend/{component}/coverage/index.html`
- **Description**: Standard Jest coverage reports for each component

### Coverage Data Formats
- **HTML**: `coverage/index.html` (unified)
- **JSON**: `coverage/coverage-summary.json` (unified)
- **LCOV**: `coverage/lcov.info` (unified)
- **Clover**: `coverage/clover.xml` (per component)

## Configuration

### Jest Configuration
- **Main Config**: `frontend/jest.config.js`
- **Setup File**: `frontend/jest.setup.js`
- **Individual Configs**: Each component has its own `jest.config.js`

### Coverage Thresholds
- **Lines**: 70%
- **Statements**: 70%
- **Functions**: 70%
- **Branches**: 70%

## How It Works

### 1. Unified Jest Configuration
The root `jest.config.js` uses Jest's `projects` feature to:
- Run tests from all components
- Collect coverage from all source files
- Generate a unified coverage report

### 2. Coverage Merging Script
The `run-unified-coverage.js` script:
- Runs tests for each component individually
- Collects coverage data from each component
- Merges coverage data into a unified report
- Generates multiple output formats (HTML, JSON, LCOV)

### 3. Component Integration
Each component:
- Has its own Jest configuration
- Can run tests independently
- Contributes to the unified coverage report

## Usage Examples

### Generate Unified Coverage Report
```bash
cd frontend
npm run test:unified
```

This will:
1. Run tests for all components
2. Collect coverage data
3. Generate unified HTML report at `coverage/index.html`
4. Show summary in terminal

### Run Tests in Watch Mode
```bash
cd frontend
npm run test:watch
```

This will run Jest in watch mode for all components.

### Run Specific Component Tests
```bash
cd frontend
npm run test:task
```

This will run only the task-app tests.

## Coverage Report Features

### Unified HTML Report
- **Overall Metrics**: Total coverage across all components
- **Component Breakdown**: Individual coverage for each component
- **Color Coding**: 
  - Green: ≥80% coverage
  - Yellow: 60-79% coverage
  - Red: <60% coverage
- **Interactive**: Click to drill down into specific components

### Terminal Output
- **Real-time Progress**: Shows which components are being tested
- **Summary Statistics**: Total passed/failed tests
- **Coverage Summary**: Overall coverage percentages
- **File Locations**: Paths to all generated reports

## Troubleshooting

### Common Issues

1. **No tests found**: Make sure test files follow the naming convention:
   - `*.test.js` or `*.test.jsx`
   - `*.spec.js` or `*.spec.jsx`
   - Located in `__tests__` directories

2. **Module resolution errors**: Check that `moduleNameMapper` in Jest config includes all necessary paths

3. **Coverage data missing**: Ensure each component has proper Jest configuration and coverage collection enabled

### Debug Mode
```bash
# Run with verbose output
npm run test:coverage -- --verbose

# Run specific component with debug
cd microfrontends/task-app
npm run test:coverage -- --verbose
```

## Best Practices

1. **Write Tests**: Ensure each component has comprehensive test coverage
2. **Maintain Thresholds**: Keep coverage above the configured thresholds
3. **Regular Testing**: Run unified coverage regularly to catch regressions
4. **CI Integration**: Use `npm run test:ci` for continuous integration
5. **Component Isolation**: Each component should be testable independently

## File Structure

```
frontend/
├── jest.config.js              # Unified Jest configuration
├── jest.setup.js               # Jest setup file
├── run-unified-coverage.js     # Coverage merging script
├── run-all-tests.js           # Individual test runner
├── coverage/                   # Unified coverage reports
│   ├── index.html             # Main HTML report
│   ├── coverage-summary.json  # JSON summary
│   └── lcov.info              # LCOV format
├── shell-app/
│   ├── coverage/              # Individual coverage
│   └── src/__tests__/         # Test files
├── shared-components/
│   ├── coverage/              # Individual coverage
│   └── src/components/__tests__/ # Test files
└── microfrontends/
    ├── task-app/
    │   ├── coverage/          # Individual coverage
    │   └── src/__tests__/     # Test files
    ├── user-app/
    │   ├── coverage/          # Individual coverage
    │   └── src/__tests__/     # Test files
    └── notification-app/
        ├── coverage/          # Individual coverage
        └── src/__tests__/     # Test files
```

This unified coverage system provides comprehensive visibility into the test coverage across your entire frontend microfrontend architecture!

