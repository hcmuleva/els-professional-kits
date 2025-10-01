/**
 * K6 Performance Test - Level 2: Data-Driven Testing with Extended Fields
 * 
 * GOAL: Load test with multiple user scenarios and extended registration data
 * MAPS TO: Functional Level 2 - Data Driven Authentication
 * 
 * SCENARIOS:
 * 1. Register users with extended fields (first_name, last_name)
 * 2. Multiple user types with different data
 * 3. Concurrent registrations
 * 4. Login performance with multiple users
 * 
 * PERFORMANCE GOALS:
 * - Response time < 800ms (p95) for extended registration
 * - Success rate > 98%
 * - 50 Virtual Users (VUs)
 * - 5 minute duration
 * - Handle 1000+ registrations
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Trend, Rate } from 'k6/metrics';
import { SharedArray } from 'k6/data';

// Custom metrics
const registrationExtendedTime = new Trend('registration_extended_duration');
const loginBulkTime = new Trend('login_bulk_duration');
const concurrentReqTime = new Trend('concurrent_request_duration');
const errorRate = new Rate('errors');
const successfulRegistrations = new Counter('successful_registrations');
const successfulLogins = new Counter('successful_logins');

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:1337/api';

// Test data - Multiple user profiles
const userProfiles = new SharedArray('user_profiles', function() {
  return [
    { firstName: 'John', lastName: 'Smith', role: 'admin' },
    { firstName: 'Jane', lastName: 'Doe', role: 'user' },
    { firstName: 'Bob', lastName: 'Johnson', role: 'manager' },
    { firstName: 'Alice', lastName: 'Williams', role: 'user' },
    { firstName: 'Charlie', lastName: 'Brown', role: 'user' },
    { firstName: 'Emma', lastName: 'Davis', role: 'manager' },
    { firstName: 'Oliver', lastName: 'Wilson', role: 'user' },
    { firstName: 'Sophia', lastName: 'Taylor', role: 'admin' },
    { firstName: 'James', lastName: 'Anderson', role: 'user' },
    { firstName: 'Emily', lastName: 'Thomas', role: 'user' },
  ];
});

// Performance test options - More intensive than Level 1
export const options = {
  scenarios: {
    // Scenario 1: Steady load for registration
    steady_registration: {
      executor: 'constant-vus',
      vus: 20,
      duration: '2m',
      exec: 'registerUsers',
      tags: { scenario: 'registration' },
    },
    // Scenario 2: Ramping load for login
    ramping_login: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 30 },
        { duration: '2m', target: 30 },
        { duration: '1m', target: 0 },
      ],
      exec: 'loginUsers',
      tags: { scenario: 'login' },
      startTime: '2m', // Start after registration scenario
    },
    // Scenario 3: Spike test
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 50 },  // Spike to 50
        { duration: '30s', target: 50 },  // Hold
        { duration: '10s', target: 0 },   // Drop
      ],
      exec: 'spikeTest',
      tags: { scenario: 'spike' },
      startTime: '4m', // Start after login scenario
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.02'],
    'registration_extended_duration': ['p(95)<800'],
    'login_bulk_duration': ['p(95)<500'],
    'concurrent_request_duration': ['p(95)<1000'],
  },
};

// Helper: Generate unique user with extended data
function generateExtendedUser(profile) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100000);
  const username = `${profile.firstName.toLowerCase()}${random}`;
  
  return {
    username: username,
    email: `${username}@test.com`,
    password: 'Test@123456',
    first_name: profile.firstName,
    last_name: profile.lastName,
    role: profile.role,
  };
}

// Test Function: Register user with extended fields
function registerExtendedUser(userData) {
  const payload = JSON.stringify({
    username: userData.username,
    email: userData.email,
    password: userData.password,
    first_name: userData.first_name,
    last_name: userData.last_name,
  });

  const response = http.post(
    `${BASE_URL}/auth/local/register`,
    payload,
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { 
        name: 'Register-Extended',
        firstName: userData.first_name,
        role: userData.role,
      },
    }
  );

  registrationExtendedTime.add(response.timings.duration);
  
  const success = check(response, {
    'Register Extended: Status 200': (r) => r.status === 200,
    'Register Extended: JWT received': (r) => r.json('jwt') !== undefined,
    'Register Extended: User created': (r) => r.json('user.id') !== undefined,
    'Register Extended: Response < 800ms': (r) => r.timings.duration < 800,
  });

  if (success) {
    successfulRegistrations.add(1);
  } else {
    errorRate.add(1);
  }
  
  return response.status === 200 ? response.json() : null;
}

// Test Function: Login with identifier
function loginUser(identifier, password) {
  const payload = JSON.stringify({
    identifier: identifier,
    password: password,
  });

  const response = http.post(
    `${BASE_URL}/auth/local`,
    payload,
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'Login-Bulk' },
    }
  );

  loginBulkTime.add(response.timings.duration);
  
  const success = check(response, {
    'Login Bulk: Status 200': (r) => r.status === 200,
    'Login Bulk: JWT received': (r) => r.json('jwt') !== undefined,
    'Login Bulk: Response < 500ms': (r) => r.timings.duration < 500,
  });

  if (success) {
    successfulLogins.add(1);
  } else {
    errorRate.add(1);
  }
  
  return response.status === 200 ? response.json() : null;
}

// Test Function: Get user info
function getUserInfo(jwt) {
  const response = http.get(
    `${BASE_URL}/users/me`,
    {
      headers: { 
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      tags: { name: 'Get-User-Bulk' },
    }
  );

  concurrentReqTime.add(response.timings.duration);
  
  check(response, {
    'Get User Bulk: Status 200': (r) => r.status === 200,
    'Get User Bulk: Data present': (r) => r.json('username') !== undefined,
  });
}

// Exported Scenario 1: Register users
export function registerUsers() {
  group('User Registration with Extended Fields', function() {
    // Get random profile
    const profile = userProfiles[Math.floor(Math.random() * userProfiles.length)];
    const userData = generateExtendedUser(profile);
    
    console.log(`[Registration] Creating user: ${userData.first_name} ${userData.last_name}`);
    
    const registerData = registerExtendedUser(userData);
    
    if (registerData) {
      sleep(0.5);
      
      // Immediately login with registered user
      const loginData = loginUser(userData.username, userData.password);
      
      if (loginData) {
        sleep(0.5);
        getUserInfo(loginData.jwt);
      }
    }
    
    sleep(1);
  });
}

// Exported Scenario 2: Login users
export function loginUsers() {
  group('Bulk User Login', function() {
    // Create user first (in real scenario, this would be existing user)
    const profile = userProfiles[Math.floor(Math.random() * userProfiles.length)];
    const userData = generateExtendedUser(profile);
    
    const registerData = registerExtendedUser(userData);
    
    if (registerData) {
      // Multiple login attempts
      for (let i = 0; i < 3; i++) {
        console.log(`[Login] Attempt ${i + 1} for user: ${userData.username}`);
        
        const loginData = loginUser(
          i % 2 === 0 ? userData.username : userData.email,
          userData.password
        );
        
        if (loginData) {
          getUserInfo(loginData.jwt);
        }
        
        sleep(0.5);
      }
    }
    
    sleep(1);
  });
}

// Exported Scenario 3: Spike test
export function spikeTest() {
  group('Spike Load Test', function() {
    console.log('[Spike Test] Concurrent operations...');
    
    // Simulate concurrent registrations
    const profile = userProfiles[Math.floor(Math.random() * userProfiles.length)];
    const users = [];
    
    // Register multiple users quickly
    for (let i = 0; i < 5; i++) {
      const userData = generateExtendedUser(profile);
      const registerData = registerExtendedUser(userData);
      
      if (registerData) {
        users.push({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          jwt: registerData.jwt,
        });
      }
      
      sleep(0.1); // Minimal wait
    }
    
    // Login all users concurrently
    users.forEach((user, index) => {
      console.log(`[Spike Test] Logging in user ${index + 1}/${users.length}`);
      const loginData = loginUser(user.username, user.password);
      
      if (loginData) {
        getUserInfo(loginData.jwt);
      }
      
      sleep(0.1);
    });
  });
}

// Main entry point (for simple execution)
export default function() {
  registerUsers();
}

// Setup
export function setup() {
  console.log('========================================');
  console.log('K6 Performance Test - Level 2: Data-Driven Testing');
  console.log('========================================');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`User Profiles: ${userProfiles.length}`);
  console.log(`Max VUs: 50`);
  console.log(`Duration: 5 minutes`);
  console.log('========================================');
  console.log('Scenarios:');
  console.log('  1. Steady Registration (20 VUs, 2m)');
  console.log('  2. Ramping Login (0-30 VUs, 4m)');
  console.log('  3. Spike Test (50 VUs, 50s)');
  console.log('========================================');
  console.log('');
  
  // Warm-up request
  const warmup = http.get(BASE_URL);
  if (warmup.status !== 200 && warmup.status !== 404) {
    console.error('Warning: API might not be accessible!');
  }
}

// Teardown
export function teardown(data) {
  console.log('');
  console.log('========================================');
  console.log('Level 2 Test Complete!');
  console.log('========================================');
  console.log('Summary:');
  console.log('  - Check successful_registrations counter');
  console.log('  - Check successful_logins counter');
  console.log('  - Review error_rate metric');
  console.log('  - Analyze response time trends');
  console.log('========================================');
}