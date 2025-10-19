#!/bin/bash

# ============================================
# Quick Setup Script for Istio Chaos Testing
# ============================================

set -e

NAMESPACE="temple-stack"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  $1"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl not found"
        exit 1
    fi
    print_success "kubectl found"
    
    # Check cluster connection
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    print_success "Connected to Kubernetes cluster"
    
    # Check Istio
    if ! kubectl get namespace istio-system &> /dev/null; then
        print_error "Istio not installed. Please install Istio first."
        exit 1
    fi
    print_success "Istio is installed"
    
    # Check namespace
    if ! kubectl get namespace $NAMESPACE &> /dev/null; then
        print_error "Namespace $NAMESPACE not found"
        exit 1
    fi
    print_success "Namespace $NAMESPACE exists"
    
    # Check if temple-api exists
    if ! kubectl get deployment temple-api -n $NAMESPACE &> /dev/null; then
        print_error "temple-api deployment not found in $NAMESPACE"
        exit 1
    fi
    print_success "temple-api deployment found"
}

enable_istio_injection() {
    print_header "Enabling Istio Injection"
    
    print_info "Labeling namespace for Istio injection..."
    kubectl label namespace $NAMESPACE istio-injection=enabled --overwrite
    
    print_success "Istio injection enabled for $NAMESPACE"
}

restart_deployments() {
    print_header "Restarting Deployments"
    
    print_info "Restarting temple-api..."
    kubectl rollout restart deployment/temple-api -n $NAMESPACE
    
    print_info "Restarting temple-ui-deployment..."
    kubectl rollout restart deployment/temple-ui-deployment -n $NAMESPACE
    
    print_info "Waiting for rollouts to complete..."
    kubectl rollout status deployment/temple-api -n $NAMESPACE --timeout=5m
    kubectl rollout status deployment/temple-ui-deployment -n $NAMESPACE --timeout=5m
    
    print_success "All deployments restarted with Istio sidecars"
}

verify_sidecars() {
    print_header "Verifying Istio Sidecars"
    
    echo "Pod Status:"
    kubectl get pods -n $NAMESPACE -o custom-columns=NAME:.metadata.name,READY:.status.containerStatuses[*].ready,CONTAINERS:.spec.containers[*].name
    
    echo ""
    
    # Check if pods have 2 containers
    API_CONTAINERS=$(kubectl get pod -n $NAMESPACE -l app=temple-api -o jsonpath='{.items[0].spec.containers[*].name}' | wc -w)
    
    if [ "$API_CONTAINERS" -eq 2 ]; then
        print_success "temple-api has Istio sidecar (2 containers)"
    else
        print_warning "temple-api may not have Istio sidecar (only $API_CONTAINERS container(s))"
    fi
}

apply_chaos_config() {
    print_header "Applying Chaos Configuration"
    
    if [ ! -f "istio-chaos-config.yaml" ]; then
        print_error "istio-chaos-config.yaml not found"
        print_info "Please ensure all required files are in the current directory"
        exit 1
    fi
    
    print_info "Applying chaos resources..."
    kubectl apply -f istio-chaos-config.yaml
    
    print_success "Chaos configuration applied"
    
    echo ""
    print_info "Resources created:"
    kubectl get virtualservice,destinationrule,gateway,configmap -n $NAMESPACE | grep chaos || true
}

make_scripts_executable() {
    print_header "Setting Up Scripts"
    
    if [ -f "chaos-controller.sh" ]; then
        chmod +x chaos-controller.sh
        print_success "chaos-controller.sh is executable"
    fi
    
    if [ -f "test-chaos.sh" ]; then
        chmod +x test-chaos.sh
        print_success "test-chaos.sh is executable"
    fi
}

