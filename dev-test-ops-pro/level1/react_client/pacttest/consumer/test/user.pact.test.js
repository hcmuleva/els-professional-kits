// pacttest/consumer/test/user.pact.test.js
const path = require("path");
const fs = require("fs");
const { pactWith } = require("jest-pact");
const { like } = require("@pact-foundation/pact").MatchersV3;
const PactUserService = require("../src/service/userService.pact");
require("dotenv").config();

jest.setTimeout(30000); // allow Pact to start/verify reliably

const pactDir = path.resolve(process.cwd(), "pacts");
const logsDir = path.resolve(process.cwd(), "logs");

if (!fs.existsSync(pactDir)) fs.mkdirSync(pactDir, { recursive: true });
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const CONSUMER_NAME = process.env.CONSUMER_NAME || "lms-frontend";
const PROVIDER_NAME = process.env.PROVIDER_NAME || "lms-backend";
const validJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid.token";

pactWith(
  {
    consumer: CONSUMER_NAME,
    provider: PROVIDER_NAME,
    dir: pactDir,
    log: path.join(logsDir, "user-pact.log"),
    logLevel: "DEBUG",
    spec: 3,
    port: 0, // dynamic port
  },
  (provider) => {
    // robust helper to fetch mock server URL (works with different versions)
    function getMockServerUrl() {
      const ms = provider.mockService || {};
      return ms.baseUrl || ms.url || ms.mockUrl || `http://127.0.0.1:${provider.port || ""}`;
    }

    describe("User API Pact Tests", () => {
      describe("GET /users - Get All Users", () => {
        it("should return list of users for authenticated user", async () => {
          const expectedUsersMatcher = like([
            {
              id: 1,
              username: "user1",
              email: "user1@example.com",
              first_name: "John",
              last_name: "Doe",
              mobile_number: "1234567890",
              gender: "MALE",
              confirmed: true,
              blocked: false,
              role: { id: 1, name: "Authenticated", type: "authenticated" }
            },
            {
              id: 2,
              username: "user2",
              email: "user2@example.com",
              first_name: "Jane",
              last_name: "Smith",
              mobile_number: "0987654321",
              gender: "FEMALE",
              confirmed: true,
              blocked: false,
              role: { id: 1, name: "Authenticated", type: "authenticated" }
            }
          ]);

          // Plain example (runtime assertion)
          const expectedUsersExample = [
            {
              id: 1,
              username: "user1",
              email: "user1@example.com",
              first_name: "John",
              last_name: "Doe",
              mobile_number: "1234567890",
              gender: "MALE",
              confirmed: true,
              blocked: false,
              role: { id: 1, name: "Authenticated", type: "authenticated" }
            },
            {
              id: 2,
              username: "user2",
              email: "user2@example.com",
              first_name: "Jane",
              last_name: "Smith",
              mobile_number: "0987654321",
              gender: "FEMALE",
              confirmed: true,
              blocked: false,
              role: { id: 1, name: "Authenticated", type: "authenticated" }
            }
          ];

          await provider.addInteraction({
            state: "users exist in the system",
            uponReceiving: "a request to get all users with valid authentication",
            withRequest: {
              method: "GET",
              path: "/users",
              headers: {
                Authorization: `Bearer ${validJWT}`,
                Accept: "application/json"
              }
            },
            willRespondWith: {
              status: 200,
              headers: { "Content-Type": "application/json" },
              body: expectedUsersMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          console.log("Using mock server baseUrl:", baseUrl);
          const userService = new PactUserService(baseUrl);

          const result = await userService.getUsers(validJWT);
          expect(result).toMatchObject(expectedUsersExample);
        });

        it("should fail to get users without authentication", async () => {
          const errorMatcher = like({
            error: { status: 401, name: "UnauthorizedError", message: "Unauthorized" }
          });

          const errorExample = { error: { status: 401, name: "UnauthorizedError", message: "Unauthorized" } };

          await provider.addInteraction({
            state: "user is not authenticated",
            uponReceiving: "a request to get all users without authentication",
            withRequest: {
              method: "GET",
              path: "/users",
              headers: { Accept: "application/json" }
            },
            willRespondWith: {
              status: 401,
              headers: { "Content-Type": "application/json" },
              body: errorMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);

          await expect(userService.getUsers()).rejects.toMatchObject(errorExample);
        });
      });

      describe("POST /users - Create User", () => {
        it("should successfully create a new user", async () => {
          const userData = {
            username: "newuser",
            email: "newuser@example.com",
            password: "password123",
            first_name: "New",
            last_name: "User",
            mobile_number: "9876543210",
            gender: "MALE",
          };

          const expectedResponseMatcher = like({
            id: 3,
            username: "newuser",
            email: "newuser@example.com",
            first_name: "New",
            last_name: "User",
            mobile_number: "9876543210",
            gender: "MALE",
            confirmed: false,
            blocked: false,
            role: { id: 1, name: "Authenticated", type: "authenticated" }
          });

          const expectedResponseExample = {
            id: 3,
            username: "newuser",
            email: "newuser@example.com",
            first_name: "New",
            last_name: "User",
            mobile_number: "9876543210",
            gender: "MALE",
            confirmed: false,
            blocked: false,
            role: { id: 1, name: "Authenticated", type: "authenticated" }
          };

          await provider.addInteraction({
            state: "authenticated user can create users",
            uponReceiving: "a request to create a new user",
            withRequest: {
              method: "POST",
              path: "/users",
              headers: {
                Authorization: `Bearer ${validJWT}`,
                "Content-Type": "application/json",
                Accept: "application/json"
              },
              body: { ...userData, role: 1 }
            },
            willRespondWith: {
              status: 200,
              headers: { "Content-Type": "application/json" },
              body: expectedResponseMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);
          const result = await userService.createUser(userData, validJWT);
          expect(result).toMatchObject(expectedResponseExample);
        });

        it("should fail to create user with duplicate email", async () => {
          const userData = {
            username: "duplicateuser",
            email: "existing@example.com",
            password: "password123",
            first_name: "Duplicate",
            last_name: "User",
            mobile_number: "1111111111",
            gender: "FEMALE",
          };

          const errorMatcher = like({
            error: {
              status: 400,
              name: "ValidationError",
              message: "Email is already taken",
              details: {
                errors: [
                  {
                    path: ["email"],
                    message: "This email is already registered"
                  }
                ]
              }
            }
          });

          const errorExample = {
            error: {
              status: 400,
              name: "ValidationError",
              message: "Email is already taken",
              details: {
                errors: [
                  {
                    path: ["email"],
                    message: "This email is already registered"
                  }
                ]
              }
            }
          };

          await provider.addInteraction({
            state: "user with email already exists",
            uponReceiving: "a request to create user with existing email",
            withRequest: {
              method: "POST",
              path: "/users",
              headers: {
                Authorization: `Bearer ${validJWT}`,
                "Content-Type": "application/json",
                Accept: "application/json"
              },
              body: { ...userData, role: 1 }
            },
            willRespondWith: {
              status: 400,
              headers: { "Content-Type": "application/json" },
              body: errorMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);

          await expect(userService.createUser(userData, validJWT)).rejects.toMatchObject(errorExample);
        });

        it("should fail to create user without authentication", async () => {
          const userData = {
            username: "unauthorizeduser",
            email: "unauthorized@example.com",
            password: "password123",
            first_name: "Unauthorized",
            last_name: "User",
            mobile_number: "2222222222",
            gender: "MALE",
          };

          const errorMatcher = like({
            error: { status: 401, name: "UnauthorizedError", message: "Unauthorized" }
          });

          const errorExample = { error: { status: 401, name: "UnauthorizedError", message: "Unauthorized" } };

          await provider.addInteraction({
            state: "user is not authenticated",
            uponReceiving: "a request to create user without authentication",
            withRequest: {
              method: "POST",
              path: "/users",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: { ...userData, role: 1 }
            },
            willRespondWith: {
              status: 401,
              headers: { "Content-Type": "application/json" },
              body: errorMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);

          await expect(userService.createUser(userData)).rejects.toMatchObject(errorExample);
        });

        it("should fail to create user with invalid data", async () => {
          const invalidUserData = {
            username: "",
            email: "invalid-email",
            password: "123",
            first_name: "",
            last_name: "",
            mobile_number: "invalid",
            gender: "INVALID",
          };

          const errorMatcher = like({
            error: {
              status: 400,
              name: "ValidationError",
              message: "Validation failed",
              details: {
                errors: [
                  { path: ["username"], message: "Username is required" },
                  { path: ["email"], message: "Email format is invalid" },
                  { path: ["password"], message: "Password must be at least 6 characters" },
                  { path: ["mobile_number"], message: "Mobile number format is invalid" }
                ]
              }
            }
          });

          const errorExample = {
            error: {
              status: 400,
              name: "ValidationError",
              message: "Validation failed",
              details: {
                errors: [
                  { path: ["username"], message: "Username is required" },
                  { path: ["email"], message: "Email format is invalid" },
                  { path: ["password"], message: "Password must be at least 6 characters" },
                  { path: ["mobile_number"], message: "Mobile number format is invalid" }
                ]
              }
            }
          };

          await provider.addInteraction({
            state: "authenticated user sends invalid data",
            uponReceiving: "a request to create user with invalid data",
            withRequest: {
              method: "POST",
              path: "/users",
              headers: {
                Authorization: `Bearer ${validJWT}`,
                "Content-Type": "application/json",
                Accept: "application/json"
              },
              body: { ...invalidUserData, role: 1 }
            },
            willRespondWith: {
              status: 400,
              headers: { "Content-Type": "application/json" },
              body: errorMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);

          await expect(userService.createUser(invalidUserData, validJWT)).rejects.toMatchObject(errorExample);
        });
      });

      describe("GET /users/:id - Get User by ID", () => {
        it("should return user details for valid user ID", async () => {
          const userId = 1;
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
            role: { id: 1, name: "Authenticated", type: "authenticated" }
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
            role: { id: 1, name: "Authenticated", type: "authenticated" }
          };

          await provider.addInteraction({
            state: "user with ID 1 exists",
            uponReceiving: "a request to get user by ID",
            withRequest: {
              method: "GET",
              path: `/users/${userId}`,
              headers: { Authorization: `Bearer ${validJWT}`, Accept: "application/json" }
            },
            willRespondWith: {
              status: 200,
              headers: { "Content-Type": "application/json" },
              body: expectedUserMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);

          const result = await userService.getUserById(userId, validJWT);
          expect(result).toMatchObject(expectedUserExample);
        });

        it("should return 404 for non-existent user ID", async () => {
          const userId = 999;
          const errorMatcher = like({ error: { status: 404, name: "NotFoundError", message: "User not found" } });
          const errorExample = { error: { status: 404, name: "NotFoundError", message: "User not found" } };

          await provider.addInteraction({
            state: "user with ID 999 does not exist",
            uponReceiving: "a request to get non-existent user by ID",
            withRequest: {
              method: "GET",
              path: `/users/${userId}`,
              headers: { Authorization: `Bearer ${validJWT}`, Accept: "application/json" }
            },
            willRespondWith: {
              status: 404,
              headers: { "Content-Type": "application/json" },
              body: errorMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);

          await expect(userService.getUserById(userId, validJWT)).rejects.toMatchObject(errorExample);
        });

        it("should fail to get user without authentication", async () => {
          const userId = 1;
          const errorMatcher = like({ error: { status: 401, name: "UnauthorizedError", message: "Unauthorized" } });
          const errorExample = { error: { status: 401, name: "UnauthorizedError", message: "Unauthorized" } };

          await provider.addInteraction({
            state: "user is not authenticated",
            uponReceiving: "a request to get user by ID without authentication",
            withRequest: {
              method: "GET",
              path: `/users/${userId}`,
              headers: { Accept: "application/json" }
            },
            willRespondWith: {
              status: 401,
              headers: { "Content-Type": "application/json" },
              body: errorMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);

          await expect(userService.getUserById(userId)).rejects.toMatchObject(errorExample);
        });
      });

      describe("PUT /users/:id - Update User", () => {
        it("should successfully update user information", async () => {
          const userId = 1;
          const updateData = { first_name: "Updated", last_name: "Name", mobile_number: "9999999999" };

          const expectedResponseMatcher = like({
            id: 1,
            username: "testuser",
            email: "test@example.com",
            first_name: "Updated",
            last_name: "Name",
            mobile_number: "9999999999",
            gender: "MALE",
            confirmed: true,
            blocked: false,
            role: { id: 1, name: "Authenticated", type: "authenticated" }
          });

          const expectedResponseExample = {
            id: 1,
            username: "testuser",
            email: "test@example.com",
            first_name: "Updated",
            last_name: "Name",
            mobile_number: "9999999999",
            gender: "MALE",
            confirmed: true,
            blocked: false,
            role: { id: 1, name: "Authenticated", type: "authenticated" }
          };

          await provider.addInteraction({
            state: "user with ID 1 exists and can be updated",
            uponReceiving: "a request to update user information",
            withRequest: {
              method: "PUT",
              path: `/users/${userId}`,
              headers: { Authorization: `Bearer ${validJWT}`, "Content-Type": "application/json", Accept: "application/json" },
              body: updateData
            },
            willRespondWith: {
              status: 200,
              headers: { "Content-Type": "application/json" },
              body: expectedResponseMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);

          const result = await userService.updateUser(userId, updateData, validJWT);
          expect(result).toMatchObject(expectedResponseExample);
        });

        it("should fail to update non-existent user", async () => {
          const userId = 999;
          const updateData = { first_name: "Updated", last_name: "Name" };
          const errorMatcher = like({ error: { status: 404, name: "NotFoundError", message: "User not found" } });
          const errorExample = { error: { status: 404, name: "NotFoundError", message: "User not found" } };

          await provider.addInteraction({
            state: "user with ID 999 does not exist",
            uponReceiving: "a request to update non-existent user",
            withRequest: {
              method: "PUT",
              path: `/users/${userId}`,
              headers: { Authorization: `Bearer ${validJWT}`, "Content-Type": "application/json", Accept: "application/json" },
              body: updateData
            },
            willRespondWith: {
              status: 404,
              headers: { "Content-Type": "application/json" },
              body: errorMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);

          await expect(userService.updateUser(userId, updateData, validJWT)).rejects.toMatchObject(errorExample);
        });

        it("should fail to update user without authentication", async () => {
          const userId = 1;
          const updateData = { first_name: "Updated", last_name: "Name" };
          const errorMatcher = like({ error: { status: 401, name: "UnauthorizedError", message: "Unauthorized" } });
          const errorExample = { error: { status: 401, name: "UnauthorizedError", message: "Unauthorized" } };

          await provider.addInteraction({
            state: "user is not authenticated",
            uponReceiving: "a request to update user without authentication",
            withRequest: {
              method: "PUT",
              path: `/users/${userId}`,
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: updateData
            },
            willRespondWith: {
              status: 401,
              headers: { "Content-Type": "application/json" },
              body: errorMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);

          await expect(userService.updateUser(userId, updateData)).rejects.toMatchObject(errorExample);
        });

        it("should fail to update user with invalid data", async () => {
          const userId = 1;
          const invalidUpdateData = { email: "invalid-email-format", mobile_number: "invalid-phone" };
          const errorMatcher = like({
            error: {
              status: 400,
              name: "ValidationError",
              message: "Validation failed",
              details: {
                errors: [
                  { path: ["email"], message: "Email format is invalid" },
                  { path: ["mobile_number"], message: "Mobile number format is invalid" }
                ]
              }
            }
          });

          const errorExample = {
            error: {
              status: 400,
              name: "ValidationError",
              message: "Validation failed",
              details: {
                errors: [
                  { path: ["email"], message: "Email format is invalid" },
                  { path: ["mobile_number"], message: "Mobile number format is invalid" }
                ]
              }
            }
          };

          await provider.addInteraction({
            state: "user with ID 1 exists but receives invalid update data",
            uponReceiving: "a request to update user with invalid data",
            withRequest: {
              method: "PUT",
              path: `/users/${userId}`,
              headers: { Authorization: `Bearer ${validJWT}`, "Content-Type": "application/json", Accept: "application/json" },
              body: invalidUpdateData
            },
            willRespondWith: {
              status: 400,
              headers: { "Content-Type": "application/json" },
              body: errorMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);

          await expect(userService.updateUser(userId, invalidUpdateData, validJWT)).rejects.toMatchObject(errorExample);
        });
      });

      describe("DELETE /users/:id - Delete User", () => {
        it("should successfully delete a user", async () => {
          const userId = 2;
          const expectedResponseMatcher = like({ id: 2, deleted: true, message: "User successfully deleted" });
          const expectedResponseExample = { id: 2, deleted: true, message: "User successfully deleted" };

          await provider.addInteraction({
            state: "user with ID 2 exists and can be deleted",
            uponReceiving: "a request to delete a user",
            withRequest: {
              method: "DELETE",
              path: `/users/${userId}`,
              headers: { Authorization: `Bearer ${validJWT}`, Accept: "application/json" }
            },
            willRespondWith: {
              status: 200,
              headers: { "Content-Type": "application/json" },
              body: expectedResponseMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);

          const result = await userService.deleteUser(userId, validJWT);
          expect(result).toMatchObject(expectedResponseExample);
        });

        it("should return 403 when trying to delete own account", async () => {
          const userId = 1;
          const errorMatcher = like({ error: { status: 403, name: "ForbiddenError", message: "Cannot delete your own account" } });
          const errorExample = { error: { status: 403, name: "ForbiddenError", message: "Cannot delete your own account" } };

          await provider.addInteraction({
            state: "user tries to delete their own account",
            uponReceiving: "a request to delete own user account",
            withRequest: {
              method: "DELETE",
              path: `/users/${userId}`,
              headers: { Authorization: `Bearer ${validJWT}`, Accept: "application/json" }
            },
            willRespondWith: {
              status: 403,
              headers: { "Content-Type": "application/json" },
              body: errorMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);

          await expect(userService.deleteUser(userId, validJWT)).rejects.toMatchObject(errorExample);
        });

        it("should return 404 when trying to delete non-existent user", async () => {
          const userId = 999;
          const errorMatcher = like({ error: { status: 404, name: "NotFoundError", message: "User not found" } });
          const errorExample = { error: { status: 404, name: "NotFoundError", message: "User not found" } };

          await provider.addInteraction({
            state: "user with ID 999 does not exist",
            uponReceiving: "a request to delete non-existent user",
            withRequest: {
              method: "DELETE",
              path: `/users/${userId}`,
              headers: { Authorization: `Bearer ${validJWT}`, Accept: "application/json" }
            },
            willRespondWith: {
              status: 404,
              headers: { "Content-Type": "application/json" },
              body: errorMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);

          await expect(userService.deleteUser(userId, validJWT)).rejects.toMatchObject(errorExample);
        });

        it("should fail to delete user without authentication", async () => {
          const userId = 2;
          const errorMatcher = like({ error: { status: 401, name: "UnauthorizedError", message: "Unauthorized" } });
          const errorExample = { error: { status: 401, name: "UnauthorizedError", message: "Unauthorized" } };

          await provider.addInteraction({
            state: "user is not authenticated",
            uponReceiving: "a request to delete user without authentication",
            withRequest: {
              method: "DELETE",
              path: `/users/${userId}`,
              headers: { Accept: "application/json" }
            },
            willRespondWith: {
              status: 401,
              headers: { "Content-Type": "application/json" },
              body: errorMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);

          await expect(userService.deleteUser(userId)).rejects.toMatchObject(errorExample);
        });

        it("should return 403 when user lacks permission to delete", async () => {
          const userId = 3;
          const errorMatcher = like({ error: { status: 403, name: "ForbiddenError", message: "Insufficient permissions to delete user" } });
          const errorExample = { error: { status: 403, name: "ForbiddenError", message: "Insufficient permissions to delete user" } };

          await provider.addInteraction({
            state: "user lacks permission to delete other users",
            uponReceiving: "a request to delete user without sufficient permissions",
            withRequest: {
              method: "DELETE",
              path: `/users/${userId}`,
              headers: { Authorization: `Bearer ${validJWT}`, Accept: "application/json" }
            },
            willRespondWith: {
              status: 403,
              headers: { "Content-Type": "application/json" },
              body: errorMatcher
            }
          });

          const baseUrl = getMockServerUrl();
          const userService = new PactUserService(baseUrl);

          await expect(userService.deleteUser(userId, validJWT)).rejects.toMatchObject(errorExample);
        });
      });
    });
  }
);
