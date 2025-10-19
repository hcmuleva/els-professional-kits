# Temple Stack - Quick Reference Card

## 🚀 One-Liners

```bash
# Deploy everything (dev)
make install-dev

# Deploy everything (prod)
make install-prod

# Upgrade
make upgrade-dev

# Uninstall
make uninstall

# Status
make status
```

## 📦 Installation Commands

| Command | Description |
|---------|-------------|
| `./scripts/deploy.sh dev` | Deploy with development config |
| `./scripts/deploy.sh prod` | Deploy with production config |
| `make install-dev` | Install using Makefile (dev) |
| `make install-prod` | Install using Makefile (prod) |
| `helm install temple-stack ./temple-stack -n temple-stack --create-namespace` | Direct Helm install |

## 🔄 Management Commands

| Command | Description |
|---------|-------------|
| `make upgrade-dev` | Upgrade release (dev) |
| `make upgrade-prod` | Upgrade release (prod) |
| `make rollback` | Rollback to previous version |
| `make uninstall` | Uninstall everything |
| `make clean` | Complete cleanup (including PVCs) |

## 📊 Monitoring Commands

| Command | Description |
|---------|-------------|
| `make status` | Show deployment status |
| `make logs-api` | Stream API logs |
| `make logs-ui` | Stream UI logs |
| `make logs-db` | Stream database logs |
| `make events` | Show recent events |
| `make top` | Show resource usage |

## 🔧 Debugging Commands

| Command | Description |
|---------|-------------|
| `make describe-api` | Describe API deployment |
| `make describe-ui` | Describe UI deployment |
| `make describe-db` | Describe database |
| `make shell-api` | Shell into API pod |
| `make shell-ui` | Shell into UI pod |
| `make shell-db` | PostgreSQL shell |

## 🌐 Port Forwarding

| Command | Local URL |
|---------|-----------|
| `make port-forward-api` | http://localhost:1337 |
| `make port-forward-ui` | http://localhost:8080 |
| `make port-forward-db` | localhost:5432 |

## 🔄 Restart Services

| Command | Description |
|---------|-------------|
| `make restart-api` | Restart API only |
| `make restart-ui` | Restart UI only |
| `make restart-all` | Restart all services |

## 📝 Chart Operations

| Command | Description |
|---------|-------------|
| `make deps` | Update dependencies |
| `make lint` | Lint chart |
| `make template` | Render templates |
| `make validate` | Validate chart |
| `make dry-run` | Simulate install |
| `make package` | Package chart |

## 🗄️ Database Operations

```bash
# Connect to database
make shell-db

# Backup database
kubectl exec statefulset/postgres-postgres -n temple-stack -- \
  pg_dump -U postgres temple > backup.sql

# Restore database
cat backup.sql | kubectl exec -i statefulset/postgres-postgres -n temple-stack -- \
  psql -U postgres temple

# List databases
kubectl exec statefulset/postgres-postgres -n temple-stack -- \
  psql -U postgres -c "\l"
```

## 🌍 Environment URLs

### Development
- UI: http://temple-ui.local
- API: http://temple-api.local/api
- Health: http://temple-api.local/_health

### Production
- UI: https://temple.com
- API: https://api.temple.com/api
- Health: https://api.temple.com/_health

## ⚙️ Configuration Files

| File | Purpose |
|------|---------|
| `Chart.yaml` | Chart definition |
| `values.yaml` | Default configuration |
| `values-dev.yaml` | Development overrides |
| `values-prod.yaml` | Production overrides |
| `Makefile` | Command shortcuts |
| `scripts/deploy.sh` | Deployment script |

## 🔐 Common Values Overrides

```bash
# Override at install
helm install temple-stack ./temple-stack \
  --set postgres.persistence.size=5Gi \
  --set temple-api.apiserver.replicaCount=3 \
  --set temple-ui.replicaCount=2

# Override with file
helm install temple-stack ./temple-stack \
  -f custom-values.yaml
```

## 🚨 Emergency Commands

```bash
# Scale down everything
kubectl scale deployment --all --replicas=0 -n temple-stack

# Scale up
kubectl scale deployment --all --replicas=1 -n temple-stack

# Force delete stuck pod
kubectl delete pod <pod-name> --force --grace-period=0 -n temple-stack

# Delete failed jobs
kubectl delete jobs --field-selector status.successful=0 -n temple-stack
```

## 📋 Health Checks

```bash
# Check pod health
kubectl get pods -n temple-stack

# Check API health
curl http://temple-api.local/_health

# Check database connection
kubectl exec deployment/temple-api -n temple-stack -- \
  nc -zv postgres-postgres.database.svc.cluster.local 5432

# Check ingress
kubectl get ingress -n temple-stack
```

## 🔍 Troubleshooting Quick Fixes

### Pods Pending
```bash
kubectl describe pod <pod-name> -n temple-stack
# Check for: resource constraints, PVC issues, node availability
```

### CrashLoopBackOff
```bash
kubectl logs <pod-name> -n temple-stack --previous
# Check for: config errors, missing dependencies
```

### ImagePullBackOff
```bash
kubectl describe pod <pod-name> -n temple-stack
# Check: image name, tag, pullPolicy, registry access
```

### Service Unreachable
```bash
kubectl get svc -n temple-stack
kubectl get endpoints -n temple-stack
# Check: service selector, pod labels, port config
```

## 📊 Useful kubectl Commands

```bash
# Get everything
kubectl get all -n temple-stack

# Watch pods
kubectl get pods -n temple-stack -w

# Follow logs
kubectl logs -f deployment/temple-api -n temple-stack

# Get events
kubectl get events -n temple-stack --sort-by='.lastTimestamp'

# Execute command in pod
kubectl exec -it deployment/temple-api -n temple-stack -- /bin/sh

# Copy files from pod
kubectl cp temple-stack/<pod-name>:/path/to/file ./local-file

# Port forward
kubectl port-forward -n temple-stack svc/temple-api-service 8080:1337
```

## 🎯 ArgoCD Commands

```bash
# List applications
argocd app list

# Get app status
argocd app get temple-stack

# Sync app
argocd app sync temple-stack

# Rollback app
argocd app rollback temple-stack

# Delete app
argocd app delete temple-stack
```

## 📈 Performance Tuning

```yaml
# Increase replicas
temple-api:
  apiserver:
    replicaCount: 3

# Adjust resources
resources:
  requests:
    cpu: 200m
    memory: 512Mi
  limits:
    cpu: 1000m
    memory: 1Gi

# Enable autoscaling
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

## 🔒 Security Checklist

- [ ] Use secrets for sensitive data
- [ ] Enable RBAC
- [ ] Set resource limits
- [ ] Enable network policies
- [ ] Use TLS for ingress
- [ ] Scan images for vulnerabilities
- [ ] Regular security updates
- [ ] Audit logs enabled

## 📞 Support Contacts

- **DevOps Team**: devops@temple.local
- **Slack Channel**: #temple-stack
- **Documentation**: https://github.com/your-repo/temple-stack
- **Issues**: https://github.com/your-repo/temple-stack/issues

## 💡 Pro Tips

1. Always use `make` commands for consistency
2. Test in dev before deploying to prod
3. Use dry-run before actual deployment
4. Keep values files in version control
5. Document custom configurations
6. Monitor resource usage regularly
7. Set up alerts for critical services
8. Regular backups of database
9. Use semantic versioning for releases
10. Review logs after deployments

---

**Last Updated**: 2024
**Version**: 1.0.0