#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const components = [
  { name: 'shell-app', path: 'shell-app' },
  { name: 'shared-components', path: 'shared-components' },
  { name: 'task-app', path: 'microfrontends/task-app' },
  { name: 'user-app', path: 'microfrontends/user-app' },
  { name: 'notification-app', path: 'microfrontends/notification-app' }
];

console.log('🚀 Running unified coverage for entire frontend project...\n');

let totalPassed = 0;
let totalFailed = 0;
const results = {};
const coverageData = {};

// Function to merge coverage data
function mergeCoverageData() {
  const mergedCoverage = {
    total: {
      lines: { total: 0, covered: 0, skipped: 0, pct: 0 },
      statements: { total: 0, covered: 0, skipped: 0, pct: 0 },
      functions: { total: 0, covered: 0, skipped: 0, pct: 0 },
      branches: { total: 0, covered: 0, skipped: 0, pct: 0 }
    },
    components: {}
  };

  // Merge data from each component
  Object.entries(coverageData).forEach(([component, data]) => {
    if (data && data.total) {
      mergedCoverage.components[component] = data.total;
      
      // Add to totals
      Object.keys(mergedCoverage.total).forEach(key => {
        mergedCoverage.total[key].total += data.total[key].total;
        mergedCoverage.total[key].covered += data.total[key].covered;
        mergedCoverage.total[key].skipped += data.total[key].skipped;
      });
    }
  });

  // Calculate percentages
  Object.keys(mergedCoverage.total).forEach(key => {
    const total = mergedCoverage.total[key].total;
    const covered = mergedCoverage.total[key].covered;
    mergedCoverage.total[key].pct = total > 0 ? Math.round((covered / total) * 100 * 100) / 100 : 0;
  });

  return mergedCoverage;
}

