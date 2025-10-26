// At the very top of your test file
require('dotenv').config();

const { Verifier } = require('@pact-foundation/pact');
const app = require('../server');
// Use the port from process.env, with a fallback
const serverPort = process.env.SERVER_PORT || 4000;
const server = app.listen(serverPort);

describe('Pact Verification', () => {
    afterAll(() => {
        server.close();
    });

    it('should validate the consumer contract', async () => {
        const verifier = new Verifier({
            provider: process.env.PACT_PROVIDER_NAME,
            providerBaseUrl: `http://localhost:${serverPort}`,
            pactBrokerUrl: process.env.PACT_BROKER_URL,
            pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
            pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
            consumerVersionSelectors: [
                { latest: true, consumer: 'react-consumer' }
            ],
            publishVerificationResult: true,
            providerVersion: process.env.PACT_PROVIDER_VERSION,
            stateHandlers: {
                'user with ID 1 exists': () => Promise.resolve('State set up'),
            },
            logLevel: 'INFO'
        });

        await verifier.verifyProvider();
    }, 30000);
});
