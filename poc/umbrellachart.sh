#!/bin/bash

# Script to create umbrella chart for Postgres + Pact Broker
# Usage: ./create-pact-umbrella-chart.sh [base-directory]

set -e

BASE_DIR="${1:-.}"

echo "Creating Pact Broker umbrella chart structure in: $BASE_DIR"

# ============================================
# 1. Create umbrella chart directory
# ============================================
echo "Creating pact-stack umbrella chart..."
mkdir -p "$BASE_DIR/pact-stack/charts"
mkdir -p "$BASE_DIR/pact-stack/templates"

# ============================================
# 2. Create Chart.yaml for umbrella
# ============================================
cat > "$BASE_DIR/pact-stack/Chart.yaml" << 'EOF'
apiVersion: v2
name: pact-stack
description: Umbrella chart for Pact Broker with Postgres database
type: application
version: 0.1.0
appVersion: "1.0"

dependencies:
  - name: postgres
    version: 0.1.0
    repository: "file://../postgres"
    condition: postgres.enabled
  - name: fabric-pact-broker
    version: 0.1.0
    repository: "file://../fabric-pact-broker"
    condition: fabric-pact-broker.enabled
EOF

# ============================================
# 3. Create values.yaml for umbrella
# ============================================
cat > "$BASE_DIR/pact-stack/values.yaml" << 'EOF'
# ===========================================
# Pact Stack - Umbrella Chart Values
# ===========================================

# Global settings
global:
  namespace: pact-system
  storageClass: hostpath

# ===========================================
# Postgres Configuration (Subchart)
# ===========================================
postgres:
  enabled: true
  
  image:
    repository: postgres
    tag: "15"
    pullPolicy: IfNotPresent
  
  auth:
    username: pact_broker
    password: pact_broker_password
    database: pact_broker
    useSecret: true
  
  service:
    type: ClusterIP
    port: 5432
  
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi
  
  persistence:
    enabled: true
    size: 5Gi
    storageClassName: "hostpath"
    mountPath: /var/lib/postgresql/data
  
  healthChecks:
    enabled: true
    readiness:
      initialDelaySeconds: 10
      periodSeconds: 5
    liveness:
      initialDelaySeconds: 30
      periodSeconds: 10
  
  # Disable security context for Docker Desktop
  securityContext:
    enabled: false
  
  initContainers: []

# ===========================================
# Pact Broker Configuration (Subchart)
# ===========================================
fabric-pact-broker:
  enabled: true
  
  replicaCount: 1
  
  image:
    repository: pactfoundation/pact-broker
    tag: "2.110.0"
    pullPolicy: IfNotPresent
  
  service:
    type: ClusterIP
    port: 9292
  
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 200m
      memory: 256Mi
  
  # Database connection - references postgres subchart
  database:
    host: postgres-service
    name: pact_broker
    username: pact_broker
    password: pact_broker_password
  
  ingress:
    enabled: true
    className: nginx
    host: pact-broker.local
EOF

# ============================================
# 4. Create values-dev.yaml
# ============================================
cat > "$BASE_DIR/pact-stack/values-dev.yaml" << 'EOF'
# Development Environment Overrides

global:
  namespace: pact-dev

postgres:
  auth:
    password: dev123
  
  persistence:
    size: 2Gi
  
  resources:
    requests:
      cpu: 50m
      memory: 128Mi
    limits:
      cpu: 200m
      memory: 256Mi

fabric-pact-broker:
  replicaCount: 1
  
  image:
    tag: "latest"
    pullPolicy: Always
  
  database:
    password: dev123
  
  ingress:
    host: pact-broker-dev.local
  
  resources:
    requests:
      cpu: 50m
      memory: 64Mi
    limits:
      cpu: 100m
      memory: 128Mi
EOF

# ============================================
# 5. Create values-prod.yaml
# ============================================
cat > "$BASE_DIR/pact-stack/values-prod.yaml" << 'EOF'
# Production Environment Overrides

global:
  namespace: pact-prod

