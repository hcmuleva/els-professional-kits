#!/bin/bash

# Strapi Full Security Scan with Authentication
# Comprehensive scan including authenticated endpoints

echo "========================================"
echo "Strapi Full Security Scan"
echo "========================================"
echo ""

# Configuration
TARGET_URL="http://host.docker.internal:1337"
REPORT_DIR="/zap/reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_NAME="full_scan_${TIMESTAMP}"
MAX_DURATION=60  # minutes

# Strapi Credentials (update these or set via environment)
STRAPI_USERNAME="${STRAPI_USER:-test@example.com}"
STRAPI_PASSWORD="${STRAPI_PASS:-Test@123456}"

echo "Target URL: ${TARGET_URL}"
echo "Max Duration: ${MAX_DURATION} minutes"
echo "Username: ${STRAPI_USERNAME}"
echo ""

# Check if ZAP container is running
if ! docker ps | grep -q strapi-zap-security; then
    echo "ERROR: ZAP container is not running!"
    echo "Please start it with: docker-compose up -d"
    exit 1
fi

echo "Starting full security scan..."
echo "This may take up to ${MAX_DURATION} minutes..."
echo ""

# Run ZAP Full Scan
docker exec strapi-zap-security \
    zap-full-scan.py \
    -t ${TARGET_URL} \
    -r ${REPORT_DIR}/html/${REPORT_NAME}.html \
    -J ${REPORT_DIR}/json/${REPORT_NAME}.json \
    -x ${REPORT_DIR}/xml/${REPORT_NAME}.xml \
    -m ${MAX_DURATION} \
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
