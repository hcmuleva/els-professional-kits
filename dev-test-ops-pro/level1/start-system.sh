#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Development System...${NC}"
echo "=========================================="

# Check if Python is available for port checking
if command -v python3 &> /dev/null; then
    echo "🔍 Checking port availability..."
    if ! python3 ../port-check.py; then
        echo -e "${RED}❌ Port check failed. Please resolve port conflicts.${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Python3 not available, skipping port check${NC}"
fi

# Check if docker-compose exists
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose not found. Please install Docker.${NC}"
    exit 1
fi

# Navigate to devops directory
cd devops

echo ""
echo "🐳 Starting Docker containers..."
echo "=========================================="

# Start the system
docker-compose --env-file .env up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ System started successfully!${NC}"
    echo ""
    echo "📊 Services Status:"
    echo "------------------------------------------"
    echo "• PostgreSQL Database: http://localhost:5454"
    echo "• Flask API Server:    http://localhost:5050" 
    echo "• React Client:        http://localhost:3030"
    echo ""
    echo "🔍 To view logs: cd devops && docker-compose logs -f"
    echo "🛑 To stop: cd devops && docker-compose down"
else
    echo -e "${RED}❌ Failed to start the system${NC}"
    exit 1
fi