postgres:
  auth:
    password: <CHANGE_ME_PROD_PASSWORD>
  
  persistence:
    size: 20Gi
    storageClassName: "gp3"  # Use appropriate storage class for production
  
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 2000m
      memory: 4Gi
  
  # Enable security context in production
  securityContext:
    enabled: true
    fsGroup: 999
    runAsUser: 999
    runAsNonRoot: true

fabric-pact-broker:
  replicaCount: 3
  
  image:
    tag: "2.110.0"
    pullPolicy: IfNotPresent
  
  database:
    password: <CHANGE_ME_PROD_PASSWORD>
  
  ingress:
    enabled: true
    host: pact-broker.example.com
    annotations:
      cert-manager.io/cluster-issuer: letsencrypt-prod
    tls:
      - secretName: pact-broker-tls
        hosts:
          - pact-broker.example.com
  
  resources:
    requests:
      cpu: 200m
      memory: 256Mi
    limits:
      cpu: 1000m
      memory: 512Mi
EOF

# ============================================
# 6. Create namespace template (optional)
# ============================================
cat > "$BASE_DIR/pact-stack/templates/namespace.yaml" << 'EOF'
{{- if .Values.global.createNamespace }}
apiVersion: v1
kind: Namespace
metadata:
  name: {{ .Values.global.namespace }}
  labels:
    name: {{ .Values.global.namespace }}
    app.kubernetes.io/managed-by: Helm
{{- end }}
EOF

# ============================================
# 7. Create README
# ============================================
cat > "$BASE_DIR/pact-stack/README.md" << 'EOF'
# Pact Stack - Umbrella Chart

Umbrella Helm chart that deploys Pact Broker with Postgres database as subcharts.

## Architecture

```
pact-stack/
├── postgres (subchart)
│   └── PostgreSQL database
└── fabric-pact-broker (subchart)
    └── Pact Broker application
```

## Prerequisites

- Kubernetes cluster (or Docker Desktop)
- Helm 3.x
- kubectl configured

## Directory Structure

```
.
├── pact-stack/              # Umbrella chart
│   ├── Chart.yaml
│   ├── values.yaml          # Default values
│   ├── values-dev.yaml      # Dev overrides
│   ├── values-prod.yaml     # Prod overrides
│   └── charts/              # Subcharts (auto-populated)
├── postgres/                # Postgres subchart
└── fabric-pact-broker/      # Pact Broker subchart
```

## Installation

### Step 1: Update Chart Dependencies

```bash
cd pact-stack
helm dependency update
```

This will download/link the subcharts into `charts/` directory.

### Step 2: Deploy to Development

```bash
# Create namespace
kubectl create namespace pact-dev

# Install with dev values
helm install pact-stack . \
  -f values.yaml \
  -f values-dev.yaml \
  -n pact-dev

# Or using Helm 3.x namespace creation
helm install pact-stack . \
  -f values.yaml \
  -f values-dev.yaml \
  -n pact-dev \
  --create-namespace
```

### Step 3: Deploy to Production

```bash
# Update passwords in values-prod.yaml first!

# Create namespace
kubectl create namespace pact-prod

# Install with prod values
helm install pact-stack . \
  -f values.yaml \
  -f values-prod.yaml \
  -n pact-prod
```

## Verify Installation

```bash
# Check all pods
kubectl get pods -n pact-dev

# Expected output:
# NAME                                  READY   STATUS    RESTARTS   AGE
# postgres-0                            1/1     Running   0          2m
# pact-stack-fabric-pact-broker-xxx     1/1     Running   0          2m

# Check services
kubectl get svc -n pact-dev

# Check ingress
kubectl get ingress -n pact-dev
```

## Access Pact Broker

### Local (Docker Desktop)

```bash
# Add to /etc/hosts
echo "127.0.0.1 pact-broker-dev.local" | sudo tee -a /etc/hosts

# Port forward (if ingress not working)
kubectl port-forward -n pact-dev svc/pact-stack-fabric-pact-broker 9292:9292

# Access at:
# http://localhost:9292
# or
# http://pact-broker-dev.local (if ingress configured)
```

## Upgrade

```bash
# Update dependencies
helm dependency update

# Upgrade deployment
helm upgrade pact-stack . \
  -f values.yaml \
  -f values-dev.yaml \
  -n pact-dev
```

