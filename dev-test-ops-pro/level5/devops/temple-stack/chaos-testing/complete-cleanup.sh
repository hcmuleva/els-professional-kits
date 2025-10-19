#!/bin/bash

# ============================================
# Complete Cleanup Script
# Removes Chaos Testing and Istio Configuration
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  $1${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

NAMESPACE="temple-stack"

print_header "Complete Cleanup - Chaos and Istio"

echo "This script will:"
echo "  1. Remove all chaos testing resources"
echo "  2. Remove Istio injection from temple-stack"
echo "  3. Restart pods without Istio sidecars"
echo "  4. Clean up any conflicting ingress rules"
echo ""

read -p "Continue with cleanup? [y/N]: " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Cleanup cancelled"
    exit 0
fi

# Step 1: Remove Chaos Resources
print_header "Step 1: Removing Chaos Resources"

print_info "Deleting chaos VirtualServices..."
kubectl delete virtualservice temple-api-chaos -n $NAMESPACE --ignore-not-found
kubectl delete virtualservice temple-ui-chaos -n $NAMESPACE --ignore-not-found

print_info "Deleting chaos DestinationRules..."
kubectl delete destinationrule temple-api-chaos -n $NAMESPACE --ignore-not-found
kubectl delete destinationrule temple-ui-chaos -n $NAMESPACE --ignore-not-found

print_info "Deleting chaos Gateways..."
kubectl delete gateway temple-api-gateway -n $NAMESPACE --ignore-not-found
kubectl delete gateway temple-ui-gateway -n $NAMESPACE --ignore-not-found

print_info "Deleting chaos ConfigMaps..."
kubectl delete configmap temple-api-chaos-config -n $NAMESPACE --ignore-not-found

print_success "Chaos resources removed"

# Step 2: Remove Istio Injection
print_header "Step 2: Removing Istio Injection"

print_info "Removing Istio injection label..."
kubectl label namespace $NAMESPACE istio-injection- --overwrite 2>/dev/null || true

print_success "Istio injection disabled"

# Step 3: Restart Pods
print_header "Step 3: Restarting Pods"

print_info "Restarting temple-api..."
kubectl rollout restart deployment/temple-api -n $NAMESPACE

print_info "Restarting temple-ui..."
kubectl rollout restart deployment/temple-ui -n $NAMESPACE 2>/dev/null || \
kubectl rollout restart deployment/temple-ui-deployment -n $NAMESPACE 2>/dev/null || true

print_info "Waiting for rollouts to complete..."
kubectl rollout status deployment/temple-api -n $NAMESPACE --timeout=5m

# Try both possible names for temple-ui
kubectl rollout status deployment/temple-ui -n $NAMESPACE --timeout=5m 2>/dev/null || \
kubectl rollout status deployment/temple-ui-deployment -n $NAMESPACE --timeout=5m 2>/dev/null || true

print_success "Pods restarted without Istio sidecars"

# Step 4: Verify Cleanup
print_header "Step 4: Verifying Cleanup"

echo "Checking for remaining Istio resources in $NAMESPACE:"
REMAINING=$(kubectl get virtualservice,destinationrule,gateway -n $NAMESPACE 2>/dev/null | grep -v "No resources" | wc -l)

if [ $REMAINING -eq 0 ]; then
    print_success "No Istio resources remaining in $NAMESPACE"
else
    print_warning "Some Istio resources still exist:"
    kubectl get virtualservice,destinationrule,gateway -n $NAMESPACE
fi

echo ""
echo "Pod status:"
kubectl get pods -n $NAMESPACE -o custom-columns=NAME:.metadata.name,READY:.status.containerStatuses[*].ready,CONTAINERS:.spec.containers[*].name

print_header "Cleanup Complete!"

echo -e "${GREEN}✅ All chaos and Istio resources removed${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Verify your application works: http://temple-ui.local"
echo "  2. Check ArgoCD sync status if using GitOps"
echo "  3. If you want to reinstall Istio monitoring, run the setup script"
echo ""
echo -e "${YELLOW}Note:${NC} Your application ingresses (temple-ui, temple-api) are preserved"
echo ""