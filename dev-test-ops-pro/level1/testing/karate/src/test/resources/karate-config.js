function fn() {
  var config = {};
  // Base URL of your Flask API
  config.baseUrl = 'http://localhost:5050/api';

  // Default headers
  config.headers = { 'Content-Type': 'application/json' };

  return config;
}
