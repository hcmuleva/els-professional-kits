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
