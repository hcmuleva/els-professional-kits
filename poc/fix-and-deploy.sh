#!/bin/bash
# Quick fix and deploy script for pact-suite umbrella chart

set -e

CHART_DIR="pact-stack"
NAMESPACE="pact-suite"

echo "🔧 Fixing Pact Suite Umbrella Chart..."
echo "======================================="
echo ""

# Step 1: Backup existing values
echo "1️⃣ Creating backup..."
if [ -f "${CHART_DIR}/values.yaml" ]; then
    cp "${CHART_DIR}/values.yaml" "${CHART_DIR}/values.yaml.backup.$(date +%Y%m%d_%H%M%S)"
    echo "   ✅ Backup created"
fi

# Step 2: Create fixed values.yaml
echo ""
echo "2️⃣ Creating fixed values.yaml..."
cat > "${CHART_DIR}/values.yaml" <<'EOF'
# ===========================================
# Global Configuration
# ===========================================
global:
  environment: development
  storageClass: hostpath

# ===========================================
# PostgreSQL Subchart Configuration
# ===========================================
postgres:
  enabled: true
  
  # Global settings
  global:
    environment: development

  # Image configuration
  image:
    repository: postgres
    tag: "15-alpine"
    pullPolicy: IfNotPresent

  # Naming
  nameOverride: ""
  fullnameOverride: ""

  # Authentication
  auth:
    existingSecret: ""
    username: postgres
    password: "pact-postgres-dev123"
    database: pactdb
    initdbArgs: "--encoding=UTF8"

  # Service configuration
  service:
    type: ClusterIP
    port: 5432
    targetPort: 5432
    annotations: {}

  # StatefulSet configuration
  statefulset:
    replicaCount: 1
    revisionHistoryLimit: 3
    podAnnotations:
      app.team: "platform"
    podSecurityContext:
      fsGroup: 999
      runAsNonRoot: true
      runAsUser: 999
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
          - ALL

  # Persistence
  persistence:
    enabled: true
    existingClaim: ""
    create: true
    accessModes:
      - ReadWriteOnce
    size: 5Gi
    storageClassName: "hostpath"
    mountPath: /var/lib/postgresql/data
    subPath: "postgres"
    annotations:
      description: "Pact PostgreSQL data"
    labels:
      app: pact-suite
      component: database

  # Resources
  resources:
    requests:
      cpu: 250m
      memory: 512Mi
    limits:
      cpu: 1000m
      memory: 1Gi

  # Health checks
  readinessProbe:
    enabled: true
    exec:
      command:
        - /bin/sh
        - -c
        - pg_isready -U $POSTGRES_USER -d $POSTGRES_DB
    initialDelaySeconds: 10
    periodSeconds: 5
    timeoutSeconds: 3
    successThreshold: 1
    failureThreshold: 3

  livenessProbe:
    enabled: true
    exec:
      command:
        - /bin/sh
        - -c
        - pg_isready -U $POSTGRES_USER -d $POSTGRES_DB
    initialDelaySeconds: 30
    periodSeconds: 10
    timeoutSeconds: 3
    failureThreshold: 3

  startupProbe:
    enabled: true
    exec:
      command:
        - /bin/sh
        - -c
        - pg_isready -U $POSTGRES_USER -d $POSTGRES_DB
    initialDelaySeconds: 0
    periodSeconds: 5
    timeoutSeconds: 3
    successThreshold: 1
    failureThreshold: 30

  # PostgreSQL configuration
  config:
    enabled: true
    postgresql_conf: |
      max_connections = 200
      shared_buffers = 256MB
      effective_cache_size = 1GB
      maintenance_work_mem = 64MB
      work_mem = 4MB
      logging_collector = on
      log_directory = 'pg_log'
      log_filename = 'postgresql-%Y-%m-%d.log'
      log_statement = 'mod'
      log_min_duration_statement = 200

  # Advanced features
  affinity: {}
  tolerations: []
  nodeSelector: {}

  # RBAC
  rbac:
    create: true
  
  serviceAccount:
    create: true
    annotations: {}
    name: ""

  # Monitoring
  monitoring:
    enabled: false

  # Network Policy
  networkPolicy:
    enabled: false

# ===========================================
# Pact Broker Subchart Configuration
# ===========================================
pact-broker:
  enabled: true

  replicaCount: 1

  # Image configuration
  image:
    repository: pactfoundation/pact-broker
    tag: "2.110.0"
    pullPolicy: IfNotPresent

  # Service configuration
  service:
    type: ClusterIP
    port: 9292

  # Database connection (connects to postgres subchart)
  database:
    host: "pact-suite-postgres"
    name: pactdb
    username: postgres
    password: "pact-postgres-dev123"

  # Resources
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi

  # Ingress configuration
  ingress:
    enabled: true
    className: nginx
    host: pact-broker.local
EOF

echo "   ✅ Fixed values.yaml created"

# Step 3: Create values-dev.yaml
echo ""
echo "3️⃣ Creating values-dev.yaml..."
cat > "${CHART_DIR}/values-dev.yaml" <<'EOF'
# Development environment overrides
global:
  environment: development
  storageClass: hostpath

postgres:
  auth:
    password: dev123
  persistence:
    size: 2Gi
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi

