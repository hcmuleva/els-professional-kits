#!/bin/bash

# Strapi Authenticated Security Scan using JWT
# Scan protected endpoints with authentication

echo "========================================"
echo "Strapi Authenticated Security Scan"
echo "========================================"
echo ""

# Configuration
STRAPI_URL="http://host.docker.internal:1337"
API_URL="${STRAPI_URL}/api"
LOGIN_URL="${API_URL}/auth/local"
TARGET_URL="${API_URL}"
REPORT_DIR="/zap/reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_NAME="authenticated_scan_${TIMESTAMP}"

# Credentials (set via environment variables)
USERNAME="${STRAPI_USER:-test@example.com}"
PASSWORD="${STRAPI_PASS:-Test@123456}"

# Check if ZAP container is running
if ! docker ps | grep -q strapi-zap-security; then
    echo "ERROR: ZAP container is not running!"
    echo "Please start it with: docker-compose up -d"
    exit 1
fi

echo "Step 1: Authenticating with Strapi..."
echo "Username: ${USERNAME}"
echo ""

# Get JWT Token (using host network)
JWT_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "{\"identifier\":\"${USERNAME}\",\"password\":\"${PASSWORD}\"}" \
    http://localhost:1337/api/auth/local)

JWT_TOKEN=$(echo $JWT_RESPONSE | grep -o '"jwt":"[^"]*' | cut -d'"' -f4)

if [ -z "$JWT_TOKEN" ]; then
    echo "ERROR: Failed to obtain JWT token"
    echo "Response: $JWT_RESPONSE"
    echo ""
    echo "Please check:"
    echo "  1. Strapi is running on http://localhost:1337"
    echo "  2. Username and password are correct"
    echo "  3. User exists in Strapi"
    exit 1
fi

echo "✓ Authentication successful"
echo "Token obtained: ${JWT_TOKEN:0:20}..."
echo ""

# Save token to file for ZAP to use
echo "$JWT_TOKEN" > security/context/jwt-token.txt

echo "Step 2: Running security scan with authentication..."
echo ""

# Run authenticated baseline scan with custom header
docker exec strapi-zap-security bash -c "
    zap-baseline.py \
        -t ${TARGET_URL} \
        -r ${REPORT_DIR}/html/${REPORT_NAME}.html \
        -J ${REPORT_DIR}/json/${REPORT_NAME}.json \
        -x ${REPORT_DIR}/xml/${REPORT_NAME}.xml \
        -a \
        -j \
        -l INFO \
        -z '-config replacer.full_list(0).description=auth1 -config replacer.full_list(0).enabled=true -config replacer.full_list(0).matchtype=REQ_HEADER -config replacer.full_list(0).matchstr=Authorization -config replacer.full_list(0).regex=false -config replacer.full_list(0).replacement=Bearer $JWT_TOKEN'
"

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