## Uninstall

```bash
# Uninstall release
helm uninstall pact-stack -n pact-dev

# Delete PVCs (if needed)
kubectl delete pvc -n pact-dev -l app.kubernetes.io/instance=pact-stack

# Delete namespace
kubectl delete namespace pact-dev
```

## Configuration

### Common Customizations

#### Change Postgres Password

```yaml
# In values-dev.yaml or values-prod.yaml
postgres:
  auth:
    password: your-secure-password

fabric-pact-broker:
  database:
    password: your-secure-password
```

#### Change Storage Size

```yaml
postgres:
  persistence:
    size: 10Gi
```

#### Change Resource Limits

```yaml
postgres:
  resources:
    limits:
      cpu: 1000m
      memory: 2Gi

fabric-pact-broker:
  resources:
    limits:
      cpu: 500m
      memory: 512Mi
```

#### Disable Components

```yaml
# Disable Postgres (use external database)
postgres:
  enabled: false

fabric-pact-broker:
  database:
    host: external-postgres.example.com
```

## Troubleshooting

### Postgres not starting

```bash
# Check logs
kubectl logs -n pact-dev postgres-0

# Check PVC
kubectl get pvc -n pact-dev

# Delete and recreate (data will be lost!)
helm uninstall pact-stack -n pact-dev
kubectl delete pvc -n pact-dev postgres-data-postgres-0
helm install pact-stack . -f values-dev.yaml -n pact-dev
```

### Pact Broker can't connect to database

```bash
# Check if postgres service is accessible
kubectl exec -n pact-dev deployment/pact-stack-fabric-pact-broker -- \
  nc -zv postgres-service 5432

# Check database credentials in secret
kubectl get secret -n pact-dev pact-stack-fabric-pact-broker-db-auth -o yaml

# Check Pact Broker logs
kubectl logs -n pact-dev deployment/pact-stack-fabric-pact-broker
```

### Ingress not working

```bash
# Check ingress
kubectl describe ingress -n pact-dev

# Ensure ingress controller is installed
kubectl get pods -n ingress-nginx

# Port forward as workaround
kubectl port-forward -n pact-dev svc/pact-stack-fabric-pact-broker 9292:9292
```

## Environment-Specific Deployments

### Development
- Single replica
- Smaller resources
- Latest image tags
- Small storage (2Gi)

### Production
- Multiple replicas (HA)
- Larger resources
- Pinned image versions
- Larger storage (20Gi)
- TLS enabled
- Secure passwords

## ArgoCD Integration

Create ArgoCD application:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: pact-stack-dev
  namespace: argocd
spec:
  project: default
  source:
    repoURL: <YOUR_GIT_REPO>
    targetRevision: HEAD
    path: pact-stack
    helm:
      valueFiles:
      - values.yaml
      - values-dev.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: pact-dev
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```

## Version Management

All components use the same umbrella chart version:

- **Chart Version**: 0.1.0
- **Postgres**: 15 (standard, not alpine)
- **Pact Broker**: 2.110.0

To update versions, modify `Chart.yaml` and subchart values.
EOF

# ============================================
# 8. Create .helmignore
# ============================================
cat > "$BASE_DIR/pact-stack/.helmignore" << 'EOF'
# Patterns to ignore when building packages
.git/
.gitignore
.DS_Store
*.md
combined_files.txt
.vscode/
EOF

echo ""
echo "✓ Pact Stack umbrella chart created successfully!"
echo ""
echo "Next steps:"
echo ""
echo "1. Update chart dependencies:"
echo "   cd $BASE_DIR/pact-stack"
echo "   helm dependency update"
echo ""
echo "2. Deploy to development:"
echo "   helm install pact-stack . -f values-dev.yaml -n pact-dev --create-namespace"
echo ""
echo "3. Verify deployment:"
echo "   kubectl get pods,svc,ingress -n pact-dev"
echo ""
echo "4. Access Pact Broker:"
echo "   kubectl port-forward -n pact-dev svc/pact-stack-fabric-pact-broker 9292:9292"
echo "   Open http://localhost:9292"
echo ""
