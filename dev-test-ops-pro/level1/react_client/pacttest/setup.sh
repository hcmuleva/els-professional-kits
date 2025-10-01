#!/bin/bash
# pacttest/setup.sh - Complete Pact Testing Setup Script

echo "🚀 Setting up Pact Contract Testing Environment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_status "Prerequisites check passed"

# Create directory structure
echo
print_info "Creating directory structure..."

mkdir -p pacttest/{broker,consumer,provider}
mkdir -p pacttest/consumer/{test,src/service,scripts,logs,pacts}
mkdir -p pacttest/provider/{test,src,logs}

print_status "Directory structure created"

# Setup Broker
echo
print_info "Setting up Pact Broker..."

# Start Pact Broker
cd pacttest/broker
print_info "Starting Pact Broker with Docker Compose..."
docker-compose up -d

# Wait for broker to be ready
echo
print_info "Waiting for Pact Broker to be ready..."
sleep 10

# Check if broker is running
if curl -f http://localhost:9292/diagnostic/status/heartbeat &> /dev/null; then
    print_status "Pact Broker is running at http://localhost:9292"
else
    print_warning "Pact Broker might still be starting up. Check with 'docker-compose logs -f'"
fi

cd ../..

# Setup Consumer
echo
print_info "Setting up Consumer (Frontend) tests..."

cd pacttest/consumer
npm install

if [ $? -eq 0 ]; then
    print_status "Consumer dependencies installed"
else
    print_error "Failed to install consumer dependencies"
    exit 1
fi

cd ../..

# Setup Provider
echo
print_info "Setting up Provider (Backend) verification..."

cd pacttest/provider

# Add undici dependency for fetch polyfill
npm install undici --save-dev

if [ $? -eq 0 ]; then
    print_status "Provider dependencies installed"
else
    print_error "Failed to install provider dependencies"
    exit 1
fi

cd ../..

# Run a complete test cycle
echo
print_info "Running complete Pact testing cycle..."

# Step 1: Run consumer tests
echo
print_info "Step 1: Running consumer contract tests..."
cd pacttest/consumer
npm run test:consumer

if [ $? -eq 0 ]; then
    print_status "Consumer tests passed"
else
    print_error "Consumer tests failed"
    cd ../..
    exit 1
fi

# Step 2: Publish pacts
echo
print_info "Step 2: Publishing pacts to broker..."
npm run publish:pacts

if [ $? -eq 0 ]; then
    print_status "Pacts published successfully"
else
    print_error "Failed to publish pacts"
    cd ../..
    exit 1
fi

cd ../..

# Step 3: Run provider verification
echo
print_info "Step 3: Running provider verification..."
cd pacttest/provider
npm run test:provider

if [ $? -eq 0 ]; then
    print_status "Provider verification passed"
else
    print_warning "Provider verification failed - this is expected on first run"
    print_info "Check the logs and adjust the mock provider as needed"
fi

cd ../..

# Final status
echo
print_status "Pact Contract Testing Setup Complete!"
echo
echo "📋 Summary:"
echo "  • Pact Broker running at: http://localhost:9292"
echo "  • Consumer tests: pacttest/consumer/npm run test:consumer"
echo "  • Provider verification: pacttest/provider/npm run test:provider"
echo "  • View contracts: http://localhost:9292/matrix"
echo
print_info "Next steps:"
echo "  1. Visit http://localhost:9292 to view the Pact Broker UI"
echo "  2. Review generated pact files in pacttest/consumer/pacts/"
echo "  3. Check provider verification results"
echo "  4. Integrate into your CI/CD pipeline"
echo
print_info "Useful commands:"
echo "  • Stop broker: cd pacttest/broker && docker-compose down"
echo "  • Consumer tests: cd pacttest/consumer && npm run test:consumer:watch"
echo "  • Provider tests: cd pacttest/provider && npm run test:provider:watch"
echo "  • Clean up: cd pacttest/consumer && npm run clean:pacts"
echo
print_status "Happy Contract Testing! 🎉"