pact-broker:
  replicaCount: 1
  database:
    password: dev123
  resources:
    requests:
      cpu: 50m
      memory: 128Mi
    limits:
      cpu: 250m
      memory: 256Mi
  ingress:
    enabled: false
EOF

echo "   ✅ values-dev.yaml created"

# Step 4: Update Chart.yaml
echo ""
echo "4️⃣ Updating Chart.yaml..."
cat > "${CHART_DIR}/Chart.yaml" <<'EOF'
apiVersion: v2
name: pact-suite
description: Umbrella chart for PostgreSQL and Pact Broker
type: application
version: 1.0.0
appVersion: "1.0"

dependencies:
  - name: postgres
    version: "1.0.0"
    repository: "file://./charts/postgres"
    condition: postgres.enabled
  - name: pact-broker
    version: "0.1.0"
    repository: "file://./charts/pact-broker"
    condition: pact-broker.enabled
    alias: pact-broker
EOF

echo "   ✅ Chart.yaml updated"

# Step 5: Update subchart Chart.yaml files
echo ""
echo "5️⃣ Updating subchart Chart.yaml files..."

# Update postgres Chart.yaml
cat > "${CHART_DIR}/charts/postgres/Chart.yaml" <<'EOF'
apiVersion: v2
name: postgres
description: PostgreSQL database
type: application
version: 1.0.0
appVersion: "15"
EOF

# Update pact-broker Chart.yaml (keep original name)
cat > "${CHART_DIR}/charts/pact-broker/Chart.yaml" <<'EOF'
apiVersion: v2
name: pact-broker
description: Pact Broker for contract testing
type: application
version: 0.1.0
appVersion: "2.110.0"
EOF

echo "   ✅ Subchart Chart.yaml files updated"

# Step 6: Validate structure
echo ""
echo "6️⃣ Validating chart structure..."
if [ ! -d "${CHART_DIR}/charts/postgres" ]; then
    echo "   ❌ Error: postgres subchart not found at ${CHART_DIR}/charts/postgres"
    exit 1
fi

if [ ! -d "${CHART_DIR}/charts/pact-broker" ]; then
    echo "   ❌ Error: pact-broker subchart not found at ${CHART_DIR}/charts/pact-broker"
    exit 1
fi

echo "   ✅ Chart structure valid"

# Step 7: Update dependencies
echo ""
echo "7️⃣ Updating Helm dependencies..."
cd "${CHART_DIR}"
helm dependency update

# Step 8: Lint chart
echo ""
echo "8️⃣ Linting chart..."
helm lint .

# Step 9: Clean up existing deployment
echo ""
echo "9️⃣ Cleaning up existing deployment..."
helm uninstall pact-suite -n ${NAMESPACE} 2>/dev/null || echo "   No existing deployment found"
kubectl delete pvc --all -n ${NAMESPACE} 2>/dev/null || echo "   No PVCs to delete"

# Step 10: Deploy
echo ""
echo "🚀 Deploying pact-suite..."
helm install pact-suite . \
  --namespace ${NAMESPACE} \
  --create-namespace \
  -f values.yaml \
  -f values-dev.yaml \
  --wait --timeout 10m

# Step 11: Verify deployment
echo ""
echo "✅ Verifying deployment..."
sleep 5

echo ""
echo "📦 Kubernetes Resources:"
kubectl get all,pvc,secret -n ${NAMESPACE}

# Step 12: Wait for pods
echo ""
echo "⏳ Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=postgres -n ${NAMESPACE} --timeout=300s
echo "   ✅ PostgreSQL ready"

kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=pact-broker -n ${NAMESPACE} --timeout=300s
echo "   ✅ Pact Broker ready"

# Step 13: Show access info
echo ""
echo "======================================="
echo "✅ Deployment Complete!"
echo "======================================="
echo ""
echo "📋 Connection Details:"
echo "-----------------------------------"
echo "PostgreSQL:"
echo "  Host: pact-suite-postgres.${NAMESPACE}.svc.cluster.local"
echo "  Port: 5432"
echo "  Database: pactdb"
echo "  Username: postgres"
echo "  Password: dev123"
echo ""
echo "Pact Broker:"
echo "  Service: pact-suite-pact-broker.${NAMESPACE}.svc.cluster.local"
echo "  Port: 9292"
echo ""
echo "🔗 Access Pact Broker UI:"
echo "kubectl port-forward -n ${NAMESPACE} svc/pact-suite-pact-broker 9292:9292"
echo "Then visit: http://localhost:9292"
echo ""
echo "📝 Useful Commands:"
echo "-----------------------------------"
echo "# View all resources"
echo "kubectl get all,pvc -n ${NAMESPACE}"
echo ""
echo "# View logs"
echo "kubectl logs -n ${NAMESPACE} -l app.kubernetes.io/name=postgres -f"
echo "kubectl logs -n ${NAMESPACE} -l app.kubernetes.io/name=pact-broker -f"
echo ""
echo "# Connect to PostgreSQL"
echo "kubectl exec -it -n ${NAMESPACE} pact-suite-postgres-0 -- psql -U postgres -d pactdb"
echo ""
echo "🎉 Done!"
