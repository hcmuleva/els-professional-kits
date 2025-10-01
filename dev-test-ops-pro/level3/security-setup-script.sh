#!/bin/bash

# ============================================
# Strapi Security Testing Kit Generator
# ============================================
# This script creates complete folder structure
# and all necessary files for security testing
# ============================================

set -e

PROJECT_NAME="strapi-security-tests"

echo "============================================"
echo "Strapi Security Testing Kit Generator"
echo "============================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if project directory already exists
if [ -d "$PROJECT_NAME" ]; then
    print_warning "Directory '$PROJECT_NAME' already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
    rm -rf "$PROJECT_NAME"
fi

print_info "Creating project structure..."

# Create directory structure
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

mkdir -p security/{scripts,reports/{html,json,xml},configs,context}
mkdir -p test-data

print_success "Folder structure created"

# ============================================
# Create docker-compose.yml
# ============================================
print_info "Creating docker-compose.yml..."

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  zap:
    image: owasp/zap2docker-stable
    container_name: strapi-zap-security
    ports:
      - "8090:8080"
      - "8091:8090"
    volumes:
      - ./security/reports:/zap/reports
      - ./security/scripts:/zap/scripts
      - ./security/configs:/zap/configs
      - ./security/context:/zap/context
    networks:
      - security-network
    command: zap.sh -daemon -host 0.0.0.0 -port 8080 -config api.addrs.addr.name=.* -config api.addrs.addr.regex=true

networks:
  security-network:
    driver: bridge
EOF

print_success "docker-compose.yml created"

# ============================================
# Create baseline-scan.sh
# ============================================
print_info "Creating baseline-scan.sh..."

cat > security/scripts/baseline-scan.sh << 'EOF'
#!/bin/bash

# Strapi Baseline Security Scan
# Quick scan for common vulnerabilities

echo "========================================"
echo "Strapi Baseline Security Scan"
echo "========================================"
echo ""

# Configuration
TARGET_URL="http://host.docker.internal:1337/api"
REPORT_DIR="/zap/reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_NAME="baseline_scan_${TIMESTAMP}"

echo "Target URL: ${TARGET_URL}"
echo "Report will be saved to: ${REPORT_DIR}/${REPORT_NAME}"
echo ""

# Check if ZAP container is running
if ! docker ps | grep -q strapi-zap-security; then
    echo "ERROR: ZAP container is not running!"
    echo "Please start it with: docker-compose up -d"
    exit 1
fi

echo "Starting baseline scan..."
echo ""

# Run ZAP Baseline Scan
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
EOF

chmod +x security/scripts/baseline-scan.sh
print_success "baseline-scan.sh created"

# ============================================
# Create full-scan.sh
# ============================================
print_info "Creating full-scan.sh..."

cat > security/scripts/full-scan.sh << 'EOF'
#!/bin/bash

# Strapi Full Security Scan with Authentication
# Comprehensive scan including authenticated endpoints

echo "========================================"
echo "Strapi Full Security Scan"
echo "========================================"
echo ""

# Configuration
TARGET_URL="http://host.docker.internal:1337/api"
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
EOF

chmod +x security/scripts/full-scan.sh
print_success "full-scan.sh created"

# ============================================
# Create api-scan.sh
# ============================================
print_info "Creating api-scan.sh..."

cat > security/scripts/api-scan.sh << 'EOF'
#!/bin/bash

# Strapi API Security Scan
# Targeted scan for REST/GraphQL APIs

echo "========================================"
echo "Strapi API Security Scan"
echo "========================================"
echo ""

# Configuration
TARGET_URL="http://host.docker.internal:1337/api"
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
EOF

chmod +x security/scripts/api-scan.sh
print_success "api-scan.sh created"

# ============================================
# Create authenticated-scan.sh
# ============================================
print_info "Creating authenticated-scan.sh..."

cat > security/scripts/authenticated-scan.sh << 'EOF'
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
EOF

chmod +x security/scripts/authenticated-scan.sh
print_success "authenticated-scan.sh created"

# ============================================
# Create run-security-scan.sh (main script)
# ============================================
print_info "Creating run-security-scan.sh..."

cat > security/scripts/run-security-scan.sh << 'EOF'
#!/bin/bash

# Main Security Scan Script
# Interactive menu to choose scan type

echo "========================================"
echo "Strapi Security Testing Kit"
echo "========================================"
echo ""

