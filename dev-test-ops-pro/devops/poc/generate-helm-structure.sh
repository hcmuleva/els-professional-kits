#!/bin/bash

# Script to generate simplified Helm charts for postgres, strapi, and react-ui
# Designed for ArgoCD deployment with dev and prod environments
# Usage: ./generate-helm-structure.sh [base-directory]

set -e

BASE_DIR="${1:-.}"

echo "Creating simplified Helm charts structure in: $BASE_DIR"

# ============================================
# 1. Main chart directory
# ============================================
echo "Creating web-suite chart..."
mkdir -p "$BASE_DIR/charts/web-suite/templates"

# Create Chart.yaml
cat > "$BASE_DIR/charts/web-suite/Chart.yaml" << 'EOF'
apiVersion: v2
name: web-suite
description: Web suite with React UI, Strapi v4, and Postgres
type: application
version: 0.1.0
appVersion: "1.0"
EOF

# Create base values.yaml
cat > "$BASE_DIR/charts/web-suite/values.yaml" << 'EOF'
# ===========================================
# Global Configuration
# ===========================================
replicaCount: 1
imagePullPolicy: IfNotPresent

# ===========================================
# React UI Configuration
# ===========================================
reactApp:
  enabled: true
  name: react-app
  image: my-react-app:latest
  containerPort: 80
  servicePort: 80

# ===========================================
# Postgres Configuration
# ===========================================
postgres:
  enabled: true
  name: postgres
  image: postgres:15
  imagePullPolicy: IfNotPresent
  containerPort: 5432
  servicePort: 5432
  username: postgres
  password: postgres
  database: temple
  storageSize: 5Gi
  readinessProbe:
    initialDelaySeconds: 5
    periodSeconds: 5

# ===========================================
# Strapi v4 (Temple API) Configuration
# ===========================================
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
    DATABASE_HOST: "postgres-service"
    DATABASE_PORT: "5432"
    DATABASE_NAME: "temple"
    DATABASE_USERNAME: "postgres"
    DATABASE_PASSWORD: "postgres"

# ===========================================
# Ingress Configuration
# ===========================================
ingress:
  enabled: true
  name: web-suite-ingress
  className: nginx
  host: example.com
  paths:
    - path: /
      service: react-app-service
      port: 80
    - path: /api
      service: temple-api-service
      port: 1337
    - path: /admin
      service: temple-api-service
      port: 1337
EOF

# Create values-dev.yaml
cat > "$BASE_DIR/charts/web-suite/values-dev.yaml" << 'EOF'
# Development Environment Overrides
replicaCount: 1
imagePullPolicy: Always

reactApp:
  image: my-react-app:dev

apiserver:
  image: harishdell/templeserver:dev

postgres:
  storageSize: 2Gi

ingress:
  host: dev.example.com
EOF

# Create values-prod.yaml
cat > "$BASE_DIR/charts/web-suite/values-prod.yaml" << 'EOF'
# Production Environment Overrides
replicaCount: 2
imagePullPolicy: IfNotPresent

reactApp:
  image: my-react-app:latest

apiserver:
  image: harishdell/templeserver:latest

postgres:
  storageSize: 10Gi
  password: <set-secure-password>
  
apiserver:
  env:
    DATABASE_PASSWORD: <set-secure-password>

ingress:
  host: example.com
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  tls:
    - secretName: web-suite-tls
      hosts:
        - example.com
EOF

# ============================================
# Create Templates
# ============================================

# React Deployment
cat > "$BASE_DIR/charts/web-suite/templates/react-deployment.yaml" << 'EOF'
{{- if .Values.reactApp.enabled }}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Values.reactApp.name }}
  labels:
    app: {{ .Values.reactApp.name }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .Values.reactApp.name }}
  template:
    metadata:
      labels:
        app: {{ .Values.reactApp.name }}
    spec:
      containers:
      - name: {{ .Values.reactApp.name }}
        image: {{ .Values.reactApp.image }}
        imagePullPolicy: {{ .Values.imagePullPolicy }}
        ports:
        - containerPort: {{ .Values.reactApp.containerPort }}
{{- end }}
EOF

# React Service
cat > "$BASE_DIR/charts/web-suite/templates/react-service.yaml" << 'EOF'
{{- if .Values.reactApp.enabled }}
apiVersion: v1
kind: Service
metadata:
  name: {{ .Values.reactApp.name }}-service
  labels:
    app: {{ .Values.reactApp.name }}
