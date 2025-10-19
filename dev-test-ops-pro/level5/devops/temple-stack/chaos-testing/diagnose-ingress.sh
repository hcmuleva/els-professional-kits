#!/bin/bash

# ============================================
# Ingress Diagnostics Script
# ============================================

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_header() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo ""
}

print_header "Ingress Diagnostics"

# Check all ingresses
print_header "All Ingresses in Cluster"
kubectl get ingress --all-namespaces

echo ""
print_header "Temple Stack Ingresses"
kubectl get ingress -n temple-stack -o wide

echo ""
print_header "Istio System Ingresses"
kubectl get ingress -n istio-system -o wide

echo ""
print_header "Istio VirtualServices (temple-stack)"
kubectl get virtualservice -n temple-stack

echo ""
print_header "Istio VirtualServices (istio-system)"
kubectl get virtualservice -n istio-system

echo ""
print_header "Istio Gateways"
kubectl get gateway --all-namespaces

echo ""
print_header "Temple UI Ingress Details"
kubectl get ingress -n temple-stack temple-ui-ingress -o yaml 2>/dev/null || echo "Not found"

echo ""
print_header "/etc/hosts Entries"
grep -E "temple|kiali|jaeger|grafana|prometheus" /etc/hosts || echo "No entries found"

echo ""
print_header "Potential Conflicts"

# Check for wildcard or catch-all rules
echo "Checking for catch-all ingress rules..."
kubectl get ingress --all-namespaces -o json | jq -r '.items[] | select(.spec.rules[].http.paths[].path == "/") | "\(.metadata.namespace)/\(.metadata.name)"'

echo ""
echo "Checking for default backend..."
kubectl get ingress --all-namespaces -o json | jq -r '.items[] | select(.spec.defaultBackend != null) | "\(.metadata.namespace)/\(.metadata.name)"'

echo ""
print_header "Recommended Actions"
echo "1. Remove conflicting VirtualServices:"
echo "   kubectl delete virtualservice -n temple-stack --all"
echo ""
echo "2. Clean up and restart:"
echo "   ./complete-cleanup.sh"
echo ""
echo "3. Reinstall monitoring:"
echo "   ./setup-istio-monitoring.sh"
echo ""