// pacttest/consumer/test/auth.pact.test.js
const path = require("path");
const fs = require("fs");
const { pactWith } = require("jest-pact");
const { like } = require('@pact-foundation/pact').MatchersV3;
const PactAuthService = require("../src/service/authService.pact");
require("dotenv").config();

jest.setTimeout(30000); // increase jest timeout for Pact operations

const pactDir = path.resolve(process.cwd(), "pacts");
const logsDir = path.resolve(process.cwd(), "logs");

if (!fs.existsSync(pactDir)) fs.mkdirSync(pactDir, { recursive: true });
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const CONSUMER_NAME = process.env.CONSUMER_NAME || "lms-frontend";
const PROVIDER_NAME = process.env.PROVIDER_NAME || "lms-backend";

pactWith(
  {
    consumer: CONSUMER_NAME,
    provider: PROVIDER_NAME,
    dir: pactDir,
    log: path.join(logsDir, "auth-pact.log"),
    logLevel: "DEBUG",
    spec: 3,
    port: 0, // dynamic port
  },
  (provider) => {
    // Helper to get mock server URL in a robust way
    function getMockServerUrl() {
      // provider.mockService may expose baseUrl or url depending on versions
      const ms = provider.mockService || {};
      return ms.baseUrl || ms.url || ms.mockUrl || `http://127.0.0.1:${provider.port || ""}`;
    }

    describe("Auth API Pact Tests", () => {
      describe("POST /auth/local - Login", () => {
        it("should successfully login with valid credentials", async () => {
          const loginRequest = {
            identifier: "test@example.com",
            password: "password123",
          };

          const expectedResponseMatcher = like({
            jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token",
            user: {
              id: 1,
              username: "testuser",
              email: "test@example.com",
              first_name: "Test",
              last_name: "User",
              mobile_number: "1234567890",
              gender: "MALE",
              confirmed: true,
              blocked: false,
              role: {
                id: 1,
                name: "Authenticated",
                type: "authenticated"
              }
            },
          });

          const expectedResponseExample = {
            jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token",
            user: {
              id: 1,
              username: "testuser",
              email: "test@example.com",
              first_name: "Test",
              last_name: "User",
              mobile_number: "1234567890",
              gender: "MALE",
              confirmed: true,
              blocked: false,
              role: {
                id: 1,
                name: "Authenticated",
                type: "authenticated"
              }
            },
          };

          await provider.addInteraction({
            state: "user exists with valid credentials",
            uponReceiving: "a login request with valid credentials",
            withRequest: {
              method: "POST",
              path: "/auth/local",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              body: loginRequest,
            },
            willRespondWith: {
              status: 200,
              headers: {
                "Content-Type": "application/json",
              },
              body: expectedResponseMatcher,
            },
          });

          const baseUrl = getMockServerUrl();
          console.log("Using mock server baseUrl:", baseUrl);
          const authService = new PactAuthService(baseUrl);

          const result = await authService.login(loginRequest.identifier, loginRequest.password);
          expect(result).toMatchObject(expectedResponseExample);
        });

        it("should fail login with invalid credentials", async () => {
          const loginRequest = {
            identifier: "test@example.com",
            password: "wrongpassword",
          };

          const errorResponseMatcher = like({
            error: {
              status: 400,
              name: "ValidationError",
              message: "Invalid identifier or password"
            }
          });

          const errorResponseExample = {
            error: {
              status: 400,
              name: "ValidationError",
              message: "Invalid identifier or password"
            }
          };

          await provider.addInteraction({
            state: "user exists but password is incorrect",
            uponReceiving: "a login request with invalid credentials",
            withRequest: {
              method: "POST",
              path: "/auth/local",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              body: loginRequest,
            },
            willRespondWith: {
              status: 400,
              headers: {
                "Content-Type": "application/json",
              },
              body: errorResponseMatcher,
            },
          });

          const baseUrl = getMockServerUrl();
          console.log("Using mock server baseUrl:", baseUrl);
          const authService = new PactAuthService(baseUrl);

          await expect(authService.login(loginRequest.identifier, loginRequest.password))
            .rejects.toMatchObject(errorResponseExample);
        });
      });

      describe("POST /auth/local/register - Registration", () => {
        it("should successfully register a new user", async () => {
          const registrationData = {
            username: "newuser",
            email: "newuser@example.com",
            password: "password123",
            first_name: "New",
            last_name: "User",
            mobile_number: "9876543210",
            gender: "MALE",
          };

          const expectedResponseMatcher = like({
            jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new.token",
            user: {
              id: 2,
              username: "newuser",
              email: "newuser@example.com",
              first_name: "New",
              last_name: "User",
              mobile_number: "9876543210",
              gender: "MALE",
              confirmed: false,
              blocked: false,
              role: {
                id: 1,
                name: "Authenticated",
                type: "authenticated"
              }
            },
          });

          const expectedResponseExample = {
            jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new.token",
            user: {
              id: 2,
              username: "newuser",
              email: "newuser@example.com",
              first_name: "New",
              last_name: "User",
              mobile_number: "9876543210",
              gender: "MALE",
              confirmed: false,
              blocked: false,
              role: {
                id: 1,
                name: "Authenticated",
                type: "authenticated"
              }
            },
          };

          await provider.addInteraction({
            state: "no user exists with this email",
            uponReceiving: "a registration request with valid data",
            withRequest: {
              method: "POST",
              path: "/auth/local/register",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              body: registrationData,
            },
            willRespondWith: {
              status: 200,
              headers: {
                "Content-Type": "application/json",
              },
              body: expectedResponseMatcher,
            },
          });

          const baseUrl = getMockServerUrl();
          console.log("Using mock server baseUrl:", baseUrl);
          const authService = new PactAuthService(baseUrl);
          const result = await authService.register(registrationData);
          expect(result).toMatchObject(expectedResponseExample);
        });

        it("should fail registration with existing email", async () => {
          const registrationData = {
            username: "existinguser",
            email: "existing@example.com",
            password: "password123",
            first_name: "Existing",
            last_name: "User",
            mobile_number: "1111111111",
            gender: "FEMALE",
          };

          const errorResponseMatcher = like({
            error: {
              status: 400,
              name: "ValidationError",
              message: "Email is already taken"
            }
          });

          const errorResponseExample = {
            error: {
              status: 400,
              name: "ValidationError",
              message: "Email is already taken"
            }
          };

          await provider.addInteraction({
            state: "user already exists with this email",
            uponReceiving: "a registration request with existing email",
            withRequest: {
              method: "POST",
              path: "/auth/local/register",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              body: registrationData,
            },
            willRespondWith: {
              status: 400,
              headers: {
                "Content-Type": "application/json",
              },
              body: errorResponseMatcher,
            },
          });

          const baseUrl = getMockServerUrl();
          console.log("Using mock server baseUrl:", baseUrl);
          const authService = new PactAuthService(baseUrl);
          await expect(authService.register(registrationData))
            .rejects.toMatchObject(errorResponseExample);
        });
      });

      describe("GET /auth/me - Token Validation", () => {
        it("should validate a valid JWT token", async () => {
          const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid.token";

          const expectedUserMatcher = like({
            id: 1,
            username: "testuser",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
            mobile_number: "1234567890",
            gender: "MALE",
            confirmed: true,
            blocked: false,
          });

          const expectedUserExample = {
            id: 1,
            username: "testuser",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
            mobile_number: "1234567890",
            gender: "MALE",
            confirmed: true,
            blocked: false,
          };

          await provider.addInteraction({
            state: "user is authenticated with valid token",
            uponReceiving: "a token validation request with valid JWT",
            withRequest: {
              method: "GET",
              path: "/auth/me",
              headers: {
                "Authorization": `Bearer ${validToken}`,
                "Accept": "application/json"
              },
            },
            willRespondWith: {
              status: 200,
              headers: {
                "Content-Type": "application/json",
              },
              body: expectedUserMatcher, // server returns user object
            },
          });

          const baseUrl = getMockServerUrl();
          console.log("Using mock server baseUrl:", baseUrl);
          const authService = new PactAuthService(baseUrl);
          const result = await authService.validateToken(validToken);

          expect(result).toMatchObject({
            valid: true,
            user: expectedUserExample,
          });
        });

        it("should fail validation with invalid JWT token", async () => {
          const invalidToken = "invalid.jwt.token";

          const errorResponseMatcher = like({
            error: {
              status: 401,
              name: "UnauthorizedError",
              message: "Invalid token"
            }
          });

          const errorResponseExample = {
            error: {
              status: 401,
              name: "UnauthorizedError",
              message: "Invalid token"
            }
          };

          await provider.addInteraction({
            state: "token is invalid or expired",
            uponReceiving: "a token validation request with invalid JWT",
            withRequest: {
              method: "GET",
              path: "/auth/me",
              headers: {
                "Authorization": `Bearer ${invalidToken}`,
                "Accept": "application/json"
              },
            },
            willRespondWith: {
              status: 401,
              headers: {
                "Content-Type": "application/json",
              },
              body: errorResponseMatcher,
            },
          });

          const baseUrl = getMockServerUrl();
          console.log("Using mock server baseUrl:", baseUrl);
          const authService = new PactAuthService(baseUrl);
          const result = await authService.validateToken(invalidToken);

          expect(result).toMatchObject({
            valid: false,
            error: errorResponseExample,
          });
        });
      });
    });
  }
);
