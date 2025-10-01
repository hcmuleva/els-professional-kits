// pacttest/provider/test/setup.js
// Global test setup for provider pact tests

// Add fetch polyfill for Node.js
const { fetch, Headers, Request, Response } = require('undici');

global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

// Set longer timeout for pact verification tests
jest.setTimeout(60000);

// Global test configuration
beforeAll(() => {
  console.log('🧪 Starting Pact Provider Test Suite');
  console.log('📋 Environment Configuration:');
  console.log(`   PACT_BROKER_BASE_URL: ${process.env.PACT_BROKER_BASE_URL}`);
  console.log(`   PROVIDER_PORT: ${process.env.PROVIDER_PORT}`);
  console.log(`   PROVIDER_NAME: ${process.env.PROVIDER_NAME}`);
  console.log(`   CONSUMER_NAME: ${process.env.CONSUMER_NAME}`);
});

afterAll(() => {
  console.log('✅ Pact Provider Test Suite completed');
});