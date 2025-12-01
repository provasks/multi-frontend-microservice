#!/usr/bin/env node

/**
 * Script to run Jest tests and coverage specifically for task-app
 * This demonstrates the proper way to run tests for individual microfrontends
 */

const { execSync } = require('child_process');
const path = require('path');

const taskAppPath = path.join(__dirname, 'microfrontends', 'task-app');

console.log('🧪 Running Jest tests and coverage for Task App...\n');
console.log(`Path: ${taskAppPath}\n`);

try {
  // Run tests with coverage for task-app only
  execSync('npm test -- --coverage --watchAll=false', {
    cwd: taskAppPath,
    stdio: 'inherit'
  });
  
  console.log('\n✅ Task App tests completed successfully!');
  console.log('\n📊 Coverage report available at:');
  console.log(`   ${path.join(taskAppPath, 'coverage', 'index.html')}`);
  
} catch (error) {
  console.error('\n❌ Task App tests failed:', error.message);
  process.exit(1);
}