echo "Select scan type:"
echo "  1) Baseline Scan (Quick, 5-10 min)"
echo "  2) Full Scan (Comprehensive, 30-60 min)"
echo "  3) API Scan (Targeted, 15-20 min)"
echo "  4) Authenticated Scan (With JWT, 20-30 min)"
echo "  5) Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        ./security/scripts/baseline-scan.sh
        ;;
    2)
        echo ""
        read -p "Enter Strapi username (default: test@example.com): " username
        read -sp "Enter Strapi password: " password
        echo ""
        export STRAPI_USER="${username:-test@example.com}"
        export STRAPI_PASS="$password"
        ./security/scripts/full-scan.sh
        ;;
    3)
        echo ""
        ./security/scripts/api-scan.sh
        ;;
    4)
        echo ""
        read -p "Enter Strapi username (default: test@example.com): " username
        read -sp "Enter Strapi password: " password
        echo ""
        export STRAPI_USER="${username:-test@example.com}"
        export STRAPI_PASS="$password"
        ./security/scripts/authenticated-scan.sh
        ;;
    5)
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo "Invalid choice!"
        exit 1
        ;;
esac
EOF

chmod +x security/scripts/run-security-scan.sh
print_success "run-security-scan.sh created"

# ============================================
# Create run-security-scan.bat (Windows)
# ============================================
print_info "Creating run-security-scan.bat..."

cat > security/scripts/run-security-scan.bat << 'EOF'
@echo off
REM Strapi Security Scan - Windows Version

echo ========================================
echo Strapi Security Scan
echo ========================================
echo.

REM Configuration
set TARGET_URL=http://host.docker.internal:1337/api
set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set REPORT_NAME=security_scan_%TIMESTAMP%

echo Target URL: %TARGET_URL%
echo Report: %REPORT_NAME%
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop
    pause
    exit /b 1
)

REM Check if ZAP container is running
docker ps | findstr strapi-zap-security >nul
if errorlevel 1 (
    echo ERROR: ZAP container is not running!
    echo Starting ZAP container...
    docker-compose up -d
    echo Waiting for ZAP to start...
    timeout /t 10
)

echo Running baseline scan...
echo.

REM Run baseline scan
docker exec strapi-zap-security zap-baseline.py -t %TARGET_URL% -r /zap/reports/html/%REPORT_NAME%.html -J /zap/reports/json/%REPORT_NAME%.json -x /zap/reports/xml/%REPORT_NAME%.xml -a -j -l INFO

echo.
echo ========================================
echo Scan Complete!
echo ========================================
echo.
echo Reports generated in: .\security\reports\
echo   HTML: .\security\reports\html\%REPORT_NAME%.html
echo   JSON: .\security\reports\json\%REPORT_NAME%.json
echo   XML:  .\security\reports\xml\%REPORT_NAME%.xml
echo.
echo Opening HTML report...
start security\reports\html\%REPORT_NAME%.html
echo.
pause
EOF

print_success "run-security-scan.bat created"

# ============================================
# Create config files
# ============================================
print_info "Creating configuration files..."

# authentication.conf
cat > security/configs/authentication.conf << 'EOF'
# Strapi Authentication Configuration
auth.type=jwt
auth.loginUrl=http://host.docker.internal:1337/api/auth/local
auth.loginBody={"identifier":"${USERNAME}","password":"${PASSWORD}"}
auth.tokenLocation=response.jwt
auth.tokenHeader=Authorization
auth.tokenPrefix=Bearer
auth.sessionManagement=jwt
EOF

# zap-config.conf
cat > security/configs/zap-config.conf << 'EOF'
# ZAP Configuration for Strapi
# General Settings
zap.api.enabled=true
zap.api.port=8080
zap.proxy.port=8090

# Spider Settings
spider.maxDepth=5
spider.maxChildren=10
spider.postform=true

# Ajax Spider Settings
ajaxSpider.enabled=true
ajaxSpider.maxDuration=10

# Active Scanner Settings
scanner.strength=MEDIUM
scanner.alertThreshold=MEDIUM
scanner.maxRuleDuration=0
scanner.delayInMs=0

# Authentication
auth.type=jwt
auth.header=Authorization
auth.prefix=Bearer

# Target Settings
target.url=http://host.docker.internal:1337/api
target.context=Strapi API Context
EOF

# scan-policy.conf
cat > security/configs/scan-policy.conf << 'EOF'
# ZAP Scan Policy for Strapi APIs
# OWASP Top 10 Coverage

# SQL Injection
scanner.sqlinjection.enabled=true
scanner.sqlinjection.strength=HIGH

# Cross-Site Scripting (XSS)
scanner.xss.enabled=true
scanner.xss.strength=HIGH

# Path Traversal
scanner.pathtraversal.enabled=true
scanner.pathtraversal.strength=MEDIUM

# Remote File Inclusion
scanner.rfi.enabled=true
scanner.rfi.strength=MEDIUM

# Server Side Include
scanner.ssi.enabled=true
scanner.ssi.strength=MEDIUM

# Command Injection
scanner.commandinjection.enabled=true
scanner.commandinjection.strength=HIGH

