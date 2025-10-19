# ArgoCD Deployment Guide for Temple Stack

## Prerequisites

✅ ArgoCD is installed and running
✅ kubectl can connect to your cluster
✅ Your code is pushed to GitHub

## Step 1: Ensure Code is in GitHub

```bash
# Navigate to your project root
cd /Users/harishmuleva/projects/els-professional-kits

# Check current branch
git branch

# Check status
git status

# Add all changes
git add dev-test-ops-pro/level5/devops/temple-stack/

# Commit
git commit -m "Add temple-stack unified helm chart"

# Push to GitHub (adjust branch name as needed)
git push origin main
# OR if you're on a different branch:
git push origin feature/apiserver
```

## Step 2: Create ArgoCD Application Directory

```bash
# Create argocd directory in temple-stack
cd /Users/harishmuleva/projects/els-professional-kits/dev-test-ops-pro/level5/devops
mkdir -p argocd
```

## Step 3: Create ArgoCD Application Manifest

```bash
cat > argocd/temple-stack-app.yaml << 'EOF'
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: temple-stack
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  
  source:
    repoURL: https://github.com/hcmuleva/els-professional-kits.git
    targetRevision: main  # Change to your branch name if different
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
      allowEmpty: false
    
    syncOptions:
      - CreateNamespace=true
      - PruneLast=true
    
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
EOF
```

**Important:** Update `targetRevision` to match your branch:
- If your code is on `main` branch → `targetRevision: main`
- If your code is on `feature/apiserver` → `targetRevision: feature/apiserver`
- If you want to always use latest → `targetRevision: HEAD`

## Step 4: Apply ArgoCD Application

```bash
kubectl apply -f argocd/temple-stack-app.yaml
```

Expected output:
```
application.argoproj.io/temple-stack created
```

## Step 5: Verify Application Created

```bash
# Check if application exists
kubectl get application -n argocd temple-stack

# Get detailed status
kubectl get application -n argocd temple-stack -o yaml
```

## Step 6: Access ArgoCD UI

### Option A: Port Forward (Easiest)

```bash
# Forward ArgoCD server to localhost
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Open in browser
open https://localhost:8080
# Or manually go to: https://localhost:8080
```

### Option B: Using Ingress (You already have it)

Since you have `argocd.local` ingress:

```bash
# Check your /etc/hosts
cat /etc/hosts | grep argocd

# If not present, add it:
echo "127.0.0.1 argocd.local" | sudo tee -a /etc/hosts

# Access ArgoCD
open http://argocd.local
```

## Step 7: Get ArgoCD Admin Password

```bash
# Get the admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo

# Save this password!
```

## Step 8: Login to ArgoCD UI

1. **Open ArgoCD UI**: http://argocd.local or https://localhost:8080
2. **Username**: `admin`
3. **Password**: (from Step 7)
4. Click **LOG IN**

## Step 9: View Your Application

After logging in:

1. You should see **temple-stack** application on the dashboard
2. Click on **temple-stack** to see details
3. You'll see a visual representation of all resources

### Application Status Colors:

- 🟢 **Green (Synced)**: Everything is in sync with Git
- 🟡 **Yellow (OutOfSync)**: Local changes differ from Git
- 🔴 **Red (Failed)**: Sync or health check failed
- 🔵 **Blue (Progressing)**: Sync in progress

## Step 10: Sync the Application

If the application is not automatically synced:

### Via UI:
1. Click on **temple-stack** application
2. Click **SYNC** button at the top
3. Click **SYNCHRONIZE** in the popup

### Via CLI:
```bash
# Install ArgoCD CLI (if not already installed)
brew install argocd  # Mac
# OR
curl -sSL -o /usr/local/bin/argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64

# Login via CLI
argocd login argocd.local --username admin --password $(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)

# Sync application
argocd app sync temple-stack

# Watch sync status
argocd app wait temple-stack
```

## Step 11: Monitor Deployment

### Via ArgoCD UI:
1. Click on **temple-stack** application
2. You'll see visual diagram with:
   - 🗄️ PostgreSQL StatefulSet
   - 🚀 Temple API Deployment
   - 🎨 Temple UI Deployment
   - 🌐 Services and Ingresses
3. Click on any resource to see details

### Via kubectl:
```bash
# Watch all resources
kubectl get all -n temple-stack

# Watch pods
watch kubectl get pods -n temple-stack

# Check application status
kubectl get application -n argocd temple-stack -o jsonpath='{.status.sync.status}'
# Should show: Synced

# Check health
kubectl get application -n argocd temple-stack -o jsonpath='{.status.health.status}'
# Should show: Healthy
```

## Step 12: Access Your Applications

