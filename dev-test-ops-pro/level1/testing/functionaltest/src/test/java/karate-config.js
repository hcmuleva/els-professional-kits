function fn() {
  var env = karate.env;
  karate.log('karate.env system property was:', env);
  
  if (!env) {
    env = 'dev';
  }
  
  var config = {
    env: env,
    baseUrl: 'http://localhost:1337/api',
    apiTimeout: 30000
  };
  
  if (env === 'dev') {
    config.baseUrl = 'http://localhost:1337/api';
  } else if (env === 'qa') {
    config.baseUrl = 'https://qa.yourapi.com/api';
  } else if (env === 'staging') {
    config.baseUrl = 'https://staging.yourapi.com/api';
  } else if (env === 'prod') {
    config.baseUrl = 'https://api.yourapi.com/api';
  }
  
  config.headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  config.generateRandomEmail = function() {
    return 'test' + java.lang.System.currentTimeMillis() + '@example.com';
  };
  
  config.generateRandomUsername = function() {
    return 'user' + java.lang.System.currentTimeMillis();
  };
  
  karate.configure('connectTimeout', config.apiTimeout);
  karate.configure('readTimeout', config.apiTimeout);
  karate.configure('report', { showLog: true, showAllSteps: false });
  
  return config;
}
