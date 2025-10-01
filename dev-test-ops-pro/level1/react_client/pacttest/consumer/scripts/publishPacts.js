// pacttest/consumer/scripts/publishPacts.js
const path = require("path");
const pact = require("@pact-foundation/pact-node");
require("dotenv").config();

async function publishPacts() {
  const opts = {
    pactFilesOrDirs: [path.resolve(process.cwd(), "pacts")],
    pactBroker: process.env.PACT_BROKER_BASE_URL,
    consumerVersion: process.env.GITHUB_SHA || `dev-${Date.now()}`,
    tags: [process.env.GITHUB_REF_NAME || "main", "latest"],
    // Optional: Add authentication if your broker requires it
    // pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
    // pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
  };

  // Validate required environment variables
  if (!opts.pactBroker) {
    throw new Error("❌ Missing PACT_BROKER_BASE_URL in .env file");
  }

  try {
    console.log("📤 Publishing pacts to broker...");
    console.log(`   Broker URL: ${opts.pactBroker}`);
    console.log(`   Consumer Version: ${opts.consumerVersion}`);
    console.log(`   Tags: ${opts.tags.join(", ")}`);
    console.log(`   Pact Files: ${opts.pactFilesOrDirs[0]}`);

    await pact.publishPacts(opts);
    
    console.log("✅ Pacts published successfully!");
    console.log(`🌐 View contracts at: ${opts.pactBroker}/matrix`);
    
  } catch (error) {
    console.error("❌ Failed to publish pacts:");
    console.error(error.message);
    
    // Provide helpful debugging information
    if (error.message.includes("ECONNREFUSED")) {
      console.error("💡 Make sure the Pact Broker is running:");
      console.error("   cd pacttest/broker && docker-compose up -d");
    }
    
    process.exit(1);
  }
}

// Add some helpful logging for debugging
console.log("🔍 Environment Variables:");
console.log(`   PACT_BROKER_BASE_URL: ${process.env.PACT_BROKER_BASE_URL || "NOT SET"}`);
console.log(`   GITHUB_SHA: ${process.env.GITHUB_SHA || "NOT SET"}`);
console.log(`   GITHUB_REF_NAME: ${process.env.GITHUB_REF_NAME || "NOT SET"}`);

publishPacts().catch((err) => {
  console.error("❌ Publish pacts script failed:", err.message);
  process.exit(1);
});