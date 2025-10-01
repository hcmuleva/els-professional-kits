// consumer/__tests__/consumer.pact.test.js
const path = require("path");
const { Pact } = require("@pact-foundation/pact");
const { getUser } = require("../src/api");

const provider = new Pact({
  consumer: "react-consumer",
  provider: "node-provider",
  port: 3344,
  log: path.resolve(process.cwd(), "logs", "pact.log"),
  dir: path.resolve(process.cwd(), "pacts"),
  logLevel: "INFO"
});

describe("Pact with Node Provider", () => {
  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());

  describe("when a request for a user is made", () => {
    beforeAll(() =>
      provider.addInteraction({
        state: "user with ID 1 exists",
        uponReceiving: "a request for user 1",
        withRequest: {
          method: "GET",
          path: "/api/users/1"
        },
        willRespondWith: {
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: {
            id: 1,
            username: "harish",
            email: "harish@hph.com"
          }
        }
      })
    );

    it("returns the correct user", async () => {
      const user = await getUser(1);
      expect(user).toEqual({
        id: 1,
        username: "harish",
        email: "harish@hph.com"
      });
    });
  });

  afterEach(async () => {
    await provider.verify();
  });
});
