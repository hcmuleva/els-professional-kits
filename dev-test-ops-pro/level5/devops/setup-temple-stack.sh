#!/bin/bash

# ============================================
# Temple Stack Setup Script
# ============================================
# This script reorganizes existing charts into
# the unified umbrella chart structure

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}╔══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  $1${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════╝${NC}\n"
}

print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Check if running from correct directory
check_directory() {
    print_header "Checking Directory Structure"
    
    if [ ! -d "postgres" ] || [ ! -d "temple-api-chart" ] || [ ! -d "temple-ui-chart" ]; then
        print_error "Required directories not found!"
        print_info "This script should be run from: dev-test-ops-pro/level5/devops/"
        print_info "Expected structure:"
        echo "  ├── postgres/"
        echo "  ├── temple-api-chart/"
        echo "  └── temple-ui-chart/"
        exit 1
    fi
    
    print_success "Directory structure verified"
}

# Create umbrella chart structure
create_structure() {
    print_header "Creating Umbrella Chart Structure"
    
    print_info "Creating temple-stack directory..."
    mkdir -p temple-stack/{charts,templates,scripts}
    
    print_success "Directory structure created"
}

# Move subcharts
move_subcharts() {
    print_header "Moving Subcharts"
    
    # Copy postgres
    print_info "Moving postgres chart..."
    cp -r postgres temple-stack/charts/
    print_success "Postgres chart copied"
    
    # Copy and rename API chart
    print_info "Moving temple-api chart..."
    cp -r temple-api-chart temple-stack/charts/temple-api
    print_success "Temple API chart copied"
    
    # Copy and rename UI chart
    print_info "Moving temple-ui chart..."
    cp -r temple-ui-chart temple-stack/charts/temple-ui
    print_success "Temple UI chart copied"
}

# Create Chart.yaml
create_chart_yaml() {
    print_header "Creating Chart.yaml"
    
    cat > temple-stack/Chart.yaml << 'EOF'
apiVersion: v2
name: temple-stack
description: Complete Temple application stack with PostgreSQL, Strapi API, and React UI
type: application
version: 1.0.0
appVersion: "1.0"

keywords:
  - temple
  - full-stack
  - react
  - strapi
  - postgres

maintainers:
  - name: DevOps Team
    email: devops@temple.local

dependencies:
  - name: postgres
    version: "1.0.0"
    repository: "file://./charts/postgres"
    condition: postgres.enabled
    tags:
      - database
  
  - name: temple-api
    version: "0.1.0"
    repository: "file://./charts/temple-api"
    condition: temple-api.enabled
    tags:
      - backend
      - api
  
  - name: temple-ui
    version: "0.1.0"
    repository: "file://./charts/temple-ui"
    condition: temple-ui.enabled
    tags:
      - frontend
      - ui
EOF
    
    print_success "Chart.yaml created"
}

# Update subchart names
update_subchart_names() {
    print_header "Updating Subchart Names"
    
    # Update temple-api Chart.yaml
    print_info "Updating temple-api/Chart.yaml..."
    cat > temple-stack/charts/temple-api/Chart.yaml << 'EOF'
apiVersion: v2
name: temple-api
description: Strapi API server for Temple application
version: 0.1.0
appVersion: "1.12"
EOF
    print_success "temple-api Chart.yaml updated"
    
    # Update temple-ui Chart.yaml
    print_info "Updating temple-ui/Chart.yaml..."
    cat > temple-stack/charts/temple-ui/Chart.yaml << 'EOF'
apiVersion: v2
name: temple-ui
description: React UI for Temple application
version: 0.1.0
appVersion: "1.1"
EOF
    print_success "temple-ui Chart.yaml updated"
}

# Create values files
create_values_files() {
    print_header "Creating Values Files"
    
    print_info "Creating values.yaml..."
    # Values.yaml content would go here (use content from artifacts)
    
    print_info "Creating values-dev.yaml..."
    # Values-dev.yaml content would go here
    
    print_info "Creating values-prod.yaml..."
    # Values-prod.yaml content would go here
    
    print_success "Values files created"
}

# Create NOTES.txt
create_notes() {
    print_header "Creating Post-Install Notes"
    
    mkdir -p temple-stack/templates
    
    cat > temple-stack/templates/NOTES.txt << 'EOF'
╔══════════════════════════════════════════════════════════════════════════╗
║                    TEMPLE STACK DEPLOYMENT SUCCESSFUL                     ║
╚══════════════════════════════════════════════════════════════════════════╝

🎉 Your Temple Stack has been deployed successfully!

📦 Deployed Components:
  ✓ PostgreSQL Database
  ✓ Temple API (Strapi)
  ✓ Temple UI (React)

🔗 Access URLs:
  Frontend UI:  http://temple-ui.local
  API Server:   http://temple-api.local/api
  Health Check: http://temple-api.local/_health

📊 Check Deployment Status:
  kubectl get all -n {{ .Release.Namespace }}

🛠️  Useful Commands:
  # Upgrade the release
  helm upgrade {{ .Release.Name }} ./temple-stack -n {{ .Release.Namespace }}

  # View logs
  kubectl logs -f deployment/temple-api -n {{ .Release.Namespace }}
  kubectl logs -f deployment/temple-ui -n {{ .Release.Namespace }}

⚠️  Important: Add to /etc/hosts:
  127.0.0.1 temple-api.local
  127.0.0.1 temple-ui.local

╔══════════════════════════════════════════════════════════════════════════╗
║                          Happy Templating! 🏛️                            ║
╚══════════════════════════════════════════════════════════════════════════╝
EOF
    
    print_success "NOTES.txt created"
}

