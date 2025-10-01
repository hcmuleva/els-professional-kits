// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(axios|@ant-design|antd|rc-.*|react-router-dom)/)'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest'
  },
  moduleFileExtensions: ['js','jsx','json','mjs'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/index.jsx',
    '!src/reportWebVitals.js',
    '!src/setupTests.js',
  ],
  coverageDirectory: 'test-results/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  reporters: [
    'default',
    ['jest-html-reporters', { publicPath: './test-results', filename: 'test-report.html', expand: true }]
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.(test|spec).{js,jsx,ts,tsx}',
    '**/*.test.(ts|js)', '**/*.it.(ts|js)', '**/*.pacttest.(ts|js)'
  ],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['js','jsx','json','mjs'],
  watchPathIgnorePatterns: ['pact/logs/*', 'pact/pacts/*'],
  verbose: true,
  passWithNoTests: true,
};
