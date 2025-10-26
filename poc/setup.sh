#!/bin/bash
# PostgreSQL Helm Chart Fix & Deploy Script

set -e

echo "🔧 Fixing PostgreSQL Helm Chart..."

# Step 1: Remove conflicting deployment file
echo "1️⃣ Removing conflicting postgres-deployment.yaml..."
if [ -f "./postgres/templates/postgres-deployment.yaml" ]; then
    rm ./postgres/templates/postgres-deployment.yaml
    echo "   ✅ Removed postgres-deployment.yaml"
else
    echo "   ℹ️  File not found (already removed)"
fi

# Step 2: Verify chart structure
echo ""
echo "2️⃣ Verifying chart structure..."
echo "   Chart files:"
ls -la ./postgres/templates/

# Step 3: Validate Helm chart
echo ""
echo "3️⃣ Validating Helm chart..."
helm lint ./postgres

# Step 4: Create namespace
echo ""
echo "4️⃣ Creating namespace postgres-dev..."
kubectl create namespace postgres-dev 2>/dev/null || echo "   ℹ️  Namespace already exists"

# Step 5: Install chart
echo ""
echo "5️⃣ Installing PostgreSQL chart..."
helm install postgres-dev ./postgres \
  --namespace postgres-dev \
  --wait \
  --timeout 5m

# Step 6: Verify deployment
echo ""
echo "6️⃣ Verifying deployment..."
sleep 5

echo ""
echo "📦 Checking resources..."
kubectl get all,pvc,secret,configmap -n postgres-dev

# Step 7: Wait for pod to be ready
echo ""
echo "⏳ Waiting for PostgreSQL pod to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=postgres \
  -n postgres-dev \
  --timeout=300s

# Step 8: Test PostgreSQL connection
echo ""
echo "🧪 Testing PostgreSQL connection..."
POD_NAME=$(kubectl get pod -n postgres-dev -l app.kubernetes.io/name=postgres -o jsonpath='{.items[0].metadata.name}')

kubectl exec -it $POD_NAME -n postgres-dev -- psql -U postgres -d appdb -c "SELECT version();"

echo ""
echo "✅ PostgreSQL is working!"
echo ""
echo "📋 Connection Details:"
echo "-----------------------------------"
echo "Host: postgres-dev-postgres.postgres-dev.svc.cluster.local"
echo "Port: 5432"
echo "Database: appdb"
echo "Username: postgres"
echo "Password: dev123"
echo ""
echo "🔗 Connection String:"
echo "postgresql://postgres:dev123@postgres-dev-postgres:5432/appdb"
echo ""
echo "🎉 Deployment Complete!"