spec:
  selector:
    app: {{ .Values.reactApp.name }}
  ports:
  - port: {{ .Values.reactApp.servicePort }}
    targetPort: {{ .Values.reactApp.containerPort }}
{{- end }}
EOF

# Postgres StatefulSet
cat > "$BASE_DIR/charts/web-suite/templates/postgres-statefulset.yaml" << 'EOF'
{{- if .Values.postgres.enabled }}
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: {{ .Values.postgres.name }}
  labels:
    app: {{ .Values.postgres.name }}
spec:
  serviceName: {{ .Values.postgres.name }}-service
  replicas: 1
  selector:
    matchLabels:
      app: {{ .Values.postgres.name }}
  template:
    metadata:
      labels:
        app: {{ .Values.postgres.name }}
    spec:
      containers:
      - name: {{ .Values.postgres.name }}
        image: {{ .Values.postgres.image }}
        imagePullPolicy: {{ .Values.postgres.imagePullPolicy }}
        ports:
        - containerPort: {{ .Values.postgres.containerPort }}
        env:
        - name: POSTGRES_USER
          value: "{{ .Values.postgres.username }}"
        - name: POSTGRES_PASSWORD
          value: "{{ .Values.postgres.password }}"
        - name: POSTGRES_DB
          value: "{{ .Values.postgres.database }}"
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        readinessProbe:
          tcpSocket:
            port: {{ .Values.postgres.containerPort }}
          initialDelaySeconds: {{ .Values.postgres.readinessProbe.initialDelaySeconds }}
          periodSeconds: {{ .Values.postgres.readinessProbe.periodSeconds }}
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: {{ .Values.postgres.storageSize }}
{{- end }}
EOF

# Postgres Service
cat > "$BASE_DIR/charts/web-suite/templates/postgres-service.yaml" << 'EOF'
{{- if .Values.postgres.enabled }}
apiVersion: v1
kind: Service
metadata:
  name: {{ .Values.postgres.name }}-service
  labels:
    app: {{ .Values.postgres.name }}
spec:
  clusterIP: None
  selector:
    app: {{ .Values.postgres.name }}
  ports:
  - port: {{ .Values.postgres.servicePort }}
    targetPort: {{ .Values.postgres.containerPort }}
{{- end }}
EOF

# Strapi Deployment
cat > "$BASE_DIR/charts/web-suite/templates/apiserver-deployment.yaml" << 'EOF'
{{- if .Values.apiserver.enabled }}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Values.apiserver.name }}
  labels:
    app: {{ .Values.apiserver.name }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .Values.apiserver.name }}
  template:
    metadata:
      labels:
        app: {{ .Values.apiserver.name }}
    spec:
      initContainers:
      - name: wait-for-postgres
        image: busybox:1.36
        command: ['sh', '-c', 'until nc -z {{ .Values.postgres.name }}-service {{ .Values.postgres.servicePort }}; do echo waiting for postgres; sleep 2; done;']
      containers:
      - name: {{ .Values.apiserver.name }}
        image: {{ .Values.apiserver.image }}
        imagePullPolicy: {{ .Values.imagePullPolicy }}
        ports:
        - containerPort: {{ .Values.apiserver.containerPort }}
        env:
        {{- range $key, $value := .Values.apiserver.env }}
        - name: {{ $key }}
          value: "{{ $value }}"
        {{- end }}
{{- end }}
EOF

# Strapi Service
cat > "$BASE_DIR/charts/web-suite/templates/apiserver-service.yaml" << 'EOF'
{{- if .Values.apiserver.enabled }}
apiVersion: v1
kind: Service
metadata:
  name: {{ .Values.apiserver.name }}-service
  labels:
    app: {{ .Values.apiserver.name }}
spec:
  selector:
    app: {{ .Values.apiserver.name }}
  ports:
  - port: {{ .Values.apiserver.servicePort }}
    targetPort: {{ .Values.apiserver.containerPort }}
{{- end }}
EOF