// Function to generate HTML report
function generateHTMLReport(mergedData) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frontend Coverage Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center; }
        .metric h3 { margin: 0 0 10px 0; color: #333; }
        .metric .value { font-size: 24px; font-weight: bold; }
        .metric .percentage { font-size: 18px; margin-top: 5px; }
        .good { color: #28a745; }
        .warning { color: #ffc107; }
        .danger { color: #dc3545; }
        .components { margin-top: 30px; }
        .component { background: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 6px; }
        .component h4 { margin: 0 0 10px 0; color: #333; }
        .component-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .component-metric { text-align: center; }
        .component-metric .label { font-size: 12px; color: #666; }
        .component-metric .value { font-size: 16px; font-weight: bold; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Frontend Coverage Report</h1>
            <p>Unified coverage report for all frontend components</p>
        </div>
        
        <div class="summary">
            <div class="metric">
                <h3>Lines</h3>
                <div class="value ${mergedData.total.lines.pct >= 80 ? 'good' : mergedData.total.lines.pct >= 60 ? 'warning' : 'danger'}">${mergedData.total.lines.pct}%</div>
                <div class="percentage">${mergedData.total.lines.covered}/${mergedData.total.lines.total}</div>
            </div>
            <div class="metric">
                <h3>Statements</h3>
                <div class="value ${mergedData.total.statements.pct >= 80 ? 'good' : mergedData.total.statements.pct >= 60 ? 'warning' : 'danger'}">${mergedData.total.statements.pct}%</div>
                <div class="percentage">${mergedData.total.statements.covered}/${mergedData.total.statements.total}</div>
            </div>
            <div class="metric">
                <h3>Functions</h3>
                <div class="value ${mergedData.total.functions.pct >= 80 ? 'good' : mergedData.total.functions.pct >= 60 ? 'warning' : 'danger'}">${mergedData.total.functions.pct}%</div>
                <div class="percentage">${mergedData.total.functions.covered}/${mergedData.total.functions.total}</div>
            </div>
            <div class="metric">
                <h3>Branches</h3>
                <div class="value ${mergedData.total.branches.pct >= 80 ? 'good' : mergedData.total.branches.pct >= 60 ? 'warning' : 'danger'}">${mergedData.total.branches.pct}%</div>
                <div class="percentage">${mergedData.total.branches.covered}/${mergedData.total.branches.total}</div>
            </div>
        </div>
        
        <div class="components">
            <h3>Component Breakdown</h3>
            ${Object.entries(mergedData.components).map(([component, data]) => `
                <div class="component">
                    <h4>${component}</h4>
                    <div class="component-metrics">
                        <div class="component-metric">
                            <div class="label">Lines</div>
                            <div class="value ${data.lines.pct >= 80 ? 'good' : data.lines.pct >= 60 ? 'warning' : 'danger'}">${data.lines.pct}%</div>
                        </div>
                        <div class="component-metric">
                            <div class="label">Statements</div>
                            <div class="value ${data.statements.pct >= 80 ? 'good' : data.statements.pct >= 60 ? 'warning' : 'danger'}">${data.statements.pct}%</div>
                        </div>
                        <div class="component-metric">
                            <div class="label">Functions</div>
                            <div class="value ${data.functions.pct >= 80 ? 'good' : data.functions.pct >= 60 ? 'warning' : 'danger'}">${data.functions.pct}%</div>
                        </div>
                        <div class="component-metric">
                            <div class="label">Branches</div>
                            <div class="value ${data.branches.pct >= 80 ? 'good' : data.branches.pct >= 60 ? 'warning' : 'danger'}">${data.branches.pct}%</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>Frontend Task Management System</p>
        </div>
    </div>
</body>
</html>`;
  
  return html;
}

// Run tests for each component
for (const component of components) {
  console.log(`\n📱 Testing ${component.name}...`);
  console.log('='.repeat(50));
  
  try {
    const componentPath = path.join(__dirname, component.path);
    
    // Check if component has tests
    const testFiles = fs.readdirSync(componentPath, { recursive: true })
      .filter(file => file.includes('__tests__') || file.includes('.test.') || file.includes('.spec.'));
    
    if (testFiles.length === 0) {
      console.log(`⚠️  No test files found in ${component.name}, skipping...`);
      results[component.name] = { status: 'skipped', reason: 'No test files' };
      continue;
    }
    
    const output = execSync('npm run test:coverage', { 
      cwd: componentPath, 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log(`✅ ${component.name} tests passed!`);
    results[component.name] = { status: 'passed', output };
    totalPassed++;
    
    // Try to read coverage data
    try {
      const coveragePath = path.join(componentPath, 'coverage', 'coverage-final.json');
      if (fs.existsSync(coveragePath)) {
        const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
        
        // Extract summary data from coverage-final.json
        if (coverage.total) {
          coverageData[component.name] = {
            total: coverage.total
          };
        } else {
          // Calculate from individual files in coverage-final.json
          const summary = {
            lines: { total: 0, covered: 0, skipped: 0, pct: 0 },
            statements: { total: 0, covered: 0, skipped: 0, pct: 0 },
            functions: { total: 0, covered: 0, skipped: 0, pct: 0 },
            branches: { total: 0, covered: 0, skipped: 0, pct: 0 }
          };
          
          Object.values(coverage).forEach(file => {
            if (file && file.s && file.f && file.b) {
              // Count statements (s array)
              summary.statements.total += file.s.length;
              summary.statements.covered += file.s.filter(count => count > 0).length;
              
              // Count functions (f array)
              summary.functions.total += file.f.length;
              summary.functions.covered += file.f.filter(count => count > 0).length;
              
              // Count branches (b array)
              summary.branches.total += file.b.length;
              summary.branches.covered += file.b.filter(branch => 
                Array.isArray(branch) ? branch.some(count => count > 0) : count > 0
              ).length;
            }
          });
          
          // Lines are the same as statements for this calculation
          summary.lines.total = summary.statements.total;
          summary.lines.covered = summary.statements.covered;
          
          // Calculate percentages
          Object.keys(summary).forEach(key => {
            const total = summary[key].total;
            const covered = summary[key].covered;
            summary[key].pct = total > 0 ? Math.round((covered / total) * 100 * 100) / 100 : 0;
          });
          
          coverageData[component.name] = { total: summary };
        }
      }
    } catch (error) {
      console.log(`⚠️  Could not read coverage data for ${component.name}: ${error.message}`);
    }
    
  } catch (error) {
    console.log(`❌ ${component.name} tests failed!`);
    console.log(error.stdout || error.message);
    results[component.name] = { status: 'failed', error: error.stdout || error.message };
    totalFailed++;
  }
}

// Generate unified coverage report
console.log('\n' + '='.repeat(60));
console.log('📊 GENERATING UNIFIED COVERAGE REPORT');
console.log('='.repeat(60));

const mergedCoverage = mergeCoverageData();

// Create coverage directory
const coverageDir = path.join(__dirname, 'coverage');
if (!fs.existsSync(coverageDir)) {
  fs.mkdirSync(coverageDir, { recursive: true });
}

// Generate HTML report
const htmlReport = generateHTMLReport(mergedCoverage);
fs.writeFileSync(path.join(coverageDir, 'index.html'), htmlReport);

// Generate JSON report
fs.writeFileSync(path.join(coverageDir, 'coverage-summary.json'), JSON.stringify(mergedCoverage, null, 2));

// Generate LCOV report (merge all lcov.info files)
let lcovContent = '';
components.forEach(component => {
  const lcovPath = path.join(__dirname, component.path, 'coverage', 'lcov.info');
  if (fs.existsSync(lcovPath)) {
    lcovContent += fs.readFileSync(lcovPath, 'utf8') + '\n';
  }
});
fs.writeFileSync(path.join(coverageDir, 'lcov.info'), lcovContent);

console.log('\n' + '='.repeat(60));
console.log('📊 FINAL RESULTS');
console.log('='.repeat(60));
console.log(`✅ Passed: ${totalPassed}`);
console.log(`❌ Failed: ${totalFailed}`);
console.log(`📱 Total: ${components.length}`);

console.log('\n🎯 Coverage Summary:');
console.log(`Lines: ${mergedCoverage.total.lines.pct}% (${mergedCoverage.total.lines.covered}/${mergedCoverage.total.lines.total})`);
console.log(`Statements: ${mergedCoverage.total.statements.pct}% (${mergedCoverage.total.statements.covered}/${mergedCoverage.total.statements.total})`);
console.log(`Functions: ${mergedCoverage.total.functions.pct}% (${mergedCoverage.total.functions.covered}/${mergedCoverage.total.functions.total})`);
console.log(`Branches: ${mergedCoverage.total.branches.pct}% (${mergedCoverage.total.branches.covered}/${mergedCoverage.total.branches.total})`);

if (totalFailed > 0) {
  console.log('\n❌ Failed components:');
  Object.entries(results).forEach(([component, result]) => {
    if (result.status === 'failed') {
      console.log(`  - ${component}`);
    }
  });
}

console.log('\n🎯 Coverage reports available at:');
console.log(`  - Unified HTML: coverage/index.html`);
console.log(`  - Unified JSON: coverage/coverage-summary.json`);
console.log(`  - Unified LCOV: coverage/lcov.info`);

process.exit(totalFailed > 0 ? 1 : 0);

