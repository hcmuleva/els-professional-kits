# Migration Guide - Reorganizing to Umbrella Chart

This guide will help you reorganize your existing charts into the unified temple-stack structure.

## 📋 Current Structure

```
dev-test-ops-pro/level5/devops/
├── postgres/
├── temple-api-chart/
├── temple-ui-chart/
└── argo-temple-api.yaml
```

## 🎯 Target Structure

```
dev-test-ops-pro/level5/devops/
└── temple-stack/
    ├── Chart.yaml
    ├── values.yaml
    ├── values-dev.yaml
    ├── values-prod.yaml
    ├── templates/
    │   └── NOTES.txt
    └── charts/
        ├── postgres/
        ├── temple-api/
        └── temple-ui/
```

## 🔧 Step-by-Step Migration

### Step 1: Create Umbrella Chart Directory

```bash
cd dev-test-ops-pro/level5/devops/
mkdir -p temple-stack/charts
mkdir -p temple-stack/templates
cd temple-stack
```

### Step 2: Move and Rename Subcharts

```bash
# Move postgres (keep as-is)
mv ../postgres ./charts/

# Move and rename API chart
mv ../temple-api-chart ./charts/temple-api

# Move and rename UI chart
mv ../temple-ui-chart ./charts/temple-ui
```

### Step 3: Create Umbrella Chart.yaml

```bash
cat > Chart.yaml << 'EOF'
apiVersion: v2
name: temple-stack
description: Complete Temple application stack with PostgreSQL, Strapi API, and React UI
type: application
version: 1.0.0
appVersion: "1.0"

dependencies:
  - name: postgres
    version: "1.0.0"
    repository: "file://./charts/postgres"
    condition: postgres.enabled
  
  - name: temple-api
    version: "0.1.0"
    repository: "file://./charts/temple-api"
    condition: temple-api.enabled
  
  - name: temple-ui
    version: "0.1.0"
    repository: "file://./charts/temple-ui"
    condition: temple-ui.enabled
EOF
```

### Step 4: Update Subchart Names

#### Update temple-api/Chart.yaml

```bash
cat > charts/temple-api/Chart.yaml << 'EOF'
apiVersion: v2
name: temple-api
description: Strapi API server for Temple application
version: 0.1.0
appVersion: "1.12"
EOF
```

#### Update temple-ui/Chart.yaml

```bash
cat > charts/temple-ui/Chart.yaml << 'EOF'
apiVersion: v2
name: temple-ui
description: React UI for Temple application
version: 0.1.0
appVersion: "1.1"
EOF
```

### Step 5: Create Unified values.yaml

```bash
cat > values.yaml << 'EOF'
# Global settings
global:
  imagePullPolicy: IfNotPresent
  namespace: temple-stack
  domain: temple.local
  
  database:
    host: postgres-postgres.database.svc.cluster.local
    port: 5432
    name: temple
    username: postgres
    password: postgres

# PostgreSQL Configuration
postgres:
  enabled: true
  image:
    repository: postgres
    tag: "15"
    pullPolicy: IfNotPresent
  auth:
    username: postgres
    password: postgres
    database: temple
  service:
    type: ClusterIP
    port: 5432
  persistence:
    enabled: true
    accessModes: ["ReadWriteOnce"]
    size: 2Gi
    storageClassName: "hostpath"
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi

# Temple API Configuration
temple-api:
  enabled: true
  apiserver:
    enabled: true
    name: temple-api
    image: harishdell/templeserver:1.12
    imagePullPolicy: IfNotPresent
    containerPort: 1337
    servicePort: 1337
    env:
      HOST: "0.0.0.0"
      PORT: "1337"
      DATABASE_CLIENT: "postgres"
      DATABASE_HOST: "postgres-postgres.database.svc.cluster.local"
      DATABASE_PORT: "5432"
      DATABASE_NAME: "temple"
      DATABASE_USERNAME: "postgres"
      DATABASE_PASSWORD: "postgres"
      CENTRALIZED_SERVER: "http://temple-api.local"
  ingress:
    enabled: true
    host: "temple-api.local"
    className: nginx
    annotations:
      nginx.ingress.kubernetes.io/backend-protocol: "HTTP"
      nginx.ingress.kubernetes.io/rewrite-target: /

# Temple UI Configuration
temple-ui:
  enabled: true
  replicaCount: 1
  templeui:
    name: temple-ui
    image: temple-ui
    tag: "1.1"
    containerPort: 80
    servicePort: 80
    env:
      REACT_APP_ABLY_API_KEY: "xul13A.CNpeww:KkS0rh8M4rJSr5r4gHNGbMijYuxvr90ybz1UQd6uKpw"
      REACT_APP_MAXPAGE: "3"
      REACT_APP_KRUTRIM_API_KEY: "5MG974Dkz5xHQ70hLzyLZQzMO57B5P9Pos1MOYe3"
      REACT_APP_GOOGLE_API_KEY: "AIzaSyDNN9LVrNB_WOGhrHG0U1CYsTWIOuaaoI8"
      REACT_APP_PINCODE: "https://emeelan.com/alumniserver/api"
      REACT_APP_API_URL: "http://temple-api.local/api"
  ingress:
    enabled: true
    name: temple-ui-ingress
    className: nginx
    annotations:
      nginx.ingress.kubernetes.io/rewrite-target: /
    paths:
      - path: /
        pathType: Prefix
        service: temple-ui-service
        port: 80
EOF
```

