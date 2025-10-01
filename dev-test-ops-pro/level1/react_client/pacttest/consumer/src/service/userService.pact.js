// pacttest/consumer/src/service/userService.pact.js
const axios = require("axios");
const http = require("http");
const https = require("https");

function stripTrailingSlash(url = "") {
  return url.replace(/\/+$/, "");
}

async function retryOnce(fn, delayMs = 200) {
  try {
    return await fn();
  } catch (err) {
    // If there was no HTTP response (network error), try once more
    if (!err.response) {
      console.warn("Network error, retrying once after", delayMs, "ms:", err.message);
      await new Promise((res) => setTimeout(res, delayMs));
      return await fn();
    }
    throw err;
  }
}

class PactUserService {
  constructor(baseURL) {
    const envUrl = process.env.API_BASE_URL;
    this.baseURL = stripTrailingSlash(baseURL || envUrl || "http://localhost:1234");

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      timeout: 20000, // larger timeout to avoid flaky socket hang ups
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      maxRedirects: 0,
      validateStatus: null, // we'll handle non-2xx statuses explicitly
    });
  }

  async getUsers(jwt) {
    try {
      const headers = { Accept: "application/json" };
      if (jwt) headers.Authorization = `Bearer ${jwt}`;

      console.log(`Sending getUsers request to ${this.baseURL}/users with headers:`, headers);
      const doRequest = () => this.client.get("/users", { headers });

      const response = await retryOnce(doRequest);

      if (response && response.status >= 200 && response.status < 300) {
        return response.data;
      }

      throw response.data || { message: "Failed to fetch users", status: response?.status };
    } catch (error) {
      if (error && error.response && error.response.data) {
        console.error("Axios error in getUsers (with response):", error.message, error.response.data);
        throw error.response.data;
      }

      if (error && typeof error === "object" && !error.response) {
        console.error("Axios/network error in getUsers (no response):", error.message || error);
        throw error;
      }

      console.error("Axios error in getUsers (fallback):", error && error.message ? error.message : error);
      throw { message: "Failed to fetch users" };
    }
  }

  async createUser(userData, jwt) {
    try {
      const headers = { Accept: "application/json" };
      if (jwt) headers.Authorization = `Bearer ${jwt}`;

      console.log(`Sending createUser request to ${this.baseURL}/users with data:`, { ...userData, role: 1 }, "headers:", headers);
      const doRequest = () => this.client.post("/users", { ...userData, role: 1 }, { headers });

      const response = await retryOnce(doRequest);

      if (response && response.status >= 200 && response.status < 300) {
        return response.data;
      }

      throw response.data || { message: "Failed to create user", status: response?.status };
    } catch (error) {
      if (error && error.response && error.response.data) {
        console.error("Axios error in createUser (with response):", error.message, error.response.data);
        throw error.response.data;
      }

      if (error && typeof error === "object" && !error.response) {
        console.error("Axios/network error in createUser (no response):", error.message || error);
        throw error;
      }

      console.error("Axios error in createUser (fallback):", error && error.message ? error.message : error);
      throw { message: "Failed to create user" };
    }
  }

  async getUserById(userId, jwt) {
    try {
      const headers = { Accept: "application/json" };
      if (jwt) headers.Authorization = `Bearer ${jwt}`;

      console.log(`Sending getUserById request to ${this.baseURL}/users/${userId} with headers:`, headers);
      const doRequest = () => this.client.get(`/users/${userId}`, { headers });

      const response = await retryOnce(doRequest);

      if (response && response.status >= 200 && response.status < 300) {
        return response.data;
      }

      throw response.data || { message: "Failed to fetch user", status: response?.status };
    } catch (error) {
      if (error && error.response && error.response.data) {
        console.error("Axios error in getUserById (with response):", error.message, error.response.data);
        throw error.response.data;
      }

      if (error && typeof error === "object" && !error.response) {
        console.error("Axios/network error in getUserById (no response):", error.message || error);
        throw error;
      }

      console.error("Axios error in getUserById (fallback):", error && error.message ? error.message : error);
      throw { message: "Failed to fetch user" };
    }
  }

  async updateUser(userId, userData, jwt) {
    try {
      const headers = { Accept: "application/json" };
      if (jwt) headers.Authorization = `Bearer ${jwt}`;

      console.log(`Sending updateUser request to ${this.baseURL}/users/${userId} with data:`, userData, "headers:", headers);
      const doRequest = () => this.client.put(`/users/${userId}`, userData, { headers });

      const response = await retryOnce(doRequest);

      if (response && response.status >= 200 && response.status < 300) {
        return response.data;
      }

      throw response.data || { message: "Failed to update user", status: response?.status };
    } catch (error) {
      if (error && error.response && error.response.data) {
        console.error("Axios error in updateUser (with response):", error.message, error.response.data);
        throw error.response.data;
      }

      if (error && typeof error === "object" && !error.response) {
        console.error("Axios/network error in updateUser (no response):", error.message || error);
        throw error;
      }

      console.error("Axios error in updateUser (fallback):", error && error.message ? error.message : error);
      throw { message: "Failed to update user" };
    }
  }

  async deleteUser(userId, jwt) {
    try {
      const headers = { Accept: "application/json" };
      if (jwt) headers.Authorization = `Bearer ${jwt}`;

      console.log(`Sending deleteUser request to ${this.baseURL}/users/${userId} with headers:`, headers);
      const doRequest = () => this.client.delete(`/users/${userId}`, { headers });

      const response = await retryOnce(doRequest);

      if (response && response.status >= 200 && response.status < 300) {
        return response.data;
      }

      throw response.data || { message: "Failed to delete user", status: response?.status };
    } catch (error) {
      if (error && error.response && error.response.data) {
        console.error("Axios error in deleteUser (with response):", error.message, error.response.data);
        throw error.response.data;
      }

      if (error && typeof error === "object" && !error.response) {
        console.error("Axios/network error in deleteUser (no response):", error.message || error);
        throw error;
      }

      console.error("Axios error in deleteUser (fallback):", error && error.message ? error.message : error);
      throw { message: "Failed to delete user" };
    }
  }
}

module.exports = PactUserService;
