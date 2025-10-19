# Temple Stack - Unified Helm Chart

Complete deployment solution for the Temple application stack including PostgreSQL, Strapi API, and React UI.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Temple Stack                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐    │
│  │  Temple UI   │   │  Temple API  │   │  PostgreSQL  │    │
│  │  (React)     │──▶│  (Strapi)    │──▶│  Database    │    │
│  │  Port: 80    │   │  Port: 1337  │   │  Port: 5432  │    │
│  └──────────────┘   └──────────────┘   └──────────────┘    │
│         │                   │                   │            │
│         └───────────────────┴───────────────────┘            │
│                             │                                │
│                    ┌────────▼────────┐                       │
│                    │ Nginx Ingress   │                       │
│                    │   Controller    │                       │
│                    └─────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
temple-stack/
├── Chart.yaml                      # Main chart definition
├── values.yaml                     # Default values
├── values-dev.yaml                 # Development environment
├── values-prod.yaml                # Production environment
├── templates/
│   └── NOTES.txt                   # Post-install instructions
├── charts/                         # Sub-charts
│   ├── postgres/                   # PostgreSQL chart
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   └── templates/
│   │       ├── statefulset.yaml
│   │       ├── service.yaml
│   │       └── secret.yaml
│   ├── temple-api/                 # Strapi API chart
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   └── templates/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       └── ingress.yaml
│   └── temple-ui/                  # React UI chart
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│           ├── deployment.yaml
│           ├── service.yaml
│           └── ingress.yaml
├── Makefile                        # Convenient commands
└── README.md                       # This file
```

## 🚀 Quick Start

### Prerequisites

- Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl configured
- Helm 3.x installed
- Nginx Ingress Controller installed

### One-Click Deployment

```bash
# Using deployment script
chmod +x scripts/deploy.sh
./scripts/deploy.sh dev

# OR using Makefile
make install-dev

# OR using Helm directly
helm install temple-stack ./temple-stack -n temple-stack --create-namespace
```

### Access the Application

Add to `/etc/hosts`:
```
127.0.0.1 temple-ui.local
127.0.0.1 temple-api.local
```

Access URLs:
- **Frontend**: http://temple-ui.local
- **API**: http://temple-api.local/api
- **Health Check**: http://temple-api.local/_health

## 📋 Installation Methods

### Method 1: Using Deploy Script (Recommended)

```bash
# Development environment
./scripts/deploy.sh dev

# Production environment
./scripts/deploy.sh prod

# Dry run (preview without deploying)
./scripts/deploy.sh dev --dry-run

# Skip dependency update
./scripts/deploy.sh dev --skip-deps
```

### Method 2: Using Makefile

```bash
# Install with dev environment
make install-dev

# Install with prod environment
make install-prod

# Upgrade existing installation
make upgrade-dev

# Show status
make status

# View logs
make logs-api
make logs-ui

# Uninstall
make uninstall

# See all available commands
make help
```

### Method 3: Using Helm CLI

```bash
# Update dependencies
cd temple-stack
helm dependency update

# Install
helm install temple-stack . \
  -n temple-stack \
  --create-namespace \
  -f values-dev.yaml

# Upgrade
helm upgrade temple-stack . \
  -n temple-stack \
  -f values-dev.yaml

# Uninstall
helm uninstall temple-stack -n temple-stack
```

### Method 4: Using ArgoCD

```bash
# Apply ArgoCD application
kubectl apply -f argocd/temple-stack-app.yaml

# Watch sync status
argocd app get temple-stack

# Sync manually
argocd app sync temple-stack
```

## ⚙️ Configuration

### Environment-Specific Values

The chart supports multiple environments through values files:

- **values.yaml** - Base configuration
- **values-dev.yaml** - Development overrides
- **values-prod.yaml** - Production overrides

### Common Configuration Options

```yaml
# Enable/disable components
postgres:
  enabled: true

temple-api:
  enabled: true

temple-ui:
  enabled: true

# Database configuration
global:
  database:
    host: postgres-postgres.database.svc.cluster.local
    port: 5432
    name: temple
    username: postgres
    password: postgres

# API configuration
temple-api:
  apiserver:
    replicaCount: 1
    image: harishdell/templeserver:1.12
    env:
      DATABASE_HOST: "postgres-postgres.database.svc.cluster.local"

# UI configuration
temple-ui:
  templeui:
    env:
      REACT_APP_API_URL: "http://temple-api.local/api"
```

### Override Values at Install Time

```bash
# Override specific values
helm install temple-stack ./temple-stack \
  --set postgres.persistence.size=5Gi \
  --set temple-api.apiserver.replicaCount=3 \
  -n temple-stack

# Using custom values file
helm install temple-stack ./temple-stack \
  -f custom-values.yaml \
  -n temple-stack
```

## 🔧 Management Commands

### Status and Monitoring

```bash
# Check deployment status
make status

# View pod logs
make logs-api
make logs-ui
make logs-db

# Get shell access
make shell-api
make shell-ui
make shell-db

# Watch events
make events

# Check resource usage
make top
```

### Port Forwarding

```bash
# Forward API to localhost
make port-forward-api
# Access at http://localhost:1337

# Forward UI to localhost
make port-forward-ui
# Access at http://localhost:8080

