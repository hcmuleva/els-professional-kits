#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create test results directory
function createTestResultsDirectory() {
  const testResultsDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
    console.log('Created test-results directory');
  }
  return testResultsDir;
}

console.log('Starting React Jest Test Runner...\n');

try {
  // Create test results directory
  const testResultsDir = createTestResultsDirectory();
  
  console.log('Running tests...');
  
  // Run tests
  const testCommand = 'npx jest --coverage --watchAll=false --verbose --passWithNoTests';
  const result = execSync(testCommand, { 
    encoding: 'utf8',
    stdio: 'inherit'
  });
  
  console.log('\nTests completed successfully!');
  console.log(`Test results saved in: ${testResultsDir}`);
  
  // Check if coverage directory exists
  const coverageDir = path.join(testResultsDir, 'coverage');
  if (fs.existsSync(coverageDir)) {
    console.log(`Coverage report: ${path.join(coverageDir, 'lcov-report', 'index.html')}`);
  }
  
} catch (error) {
  console.error('Test execution failed:');
  console.error(error.message);
  
  // Save error to file
  const testResultsDir = createTestResultsDirectory();
  const errorLog = path.join(testResultsDir, 'error.log');
  fs.writeFileSync(errorLog, error.message || error.toString());
  console.log(`Error log saved to: ${errorLog}`);
  
  process.exit(1);
}