// pacttest/consumer/src/service/authService.pact.js
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

class PactAuthService {
  constructor(baseURL) {
    // allow baseURL to come from constructor, or env var, or fallback
    const envUrl = process.env.API_BASE_URL;
    this.baseURL = stripTrailingSlash(baseURL || envUrl || "http://localhost:1234");

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      timeout: 20000, // increased timeout to avoid flaky socket hang ups
      // keepAlive agents to improve connection stability with the mock server
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      // don't follow redirects by default (not needed here)
      maxRedirects: 0,
      // optional: do not throw on 4xx/5xx so we can handle response bodies consistently
      validateStatus: null,
    });
  }

  async login(identifier, password) {
    try {
      console.log(`Sending login request to ${this.baseURL}/auth/local with data:`, { identifier, password });
      const doRequest = () =>
        this.client.post("/auth/local", { identifier, password });

      const response = await retryOnce(doRequest);

      // If mock server returns 2xx, return body; if 4xx/5xx propagate error shape
      if (response && response.status >= 200 && response.status < 300) {
        return response.data;
      }

      // Non-2xx: throw response.data so tests can assert
      throw response.data || { message: "Login failed", status: response?.status };
    } catch (error) {
      // If axios provided a response, propagate its data (expected by your tests)
      if (error && error.response && error.response.data) {
        console.error("Axios error in login (with response):", error.message, error.response.data);
        throw error.response.data;
      }

      // If we threw a non-axios object (like the line above), rethrow it
      if (error && typeof error === "object" && !error.response) {
        console.error("Axios/network error in login (no response):", error.message || error);
        throw error;
      }

      // Last fallback
      console.error("Axios error in login (fallback):", error && error.message ? error.message : error);
      throw { message: "Login failed" };
    }
  }

  async register(userData) {
    try {
      console.log(`Sending register request to ${this.baseURL}/auth/local/register with data:`, userData);
      const doRequest = () => this.client.post("/auth/local/register", userData);

      const response = await retryOnce(doRequest);

      if (response && response.status >= 200 && response.status < 300) {
        return response.data;
      }

      throw response.data || { message: "Registration failed", status: response?.status };
    } catch (error) {
      if (error && error.response && error.response.data) {
        console.error("Axios error in register (with response):", error.message, error.response.data);
        throw error.response.data;
      }

      if (error && typeof error === "object" && !error.response) {
        console.error("Axios/network error in register (no response):", error.message || error);
        throw error;
      }

      console.error("Axios error in register (fallback):", error && error.message ? error.message : error);
      throw { message: "Registration failed" };
    }
  }

  async validateToken(token) {
    try {
      console.log(`Sending validateToken request to ${this.baseURL}/auth/me with token:`, token);
      const doRequest = () =>
        this.client.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

      const response = await retryOnce(doRequest);

      if (response && response.status >= 200 && response.status < 300) {
        return { valid: true, user: response.data };
      }

      // Non-2xx (e.g. 401) — return expected shaped object
      return { valid: false, error: response.data || { message: "Invalid token", status: response?.status } };
    } catch (error) {
      if (error && error.response && error.response.data) {
        console.error("Axios error in validateToken (with response):", error.message, error.response.data);
        return { valid: false, error: error.response.data };
      }

      console.error("Axios/network error in validateToken (no response):", error && error.message ? error.message : error);
      return { valid: false, error: { message: "No response from auth server" } };
    }
  }
}

module.exports = PactAuthService;