update_etc_hosts() {
    print_header "Updating /etc/hosts"
    
    if grep -q "temple-api.local" /etc/hosts && grep -q "temple-ui.local" /etc/hosts; then
        print_info "/etc/hosts already contains required entries"
    else
        print_warning "You need to add these entries to /etc/hosts:"
        echo ""
        echo "127.0.0.1 temple-api.local"
        echo "127.0.0.1 temple-ui.local"
        echo ""
        
        read -p "Add them now? (requires sudo) [y/N]: " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            if ! grep -q "temple-api.local" /etc/hosts; then
                echo "127.0.0.1 temple-api.local" | sudo tee -a /etc/hosts > /dev/null
            fi
            if ! grep -q "temple-ui.local" /etc/hosts; then
                echo "127.0.0.1 temple-ui.local" | sudo tee -a /etc/hosts > /dev/null
            fi
            print_success "/etc/hosts updated"
        else
            print_warning "Please add entries manually to /etc/hosts"
        fi
    fi
}

run_initial_test() {
    print_header "Running Initial Chaos Test"
    
    print_info "Testing with 10 requests..."
    echo ""
    
    for i in {1..10}; do
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://temple-api.local/api/users 2>/dev/null || echo "000")
        
        if [ "$STATUS" == "200" ]; then
            echo -e "Request $i: ${GREEN}✓ Success ($STATUS)${NC}"
        else
            echo -e "Request $i: ${RED}✗ Failed ($STATUS)${NC}"
        fi
        sleep 0.3
    done
    
    echo ""
    print_info "For detailed testing, run: ./test-chaos.sh"
}

show_summary() {
    print_header "Setup Complete!"
    
    echo -e "${GREEN}✅ Istio chaos testing is now configured!${NC}"
    echo ""
    
    echo -e "${BLUE}Quick Commands:${NC}"
    echo ""
    echo "  # Run chaos test"
    echo "  ./test-chaos.sh"
    echo ""
    echo "  # Change failure rate to 80%"
    echo "  make set-chaos-80"
    echo ""
    echo "  # View current configuration"
    echo "  make status"
    echo ""
    echo "  # Open Kiali dashboard"
    echo "  make kiali"
    echo ""
    echo "  # See all available commands"
    echo "  make help"
    echo ""
    
    echo -e "${BLUE}Access URLs:${NC}"
    echo "  Frontend:     http://temple-ui.local"
    echo "  API:          http://temple-api.local/api"
    echo "  Health Check: http://temple-api.local/_health"
    echo ""
    
    echo -e "${BLUE}Current Chaos Configuration:${NC}"
    FAILURE=$(kubectl get configmap temple-api-chaos-config -n $NAMESPACE -o jsonpath='{.data.failure-percent}')
    SUCCESS=$(kubectl get configmap temple-api-chaos-config -n $NAMESPACE -o jsonpath='{.data.success-percent}')
    echo "  Failure Rate: ${FAILURE}%"
    echo "  Success Rate: ${SUCCESS}%"
    echo ""
    
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "  1. Run './test-chaos.sh' to test the chaos injection"
    echo "  2. Open Kiali to visualize traffic: 'make kiali'"
    echo "  3. Adjust failure rate: 'make set-chaos-80' or 'make set-chaos-30'"
    echo "  4. View logs: 'make logs-proxy' or 'make logs-app'"
    echo ""
}

main() {
    clear
    
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                    ║"
    echo "║         Istio Chaos Testing - Quick Setup                         ║"
    echo "║         For Temple API Service                                    ║"
    echo "║                                                                    ║"
    echo "╔════════════════════════════════════════════════════════════════════╗"
    echo -e "${NC}"
    echo ""
    
    print_warning "This script will:"
    echo "  1. Enable Istio injection for temple-stack namespace"
    echo "  2. Restart deployments to inject Istio sidecars"
    echo "  3. Apply chaos configuration (60% failure rate)"
    echo "  4. Run initial tests"
    echo ""
    
    read -p "Continue? [Y/n]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]] && [[ ! -z $REPLY ]]; then
        print_info "Setup cancelled"
        exit 0
    fi
    
    check_prerequisites
    enable_istio_injection
    restart_deployments
    verify_sidecars
    apply_chaos_config
    make_scripts_executable
    update_etc_hosts
    
    # Wait a bit for configuration to propagate
    print_info "Waiting for configuration to propagate..."
    sleep 5
    
    run_initial_test
    show_summary
    
    echo ""
    print_success "🎉 Setup complete! Happy chaos testing!"
    echo ""
}

main "$@"