### Update /etc/hosts (if not already done):
```bash
echo "127.0.0.1 temple-ui.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 temple-api.local" | sudo tee -a /etc/hosts
```

### Access URLs:
- **Frontend**: http://temple-ui.local
- **API**: http://temple-api.local/api
- **API Health**: http://temple-api.local/_health
- **ArgoCD**: http://argocd.local

## Troubleshooting

### Issue 1: Application Shows "OutOfSync"

**Check what's different:**
```bash
argocd app diff temple-stack
```

**Force sync:**
```bash
argocd app sync temple-stack --force
```

### Issue 2: "Repository not accessible"

**Check if GitHub is accessible:**
```bash
# Test SSH
ssh -T git@github.com

# If using HTTPS (which you are), no auth needed for public repos
curl -I https://github.com/hcmuleva/els-professional-kits.git
```

**If repo is private, add credentials:**
```bash
argocd repo add https://github.com/hcmuleva/els-professional-kits.git \
  --username YOUR_GITHUB_USERNAME \
  --password YOUR_GITHUB_TOKEN
```

### Issue 3: Pods Not Starting

**Check events:**
```bash
kubectl get events -n temple-stack --sort-by='.lastTimestamp'
```

**Check pod logs:**
```bash
kubectl logs -n temple-stack deployment/temple-api
kubectl logs -n temple-stack deployment/temple-ui
kubectl logs -n temple-stack statefulset/postgres-postgres
```

### Issue 4: Application Stuck in "Progressing"

**Check sync status:**
```bash
argocd app get temple-stack
```

**Refresh application:**
```bash
argocd app get temple-stack --refresh
```

## ArgoCD CLI Useful Commands

```bash
# List all applications
argocd app list

# Get application details
argocd app get temple-stack

# View application history
argocd app history temple-stack

# Rollback to previous version
argocd app rollback temple-stack

# Delete application
argocd app delete temple-stack

# View logs
argocd app logs temple-stack

# Set sync policy to manual
argocd app set temple-stack --sync-policy none

# Set sync policy to automatic
argocd app set temple-stack --sync-policy automated --auto-prune --self-heal
```

## Making Changes

### Update via Git (Recommended):

```bash
# 1. Make changes to temple-stack
cd /Users/harishmuleva/projects/els-professional-kits/dev-test-ops-pro/level5/devops/temple-stack
vim values-dev.yaml  # Make your changes

# 2. Commit and push
git add .
git commit -m "Update temple-stack configuration"
git push origin main

# 3. ArgoCD will auto-sync (if automated sync is enabled)
# Or manually sync:
argocd app sync temple-stack
```

### Update via ArgoCD UI:

1. Go to temple-stack application
2. Click **APP DETAILS**
3. Click **EDIT**
4. Modify parameters
5. Click **SAVE**
6. Click **SYNC**

## Health Checks in ArgoCD

ArgoCD automatically monitors:
- ✅ **Deployment**: Ready replicas match desired
- ✅ **StatefulSet**: Ready replicas match desired
- ✅ **Service**: Endpoints exist
- ✅ **Ingress**: Created successfully
- ✅ **Pod**: Running and passing health checks

View health status:
```bash
argocd app get temple-stack --show-operation
```

## Complete Verification Checklist

- [ ] Code pushed to GitHub
- [ ] ArgoCD Application created
- [ ] Application visible in ArgoCD UI
- [ ] Application status is "Synced"
- [ ] Application health is "Healthy"
- [ ] All pods are running (3 pods expected)
- [ ] Services are created (3 services expected)
- [ ] Ingresses are created (2 ingresses expected)
- [ ] Can access http://temple-ui.local
- [ ] Can access http://temple-api.local/api
- [ ] API health check passes: http://temple-api.local/_health

## Screenshots Guide

### 1. ArgoCD Dashboard
You should see:
- Application: **temple-stack**
- Status: 🟢 **Synced**
- Health: 🟢 **Healthy**

### 2. Application Details
Click on temple-stack to see:
- Visual graph of all resources
- Pod status indicators
- Service connections
- Ingress endpoints

### 3. Resource Tree
Hierarchy shows:
- Application
  - Helm Release
    - postgres (StatefulSet, Service)
    - temple-api (Deployment, Service, Ingress)
    - temple-ui (Deployment, Service, Ingress)

## Success!

Once everything is green and healthy:

1. ✅ Your application is deployed via GitOps
2. ✅ Changes to Git will auto-sync
3. ✅ ArgoCD monitors health continuously
4. ✅ Easy rollback capability
5. ✅ Visual monitoring and management

---

**Next Steps:**
- Set up webhooks for faster sync
- Configure notifications (Slack, email)
- Add RBAC for team access
- Set up ApplicationSets for multi-environment