# Forward database
make port-forward-db
# Connect at localhost:5432
```

### Debugging

```bash
# Describe resources
make describe-api
make describe-ui
make describe-db

# Test service connectivity
make test-connection

# View release history
make history

# Get current values
make get-values

# Get rendered manifest
make get-manifest
```

### Upgrades and Rollbacks

```bash
# Upgrade to new version
make upgrade-dev

# Rollback to previous version
make rollback

# Restart deployments
make restart-api
make restart-ui
make restart-all
```

## 🗄️ Database Management

### Connect to PostgreSQL

```bash
# Using kubectl
kubectl exec -it statefulset/postgres-postgres -n temple-stack -- \
  psql -U postgres -d temple

# Using make
make shell-db

# Using port-forward
make port-forward-db
psql -h localhost -U postgres -d temple
```

### Backup Database

```bash
# Backup to file
kubectl exec statefulset/postgres-postgres -n temple-stack -- \
  pg_dump -U postgres temple > backup.sql

# Restore from file
cat backup.sql | kubectl exec -i statefulset/postgres-postgres -n temple-stack -- \
  psql -U postgres temple
```

## 🎯 Use Cases

### Development Environment

```bash
# Install with local images
make install-dev

# Hot reload enabled
# Minimal resources
# Debug logging enabled
```

### Production Environment

```bash
# Install with production config
make install-prod

# Features:
# - Multiple replicas
# - Resource limits
# - TLS enabled
# - Autoscaling configured
# - Production logging
```

### Staging Environment

```bash
# Create custom values
cat > values-staging.yaml <<EOF
global:
  domain: staging.temple.com

temple-api:
  apiserver:
    replicaCount: 2

postgres:
  persistence:
    size: 5Gi
EOF

# Install
helm install temple-stack ./temple-stack \
  -f values-staging.yaml \
  -n temple-stack
```

## 🔐 Security Considerations

### Secrets Management

```bash
# Create secret for database credentials
kubectl create secret generic postgres-secret \
  -n temple-stack \
  --from-literal=username=postgres \
  --from-literal=password=your-secure-password \
  --from-literal=database=temple

# Use in values.yaml
postgres:
  auth:
    existingSecret: postgres-secret
```

### Network Policies

```yaml
# Add to values.yaml
networkPolicy:
  enabled: true
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            name: temple-stack
```

### TLS Configuration

```yaml
# Production TLS
temple-api:
  ingress:
    tls:
      - secretName: temple-api-tls
        hosts:
          - api.temple.com

temple-ui:
  ingress:
    tls:
      - secretName: temple-ui-tls
        hosts:
          - temple.com
```

## 📊 Monitoring and Observability

### Health Checks

```bash
# API health
curl http://temple-api.local/_health

# Check readiness
kubectl get pods -n temple-stack

# View pod events
kubectl describe pod <pod-name> -n temple-stack
```

### Metrics

```bash
# Resource usage
make top

# Pod metrics
kubectl top pods -n temple-stack

# Node metrics
kubectl top nodes
```

### Logging

```bash
# Stream logs
make logs-api
make logs-ui

# Get logs with timestamps
kubectl logs -f deployment/temple-api -n temple-stack --timestamps

# Previous logs (after restart)
kubectl logs deployment/temple-api -n temple-stack --previous
```

## 🐛 Troubleshooting

### Common Issues

#### Pods Not Starting

```bash
# Check pod status
kubectl get pods -n temple-stack

# Describe pod
kubectl describe pod <pod-name> -n temple-stack

# Check logs
kubectl logs <pod-name> -n temple-stack

# Check events
make events
```

#### Database Connection Issues

```bash
# Test database connectivity
kubectl run test-db --rm -it --restart=Never \
  --image=postgres:15 -n temple-stack -- \
  psql -h postgres-postgres -U postgres -d temple

# Check database service
kubectl get svc -n temple-stack

# Check database logs
make logs-db
```

#### Ingress Not Working

```bash
# Check ingress controller
kubectl get pods -n ingress-nginx

# Check ingress resource
kubectl get ingress -n temple-stack

# Describe ingress
kubectl describe ingress -n temple-stack

# Check /etc/hosts
cat /etc/hosts | grep temple
```

#### Image Pull Errors

```bash
# For local images (dev environment)
# Ensure imagePullPolicy: Never

# For remote images
# Check image name and tag
# Verify image exists: docker pull <image>
```

### Reset Everything

```bash
# Complete cleanup
make clean

# Reinstall
make install-dev
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy Temple Stack

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install kubectl
        uses: azure/setup-kubectl@v3
      
      - name: Install Helm
        uses: azure/setup-helm@v3
      
      - name: Deploy
        run: |
          ./scripts/deploy.sh prod
```

### GitLab CI Example

```yaml
deploy:
  stage: deploy
  image: alpine/helm:latest
  script:
    - helm upgrade --install temple-stack ./temple-stack
      -n temple-stack
      -f values-prod.yaml
  only:
    - main
```

## 📚 Additional Resources

- [Helm Documentation](https://helm.sh/docs/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [Strapi Documentation](https://docs.strapi.io/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📝 License

[Your License Here]

## 👥 Support

For issues and questions:
- GitHub Issues: [your-repo/issues]
- Email: devops@temple.local
- Slack: #temple-stack