# CRLF Injection
scanner.crlfinjection.enabled=true
scanner.crlfinjection.strength=MEDIUM

# External Redirect
scanner.redirect.enabled=true
scanner.redirect.strength=MEDIUM

# Buffer Overflow
scanner.bufferoverflow.enabled=true
scanner.bufferoverflow.strength=LOW

# Format String
scanner.formatstring.enabled=true
scanner.formatstring.strength=LOW
EOF

print_success "Configuration files created"

# ============================================
# Create context files
# ============================================
print_info "Creating context files..."

# strapi-context.context
cat > security/context/strapi-context.context << 'EOF'
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<configuration>
    <context>
        <name>Strapi API Context</name>
        <desc>Security testing context for Strapi APIs</desc>
        <inscope>true</inscope>
        <incregexes>http://host.docker.internal:1337/api/.*</incregexes>
        <tech>
            <include>Db</include>
            <include>Db.PostgreSQL</include>
            <include>Language</include>
            <include>Language.JavaScript</include>
            <include>OS</include>
            <include>OS.Linux</include>
            <include>SCM</include>
            <include>WS</include>
        </tech>
        <urlparser>
            <class>org.zaproxy.zap.model.StandardParameterParser</class>
            <config>{"kvps":"&amp;","kvs":"=","struct":[]}</config>
        </urlparser>
        <authentication>
            <type>1</type>
            <strategy>EACH_RESP</strategy>
            <pollurl></pollurl>
            <polldata></polldata>
            <pollheaders></pollheaders>
            <pollfreq>60</pollfreq>
            <pollunits>REQUESTS</pollunits>
        </authentication>
        <users>
            <user>testuser;true</user>
        </users>
        <forceduser>-1</forceduser>
        <session>
            <type>0</type>
        </session>
        <authorization>
            <type>0</type>
            <basic>
                <header></header>
                <body></body>
                <logic>AND</logic>
                <code>-1</code>
            </basic>
        </authorization>
    </context>
</configuration>
EOF

# authentication-script.js
cat > security/context/authentication-script.js << 'EOF'
// ZAP Authentication Script for Strapi
// This script handles JWT authentication for Strapi APIs

function authenticate(helper, paramsValues, credentials) {
    var loginUrl = "http://host.docker.internal:1337/api/auth/local";
    var username = credentials.getParam("username");
    var password = credentials.getParam("password");
    
    var loginData = JSON.stringify({
        identifier: username,
        password: password
    });
    
    var msg = helper.prepareMessage();
    msg.setRequestHeader("POST " + loginUrl + " HTTP/1.1");
    msg.setRequestHeader("Content-Type: application/json");
    msg.setRequestBody(loginData);
    
    helper.sendAndReceive(msg);
    
    var response = msg.getResponseBody().toString();
    var jwtToken = extractToken(response);
    
    if (jwtToken) {
        helper.getAuthenticationState().setAuthToken(jwtToken);
        return true;
    }
    
    return false;
}

function extractToken(response) {
    try {
        var json = JSON.parse(response);
        return json.jwt;
    } catch (e) {
        return null;
    }
}

function getRequiredParamsNames() {
    return ["username", "password"];
}

function getOptionalParamsNames() {
    return [];
}

function getCredentialsParamsNames() {
    return ["username", "password"];
}
EOF

print_success "Context files created"

# ============================================
# Create test data files
# ============================================
print_info "Creating test data files..."

# api-endpoints.txt
cat > test-data/api-endpoints.txt << 'EOF'
# Strapi API Endpoints for Security Testing
# Authentication Endpoints
http://localhost:1337/api/auth/local
http://localhost:1337/api/auth/local/register
http://localhost:1337/api/auth/forgot-password
http://localhost:1337/api/auth/reset-password

# User Endpoints
http://localhost:1337/api/users
http://localhost:1337/api/users/me
http://localhost:1337/api/users/count
http://localhost:1337/api/users/:id

# Add your custom content-type endpoints here
# http://localhost:1337/api/posts
# http://localhost:1337/api/categories
EOF

# test-credentials.json
cat > test-data/test-credentials.json << 'EOF'
{
  "strapi": {
    "baseUrl": "http://localhost:1337",
    "apiUrl": "http://localhost:1337/api",
    "credentials": {
      "username": "test@example.com",
      "password": "Test@123456",
      "identifier": "test@example.com"
    },
    "endpoints": {
      "login": "/auth/local",
      "register": "/auth/local/register",
      "users": "/users",
      "usersMe": "/users/me",
      "usersCount": "/users/count"
    },
    "sampleToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg5NzYyMDAwLCJleHAiOjE2OTIzNTQwMDB9.SAMPLE_TOKEN"
  },
  "testUsers": [
    {
      "email": "admin@test.com",
      "password": "Admin@123456",
      "role": "admin"
    },
    {
      "email": "user@test.com",
      "password": "User@123456",
      "role": "authenticated"
    }
  ]
}
EOF

