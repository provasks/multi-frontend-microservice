# Jest Testing Guide for Microfrontend Architecture

## Overview

This document explains the proper way to run Jest tests and generate coverage reports for the microfrontend architecture without duplicating source files.

## Problem Solved

Previously, running Jest tests from the root frontend directory was causing:
- Source files to be duplicated in the main `frontend/coverage` folder
- Confusion about which coverage reports to use
- Unnecessary disk space usage
- Mixed coverage reports from all apps

## Solution

Each microfrontend now has its own Jest configuration and coverage folder:

```
frontend/
├── microfrontends/
│   ├── task-app/
│   │   ├── coverage/          # Task app coverage only
│   │   ├── src/
│   │   └── jest.config.js
│   ├── user-app/
│   │   ├── coverage/          # User app coverage only
│   │   ├── src/
│   │   └── jest.config.js
│   └── notification-app/
│       ├── coverage/          # Notification app coverage only
│       ├── src/
│       └── jest.config.js
├── shared-components/
│   ├── coverage/              # Shared components coverage only
│   ├── src/
│   └── jest.config.js
└── shell-app/
    ├── coverage/              # Shell app coverage only
    ├── src/
    └── jest.config.js
```

## How to Run Tests

### Option 1: Run Tests for Individual Apps

```bash
# Navigate to specific app
cd frontend/microfrontends/task-app

# Run tests with coverage
npm test -- --coverage --watchAll=false
```

### Option 2: Use the Provided Scripts

```bash
# Run task-app tests specifically
node frontend/run-task-app-tests.js

# Run all individual app tests
node frontend/run-individual-coverage.js
```

### Option 3: Run from Root (All Apps)

```bash
# From frontend directory
npm test
```

## Coverage Reports

Each app generates its own coverage report:

- **Task App**: `frontend/microfrontends/task-app/coverage/index.html`
- **User App**: `frontend/microfrontends/user-app/coverage/index.html`
- **Notification App**: `frontend/microfrontends/notification-app/coverage/index.html`
- **Shared Components**: `frontend/shared-components/coverage/index.html`
- **Shell App**: `frontend/shell-app/coverage/index.html`

## Jest Configuration

### Root Configuration (`frontend/jest.config.js`)
- **Disabled coverage collection** to prevent source file duplication
- **Projects configuration** for running all apps from root
- **Module mapping** for shared components

### Individual App Configuration (e.g., `task-app/jest.config.js`)
- **Enabled coverage collection** for the specific app
- **Coverage directory** set to app's own coverage folder
- **Coverage thresholds** specific to the app
- **Test patterns** for the app's source files

## Benefits

1. **No Source File Duplication**: Each app only includes its own source files in coverage
2. **Clear Separation**: Easy to identify which app's coverage you're viewing
3. **Individual Thresholds**: Each app can have different coverage requirements
4. **Faster Builds**: Only relevant files are processed for each app
5. **Better Organization**: Coverage reports are co-located with their respective apps

## Best Practices

1. **Always run tests from individual app directories** for development
2. **Use the root npm test** only for CI/CD or comprehensive testing
3. **Check individual app coverage** before checking overall project coverage
4. **Set appropriate coverage thresholds** per app based on complexity
5. **Keep test files organized** in `__tests__` folders within each app

## Current Coverage Status

Based on the latest test run:

- **Task App**: 37.41% statements, 28.85% branches, 37.01% functions, 38.17% lines
- **Components**: ErrorBoundary (100%), Pagination (100%), TaskItem (100%), TaskTable (100%)
- **Hooks**: useApi (98.11%), useDebounce (100%), useTaskManagement (45.72%)
- **Utils**: dateUtils (0% - needs tests), validationUtils (53.52%)

## Next Steps

1. Continue improving test coverage for individual components
2. Add tests for missing utilities (dateUtils.js)
3. Improve useTaskManagement hook test coverage
4. Add integration tests for complete user flows
5. Set up CI/CD to run tests automatically

## Troubleshooting

### If you see source files duplicated in main coverage folder:
1. Delete the main `frontend/coverage` folder
2. Run tests from individual app directories
3. Check that `collectCoverage: false` is set in root jest.config.js

### If tests fail with module resolution errors:
1. Check that the app's jest.config.js has correct moduleNameMapper
2. Verify that shared components are properly mocked
3. Ensure setupTests.js is configured correctly

### If coverage thresholds are not met:
1. Check individual app coverage reports
2. Add more tests for uncovered code paths
3. Adjust coverage thresholds in app-specific jest.config.js files
