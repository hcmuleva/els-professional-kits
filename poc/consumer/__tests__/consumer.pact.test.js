// At the very top of your test file
require('dotenv').config();

import { Pact } from "@pact-foundation/pact";
import { getUser } from "../src/api.js";
const path = require("path");
import { Matchers } from "@pact-foundation/pact";
const { like, integer, string } = Matchers;

// Use variables from process.env, with fallbacks for safety
const pactPort = parseInt(process.env.PACT_MOCK_PORT) || 4400;
const consumerName = process.env.PACT_CONSUMER_NAME || "react-consumer";
const providerName = process.env.PACT_PROVIDER_NAME || "node-provider";
const pactHost = process.env.PACT_MOCK_HOST || "127.0.0.1";

const provider = new Pact({
    consumer: consumerName,
    provider: providerName,
    port: pactPort,
    log: path.resolve(process.cwd(), "logs", "pact.log"),
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "INFO",
    spec: 2,
});

describe("Pact with NodeJS", () => {
    beforeAll(() => provider.setup());
    afterAll(() => provider.finalize());

    describe("when a call to the API is made", () => {
        beforeAll(() =>
            provider.addInteraction({
                state: "user with ID 1 exists",
                uponReceiving: "a request for user with ID 1",
                withRequest: {
                    method: "GET",
                    path: "/api/users/1"
                },
                willRespondWith: {
                    status: 200,
                    body: {
                        id: integer(1),
                        username: string("Harish"),
                        email: like("harish@example.com"),
                    },
                },
            })
        );
        it("can process the JSON response", async () => {
            // Pass the base URL to the API function
            const user = await getUser(`http://${pactHost}:${pactPort}`);

            expect(user).toEqual({
                id: 1,
                username: "Harish",
                email: "harish@example.com",
            });
        });
        afterEach(async () => { await provider.verify(); });
    });
});
