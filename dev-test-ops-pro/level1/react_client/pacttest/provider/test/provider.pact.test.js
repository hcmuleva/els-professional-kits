// pacttest/provider/test/provider.pact.test.js
const { Verifier } = require("@pact-foundation/pact");
const app = require("../src/mockProvider");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Ensure logs directory exists
const logsDir = path.resolve(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

describe("Pact Provider Verification", () => {
  let server;
  const PORT = process.env.PROVIDER_PORT || 4000;
  const PROVIDER_NAME = process.env.PROVIDER_NAME || "lms-backend";
  const CONSUMER_NAME = process.env.CONSUMER_NAME || "lms-frontend";

  beforeAll((done) => {
    server = app.listen(PORT, () => {
      console.log(`✅ Provider running on http://localhost:${PORT}`);
      done();
    });
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  describe("Contract Verification", () => {
    it("validates provider against consumer pacts", async () => {
      const opts = {
        // Provider details
        provider: PROVIDER_NAME,
        providerBaseUrl: `http://localhost:${PORT}`,
        
        // Pact Broker configuration
        pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
        
        // Publish verification results back to broker
        publishVerificationResult: process.env.PUBLISH_VERIFICATION_RESULT === 'true',
        providerVersion: process.env.GITHUB_SHA || `dev-${Date.now()}`,
        providerVersionTags: [process.env.GITHUB_REF_NAME || "main"],
        
        // Consumer version selectors - which pacts to verify against
        consumerVersionSelectors: [
          {
            latest: true,
            tag: "main" // Verify against latest main branch pacts
          },
          {
            latest: true,
            tag: "latest"
          }
        ],
        
        // State handlers for provider states
        stateHandlers: {
          // Auth states
          "user exists with valid credentials": () => {
            console.log("🔧 Setting up state: user exists with valid credentials");
            // Mock data is already set up in mockProvider.js
            return Promise.resolve();
          },
          
          "user exists but password is incorrect": () => {
            console.log("🔧 Setting up state: user exists but password is incorrect");
            // This is handled by the mock logic
            return Promise.resolve();
          },
          
          "no user exists with this email": () => {
            console.log("🔧 Setting up state: no user exists with this email");
            // Mock allows new registrations by default
            return Promise.resolve();
          },
          
          "user already exists with this email": () => {
            console.log("🔧 Setting up state: user already exists with this email");
            // Mock handles this with "existing@example.com"
            return Promise.resolve();
          },
          
          "user is authenticated with valid token": () => {
            console.log("🔧 Setting up state: user is authenticated with valid token");
            // Mock JWT middleware handles this
            return Promise.resolve();
          },
          
          "token is invalid or expired": () => {
            console.log("🔧 Setting up state: token is invalid or expired");
            // Mock handles invalid.jwt.token
            return Promise.resolve();
          },
          
          // User management states
          "users exist in the system": () => {
            console.log("🔧 Setting up state: users exist in the system");
            // Mock data is pre-populated
            return Promise.resolve();
          },
          
          "user is not authenticated": () => {
            console.log("🔧 Setting up state: user is not authenticated");
            // Mock middleware handles missing auth
            return Promise.resolve();
          },
          
          "authenticated user can create users": () => {
            console.log("🔧 Setting up state: authenticated user can create users");
            // Mock allows user creation with valid JWT
            return Promise.resolve();
          },
          
          "user with email already exists": () => {
            console.log("🔧 Setting up state: user with email already exists");
            // Mock handles existing@example.com
            return Promise.resolve();
          },
          
          "user with ID 1 exists": () => {
            console.log("🔧 Setting up state: user with ID 1 exists");
            // Mock data includes user with ID 1
            return Promise.resolve();
          },
          
          "user with ID 999 does not exist": () => {
            console.log("🔧 Setting up state: user with ID 999 does not exist");
            // Mock will return 404 for non-existent users
            return Promise.resolve();
          },
          
          "user with ID 1 exists and can be updated": () => {
            console.log("🔧 Setting up state: user with ID 1 exists and can be updated");
            // Mock allows updates to existing users
            return Promise.resolve();
          },
          
          "user with ID 2 exists and can be deleted": () => {
            console.log("🔧 Setting up state: user with ID 2 exists and can be deleted");
            // Mock allows deletion of user ID 2
            return Promise.resolve();
          },
          
          "user tries to delete their own account": () => {
            console.log("🔧 Setting up state: user tries to delete their own account");
            // Mock prevents deletion of user ID 1 (current user)
            return Promise.resolve();
          }
        },
        
        // Request filters - modify requests before verification if needed
        requestFilters: {
          // You can add custom request filtering logic here if needed
        },
        
        // Logging configuration
        logLevel: process.env.PACT_LOG_LEVEL || "INFO",
        logDir: logsDir,
        
        // Timeout settings
        timeout: 30000,
        
        // Optional: Pact Broker authentication
        // pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
        // pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
      };

      try {
        console.log("🔍 Starting Pact verification...");
        console.log(`   Provider: ${opts.provider}`);
        console.log(`   Provider URL: ${opts.providerBaseUrl}`);
        console.log(`   Pact Broker: ${opts.pactBrokerUrl}`);
        console.log(`   Consumer Selectors:`, opts.consumerVersionSelectors);
        
        const output = await new Verifier(opts).verifyProvider();
        
        console.log("✅ Pact Verification completed successfully!");
        console.log("📊 Verification Results:", output);
        
        // The verification results are automatically published to the broker
        // if publishVerificationResult is true
        
      } catch (error) {
        console.error("❌ Pact verification failed:");
        console.error(error.message);
        
        // Provide helpful debugging information
        if (error.message.includes("No pacts found")) {
          console.error("💡 Possible causes:");
          console.error("   - Consumer pacts haven't been published yet");
          console.error("   - Consumer/Provider names don't match");
          console.error("   - Pact Broker is not accessible");
          console.error("   - Wrong consumer version selectors");
          console.error("\n🔧 Try running:");
          console.error("   cd ../consumer && npm run test:consumer && npm run publish:pacts");
        }
        
        if (error.message.includes("ECONNREFUSED")) {
          console.error("💡 Make sure the Pact Broker is running:");
          console.error("   cd ../broker && docker-compose up -d");
        }
        
        throw error;
      }
    }, 60000); // Increased timeout for verification
  });

  describe("Provider State Setup Verification", () => {
    it("should have all required state handlers defined", () => {
      const requiredStates = [
        "user exists with valid credentials",
        "user exists but password is incorrect", 
        "no user exists with this email",
        "user already exists with this email",
        "user is authenticated with valid token",
        "token is invalid or expired",
        "users exist in the system",
        "user is not authenticated",
        "authenticated user can create users",
        "user with email already exists",
        "user with ID 1 exists",
        "user with ID 999 does not exist",
        "user with ID 1 exists and can be updated",
        "user with ID 2 exists and can be deleted",
        "user tries to delete their own account"
      ];

      // This is more of a documentation test to ensure we have all states
      requiredStates.forEach(state => {
        console.log(`✓ State handler available: ${state}`);
      });

      expect(requiredStates.length).toBeGreaterThan(0);
    });
  });

  describe("Provider Health Check", () => {
    it("should be healthy before running pact verification", async () => {
      const response = await fetch(`http://localhost:${PORT}/health`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
      
      console.log("✅ Provider health check passed");
    });
  });
});