# Ingress
cat > "$BASE_DIR/charts/web-suite/templates/ingress.yaml" << 'EOF'
{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ .Values.ingress.name }}
  {{- with .Values.ingress.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
  ingressClassName: {{ .Values.ingress.className }}
  {{- if .Values.ingress.tls }}
  tls:
  {{- range .Values.ingress.tls }}
  - hosts:
    {{- range .hosts }}
    - {{ . }}
    {{- end }}
    secretName: {{ .secretName }}
  {{- end }}
  {{- end }}
  rules:
  - host: {{ .Values.ingress.host }}
    http:
      paths:
      {{- range .Values.ingress.paths }}
      - path: {{ .path }}
        pathType: Prefix
        backend:
          service:
            name: {{ .service }}
            port:
              number: {{ .port }}
      {{- end }}
{{- end }}
EOF

# ============================================
# ArgoCD Applications
# ============================================
echo "Creating ArgoCD application manifests..."

mkdir -p "$BASE_DIR/argocd/dev"
mkdir -p "$BASE_DIR/argocd/prod"

# Dev Application
cat > "$BASE_DIR/argocd/dev/application.yaml" << 'EOF'
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: web-suite-dev
  namespace: argocd
spec:
  project: default
  source:
    repoURL: <YOUR_GIT_REPO_URL>
    targetRevision: HEAD
    path: charts/web-suite
    helm:
      valueFiles:
      - values.yaml
      - values-dev.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: dev
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
EOF

# Prod Application
cat > "$BASE_DIR/argocd/prod/application.yaml" << 'EOF'
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: web-suite-prod
  namespace: argocd
spec:
  project: default
  source:
    repoURL: <YOUR_GIT_REPO_URL>
    targetRevision: HEAD
    path: charts/web-suite
    helm:
      valueFiles:
      - values.yaml
      - values-prod.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
EOF

# Create README
cat > "$BASE_DIR/README.md" << 'EOF'
# Web Suite Helm Chart

Simple Helm chart for deploying React UI, Strapi v4, and Postgres with ArgoCD.

## Structure
```
├── charts/web-suite/          # Main Helm chart
│   ├── Chart.yaml
│   ├── values.yaml            # Base values
│   ├── values-dev.yaml        # Dev overrides
│   ├── values-prod.yaml       # Prod overrides
│   └── templates/             # K8s manifests
└── argocd/                    # ArgoCD applications
    ├── dev/
    │   └── application.yaml
    └── prod/
        └── application.yaml
```

## Manual Deployment

### Dev Environment
```bash
helm install web-suite-dev ./charts/web-suite \
  -f ./charts/web-suite/values.yaml \
  -f ./charts/web-suite/values-dev.yaml \
  -n dev --create-namespace
```

### Prod Environment
```bash
helm install web-suite-prod ./charts/web-suite \
  -f ./charts/web-suite/values.yaml \
  -f ./charts/web-suite/values-prod.yaml \
  -n prod --create-namespace
```

## ArgoCD Deployment

1. Update `<YOUR_GIT_REPO_URL>` in ArgoCD application files
2. Apply ArgoCD applications:

```bash
# Deploy to dev
kubectl apply -f argocd/dev/application.yaml

# Deploy to prod
kubectl apply -f argocd/prod/application.yaml
```

## Components

- **React UI**: Frontend application (port 80)
- **Strapi v4**: API server (port 1337)
- **Postgres**: Database (port 5432)

## Customization

Edit values in:
- `values.yaml` - Base configuration
- `values-dev.yaml` - Dev-specific settings
- `values-prod.yaml` - Prod-specific settings
EOF

echo ""
echo "✓ Simplified Helm chart structure created successfully!"
echo ""
echo "Structure:"
echo "├── charts/web-suite/"
echo "│   ├── Chart.yaml"
echo "│   ├── values.yaml"
echo "│   ├── values-dev.yaml"
echo "│   ├── values-prod.yaml"
echo "│   └── templates/"
echo "│       ├── react-deployment.yaml"
echo "│       ├── react-service.yaml"
echo "│       ├── postgres-statefulset.yaml"
echo "│       ├── postgres-service.yaml"
echo "│       ├── apiserver-deployment.yaml"
echo "│       ├── apiserver-service.yaml"
echo "│       └── ingress.yaml"
echo "└── argocd/"
echo "    ├── dev/application.yaml"
echo "    └── prod/application.yaml"
echo ""
echo "Next steps:"
echo "1. Update <YOUR_GIT_REPO_URL> in argocd/*/application.yaml"
echo "2. Customize values-dev.yaml and values-prod.yaml"
echo "3. Deploy with: kubectl apply -f argocd/dev/application.yaml"
echo ""