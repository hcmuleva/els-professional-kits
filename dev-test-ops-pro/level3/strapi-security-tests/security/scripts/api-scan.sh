#!/bin/bash

# Strapi API Security Scan
# Targeted scan for REST/GraphQL APIs

echo "========================================"
echo "Strapi API Security Scan"
echo "========================================"
echo ""

# Configuration
TARGET_URL="http://host.docker.internal:1337"
REPORT_DIR="/zap/reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_NAME="api_scan_${TIMESTAMP}"

echo "Target API: ${TARGET_URL}"
echo ""

# Check if ZAP container is running
if ! docker ps | grep -q strapi-zap-security; then
    echo "ERROR: ZAP container is not running!"
    echo "Please start it with: docker-compose up -d"
    exit 1
fi

echo "Starting API security scan..."
echo ""

# Run ZAP API Scan using baseline (since we don't have OpenAPI spec)
docker exec strapi-zap-security \
    zap-baseline.py \
    -t ${TARGET_URL} \
    -r ${REPORT_DIR}/html/${REPORT_NAME}.html \
    -J ${REPORT_DIR}/json/${REPORT_NAME}.json \
    -x ${REPORT_DIR}/xml/${REPORT_NAME}.xml \
    -a \
    -j \
    -l INFO

echo ""
echo "========================================"
echo "Scan Complete!"
echo "========================================"
echo ""
echo "Reports generated:"
echo "  HTML: ./security/reports/html/${REPORT_NAME}.html"
echo "  JSON: ./security/reports/json/${REPORT_NAME}.json"
echo "  XML:  ./security/reports/xml/${REPORT_NAME}.xml"
echo ""
echo "To view the report:"
echo "  open security/reports/html/${REPORT_NAME}.html"
echo ""