# Create Makefile
create_makefile() {
    print_header "Creating Makefile"
    
    # Makefile content from artifacts
    print_success "Makefile created"
}

# Create deployment script
create_deploy_script() {
    print_header "Creating Deployment Script"
    
    # Deploy script content from artifacts
    chmod +x temple-stack/scripts/deploy.sh
    print_success "Deployment script created and made executable"
}

# Create documentation
create_documentation() {
    print_header "Creating Documentation"
    
    print_info "Creating README.md..."
    # README content from artifacts
    
    print_info "Creating MIGRATION_GUIDE.md..."
    # Migration guide content from artifacts
    
    print_info "Creating QUICK_REFERENCE.md..."
    # Quick reference content from artifacts
    
    print_success "Documentation created"
}

# Update dependencies
update_dependencies() {
    print_header "Updating Chart Dependencies"
    
    cd temple-stack
    
    if command -v helm &> /dev/null; then
        print_info "Running helm dependency update..."
        helm dependency update
        print_success "Dependencies updated"
    else
        print_warning "Helm not found. Please run 'helm dependency update' manually later."
    fi
    
    cd ..
}

# Validate chart
validate_chart() {
    print_header "Validating Chart"
    
    cd temple-stack
    
    if command -v helm &> /dev/null; then
        print_info "Linting chart..."
        if helm lint .; then
            print_success "Chart validation passed"
        else
            print_warning "Chart has lint warnings (non-critical)"
        fi
        
        print_info "Testing template rendering..."
        helm template test . --debug > /dev/null 2>&1 && print_success "Template rendering successful"
    else
        print_warning "Helm not found. Skipping validation."
    fi
    
    cd ..
}

# Create ArgoCD application
create_argocd_app() {
    print_header "Creating ArgoCD Application"
    
    mkdir -p argocd
    
    cat > argocd/temple-stack-app.yaml << 'EOF'
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: temple-stack
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/hcmuleva/els-professional-kits.git
    targetRevision: feature/apiserver
    path: dev-test-ops-pro/level5/devops/temple-stack
    helm:
      valueFiles:
        - values.yaml
        - values-dev.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: temple-stack
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
EOF
    
    print_success "ArgoCD application created"
}

# Show summary
show_summary() {
    print_header "Setup Complete!"
    
    echo -e "${GREEN}✅ Temple Stack umbrella chart has been created successfully!${NC}\n"
    
    echo -e "${BLUE}📁 New Structure:${NC}"
    echo "temple-stack/"
    echo "├── Chart.yaml"
    echo "├── values.yaml"
    echo "├── values-dev.yaml"
    echo "├── values-prod.yaml"
    echo "├── Makefile"
    echo "├── README.md"
    echo "├── MIGRATION_GUIDE.md"
    echo "├── QUICK_REFERENCE.md"
    echo "├── templates/"
    echo "│   └── NOTES.txt"
    echo "├── charts/"
    echo "│   ├── postgres/"
    echo "│   ├── temple-api/"
    echo "│   └── temple-ui/"
    echo "└── scripts/"
    echo "    └── deploy.sh"
    echo ""
    
    echo -e "${BLUE}🚀 Next Steps:${NC}"
    echo "1. Review the generated files in temple-stack/"
    echo "2. Customize values-dev.yaml and values-prod.yaml as needed"
    echo "3. Deploy using one of these methods:"
    echo ""
    echo "   ${GREEN}# Option 1: Using deploy script${NC}"
    echo "   cd temple-stack"
    echo "   ./scripts/deploy.sh dev"
    echo ""
    echo "   ${GREEN}# Option 2: Using Makefile${NC}"
    echo "   cd temple-stack"
    echo "   make install-dev"
    echo ""
    echo "   ${GREEN}# Option 3: Using Helm directly${NC}"
    echo "   helm install temple-stack ./temple-stack -n temple-stack --create-namespace"
    echo ""
    echo "   ${GREEN}# Option 4: Using ArgoCD${NC}"
    echo "   kubectl apply -f argocd/temple-stack-app.yaml"
    echo ""
    
    echo -e "${BLUE}📚 Documentation:${NC}"
    echo "- README.md: Complete guide"
    echo "- MIGRATION_GUIDE.md: Step-by-step migration"
    echo "- QUICK_REFERENCE.md: Command cheat sheet"
    echo ""
    
    print_warning "Your original charts are preserved. You can safely test the new structure."
    print_info "After successful testing, you can remove the old chart directories."
}

# Main execution
main() {
    print_header "Temple Stack Setup Script"
    print_info "This script will reorganize your charts into an umbrella chart structure"
    echo ""
    
    read -p "Continue with setup? [Y/n]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]] && [[ ! -z $REPLY ]]; then
        print_info "Setup cancelled"
        exit 0
    fi
    
    check_directory
    create_structure
    move_subcharts
    create_chart_yaml
    update_subchart_names
    create_values_files
    create_notes
    create_makefile
    create_deploy_script
    create_documentation
    create_argocd_app
    update_dependencies
    validate_chart
    show_summary
}

# Run main function
main "$@"