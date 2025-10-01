# Pact Contract Testing Setup for LMS Application

This folder contains the complete Pact contract testing setup for the LMS (Learning Management System) application, providing contract testing between the React frontend (consumer) and the Node.js backend API (provider).

## 📁 Folder Structure

```
pacttest/
├── broker/                 # Pact Broker setup
│   ├── docker-compose.yml  # Pact Broker with PostgreSQL
│   └── .env                # Broker configuration
├── consumer/               # Frontend consumer tests
│   ├── package.json        # Consumer dependencies
│   ├── .env                # Consumer configuration
│   ├── test/               # Pact consumer tests
│   │   ├── auth.pact.test.js    # Auth API contract tests
│   │   └── user.pact.test.js    # User API contract tests
│   ├── src/service/        # Service wrappers for testing
│   │   ├── authService.pact.js  # Auth service wrapper
│   │   └── userService.pact.js  # User service wrapper
│   ├── scripts/
│   │   └── publishPacts.js # Pact publishing script
│   ├── logs/               # Test logs
│   └── pacts/              # Generated pact files
└── provider/               # Backend provider verification
    ├── package.json        # Provider dependencies
    ├── .env                # Provider configuration
    ├── test/
    │   ├── provider.pact.test.js # Provider verification tests
    │   └── setup.js        # Test setup configuration
    ├── src/
    │   └── mockProvider.js # Mock API server for testing
    └── logs/               # Verification logs
```

## 🚀 Quick Start Guide

### 1. Start the Pact Broker

```bash
cd pacttest/broker
docker-compose up -d
```

The Pact Broker will be available at: http://localhost:9292

### 2. Install Dependencies

**Consumer:**
```bash
cd pacttest/consumer
npm install
```

**Provider:**
```bash
cd pacttest/provider
npm install
```

### 3. Run Consumer Tests

```bash
cd pacttest/consumer
npm run test:consumer
```

This will:
- Generate pact contract files in `consumer/pacts/`
- Test the expected API behavior from frontend perspective

### 4. Publish Pacts to Broker

```bash
cd pacttest/consumer
npm run publish:pacts
```

### 5. Run Provider Verification

```bash
cd pacttest/provider
npm run test:provider
```

This will:
- Fetch contracts from the Pact Broker
- Verify the provider (backend) fulfills all consumer expectations
- Publish verification results back to the broker

## 📋 Available Scripts

### Consumer Scripts
- `npm run test:auth` - Run auth API contract tests only
- `npm run test:user` - Run user API contract tests only
- `npm run test:consumer` - Run all consumer contract tests
- `npm run test:consumer:watch` - Run tests in watch mode
- `npm run publish:pacts` - Publish pacts to broker
- `npm run clean:pacts` - Remove generated pact files
- `npm run test:ci` - Run tests and publish (for CI/CD)

### Provider Scripts
- `npm run test:provider` - Run provider verification tests
- `npm run test:provider:watch` - Run verification in watch mode
- `npm run start:mock` - Start mock provider server
- `npm run clean:logs` - Remove log files
- `npm run test:ci` - Run verification (for CI/CD)

### Broker Scripts
- `docker-compose up -d` - Start broker and database
- `docker-compose down` - Stop broker and database
- `docker-compose logs -f` - View broker logs

## 🔧 Configuration

### Environment Variables

**Broker (.env):**
- `PACT_BROKER_BASE_URL` - Broker URL (default: http://localhost:9292)
- Database connection settings

**Consumer (.env):**
- `PACT_BROKER_BASE_URL` - Where to publish pacts
- `PACT_MOCK_SERVER_PORT` - Mock server port for tests
- `CONSUMER_NAME` - Consumer identifier (lms-frontend)
- `PROVIDER_NAME` - Provider identifier (lms-backend)

**Provider (.env):**
- `PACT_BROKER_BASE_URL` - Where to fetch contracts
- `PROVIDER_PORT` - Provider server port
- `PUBLISH_VERIFICATION_RESULT` - Whether to publish results

## 📊 Contract Coverage

### Authentication API
- ✅ POST /auth/local (Login)
- ✅ POST /auth/local/register (Registration)
- ✅ GET /auth/me (Token validation)

### User Management API
- ✅ GET /users (List users)
- ✅ POST /users (Create user)
- ✅ GET /users/:id (Get user by ID)
- ✅ PUT /users/:id (Update user)
- ✅ DELETE /users/:id (Delete user)

## 🛠️ Provider States

The provider tests handle various states to ensure comprehensive testing:

**Authentication States:**
- User exists with valid credentials
- User exists but password is incorrect
- No user exists with this email
- User already exists with this email
- User is authenticated with valid token
- Token is invalid or expired

**User Management States:**
- Users exist in the system
- User is not authenticated
- Authenticated user can create users
- User with specific ID exists/doesn't exist
- User can be updated/deleted
- User tries to delete their own account

## 🔍 Viewing Results

1. **Pact Broker UI**: http://localhost:9292
   - View all contracts and verification results
   - Matrix view showing compatibility between versions
   - Webhooks and integrations

2. **Test Outputs**:
   - Consumer: Generated pact files in `consumer/pacts/`
   - Provider: Verification logs in `provider/logs/`
   - Both: Console output during test runs

## 🚦 CI/CD Integration

### Consumer Pipeline
```yaml
- name: Run Consumer Pact Tests
  run: |
    cd pacttest/consumer
    npm install
    npm run test:ci  # Runs tests and publishes pacts

env:
  GITHUB_SHA: ${{ github.sha }}
  GITHUB_REF_NAME: ${{ github.ref_name }}
```

### Provider Pipeline
```yaml
- name: Run Provider Verification
  run: |
    cd pacttest/provider
    npm install
    npm run test:ci  # Verifies against latest pacts

env:
  GITHUB_SHA: ${{ github.sha }}
  GITHUB_REF_NAME: ${{ github.ref_name }}
```

## 🐛 Troubleshooting

### Common Issues

**1. Pact Broker Connection Failed**
```bash
# Check if broker is running
docker-compose ps

# View broker logs
docker-compose logs -f pact-broker
```

**2. No Pacts Found for Verification**
```bash
# Ensure consumer tests have run and published
cd consumer
npm run test:consumer
npm run publish:pacts
```

**3. Provider Verification Failed**
- Check provider state handlers match consumer expectations
- Verify mock provider implements all required endpoints
- Review logs in `provider/logs/` for detailed errors

**4. Permission Issues**
```bash
# Fix folder permissions
chmod -R 755 pacttest/
```

## 🔄 Workflow

1. **Development Phase**:
   - Write consumer tests defining API expectations
   - Run consumer tests to generate contracts
   - Implement provider to fulfill contracts
   - Run provider verification

2. **CI/CD Phase**:
   - Consumer pipeline publishes contracts
   - Provider pipeline verifies against contracts
   - Both publish results to broker

3. **Deployment Phase**:
   - Check broker matrix for compatibility
   - Deploy only if all contracts are verified
   - Use can-i-deploy tool for advanced checks

## 📚 Best Practices

1. **Consumer Tests**: Focus on what your frontend actually needs
2. **Provider States**: Keep state setup simple and focused
3. **Versioning**: Use semantic versioning for better tracking
4. **Documentation**: Keep contracts as living documentation
5. **Integration**: Run Pact tests in every build pipeline

## 🤝 Contributing

1. Add new contract tests in appropriate consumer test files
2. Update provider states and mock data as needed
3. Ensure all tests pass before submitting changes
4. Update documentation for new API endpoints

---

For more information about Pact testing, visit: https://pact.io/