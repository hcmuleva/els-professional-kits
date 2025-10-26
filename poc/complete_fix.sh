#!/bin/bash
# PostgreSQL PVC Fix Script
# Fixes "unbound immediate PersistentVolumeClaims" error

set -e

NAMESPACE="postgres-dev"
RELEASE="postgres-dev"

echo "🔍 Diagnosing PVC Issue..."
echo "================================"

# Check PVC status
echo ""
echo "1️⃣ Checking PVC Status:"
kubectl get pvc -n "${NAMESPACE}"

echo ""
echo "2️⃣ PVC Details:"
kubectl describe pvc -n "${NAMESPACE}"

echo ""
echo "3️⃣ Available Storage Classes:"
kubectl get storageclass

echo ""
echo "4️⃣ Checking for PersistentVolumes:"
kubectl get pv

echo ""
echo "================================"
echo "🔧 Applying Fix..."
echo "================================"

# Determine the environment and apply appropriate fix
if kubectl get storageclass local-path &>/dev/null; then
    echo ""
    echo "✅ Found 'local-path' storage class (Docker Desktop/K3s/Kind)"
    STORAGE_CLASS="local-path"
elif kubectl get storageclass hostpath &>/dev/null; then
    echo ""
    echo "✅ Found 'hostpath' storage class (Minikube)"
    STORAGE_CLASS="hostpath"
elif kubectl get storageclass standard &>/dev/null; then
    echo ""
    echo "✅ Found 'standard' storage class"
    STORAGE_CLASS="standard"
else
    echo ""
    echo "⚠️  No suitable storage class found. Creating local-path provisioner..."
    
    # Install local-path-provisioner
    kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.24/deploy/local-path-storage.yaml
    
    echo "   Waiting for provisioner to be ready..."
    sleep 10
    
    STORAGE_CLASS="local-path"
fi

echo ""
echo "📝 Using storage class: ${STORAGE_CLASS}"

# Uninstall existing release
echo ""
echo "🧹 Cleaning up existing installation..."
helm uninstall "${RELEASE}" -n "${NAMESPACE}" 2>/dev/null || echo "   No existing release found"

# Delete stuck PVC if exists
echo ""
echo "🗑️  Removing old PVCs..."
kubectl delete pvc --all -n "${NAMESPACE}" 2>/dev/null || echo "   No PVCs to delete"

echo "   Waiting for cleanup..."
sleep 5

# Reinstall with correct storage class
echo ""
echo "🚀 Reinstalling PostgreSQL with storage class: ${STORAGE_CLASS}"
helm install "${RELEASE}" ./postgres \
  --namespace "${NAMESPACE}" \
  --set persistence.storageClassName="${STORAGE_CLASS}" \
  --wait \
  --timeout 5m

# Verify
echo ""
echo "✅ Verifying deployment..."
sleep 5

echo ""
echo "📦 PVC Status:"
kubectl get pvc -n "${NAMESPACE}"

echo ""
echo "📦 Pod Status:"
kubectl get pods -n "${NAMESPACE}"

# Wait for pod to be ready
echo ""
echo "⏳ Waiting for pod to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=postgres \
  -n "${NAMESPACE}" \
  --timeout=300s

POD_NAME=$(kubectl get pod -n "${NAMESPACE}" -l app.kubernetes.io/name=postgres -o jsonpath='{.items[0].metadata.name}')

echo ""
echo "🧪 Testing PostgreSQL..."
kubectl exec -n "${NAMESPACE}" "${POD_NAME}" -- psql -U postgres -d appdb -c "SELECT 'PVC Issue Fixed!' as status;"

echo ""
echo "================================"
echo "✅ PVC Issue Resolved!"
echo "================================"
echo ""
echo "Storage Class Used: ${STORAGE_CLASS}"
echo "PVC Bound Successfully!"
echo ""
