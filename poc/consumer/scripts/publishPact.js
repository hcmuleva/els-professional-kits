import dotenv from "dotenv";
import { execSync } from "child_process";

dotenv.config(); // loads .env into process.env

const {
  PACT_BROKER_URL,
  PACT_BROKER_USERNAME,
  PACT_BROKER_PASSWORD,
  PACT_VERSION,
} = process.env;

if (!PACT_BROKER_URL || !PACT_BROKER_USERNAME || !PACT_BROKER_PASSWORD) {
  throw new Error("❌ Missing Pact Broker environment variables. Check .env file.");
}

const cmd = `npx pact-broker publish ./pacts \
  --consumer-app-version ${PACT_VERSION} \
  --broker-base-url=${PACT_BROKER_URL} \
  --broker-username=${PACT_BROKER_USERNAME} \
  --broker-password=${PACT_BROKER_PASSWORD}`;

console.log("🚀 Running:", cmd);
execSync(cmd, { stdio: "inherit" });

