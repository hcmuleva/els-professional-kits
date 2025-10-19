#!/bin/bash

# ============================================
# Istio Monitoring Setup Script
# Properly configures Kiali, Jaeger, Grafana, Prometheus
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

print_header "Istio Monitoring Setup"

# Check if Istio is installed
if ! kubectl get namespace istio-system &> /dev/null; then
    print_error "Istio is not installed"
    print_info "Please install Istio first with: istioctl install --set profile=demo -y"
    exit 1
fi

print_success "Istio is installed"

# Step 1: Install monitoring addons
print_header "Step 1: Installing Monitoring Addons"

print_info "Downloading Istio monitoring addons..."

ISTIO_VERSION="1.20.0"
SAMPLES_URL="https://raw.githubusercontent.com/istio/istio/${ISTIO_VERSION}/samples/addons"

# Create temp directory
mkdir -p /tmp/istio-addons
cd /tmp/istio-addons

# Download addons
for addon in kiali jaeger prometheus grafana; do
    print_info "Downloading ${addon}..."
    curl -sL "${SAMPLES_URL}/${addon}.yaml" -o "${addon}.yaml"
done

print_info "Applying monitoring addons..."
kubectl apply -f prometheus.yaml
kubectl apply -f grafana.yaml
kubectl apply -f jaeger.yaml
kubectl apply -f kiali.yaml

print_success "Monitoring addons applied"

# Step 2: Wait for deployments
print_header "Step 2: Waiting for Deployments"

print_info "Waiting for Prometheus..."
kubectl rollout status deployment/prometheus -n istio-system --timeout=5m

print_info "Waiting for Grafana..."
kubectl rollout status deployment/grafana -n istio-system --timeout=5m

print_info "Waiting for Jaeger..."
kubectl rollout status deployment/jaeger -n istio-system --timeout=5m

print_info "Waiting for Kiali..."
kubectl rollout status deployment/kiali -n istio-system --timeout=5m

print_success "All monitoring tools are ready"

# Step 3: Create proper ingresses
print_header "Step 3: Creating Ingress Rules"

cat > /tmp/istio-monitoring-ingress.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: kiali-ingress
  namespace: istio-system
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: kiali.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: kiali
            port:
              number: 20001
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: jaeger-ingress
  namespace: istio-system
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: jaeger.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: tracing
            port:
              number: 80
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: grafana-ingress
  namespace: istio-system
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: grafana.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: grafana
            port:
              number: 3000
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: prometheus-ingress
  namespace: istio-system
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: prometheus.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: prometheus
            port:
              number: 9090
EOF

kubectl apply -f /tmp/istio-monitoring-ingress.yaml

print_success "Ingress rules created"

# Step 4: Update /etc/hosts
print_header "Step 4: Updating /etc/hosts"

HOSTS_ENTRIES=(
    "kiali.local"
    "jaeger.local"
    "grafana.local"
    "prometheus.local"
)

print_info "Checking /etc/hosts entries..."

MISSING=()
for host in "${HOSTS_ENTRIES[@]}"; do
    if ! grep -q "$host" /etc/hosts; then
        MISSING+=("$host")
    fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
    print_warning "Missing /etc/hosts entries:"
    for host in "${MISSING[@]}"; do
        echo "  127.0.0.1 $host"
    done
    echo ""
    
    read -p "Add them now? (requires sudo) [y/N]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        for host in "${MISSING[@]}"; do
            echo "127.0.0.1 $host" | sudo tee -a /etc/hosts > /dev/null
        done
        print_success "/etc/hosts updated"
    else
        print_warning "Please add entries manually"
    fi
else
    print_success "All /etc/hosts entries present"
fi

# Step 5: Verify setup
print_header "Step 5: Verifying Setup"

echo "Checking services:"
kubectl get svc -n istio-system | grep -E "kiali|jaeger|grafana|prometheus|tracing"

echo ""
echo "Checking ingresses:"
kubectl get ingress -n istio-system

print_header "Setup Complete!"

echo -e "${GREEN}✅ Istio monitoring is configured${NC}"
echo ""
echo -e "${BLUE}Access URLs:${NC}"
echo "  Kiali:      http://kiali.local"
echo "  Jaeger:     http://jaeger.local"
echo "  Grafana:    http://grafana.local"
echo "  Prometheus: http://prometheus.local"
echo ""
echo -e "${BLUE}Your Application:${NC}"
echo "  UI:  http://temple-ui.local"
echo "  API: http://temple-api.local"
echo ""
echo -e "${YELLOW}Note:${NC} If monitoring tools don't load, try:"
echo "  kubectl port-forward svc/kiali -n istio-system 20001:20001"
echo "  Then access: http://localhost:20001"
echo ""

# Cleanup
cd -
rm -rf /tmp/istio-addons