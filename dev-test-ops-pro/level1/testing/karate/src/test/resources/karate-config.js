function fn() {
  var config = {};
  // Base URL of your Flask API
  config.baseUrl = 'http://localhost:5002/api';

  // Default headers
  config.headers = { 'Content-Type': 'application/json' };

  return config;
}
