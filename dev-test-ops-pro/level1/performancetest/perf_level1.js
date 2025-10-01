/**
 * K6 Performance Test - Level 1: Basic Authentication
 * 
 * GOAL: Learn K6 basics and test simple authentication flows
 * MAPS TO: Functional Level 1 - Basic Authentication
 * 
 * SCENARIOS:
 * 1. Register a new user
 * 2. Login with username
 * 3. Login with email
 * 4. Get authenticated user info
 * 
 * PERFORMANCE GOALS:
 * - Response time < 500ms (p95)
 * - Success rate > 99%
 * - 10 Virtual Users (VUs)
 * - 1 minute duration
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend, Rate } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// Custom metrics
const registrationTime = new Trend('registration_duration');
const loginTime = new Trend('login_duration');
const getUserTime = new Trend('get_user_duration');
const errorRate = new Rate('errors');

// Counters for specific scenarios
const registrationCounter = new Counter('registration_count');
const loginUsernameCounter = new Counter('login_username_count');
const loginEmailCounter = new Counter('login_email_count');
const getUserCounter = new Counter('get_user_count');

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:1337/api';
const REPORT_FORMAT = __ENV.REPORT_FORMAT || 'both'; // 'json', 'html', or 'both'

// Performance test options
export const options = {
  stages: [
    { duration: '3s', target: 10 },  // Ramp up to 10 users
    { duration: '10s', target: 10 },   // Stay at 10 users
    { duration: '3s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],        // 95% requests < 500ms
    http_req_failed: ['rate<0.01'],          // Error rate < 1%
    'registration_duration': ['p(95)<600'],  // Registration < 600ms
    'login_duration': ['p(95)<400'],         // Login < 400ms
    'get_user_duration': ['p(95)<300'],      // Get user < 300ms
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(95)', 'p(99)'],
};

// Helper function to generate unique user data
function generateUserData() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const username = `user${timestamp}${random}`;
  
  return {
    username: username,
    email: `${username}@test.com`,
    password: 'Test@123456',
  };
}

// Test Scenario 1: Register a new user
function testRegister() {
  const userData = generateUserData();
  
  const registerPayload = JSON.stringify({
    username: userData.username,
    email: userData.email,
    password: userData.password,
  });

  const registerResponse = http.post(
    `${BASE_URL}/auth/local/register`,
    registerPayload,
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'Register' },
    }
  );

  // Record metrics
  registrationTime.add(registerResponse.timings.duration);
  registrationCounter.add(1);
  
  // Validate response
  const registerSuccess = check(registerResponse, {
    'Register: Status is 200': (r) => r.status === 200,
    'Register: JWT token received': (r) => r.json('jwt') !== undefined,
    'Register: User ID received': (r) => r.json('user.id') !== undefined,
    'Register: Username matches': (r) => r.json('user.username') === userData.username,
    'Register: Response time < 600ms': (r) => r.timings.duration < 600,
  });

  errorRate.add(!registerSuccess);
  
  return registerResponse.status === 200 ? registerResponse.json() : null;
}

// Test Scenario 2: Login with username
function testLoginUsername(username, password) {
  const loginPayload = JSON.stringify({
    identifier: username,
    password: password,
  });

  const loginResponse = http.post(
    `${BASE_URL}/auth/local`,
    loginPayload,
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'Login-Username' },
    }
  );

  // Record metrics
  loginTime.add(loginResponse.timings.duration);
  loginUsernameCounter.add(1);
  
  // Validate response
  const loginSuccess = check(loginResponse, {
    'Login(Username): Status is 200': (r) => r.status === 200,
    'Login(Username): JWT received': (r) => r.json('jwt') !== undefined,
    'Login(Username): User data present': (r) => r.json('user') !== undefined,
    'Login(Username): Response time < 400ms': (r) => r.timings.duration < 400,
  });

  errorRate.add(!loginSuccess);
  
  return loginResponse.status === 200 ? loginResponse.json() : null;
}

// Test Scenario 3: Login with email
function testLoginEmail(email, password) {
  const loginPayload = JSON.stringify({
    identifier: email,
    password: password,
  });

  const loginResponse = http.post(
    `${BASE_URL}/auth/local`,
    loginPayload,
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'Login-Email' },
    }
  );

  loginTime.add(loginResponse.timings.duration);
  loginEmailCounter.add(1);
  
  const loginSuccess = check(loginResponse, {
    'Login(Email): Status is 200': (r) => r.status === 200,
    'Login(Email): JWT received': (r) => r.json('jwt') !== undefined,
    'Login(Email): Email matches': (r) => r.json('user.email') === email,
    'Login(Email): Response time < 400ms': (r) => r.timings.duration < 400,
  });

  errorRate.add(!loginSuccess);
  
  return loginResponse.status === 200 ? loginResponse.json() : null;
}

// Test Scenario 4: Get authenticated user info
function testGetUserInfo(jwt) {
  const getUserResponse = http.get(
    `${BASE_URL}/users/me`,
    {
      headers: { 
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      tags: { name: 'Get-User-Info' },
    }
  );

  getUserTime.add(getUserResponse.timings.duration);
  getUserCounter.add(1);
  
  const getUserSuccess = check(getUserResponse, {
    'Get User: Status is 200': (r) => r.status === 200,
    'Get User: User ID present': (r) => r.json('id') !== undefined,
    'Get User: Username present': (r) => r.json('username') !== undefined,
    'Get User: Response time < 300ms': (r) => r.timings.duration < 300,
  });

  errorRate.add(!getUserSuccess);
}

// Main test function (executed by each VU)
export default function () {
  // Scenario 1: Register a new user
  console.log('[VU] Registering new user...');
  const registerData = testRegister();
  
  if (registerData) {
    const { username, email } = registerData.user;
    const password = 'Test@123456';
    
    sleep(1); // Think time between requests
    
    // Scenario 2: Login with username
    console.log('[VU] Logging in with username...');
    const loginData = testLoginUsername(username, password);
    
    sleep(1);
    
    // Scenario 3: Login with email
    console.log('[VU] Logging in with email...');
    const emailLoginData = testLoginEmail(email, password);
    
    if (emailLoginData) {
      sleep(1);
      
      // Scenario 4: Get user info with JWT
      console.log('[VU] Getting user info...');
      testGetUserInfo(emailLoginData.jwt);
    }
  }
  
  // Think time before next iteration
  sleep(2);
}

// Setup function (runs once before test)
export function setup() {
  console.log('========================================');
  console.log('K6 Performance Test - Level 1: Basic Authentication');
  console.log('========================================');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Virtual Users: 10`);
  console.log(`Report Format: ${REPORT_FORMAT}`);
  console.log('========================================');
  console.log('');
}

// Teardown function (runs once after test)
export function teardown(data) {
  console.log('');
  console.log('========================================');
  console.log('Test completed!');
  console.log('Check the generated reports for results.');
  console.log('========================================');
}

// Handle summary report generation
export function handleSummary(data) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const summary = {
    // Base test information
    test_name: "K6 Performance Test - Level 1: Basic Authentication",
    timestamp: new Date().toISOString(),
    base_url: BASE_URL,
    options: options,
    
    // Key metrics
    duration: data.metrics.iteration_duration.values.avg,
    iterations: data.metrics.iterations.count,
    total_requests: data.metrics.http_reqs.count,
    success_rate: (1 - data.metrics.http_req_failed.values.rate) * 100,
    
    // Response times
    avg_response_time: data.metrics.http_req_duration.values.avg,
    p95_response_time: data.metrics.http_req_duration.values['p(95)'],
    p99_response_time: data.metrics.http_req_duration.values['p(99)'],
    
    // Scenario-specific metrics
    scenarios: {
      registration: {
        count: data.metrics.registration_count.values.count,
        avg_duration: data.metrics.registration_duration.values.avg,
        p95_duration: data.metrics.registration_duration.values['p(95)']
      },
      login_username: {
        count: data.metrics.login_username_count.values.count,
        avg_duration: data.metrics.login_duration.values.avg,
        p95_duration: data.metrics.login_duration.values['p(95)']
      },
      login_email: {
        count: data.metrics.login_email_count.values.count,
        avg_duration: data.metrics.login_duration.values.avg,
        p95_duration: data.metrics.login_duration.values['p(95)']
      },
      get_user: {
        count: data.metrics.get_user_count.values.count,
        avg_duration: data.metrics.get_user_duration.values.avg,
        p95_duration: data.metrics.get_user_duration.values['p(95)']
      }
    },
    
    // Threshold results
    thresholds: {
      http_req_duration: data.metrics.http_req_duration.thresholds,
      http_req_failed: data.metrics.http_req_failed.thresholds,
      registration_duration: data.metrics.registration_duration.thresholds,
      login_duration: data.metrics.login_duration.thresholds,
      get_user_duration: data.metrics.get_user_duration.thresholds
    }
  };

  const reports = {};
  
  // Generate JSON report
  if (REPORT_FORMAT === 'json' || REPORT_FORMAT === 'both') {
    reports[`summary-${timestamp}.json`] = JSON.stringify(summary, null, 2);
  }
  
  // Generate HTML report
  if (REPORT_FORMAT === 'html' || REPORT_FORMAT === 'both') {
    reports[`summary-${timestamp}.html`] = htmlReport(data);
  }
  
  // Always generate text summary to console
  console.log(textSummary(data, { indent: ' ', enableColors: true }));
  
  return reports;
}