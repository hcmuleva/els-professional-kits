#!/bin/bash

# ============================================
# Temple Stack - One-Click Deployment Script
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CHART_DIR="."
RELEASE_NAME="temple-stack"
NAMESPACE="temple-stack"
ENVIRONMENT="${1:-dev}"  # dev, prod, or custom

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  $1${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Function to check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed. Please install it first."
        exit 1
    fi
    print_success "kubectl is installed"
    
    # Check if helm is installed
    if ! command -v helm &> /dev/null; then
        print_error "helm is not installed. Please install it first."
        exit 1
    fi
    print_success "helm is installed"
    
    # Check kubectl connection
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    print_success "Connected to Kubernetes cluster"
    
    # Check if chart directory exists
    if [ ! -f "Chart.yaml" ]; then
        print_error "Chart.yaml not found. Are you in the temple-stack directory?"
        exit 1
    fi
    print_success "Chart files found"
}

# Function to update chart dependencies
update_dependencies() {
    print_header "Updating Chart Dependencies"
    
    print_info "Updating dependencies..."
    helm dependency update
    
    print_success "Dependencies updated"
}

# Function to validate chart
validate_chart() {
    print_header "Validating Helm Chart"
    
    print_info "Linting chart..."
    helm lint "$CHART_DIR"
    
    print_info "Validating template rendering..."
    helm template "$RELEASE_NAME" "$CHART_DIR" \
        -f "values-${ENVIRONMENT}.yaml" \
        --namespace "$NAMESPACE" \
        --debug > /dev/null
    
    print_success "Chart validation passed"
}

# Function to create namespace
create_namespace() {
    print_header "Setting Up Namespace"
    
    if kubectl get namespace "$NAMESPACE" &> /dev/null; then
        print_info "Namespace $NAMESPACE already exists"
    else
        print_info "Creating namespace $NAMESPACE..."
        kubectl create namespace "$NAMESPACE"
        print_success "Namespace created"
    fi
}

# Function to check if release exists
check_release() {
    helm list -n "$NAMESPACE" 2>/dev/null | grep -q "^${RELEASE_NAME}"
}

# Function to install or upgrade
deploy() {
    print_header "Deploying Temple Stack ($ENVIRONMENT)"
    
    local VALUES_FILE="values-${ENVIRONMENT}.yaml"
    
    if [ ! -f "$VALUES_FILE" ]; then
        print_warning "Values file $VALUES_FILE not found, using default values.yaml"
        VALUES_FILE="values.yaml"
    fi
    
    if check_release; then
        print_info "Release exists. Performing upgrade..."
        helm upgrade "$RELEASE_NAME" "$CHART_DIR" \
            -n "$NAMESPACE" \
            -f "$VALUES_FILE" \
            --wait \
            --timeout 10m \
            --atomic \
            --cleanup-on-fail
    else
        print_info "Installing new release..."
        helm install "$RELEASE_NAME" "$CHART_DIR" \
            -n "$NAMESPACE" \
            -f "$VALUES_FILE" \
            --wait \
            --timeout 10m \
            --atomic \
            --create-namespace
    fi
    
    print_success "Deployment completed!"
}

# Function to show deployment status
show_status() {
    print_header "Deployment Status"
    
    print_info "Release Information:"
    helm list -n "$NAMESPACE"
    
    echo ""
    print_info "Pod Status:"
    kubectl get pods -n "$NAMESPACE"
    
    echo ""
    print_info "Service Status:"
    kubectl get svc -n "$NAMESPACE"
    
    echo ""
    print_info "Ingress Status:"
    kubectl get ingress -n "$NAMESPACE"
}

# Function to update /etc/hosts
update_hosts() {
    print_header "Updating /etc/hosts"
    
    print_warning "You may need to add the following entries to /etc/hosts:"
    echo ""
    echo "127.0.0.1 temple-api.local"
    echo "127.0.0.1 temple-ui.local"
    echo ""
    
    read -p "Do you want to update /etc/hosts automatically? (requires sudo) [y/N]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if grep -q "temple-api.local" /etc/hosts && grep -q "temple-ui.local" /etc/hosts; then
            print_info "/etc/hosts already contains required entries"
        else
            echo "127.0.0.1 temple-api.local" | sudo tee -a /etc/hosts > /dev/null
            echo "127.0.0.1 temple-ui.local" | sudo tee -a /etc/hosts > /dev/null
            print_success "/etc/hosts updated"
        fi
    fi
}

# Function to show access information
show_access_info() {
    print_header "Access Information"
    
    echo ""
    print_success "Temple Stack is deployed and ready!"
    echo ""
    echo -e "${GREEN}Frontend UI:${NC}  http://temple-ui.local"
    echo -e "${GREEN}API Server:${NC}   http://temple-api.local/api"
    echo -e "${GREEN}Health Check:${NC} http://temple-api.local/_health"
    echo ""
    
    print_info "Monitor logs with:"
    echo "  kubectl logs -f deployment/temple-api -n $NAMESPACE"
    echo "  kubectl logs -f deployment/temple-ui -n $NAMESPACE"
    echo ""
    
    print_info "Or use Makefile commands:"
    echo "  make logs-api"
    echo "  make logs-ui"
    echo "  make status"
    echo ""
}

# Function to show help
show_help() {
    cat << EOF
Temple Stack Deployment Script

Usage: $0 [ENVIRONMENT] [OPTIONS]

Environments:
  dev         Deploy with development configuration (default)
  prod        Deploy with production configuration
  custom      Use custom values file

Options:
  --skip-deps     Skip dependency update
  --skip-lint     Skip chart validation
  --dry-run       Show what would be deployed without actually deploying
  --help          Show this help message

Examples:
  $0                    # Deploy with dev environment
  $0 prod              # Deploy with prod environment
  $0 --dry-run         # Preview deployment
  
EOF
}

# Main execution
main() {
    # Parse arguments
    SKIP_DEPS=false
    SKIP_LINT=false
    DRY_RUN=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-deps)
                SKIP_DEPS=true
                shift
                ;;
            --skip-lint)
                SKIP_LINT=true
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                ENVIRONMENT=$1
                shift
                ;;
        esac
    done
    
    print_header "Temple Stack Deployment"
    print_info "Environment: $ENVIRONMENT"
    print_info "Release: $RELEASE_NAME"
    print_info "Namespace: $NAMESPACE"
    echo ""
    
    # Run deployment steps
    check_prerequisites
    
    if [ "$SKIP_DEPS" = false ]; then
        update_dependencies
    fi
    
    if [ "$SKIP_LINT" = false ]; then
        validate_chart
    fi
    
    if [ "$DRY_RUN" = true ]; then
        print_info "Dry run - showing what would be deployed:"
        helm template "$RELEASE_NAME" "$CHART_DIR" \
            -f "values-${ENVIRONMENT}.yaml" \
            --namespace "$NAMESPACE"
        exit 0
    fi
    
    create_namespace
    deploy
    show_status
    update_hosts
    show_access_info
    
    print_header "Deployment Complete! 🎉"
}

# Run main function
main "$@"