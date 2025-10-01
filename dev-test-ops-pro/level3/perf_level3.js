/**
 * K6 Performance Test - Level 3: Advanced Load Testing
 * 
 * GOAL: Production-like load testing with comprehensive CRUD and validation
 * MAPS TO: Functional Level 3 - Advanced Authentication & User CRUD
 * 
 * SCENARIOS:
 * 1. Authentication flows (12 test types)
 * 2. User CRUD operations (8 operations)
 * 3. Complex validation scenarios
 * 4. Error handling under load
 * 5. Mixed workload simulation
 * 
 * PERFORMANCE GOALS:
 * - Response time < 1000ms (p95) for all operations
 * - Success rate > 95%
 * - 100 Virtual Users (VUs)
 * - 10 minute duration
 * - Handle 10,000+ requests
 * - < 5% error rate under stress
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Trend, Rate, Gauge } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

// Custom metrics
const authFlowTime = new Trend('auth_flow_duration');
const crudOperationTime = new Trend('crud_operation_duration');
const validationTime = new Trend('validation_duration');
const errorRate = new Rate('errors');
const successRate = new Rate('success');
const concurrentUsers = new Gauge('concurrent_users');

// Operation counters
const registrations = new Counter('op_registrations');
const logins = new Counter('op_logins');
const userReads = new Counter('op_user_reads');
const userUpdates = new Counter('op_user_updates');
const userDeletes = new Counter('op_user_deletes');
const validationErrors = new Counter('op_validation_errors');

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:1337/api';
const TEST_DURATION = __ENV.DURATION || '10m';

// Test profiles for different load patterns
const loadProfiles = new SharedArray('load_profiles', function() {
  return [
    { name: 'Standard User', weight: 60, operations: ['register', 'login', 'getUser'] },
    { name: 'Power User', weight: 25, operations: ['register', 'login', 'getUser', 'updateUser', 'getAll'] },
    { name: 'Admin User', weight: 10, operations: ['register', 'login', 'getAll', 'getUser', 'updateUser', 'count'] },
    { name: 'API Integration', weight: 5, operations: ['register', 'login', 'getUser', 'updateUser', 'delete'] },
  ];
});

// Performance test configuration
export const options = {
  scenarios: {
    // Scenario 1: Baseline load
    baseline_load: {
      executor: 'constant-vus',
      vus: 20,
      duration: '3m',
      exec: 'baselineTest',
      tags: { test_type: 'baseline' },
    },
    
    // Scenario 2: Stress test
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 50 },
        { duration: '3m', target: 100 },
        { duration: '2m', target: 150 },
        { duration: '1m', target: 0 },
      ],
      exec: 'stressTest',
      tags: { test_type: 'stress' },
      startTime: '3m',
    },
    
    // Scenario 3: Spike test
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 200 },
        { duration: '30s', target: 200 },
        { duration: '10s', target: 0 },
      ],
      exec: 'spikeTest',
      tags: { test_type: 'spike' },
      startTime: '11m',
    },
    
    // Scenario 4: Soak test
    soak_test: {
      executor: 'constant-vus',
      vus: 30,
      duration: '5m',
      exec: 'soakTest',
      tags: { test_type: 'soak' },
      startTime: '12m',
    },
  },
  
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    http_req_failed: ['rate<0.05'],
    'auth_flow_duration': ['p(95)<800'],
    'crud_operation_duration': ['p(95)<1000'],
    'validation_duration': ['p(95)<600'],
    'errors': ['rate<0.05'],
    'success': ['rate>0.95'],
  },
};

// ===== Helper Functions =====

function generateUser(profile) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  const username = `${profile.name.toLowerCase().replace(/\s/g, '_')}${random}`;
  
  return {
    username: username,
    email: `${username}@test.com`,
    password: 'Test@123456',
    first_name: profile.name.split(' ')[0],
    last_name: profile.name.split(' ')[1] || 'User',
  };
}

function selectRandomProfile() {
  const totalWeight = loadProfiles.reduce((sum, p) => sum + p.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const profile of loadProfiles) {
    random -= profile.weight;
    if (random <= 0) return profile;
  }
  
  return loadProfiles[0];
}

// ===== Test Operations =====

// Operation: Register user
function registerUser(userData) {
  const startTime = new Date();
  
  const response = http.post(
    `${BASE_URL}/auth/local/register`,
    JSON.stringify({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      first_name: userData.first_name,
      last_name: userData.last_name,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { operation: 'register' },
    }
  );

  authFlowTime.add(response.timings.duration);
  
  const success = check(response, {
    'Register: Status 200': (r) => r.status === 200,
    'Register: JWT present': (r) => r.json('jwt') !== undefined,
    'Register: User created': (r) => r.json('user.id') !== undefined,
  });

  if (success) {
    registrations.add(1);
    successRate.add(1);
  } else {
    errorRate.add(1);
  }
  
  return success ? response.json() : null;
}

// Operation: Login user
function loginUser(identifier, password) {
  const response = http.post(
    `${BASE_URL}/auth/local`,
    JSON.stringify({ identifier, password }),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { operation: 'login' },
    }
  );

  authFlowTime.add(response.timings.duration);
  
  const success = check(response, {
    'Login: Status 200': (r) => r.status === 200,
    'Login: JWT received': (r) => r.json('jwt') !== undefined,
  });

  if (success) {
    logins.add(1);
    successRate.add(1);
  } else {
    errorRate.add(1);
  }
  
  return success ? response.json() : null;
}

// Operation: Get current user
function getCurrentUser(jwt) {
  const response = http.get(
    `${BASE_URL}/users/me`,
    {
      headers: { 
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      tags: { operation: 'get_user' },
    }
  );

  crudOperationTime.add(response.timings.duration);
  
  const success = check(response, {
    'Get User: Status 200': (r) => r.status === 200,
    'Get User: Data present': (r) => r.json('username') !== undefined,
  });

  if (success) {
    userReads.add(1);
    successRate.add(1);
  } else {
    errorRate.add(1);
  }
  
  return success ? response.json() : null;
}

// Operation: Get all users
function getAllUsers(jwt) {
  const response = http.get(
    `${BASE_URL}/users?_limit=10&_start=0`,
    {
      headers: { 
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      tags: { operation: 'get_all_users' },
    }
  );

  crudOperationTime.add(response.timings.duration);
  
  const success = check(response, {
    'Get All Users: Status 200': (r) => r.status === 200,
    'Get All Users: Array returned': (r) => Array.isArray(r.json()),
  });

  if (success) {
    userReads.add(1);
    successRate.add(1);
  } else {
    errorRate.add(1);
  }
}

// Operation: Update user
function updateUser(jwt, userId, data) {
  const response = http.put(
    `${BASE_URL}/users/${userId}`,
    JSON.stringify(data),
    {
      headers: { 
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      tags: { operation: 'update_user' },
    }
  );

  crudOperationTime.add(response.timings.duration);
  
  const success = check(response, {
    'Update User: Status 200': (r) => r.status === 200,
    'Update User: Data updated': (r) => r.json('username') !== undefined,
  });

  if (success) {
    userUpdates.add(1);
    successRate.add(1);
  } else {
    errorRate.add(1);
  }
}

// Operation: Get user count
function getUserCount(jwt) {
  const response = http.get(
    `${BASE_URL}/users/count`,
    {
      headers: { 
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      tags: { operation: 'user_count' },
    }
  );

  crudOperationTime.add(response.timings.duration);
  
  const success = check(response, {
    'User Count: Status 200': (r) => r.status === 200,
    'User Count: Number returned': (r) => typeof r.json() === 'number',
  });

  if (success) {
    successRate.add(1);
  } else {
    errorRate.add(1);
  }
}

// Operation: Test validation error
function testValidationError() {
  const response = http.post(
    `${BASE_URL}/auth/local/register`,
    JSON.stringify({
      username: '', // Invalid - empty username
      email: 'invalidemail', // Invalid format
      password: '123', // Too short
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { operation: 'validation_error' },
    }
  );

  validationTime.add(response.timings.duration);
  
  check(response, {
    'Validation: Status 400': (r) => r.status === 400,
    'Validation: Error present': (r) => r.json('error') !== undefined,
  });

  validationErrors.add(1);
}

// ===== Test Scenarios =====

// Scenario 1: Baseline Test
export function baselineTest() {
  concurrentUsers.add(1);
  
  group('Baseline - Standard Flow', function() {
    const profile = loadProfiles[0]; // Standard user
    const userData = generateUser(profile);
    
    // Register
    const registerData = registerUser(userData);
    if (!registerData) return;
    
    sleep(0.5);
    
    // Login
    const loginData = loginUser(userData.username, userData.password);
    if (!loginData) return;
    
    sleep(0.5);
    
    // Get user info
    getCurrentUser(loginData.jwt);
    
    sleep(1);
  });
}

// Scenario 2: Stress Test
export function stressTest() {
  concurrentUsers.add(1);
  
  const profile = selectRandomProfile();
  const userData = generateUser(profile);
  
  group('Stress Test - Multiple Operations', function() {
    // Register
    const registerData = registerUser(userData);
    if (!registerData) return;
    
    sleep(0.3);
    
    // Login with username
    const loginData = loginUser(userData.username, userData.password);
    if (!loginData) return;
    
    sleep(0.3);
    
    // Perform operations based on profile
    profile.operations.forEach((operation) => {
      switch(operation) {
        case 'getUser':
          getCurrentUser(loginData.jwt);
          break;
        case 'getAll':
          getAllUsers(loginData.jwt);
          break;
        case 'updateUser':
          updateUser(loginData.jwt, registerData.user.id, {
            username: `${userData.username}_updated`
          });
          break;
        case 'count':
          getUserCount(loginData.jwt);
          break;
      }
      sleep(0.2);
    });
    
    sleep(0.5);
  });
}

// Scenario 3: Spike Test
export function spikeTest() {
  concurrentUsers.add(1);
  
  group('Spike Test - High Concurrency', function() {
    const userData = generateUser(loadProfiles[0]);
    
    // Rapid fire operations
    const registerData = registerUser(userData);
    if (registerData) {
      const loginData = loginUser(userData.username, userData.password);
      if (loginData) {
        getCurrentUser(loginData.jwt);
        getAllUsers(loginData.jwt);
      }
    }
    
    sleep(0.1);
  });
}

// Scenario 4: Soak Test
export function soakTest() {
  concurrentUsers.add(1);
  
  group('Soak Test - Sustained Load', function() {
    const profile = selectRandomProfile();
    const userData = generateUser(profile);
    
    // Full user lifecycle
    const registerData = registerUser(userData);
    if (!registerData) return;
    
    sleep(1);
    
    // Multiple login sessions
    for (let i = 0; i < 3; i++) {
      const loginData = loginUser(
        i % 2 === 0 ? userData.username : userData.email,
        userData.password
      );
      
      if (loginData) {
        getCurrentUser(loginData.jwt);
        sleep(0.5);
        getAllUsers(loginData.jwt);
        sleep(0.5);
        updateUser(loginData.jwt, registerData.user.id, {
          username: `${userData.username}_v${i}`
        });
        sleep(0.5);
      }
    }
    
    // Test validation
    testValidationError();
    
    sleep(2);
  });
}

// Main default export
export default function() {
  baselineTest();
}

// Setup function
export function setup() {
  console.log('========================================');
  console.log('K6 Performance Test - Level 3: Advanced Load Testing');
  console.log('========================================');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Test Duration: ${TEST_DURATION}`);
  console.log(`Load Profiles: ${loadProfiles.length}`);
  console.log('========================================');
  console.log('Test Scenarios:');
  console.log('  1. Baseline (20 VUs, 3m) - Standard flow');
  console.log('  2. Stress (50-150 VUs, 8m) - Heavy load');
  console.log('  3. Spike (200 VUs, 50s) - Peak load');
  console.log('  4. Soak (30 VUs, 5m) - Sustained load');
  console.log('========================================');
  console.log('Performance Goals:');
  console.log('  - p95 response time: < 1000ms');
  console.log('  - Error rate: < 5%');
  console.log('  - Success rate: > 95%');
  console.log('  - Total requests: 10,000+');
  console.log('========================================');
  console.log('');
  
  // API health check
  const healthCheck = http.get(BASE_URL);
  if (healthCheck.status === 0) {
    throw new Error('API is not accessible! Please start your Strapi server.');
  }
  
  console.log('✓ API is accessible');
  console.log('Starting performance tests...');
  console.log('');
  
  return { startTime: Date.now() };
}

// Teardown function
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  
  console.log('');
  console.log('========================================');
  console.log('Level 3 Performance Test Complete!');
  console.log('========================================');
  console.log(`Total Duration: ${duration.toFixed(2)} seconds`);
  console.log('');
  console.log('📊 Key Metrics to Review:');
  console.log('  - http_req_duration (95th percentile)');
  console.log('  - http_req_failed (error rate)');
  console.log('  - auth_flow_duration');
  console.log('  - crud_operation_duration');
  console.log('  - Custom counters (operations)');
  console.log('');
  console.log('📈 Operation Counters:');
  console.log('  - op_registrations');
  console.log('  - op_logins');
  console.log('  - op_user_reads');
  console.log('  - op_user_updates');
  console.log('  - op_validation_errors');
  console.log('');
  console.log('💡 Next Steps:');
  console.log('  1. Review HTML report');
  console.log('  2. Check error logs');
  console.log('  3. Analyze bottlenecks');
  console.log('  4. Optimize API if needed');
  console.log('========================================');
}

// Generate HTML report
export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data),
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  const { indent = '', enableColors = false } = options;
  let output = '';
  
  output += '\n' + indent + '='.repeat(60) + '\n';
  output += indent + 'PERFORMANCE TEST SUMMARY\n';
  output += indent + '='.repeat(60) + '\n\n';
  
  output += indent + `Total Requests: ${data.metrics.http_reqs.values.count}\n`;
  output += indent + `Failed Requests: ${data.metrics.http_req_failed.values.rate * 100}%\n`;
  output += indent + `Average Duration: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms\n`;
  output += indent + `95th Percentile: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms\n`;
  output += indent + `99th Percentile: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms\n`;
  
  output += '\n' + indent + '-'.repeat(60) + '\n';
  output += indent + 'Custom Metrics:\n';
  output += indent + '-'.repeat(60) + '\n';
  
  if (data.metrics.op_registrations) {
    output += indent + `Registrations: ${data.metrics.op_registrations.values.count}\n`;
  }
  if (data.metrics.op_logins) {
    output += indent + `Logins: ${data.metrics.op_logins.values.count}\n`;
  }
  if (data.metrics.op_user_reads) {
    output += indent + `User Reads: ${data.metrics.op_user_reads.values.count}\n`;
  }
  if (data.metrics.op_user_updates) {
    output += indent + `User Updates: ${data.metrics.op_user_updates.values.count}\n`;
  }
  
  output += '\n' + indent + '='.repeat(60) + '\n';
  
  return output;
}