### Step 6: Create Environment Files

```bash
# Development environment
cat > values-dev.yaml << 'EOF'
global:
  imagePullPolicy: Never
  domain: temple.local

postgres:
  persistence:
    size: 1Gi

temple-api:
  apiserver:
    replicaCount: 1

temple-ui:
  replicaCount: 1
  templeui:
    tag: "latest"
EOF

# Production environment  
cat > values-prod.yaml << 'EOF'
global:
  imagePullPolicy: IfNotPresent
  domain: temple.com

postgres:
  persistence:
    size: 10Gi
    storageClassName: "ssd"
  resources:
    requests:
      cpu: 500m
      memory: 1Gi

temple-api:
  apiserver:
    replicaCount: 3

temple-ui:
  replicaCount: 3
EOF
```

### Step 7: Create NOTES.txt Template

Copy the NOTES.txt content from the artifacts provided earlier.

### Step 8: Update Dependencies

```bash
cd temple-stack
helm dependency update
```

### Step 9: Validate the Chart

```bash
# Lint the chart
helm lint .

# Test template rendering
helm template test-release . --debug

# Dry run install
helm install test-release . --dry-run --debug
```

### Step 10: Update ArgoCD Application

```bash
cat > ../argocd/temple-stack-app.yaml << 'EOF'
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
```

### Step 11: Create Deployment Scripts

```bash
# Copy Makefile
# Copy deploy.sh to scripts/

chmod +x scripts/deploy.sh
```

### Step 12: Test Deployment

```bash
# Test with development environment
./scripts/deploy.sh dev

# OR using Makefile
make install-dev

# Check status
make status

# View logs
make logs-api
make logs-ui
```

## ✅ Verification Checklist

After migration, verify:

- [ ] All three subcharts are in `charts/` directory
- [ ] Dependencies are listed in `Chart.yaml`
- [ ] `helm dependency update` runs successfully
- [ ] `helm lint` passes without errors
- [ ] Templates render correctly (`helm template`)
- [ ] Dry-run install works
- [ ] Actual deployment succeeds
- [ ] All pods are running
- [ ] Services are accessible via ingress
- [ ] Database connection works
- [ ] API health check passes
- [ ] UI loads correctly

## 🔄 Deployment Comparison

### Before (Separate Charts)

```bash
# Install PostgreSQL
helm install postgres ./postgres -n database --create-namespace

# Install API (wait for postgres)
helm install temple-api ./temple-api-chart -n strapi --create-namespace

# Install UI (wait for API)
helm install temple-ui ./temple-ui-chart -n frontend --create-namespace
```

### After (Umbrella Chart)

```bash
# Install everything
helm install temple-stack ./temple-stack -n temple-stack --create-namespace

# OR
make install-dev

# OR
./scripts/deploy.sh dev
```

## 🎯 Benefits of New Structure

1. **Single Command Deployment**: One command installs all components
2. **