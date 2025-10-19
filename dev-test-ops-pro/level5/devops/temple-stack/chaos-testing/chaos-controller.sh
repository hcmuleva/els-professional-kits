#!/bin/bash

# ============================================
# Istio Chaos Controller for Temple API
# ============================================
# This script reads chaos parameters from ConfigMap
# and updates the VirtualService accordingly

set -e

NAMESPACE="temple-stack"
CONFIGMAP="temple-api-chaos-config"
VIRTUALSERVICE="temple-api-chaos"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Get current chaos parameters
get_chaos_params() {
    FAILURE_PERCENT=$(kubectl get configmap $CONFIGMAP -n $NAMESPACE -o jsonpath='{.data.failure-percent}')
    FAILURE_STATUS=$(kubectl get configmap $CONFIGMAP -n $NAMESPACE -o jsonpath='{.data.failure-status}')
    SUCCESS_PERCENT=$(kubectl get configmap $CONFIGMAP -n $NAMESPACE -o jsonpath='{.data.success-percent}')
    
    print_info "Current Chaos Configuration:"
    echo "  Failure Rate: ${FAILURE_PERCENT}%"
    echo "  Success Rate: ${SUCCESS_PERCENT}%"
    echo "  Failure Status Code: ${FAILURE_STATUS}"
}

# Update VirtualService with new parameters
update_virtualservice() {
    print_info "Updating VirtualService with new chaos parameters..."
    
    # Create temporary file with updated values
    cat > /tmp/vs-patch.yaml <<EOF
spec:
  hosts:
  - temple-api-service
  - temple-api.local
  http:
  - match:
    - uri:
        prefix: /api
    fault:
      abort:
        percentage:
          value: ${FAILURE_PERCENT}.0
        httpStatus: ${FAILURE_STATUS}
    route:
    - destination:
        host: temple-api-service
        port:
          number: 1337
  - match:
    - uri:
        prefix: /_health
    route:
    - destination:
        host: temple-api-service
        port:
          number: 1337
  - route:
    - destination:
        host: temple-api-service
        port:
          number: 1337
EOF
    
    # Apply the patch
    kubectl patch virtualservice $VIRTUALSERVICE -n $NAMESPACE --type merge --patch-file /tmp/vs-patch.yaml
    
    # Clean up
    rm /tmp/vs-patch.yaml
    
    print_success "VirtualService updated successfully!"
}

# Validate configuration
validate_config() {
    if [ -z "$FAILURE_PERCENT" ] || [ -z "$SUCCESS_PERCENT" ]; then
        print_error "Failed to read chaos parameters from ConfigMap"
        exit 1
    fi
    
    # Check if percentages add up to 100
    TOTAL=$((FAILURE_PERCENT + SUCCESS_PERCENT))
    if [ $TOTAL -ne 100 ]; then
        print_warning "Warning: Failure ($FAILURE_PERCENT%) + Success ($SUCCESS_PERCENT%) = $TOTAL% (should be 100%)"
    fi
}

# Main function
main() {
    echo "============================================"
    echo "  Istio Chaos Controller"
    echo "============================================"
    echo ""
    
    get_chaos_params
    validate_config
    
    echo ""
    read -p "Apply these chaos parameters? [Y/n]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]] && [[ ! -z $REPLY ]]; then
        print_info "Operation cancelled"
        exit 0
    fi
    
    update_virtualservice
    
    echo ""
    print_success "Chaos parameters applied successfully!"
    echo ""
    print_info "To test the chaos:"
    echo "  curl http://temple-api.local/api/users"
    echo "  # Expect ${FAILURE_PERCENT}% of requests to fail with 503"
    echo ""
    print_info "To modify parameters:"
    echo "  kubectl edit configmap $CONFIGMAP -n $NAMESPACE"
    echo "  ./chaos-controller.sh  # Re-run this script"
}

# Run main
main