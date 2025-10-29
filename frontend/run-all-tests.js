#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const microfrontends = [
  'task-app',
  'user-app', 
  'notification-app'
];

console.log('🚀 Running tests for all microfrontends...\n');

let totalPassed = 0;
let totalFailed = 0;
const results = {};

for (const app of microfrontends) {
  console.log(`\n📱 Testing ${app}...`);
  console.log('='.repeat(50));
  
  try {
    const appPath = path.join(__dirname, 'microfrontends', app);
    const output = execSync('npm run test:coverage', { 
      cwd: appPath, 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log(`✅ ${app} tests passed!`);
    results[app] = { status: 'passed', output };
    totalPassed++;
    
  } catch (error) {
    console.log(`❌ ${app} tests failed!`);
    console.log(error.stdout || error.message);
    results[app] = { status: 'failed', error: error.stdout || error.message };
    totalFailed++;
  }
}

console.log('\n' + '='.repeat(60));
console.log('📊 FINAL RESULTS');
console.log('='.repeat(60));
console.log(`✅ Passed: ${totalPassed}`);
console.log(`❌ Failed: ${totalFailed}`);
console.log(`📱 Total: ${microfrontends.length}`);

if (totalFailed > 0) {
  console.log('\n❌ Failed apps:');
  Object.entries(results).forEach(([app, result]) => {
    if (result.status === 'failed') {
      console.log(`  - ${app}`);
    }
  });
}

console.log('\n🎯 Coverage reports available at:');
microfrontends.forEach(app => {
  console.log(`  - ${app}: microfrontends/${app}/coverage/index.html`);
});

process.exit(totalFailed > 0 ? 1 : 0);