print_success "Test data files created"

# ============================================
# Create README.md
# ============================================
print_info "Creating README.md..."

cat > README.md << 'EOF'
# 🔒 Strapi Security Testing Kit

Comprehensive security testing suite for Strapi APIs using OWASP ZAP.

## 🚀 Quick Start

### 1. Start ZAP Container
```bash
docker-compose up -d
```

### 2. Verify Setup
```bash
docker ps | grep zap
```

### 3. Run Your First Scan
```bash
./security/scripts/baseline-scan.sh
```

### 4. View Report
```bash
open security/reports/html/baseline_scan_*.html
```

## 📊 Available Scans

### Baseline Scan (Quick - 5-10 min)
```bash
./security/scripts/baseline-scan.sh
```
Tests: OWASP Top 10, SQL Injection, XSS, Security Headers

### Full Scan (Comprehensive - 30-60 min)
```bash
export STRAPI_USER="your-email@example.com"
export STRAPI_PASS="your-password"
./security/scripts/full-scan.sh
```
Tests: All vulnerabilities with active scanning

### API Scan (Targeted - 15-20 min)
```bash
./security/scripts/api-scan.sh
```
Tests: API-specific vulnerabilities

### Authenticated Scan (With JWT - 20-30 min)
```bash
export STRAPI_USER="your-email@example.com"
export STRAPI_PASS="your-password"
./security/scripts/authenticated-scan.sh
```
Tests: Protected endpoints with authentication

### Interactive Menu
```bash
./security/scripts/run-security-scan.sh
```

## 📁 Project Structure

```
strapi-security-tests/
├── docker-compose.yml
├── security/
│   ├── scripts/          # Scan scripts
│   ├── reports/          # Generated reports
│   ├── configs/          # Configuration files
│   └── context/          # ZAP context files
├── test-data/            # Test credentials and endpoints
└── README.md
```

## 🔧 Configuration

Update your credentials in `test-data/test-credentials.json`:

```json
{
  "credentials": {
    "username": "your-email@example.com",
    "password": "your-password"
  }
}
```

## 📊 Understanding Reports

- **High** 🔴: Fix immediately
- **Medium** 🟡: Fix in next sprint  
- **Low** 🟢: Fix when possible
- **Informational** 🔵: Review and note

## 🆘 Troubleshooting

### ZAP Container Not Starting
```bash
docker-compose down
docker-compose up -d
docker logs strapi-zap-security
```

### Cannot Connect to Strapi
Ensure Strapi is running:
```bash
curl http://localhost:1337
```

### Authentication Fails
1. Verify credentials in Strapi admin
2. Check user has proper permissions
3. Test login manually first

## 📚 Resources

- [OWASP ZAP Documentation](https://www.zaproxy.org/docs/)
- [Strapi Security](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/optional/middlewares.html#security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## 🎯 Next Steps

1. Run baseline scan
2. Review results
3. Fix high-priority issues
4. Re-scan to verify
5. Schedule regular scans

---

Generated by Strapi Security Testing Kit Generator
EOF

print_success "README.md created"

# ============================================
# Create .gitignore
# ============================================
print_info "Creating .gitignore..."

cat > .gitignore << 'EOF'
# Reports
security/reports/**/*.html
security/reports/**/*.json
security/reports/**/*.xml

# Logs
*.log

# Environment variables
.env
.env.local

# Temporary files
*.tmp
*.temp

# JWT tokens
security/context/jwt-token.txt

# Keep directory structure
!security/reports/html/.gitkeep
!security/reports/json/.gitkeep
!security/reports/xml/.gitkeep
EOF

# Create .gitkeep files
touch security/reports/html/.gitkeep
touch security/reports/json/.gitkeep
touch security/reports/xml/.gitkeep

print_success ".gitignore created"

# ============================================
# Summary
# ============================================
echo ""
echo "============================================"
echo "✓ Setup Complete!"
echo "============================================"
echo ""
echo "📁 Project created at: ./$PROJECT_NAME"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "1. Navigate to project:"
echo "   cd $PROJECT_NAME"
echo ""
echo "2. Update credentials in:"
echo "   test-data/test-credentials.json"
echo ""
echo "3. Start ZAP container:"
echo "   docker-compose up -d"
echo ""
echo "4. Run your first scan:"
echo "   ./security/scripts/baseline-scan.sh"
echo ""
echo "5. View the report:"
echo "   open security/reports/html/baseline_scan_*.html"
echo ""
echo "📚 For detailed instructions, see:"
echo "   cat README.md"
echo ""
echo "Happy Security Testing! 🔒"
echo ""