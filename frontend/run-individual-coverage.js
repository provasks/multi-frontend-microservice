#!/usr/bin/env node

/**
 * Script to run Jest tests and coverage for individual microfrontends
 * This prevents source file duplication in coverage folders
 */

const { execSync } = require('child_process');
const path = require('path');

const apps = [
  'shell-app',
  'shared-components', 
  'microfrontends/task-app',
  'microfrontends/user-app',
  'microfrontends/notification-app'
];

console.log('🧪 Running Jest tests and coverage for individual apps...\n');

apps.forEach((app, index) => {
  const appPath = path.join(__dirname, app);
  const appName = app.split('/').pop();
  
  console.log(`\n${index + 1}. Testing ${appName}...`);
  console.log(`   Path: ${appPath}`);
  
  try {
    // Run tests with coverage for this specific app
    execSync('npm test -- --coverage --watchAll=false', {
      cwd: appPath,
      stdio: 'inherit'
    });
    
    console.log(`✅ ${appName} tests completed successfully`);
  } catch (error) {
    console.error(`❌ ${appName} tests failed:`, error.message);
  }
});

console.log('\n🎉 All individual app tests completed!');
console.log('\n📊 Coverage reports are available in each app\'s coverage folder:');
apps.forEach(app => {
  const appName = app.split('/').pop();
  console.log(`   - ${app}/coverage/index.html`);
});
