#!/bin/bash

# Helm Chart Validation Script for pact-stack
# This script performs comprehensive validation before deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CHART_PATH="."
RELEASE_NAME="pact-stack"
NAMESPACE="pact-stack"
VALUES_FILE="values.yaml"
ENV_VALUES_FILE="values-dev.yaml"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Helm Chart Validation for pact-stack${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to print step headers
print_step() {
    echo -e "\n${BLUE}[STEP $1]${NC} $2"
    echo "----------------------------------------"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to print error
print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Track overall status
ERRORS=0
WARNINGS=0

# ===========================================
# STEP 1: Check Prerequisites
# ===========================================
print_step "1" "Checking Prerequisites"

# Check Helm is installed
if command -v helm &> /dev/null; then
    HELM_VERSION=$(helm version --short)
    print_success "Helm is installed: $HELM_VERSION"
else
    print_error "Helm is not installed. Please install Helm 3.x"
    exit 1
fi

# Check kubectl is installed
if command -v kubectl &> /dev/null; then
    KUBECTL_VERSION=$(kubectl version --client --short 2>/dev/null || kubectl version --client)
    print_success "kubectl is installed"
else
    print_warning "kubectl is not installed. Skipping cluster connectivity checks"
fi

# Check kubeseal for sealed secrets validation
if command -v kubeseal &> /dev/null; then
    print_success "kubeseal is installed"
    KUBESEAL_INSTALLED=true
else
    print_warning "kubeseal is not installed. Skipping sealed secrets validation"
    KUBESEAL_INSTALLED=false
    ((WARNINGS++))
fi

# ===========================================
# STEP 2: Chart Structure Validation
# ===========================================
print_step "2" "Validating Chart Structure"

# Check main Chart.yaml exists
if [ -f "$CHART_PATH/Chart.yaml" ]; then
    print_success "Main Chart.yaml found"
else
    print_error "Main Chart.yaml not found"
    ((ERRORS++))
fi

# Check subchart directories
if [ -d "$CHART_PATH/charts/fabric-pact-broker" ]; then
    print_success "fabric-pact-broker subchart found"
else
    print_error "fabric-pact-broker subchart not found"
    ((ERRORS++))
fi

if [ -d "$CHART_PATH/charts/fabric-postgres" ]; then
    print_success "fabric-postgres subchart found"
else
    print_error "fabric-postgres subchart not found"
    ((ERRORS++))
fi

# Check values files
if [ -f "$CHART_PATH/$VALUES_FILE" ]; then
    print_success "Main values.yaml found"
else
    print_error "Main values.yaml not found"
    ((ERRORS++))
fi

# ===========================================
# STEP 3: Update Chart Dependencies
# ===========================================
print_step "3" "Updating Chart Dependencies"

if helm dependency update "$CHART_PATH" 2>&1; then
    print_success "Chart dependencies updated successfully"
else
    print_error "Failed to update chart dependencies"
    ((ERRORS++))
fi

# ===========================================
# STEP 4: Helm Lint - Main Chart
# ===========================================
print_step "4" "Running Helm Lint on Main Chart"

if helm lint "$CHART_PATH" --values "$CHART_PATH/$VALUES_FILE" 2>&1 | tee /tmp/helm-lint.log; then
    print_success "Main chart lint passed"
else
    print_error "Main chart lint failed"
    cat /tmp/helm-lint.log
    ((ERRORS++))
fi

# Lint with dev values
if [ -f "$CHART_PATH/$ENV_VALUES_FILE" ]; then
    print_step "4.1" "Running Helm Lint with Dev Values"
    if helm lint "$CHART_PATH" --values "$CHART_PATH/$VALUES_FILE" --values "$CHART_PATH/$ENV_VALUES_FILE" 2>&1; then
        print_success "Chart lint with dev values passed"
    else
        print_error "Chart lint with dev values failed"
        ((ERRORS++))
    fi
fi

# ===========================================
# STEP 5: Helm Lint - Subcharts
# ===========================================
print_step "5" "Running Helm Lint on Subcharts"

# Lint fabric-pact-broker
if helm lint "$CHART_PATH/charts/fabric-pact-broker" 2>&1; then
    print_success "fabric-pact-broker lint passed"
else
    print_error "fabric-pact-broker lint failed"
    ((ERRORS++))
fi

# Lint fabric-postgres
if helm lint "$CHART_PATH/charts/fabric-postgres" 2>&1; then
    print_success "fabric-postgres lint passed"
else
    print_error "fabric-postgres lint failed"
    ((ERRORS++))
fi

# ===========================================
# STEP 6: Template Rendering Test
# ===========================================
print_step "6" "Testing Template Rendering"

if helm template "$RELEASE_NAME" "$CHART_PATH" \
    --namespace "$NAMESPACE" \
    --values "$CHART_PATH/$VALUES_FILE" \
    --debug \
    > /tmp/helm-template-output.yaml 2>&1; then
    print_success "Templates rendered successfully"
    echo "Output saved to: /tmp/helm-template-output.yaml"
else
    print_error "Template rendering failed"
    cat /tmp/helm-template-output.yaml
    ((ERRORS++))
fi

# ===========================================
# STEP 7: YAML Syntax Validation
# ===========================================
print_step "7" "Validating YAML Syntax"

# Check if yq or yamllint is available
if command -v yamllint &> /dev/null; then
    if yamllint -d relaxed /tmp/helm-template-output.yaml 2>&1; then
        print_success "YAML syntax is valid"
    else
        print_warning "YAML syntax validation found issues"
        ((WARNINGS++))
    fi
elif command -v yq &> /dev/null; then
    if yq eval /tmp/helm-template-output.yaml > /dev/null 2>&1; then
        print_success "YAML syntax is valid"
    else
        print_error "YAML syntax validation failed"
        ((ERRORS++))
    fi
else
    print_warning "yamllint or yq not installed, skipping YAML validation"
    ((WARNINGS++))
fi

# ===========================================
# STEP 8: Kubernetes Schema Validation
# ===========================================
print_step "8" "Validating Kubernetes Schemas"

if command -v kubectl &> /dev/null; then
    # Validate with kubectl without applying
    if kubectl apply --dry-run=client -f /tmp/helm-template-output.yaml 2>&1 | tee /tmp/k8s-validation.log; then
        print_success "Kubernetes schema validation passed"
    else
        # Check if errors are critical
        if grep -q "error:" /tmp/k8s-validation.log; then
            print_error "Kubernetes schema validation failed"
            cat /tmp/k8s-validation.log
            ((ERRORS++))
        else
            print_warning "Kubernetes schema validation has warnings"
            ((WARNINGS++))
        fi
    fi
    
    # Try server-side dry run if connected to cluster
    if kubectl cluster-info &> /dev/null; then
        print_step "8.1" "Running Server-Side Dry Run"
        if kubectl apply --dry-run=server -f /tmp/helm-template-output.yaml 2>&1; then
            print_success "Server-side dry run passed"
        else
            print_warning "Server-side dry run failed (might be due to missing CRDs)"
            ((WARNINGS++))
        fi
    else
        print_warning "Not connected to Kubernetes cluster, skipping server-side validation"
        ((WARNINGS++))
    fi
else
    print_warning "kubectl not available, skipping Kubernetes validation"
    ((WARNINGS++))
fi

# ===========================================
# STEP 9: Sealed Secrets Validation
# ===========================================
print_step "9" "Validating Sealed Secrets"

if [ "$KUBESEAL_INSTALLED" = true ] && [ -f "$CHART_PATH/sealed-broker-auth.yaml" ]; then
    # Check sealed secret structure
    if kubectl apply --dry-run=client -f "$CHART_PATH/sealed-broker-auth.yaml" 2>&1; then
        print_success "Sealed secret structure is valid"
    else
        print_error "Sealed secret validation failed"
        ((ERRORS++))
    fi
    
    # Check namespace matches
    SEALED_NAMESPACE=$(yq eval '.metadata.namespace' "$CHART_PATH/sealed-broker-auth.yaml" 2>/dev/null || grep "namespace:" "$CHART_PATH/sealed-broker-auth.yaml" | head -1 | awk '{print $2}')
    if [ "$SEALED_NAMESPACE" = "$NAMESPACE" ]; then
        print_success "Sealed secret namespace matches deployment namespace"
    else
        print_error "Sealed secret namespace ($SEALED_NAMESPACE) does not match deployment namespace ($NAMESPACE)"
        ((ERRORS++))
    fi
else
    print_warning "Sealed secrets validation skipped"
    ((WARNINGS++))
fi

# ===========================================
# STEP 10: Values File Validation
# ===========================================
print_step "10" "Validating Values Configuration"

# Check for common misconfigurations
echo "Checking for common issues..."

# Check postgres password
PG_PASSWORD=$(yq eval '.postgres.auth.password' "$CHART_PATH/$VALUES_FILE" 2>/dev/null || echo "")
if [ "$PG_PASSWORD" = "CHANGE_ME_IN_OVERLAY" ] || [ "$PG_PASSWORD" = "dev123" ]; then
    print_warning "Using default/placeholder postgres password. Change for production!"
    ((WARNINGS++))
else
    print_success "Postgres password is customized"
fi

# Check broker auth
BROKER_PASSWORD=$(yq eval '.fabric-pact-broker.basicAuth.password' "$CHART_PATH/$VALUES_FILE" 2>/dev/null || echo "")
if [ "$BROKER_PASSWORD" = "CHANGE_ME_IN_OVERLAY" ] || [ "$BROKER_PASSWORD" = "admin123" ]; then
    print_warning "Using default/placeholder broker password. Change for production!"
    ((WARNINGS++))
else
    print_success "Broker auth password is customized"
fi

# Check storage class
STORAGE_CLASS=$(yq eval '.global.storageClass' "$CHART_PATH/$VALUES_FILE" 2>/dev/null || echo "")
if [ "$STORAGE_CLASS" = "hostpath" ]; then
    print_warning "Using 'hostpath' storage class. Not recommended for production!"
    ((WARNINGS++))
else
    print_success "Storage class configured: $STORAGE_CLASS"
fi

# Check namespace creation
CREATE_NS=$(yq eval '.global.createNamespace' "$CHART_PATH/$VALUES_FILE" 2>/dev/null || echo "false")
print_success "Namespace creation is set to: $CREATE_NS"

# ===========================================
# STEP 11: Dependency Check
# ===========================================
print_step "11" "Checking Chart Dependencies"

if helm dependency list "$CHART_PATH" 2>&1; then
    print_success "Chart dependencies listed successfully"
else
    print_warning "Could not list chart dependencies"
    ((WARNINGS++))
fi

# ===========================================
# STEP 12: Resource Validation
# ===========================================
print_step "12" "Validating Resource Definitions"

# Count resources
TOTAL_RESOURCES=$(grep -c "^kind:" /tmp/helm-template-output.yaml || echo 0)
print_success "Total Kubernetes resources: $TOTAL_RESOURCES"

# List resource types
echo "Resource types:"
grep "^kind:" /tmp/helm-template-output.yaml | sort | uniq -c

# Check for required resources
REQUIRED_RESOURCES=("Deployment" "Service" "StatefulSet" "Secret")
for resource in "${REQUIRED_RESOURCES[@]}"; do
    if grep -q "^kind: $resource" /tmp/helm-template-output.yaml; then
        print_success "$resource found"
    else
        print_warning "$resource not found"
        ((WARNINGS++))
    fi
done

# ===========================================
# STEP 13: Security Validation
# ===========================================
print_step "13" "Security Validation"

# Check for hardcoded passwords in templates (should use secrets)
echo "Checking for hardcoded sensitive data..."
if grep -r "password:" "$CHART_PATH/charts/*/templates/" 2>/dev/null | grep -v "secretKeyRef" | grep -v "existingSecret"; then
    print_warning "Found potential hardcoded passwords in templates"
    ((WARNINGS++))
else
    print_success "No hardcoded passwords found in templates"
fi

# Check security contexts
if grep -q "securityContext:" /tmp/helm-template-output.yaml; then
    print_success "Security contexts are defined"
else
    print_warning "No security contexts found"
    ((WARNINGS++))
fi

# ===========================================
# STEP 14: Network Policy Check
# ===========================================
print_step "14" "Checking Network Policies"

if grep -q "kind: NetworkPolicy" /tmp/helm-template-output.yaml; then
    print_success "Network policies are defined"
else
    print_warning "No network policies found (recommended for production)"
    ((WARNINGS++))
fi

# ===========================================
# STEP 15: Generate Deployment Plan
# ===========================================
print_step "15" "Generating Deployment Plan"

cat > /tmp/deployment-plan.txt <<EOF
===========================================
DEPLOYMENT PLAN FOR: $RELEASE_NAME
===========================================

Chart: $CHART_PATH
Release Name: $RELEASE_NAME
Namespace: $NAMESPACE
Values File: $VALUES_FILE

DEPLOYMENT COMMANDS:
===========================================

1. Create namespace (if not exists):
   kubectl create namespace $NAMESPACE

2. Apply sealed secrets (if using):
   kubectl apply -f sealed-broker-auth.yaml -n $NAMESPACE
   # Wait for sealed-secrets controller to unseal
   kubectl wait --for=condition=Ready secret/pact-stack-db-auth -n $NAMESPACE --timeout=60s

3. Install/Upgrade with Helm:
   helm upgrade --install $RELEASE_NAME $CHART_PATH \\
     --namespace $NAMESPACE \\
     --values $VALUES_FILE \\
     --values $ENV_VALUES_FILE \\
     --create-namespace \\
     --timeout 10m \\
     --wait

4. Verify deployment:
   kubectl get all -n $NAMESPACE
   helm status $RELEASE_NAME -n $NAMESPACE
   
5. Test connectivity:
   kubectl run -it --rm debug --image=postgres:15 --restart=Never -n $NAMESPACE -- \\
     psql -h pact-stack-postgres -U postgres -d pactbroker

6. Access Pact Broker:
   kubectl port-forward -n $NAMESPACE svc/pact-stack-fabric-pact-broker 9292:9292
   # Then visit: http://localhost:9292

ROLLBACK COMMAND (if needed):
===========================================
helm rollback $RELEASE_NAME -n $NAMESPACE

UNINSTALL COMMAND:
===========================================
helm uninstall $RELEASE_NAME -n $NAMESPACE
kubectl delete pvc --all -n $NAMESPACE  # Delete persistent data

EOF

cat /tmp/deployment-plan.txt
print_success "Deployment plan saved to: /tmp/deployment-plan.txt"

# ===========================================
# FINAL REPORT
# ===========================================
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}VALIDATION SUMMARY${NC}"
echo -e "${BLUE}========================================${NC}"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ ALL CHECKS PASSED!${NC}"
    echo -e "${GREEN}The chart is ready for deployment.${NC}\n"
    echo "Next steps:"
    echo "1. Review the deployment plan: cat /tmp/deployment-plan.txt"
    echo "2. Deploy with: helm upgrade --install $RELEASE_NAME $CHART_PATH -n $NAMESPACE --values $VALUES_FILE --create-namespace"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ VALIDATION PASSED WITH $WARNINGS WARNING(S)${NC}"
    echo -e "${YELLOW}Review warnings above before deploying to production.${NC}\n"
    echo "The chart can be deployed, but address warnings for production use."
    exit 0
else
    echo -e "${RED}✗ VALIDATION FAILED${NC}"
    echo -e "${RED}Found $ERRORS error(s) and $WARNINGS warning(s)${NC}\n"
    echo "Please fix the errors above before deploying."
    exit 1
fi
