#!/bin/bash

# ============================================
# Chaos Testing Script for Temple API
# Mac-compatible version (Bash 3.x)
# ============================================

set -e

# Configuration
TOTAL=${1:-100}
URL="http://temple-api.local/api/users"
NAMESPACE="temple-stack"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Counters
SUCCESS=0
FAILURES=0

# Status code counters (using regular variables instead of associative array)
STATUS_200=0
STATUS_503=0
STATUS_OTHER=0

# Get expected failure rate from ConfigMap
EXPECTED_FAILURE=$(kubectl get configmap temple-api-chaos-config -n $NAMESPACE -o jsonpath='{.data.failure-percent}' 2>/dev/null || echo "60")
EXPECTED_SUCCESS=$(kubectl get configmap temple-api-chaos-config -n $NAMESPACE -o jsonpath='{.data.success-percent}' 2>/dev/null || echo "40")

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         Temple API Chaos Testing                             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${BLUE}Configuration:${NC}"
echo "  Target URL:        $URL"
echo "  Total Requests:    $TOTAL"
echo "  Expected Failure:  ${EXPECTED_FAILURE}%"
echo "  Expected Success:  ${EXPECTED_SUCCESS}%"
echo ""
echo -e "${BLUE}Running test...${NC}"
echo ""

# Run tests
echo -n "Testing: "
for i in $(seq 1 $TOTAL); do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null || echo "000")
    
    # Count status codes
    case $STATUS in
        200)
            STATUS_200=$((STATUS_200 + 1))
            SUCCESS=$((SUCCESS + 1))
            echo -n "."
            ;;
        503)
            STATUS_503=$((STATUS_503 + 1))
            FAILURES=$((FAILURES + 1))
            echo -n "x"
            ;;
        *)
            STATUS_OTHER=$((STATUS_OTHER + 1))
            FAILURES=$((FAILURES + 1))
            echo -n "?"
            ;;
    esac
    
    # New line every 50 requests
    if [ $((i % 50)) -eq 0 ]; then
        echo ""
        echo -n "         "
    fi
    
    # Small delay between requests
    sleep 0.05
done

echo ""
echo ""

# Calculate percentages
SUCCESS_PERCENT=$((SUCCESS * 100 / TOTAL))
FAILURE_PERCENT=$((FAILURES * 100 / TOTAL))

# Display results
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                     Test Results                             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${BLUE}Summary:${NC}"
echo "  Total Requests:    $TOTAL"
echo -e "  ${GREEN}Successful:${NC}        $SUCCESS (${SUCCESS_PERCENT}%)"
echo -e "  ${RED}Failed:${NC}            $FAILURES (${FAILURE_PERCENT}%)"
echo ""

echo -e "${BLUE}Status Code Distribution:${NC}"
if [ $STATUS_200 -gt 0 ]; then
    PERCENT_200=$((STATUS_200 * 100 / TOTAL))
    echo -e "  ${GREEN}200:${NC} $STATUS_200 requests ($PERCENT_200%)"
fi
if [ $STATUS_503 -gt 0 ]; then
    PERCENT_503=$((STATUS_503 * 100 / TOTAL))
    echo -e "  ${RED}503:${NC} $STATUS_503 requests ($PERCENT_503%)"
fi
if [ $STATUS_OTHER -gt 0 ]; then
    PERCENT_OTHER=$((STATUS_OTHER * 100 / TOTAL))
    echo -e "  ${YELLOW}Other:${NC} $STATUS_OTHER requests ($PERCENT_OTHER%)"
fi
echo ""

# Compare with expected values
echo -e "${BLUE}Expected vs Actual:${NC}"

SUCCESS_DIFF=$((SUCCESS_PERCENT - EXPECTED_SUCCESS))
FAILURE_DIFF=$((FAILURE_PERCENT - EXPECTED_FAILURE))

# Get absolute value for comparison
SUCCESS_DIFF_ABS=${SUCCESS_DIFF#-}
FAILURE_DIFF_ABS=${FAILURE_DIFF#-}

if [ $SUCCESS_DIFF_ABS -le 10 ]; then
    echo -e "  Success Rate:   ${GREEN}✓ Within tolerance${NC} (Expected: ${EXPECTED_SUCCESS}%, Actual: ${SUCCESS_PERCENT}%)"
else
    echo -e "  Success Rate:   ${YELLOW}⚠ Outside tolerance${NC} (Expected: ${EXPECTED_SUCCESS}%, Actual: ${SUCCESS_PERCENT}%)"
fi

if [ $FAILURE_DIFF_ABS -le 10 ]; then
    echo -e "  Failure Rate:   ${GREEN}✓ Within tolerance${NC} (Expected: ${EXPECTED_FAILURE}%, Actual: ${FAILURE_PERCENT}%)"
else
    echo -e "  Failure Rate:   ${YELLOW}⚠ Outside tolerance${NC} (Expected: ${EXPECTED_FAILURE}%, Actual: ${FAILURE_PERCENT}%)"
fi
echo ""

# Visual representation
echo -e "${BLUE}Visual Distribution:${NC}"
echo -n "  ["

# Calculate bar segments
success_bars=$((SUCCESS * 50 / TOTAL))
failure_bars=$((FAILURES * 50 / TOTAL))

for ((i=0; i<success_bars; i++)); do 
    printf "${GREEN}█${NC}"
done
for ((i=0; i<failure_bars; i++)); do 
    printf "${RED}█${NC}"
done

echo "]"
echo ""

# Recommendations
if [ $FAILURE_PERCENT -gt 70 ]; then
    echo -e "${YELLOW}⚠️  High failure rate detected!${NC}"
    echo "   This may impact user experience."
    echo "   Consider reducing failure percentage."
elif [ $FAILURE_PERCENT -lt 10 ]; then
    echo -e "${GREEN}✓ Low failure rate${NC}"
    echo "  System is stable with minimal chaos."
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                   Test Complete                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Export results to file
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RESULT_FILE="chaos-test-results-${TIMESTAMP}.txt"

cat > "$RESULT_FILE" <<ENDOFFILE
Chaos Test Results - $(date)
═══════════════════════════════════════════════════

Configuration:
  Target URL:        $URL
  Total Requests:    $TOTAL
  Expected Failure:  ${EXPECTED_FAILURE}%
  Expected Success:  ${EXPECTED_SUCCESS}%

Results:
  Successful:        $SUCCESS (${SUCCESS_PERCENT}%)
  Failed:            $FAILURES (${FAILURE_PERCENT}%)

Status Codes:
  200: $STATUS_200 ($(( STATUS_200 * 100 / TOTAL ))%)
  503: $STATUS_503 ($(( STATUS_503 * 100 / TOTAL ))%)
  Other: $STATUS_OTHER ($(( STATUS_OTHER * 100 / TOTAL ))%)

Comparison:
  Success: Expected ${EXPECTED_SUCCESS}%, Got ${SUCCESS_PERCENT}% (Diff: ${SUCCESS_DIFF}%)
  Failure: Expected ${EXPECTED_FAILURE}%, Got ${FAILURE_PERCENT}% (Diff: ${FAILURE_DIFF}%)
ENDOFFILE

echo -e "${BLUE}Results saved to: ${RESULT_FILE}${NC}"
echo ""
