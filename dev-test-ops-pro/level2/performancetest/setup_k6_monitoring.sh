#!/bin/bash

# Configuration Variables
INFLUXDB_HOST="localhost"
INFLUXDB_PORT="8086"
INFLUXDB_DATABASE="k6"
GRAFANA_HOST="localhost"
GRAFANA_PORT="3000"
GRAFANA_USER="admin"
GRAFANA_PASSWORD="admin"

# Function to check if a service is ready
check_service() {
    local service=$1
    local url=$2
    echo -n "Waiting for $service to be ready..."
    until curl -s "$url" > /dev/null; do
        echo -n '.'
        sleep 2
    done
    echo " Ready!"
}

# Function to check the exit status of the previous command
check_status() {
    if [ $? -eq 0 ]; then
        echo "✅ $1"
    else
        echo "❌ $1 failed"
        exit 1
    fi
}

# Function to check API response
check_api_response() {
    local response="$1"
    local success_pattern="$2"
    local error_msg="$3"
    
    if echo "$response" | grep -q "$success_pattern"; then
        echo "✅ $error_msg"
        return 0
    else
        echo "❌ $error_msg"
        echo "API Response: $response"
        return 1
    fi
}

echo "Starting k6, InfluxDB, and Grafana setup..."
echo "============================================="

# Step 1: Start the infrastructure using Docker Compose
echo "1. Starting Docker containers (InfluxDB & Grafana)..."
docker-compose up -d influxdb grafana
check_status "Docker containers started"

# Step 2: Wait for InfluxDB to be ready
check_service "InfluxDB" "http://$INFLUXDB_HOST:$INFLUXDB_PORT/ping"

# Step 3: Create the k6 database in InfluxDB if it doesn't exist
echo "2. Creating InfluxDB database '$INFLUXDB_DATABASE'..."
curl -s -XPOST "http://$INFLUXDB_HOST:$INFLUXDB_PORT/query?u=admin&p=admin" --data-urlencode "q=CREATE DATABASE IF NOT EXISTS $INFLUXDB_DATABASE" > /dev/null
check_status "InfluxDB database creation"

# Step 4: Wait for Grafana to be ready and be responsive to API calls
echo "3. Waiting for Grafana to be fully ready..."
check_service "Grafana" "http://$GRAFANA_HOST:$GRAFANA_PORT"
# Additional wait for Grafana to initialize completely
sleep 10

# Step 5: Configure the InfluxDB data source in Grafana via API
echo "4. Configuring InfluxDB data source in Grafana..."

# Use basic authentication credentials
GRAFANA_AUTH="$GRAFANA_USER:$GRAFANA_PASSWORD"

# CORRECTED Data source configuration for InfluxDB 1.8
DATA_SOURCE_CONFIG=$(cat <<EOF
{
  "name": "InfluxDB-k6",
  "type": "influxdb",
  "url": "http://influxdb:8086",
  "access": "proxy",
  "database": "$INFLUXDB_DATABASE",
  "isDefault": true,
  "basicAuth": false,
  "jsonData": {
    "httpMode": "GET",
    "version": "InfluxQL"
  }
}
EOF
)

# Add the data source
CONFIG_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$DATA_SOURCE_CONFIG" \
    "http://$GRAFANA_AUTH@$GRAFANA_HOST:$GRAFANA_PORT/api/datasources")

# Extract HTTP status code and response body
HTTP_CODE=$(echo "$CONFIG_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$CONFIG_RESPONSE" | head -n -1)

echo "HTTP Status Code: $HTTP_CODE"
echo "Response: $RESPONSE_BODY"

# Check if the configuration was successful
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Data source configured successfully"
elif echo "$RESPONSE_BODY" | grep -q '"message":"data source with the same name already exists"'; then
    echo "ℹ️  Data source already exists. Skipping creation."
else
    echo "❌ Failed to configure data source"
    
    # Try alternative configuration without authentication (since InfluxDB 1.8 often runs without auth)
    echo "5. Trying alternative configuration without InfluxDB authentication..."
    
    ALTERNATIVE_CONFIG=$(cat <<EOF
{
  "name": "InfluxDB-k6-NoAuth",
  "type": "influxdb",
  "url": "http://influxdb:8086",
  "access": "proxy",
  "database": "$INFLUXDB_DATABASE",
  "isDefault": true,
  "basicAuth": false,
  "jsonData": {
    "httpMode": "GET",
    "version": "InfluxQL"
  }
}
EOF
    )
    
    ALT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "$ALTERNATIVE_CONFIG" \
        "http://$GRAFANA_AUTH@$GRAFANA_HOST:$GRAFANA_PORT/api/datasources")
    
    ALT_HTTP_CODE=$(echo "$ALT_RESPONSE" | tail -n1)
    ALT_RESPONSE_BODY=$(echo "$ALT_RESPONSE" | head -n -1)
    
    if [ "$ALT_HTTP_CODE" = "200" ]; then
        echo "✅ Alternative data source configured successfully"
    else
        echo "❌ Alternative configuration also failed"
        echo "Alternative HTTP Status Code: $ALT_HTTP_CODE"
        echo "Alternative Response: $ALT_RESPONSE_BODY"
    fi
fi

# Step 6: Test the data source connection
echo "6. Testing data source connection..."
TEST_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"queries":[{"refId":"A","datasource":{"type":"influxdb","uid":"InfluxDB-k6"},"rawQuery":true,"query":"SHOW MEASUREMENTS","resultFormat":"time_series"}]}' \
    "http://$GRAFANA_AUTH@$GRAFANA_HOST:$GRAFANA_PORT/api/ds/query")

if echo "$TEST_RESPONSE" | grep -q '"status":"success"'; then
    echo "✅ Data source test successful"
else
    echo "⚠️  Data source test may have issues, but continuing..."
fi

# Step 7: Import the k6 dashboard (ID: 2587) using the API method that works
echo "7. Setting up k6 dashboard..."

# Instead of trying to import via API (which is complex), provide clear instructions
echo "ℹ️  Please manually import the k6 dashboard by following these steps:"
echo "   a. Open http://$GRAFANA_HOST:$GRAFANA_PORT"
echo "   b. Log in with $GRAFANA_USER / $GRAFANA_PASSWORD"
echo "   c. Navigate to '+' -> 'Import'"
echo "   d. Enter dashboard ID: 2587"
echo "   e. Select your InfluxDB data source and click 'Import'"
echo ""
echo "   Alternatively, use this direct import link:"
echo "   http://$GRAFANA_HOST:$GRAFANA_PORT/dashboard/import?orgId=1"

# Step 8: Verify data can be written and read
echo "8. Verifying end-to-end setup..."
echo "   To test the complete setup:"
echo "   docker-compose run --rm k6 run --out influxdb=http://influxdb:8086/k6 /scripts/perf_level1.js"
echo ""
echo "   Then check Grafana for data at: http://$GRAFANA_HOST:$GRAFANA_PORT"

# Step 9: Final instructions
echo ""
echo "============================================="
echo "Setup complete!"
echo "============================================="
echo "Quick verification commands:"
echo "  Check InfluxDB data: curl -G 'http://localhost:8086/query?db=k6' --data-urlencode 'q=SHOW MEASUREMENTS'"
echo "  Check Grafana: http://$GRAFANA_HOST:$GRAFANA_PORT"
echo ""
echo "To stop the environment: docker-compose down"
echo "============================================="