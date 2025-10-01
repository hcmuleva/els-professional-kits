const { Verifier } = require("@pact-foundation/pact");
const app = require("../server");

let server;

beforeAll(done => {
  server = app.listen(3000, () => {
    console.log("Provider running for Pact verification");
    done();
  });
});

afterAll(() => {
  server.close();
});

describe("Pact Verification", () => {
  it("validates the expectations of react-consumer", () => {
    return new Verifier({
      provider: "node-provider",
      providerBaseUrl: "http://localhost:3000",
      pactBrokerUrl: "http://localhost:9292",
      consumerVersionSelectors: [{ latest: true, consumer: "react-consumer" }],
      publishVerificationResult: true,
      providerVersion: "1.0.0",

      // 👇 Add state handlers
      stateHandlers: {
        "user with ID 1 exists": async () => {
          // you could seed a DB or reset state here
          console.log("Provider state: user with ID 1 exists");
          return Promise.resolve();
        }
      }
    }).verifyProvider();
  }, 15000); // 👈 extend timeout for Jest (15s)
});
