#!/bin/bash

# Quick Helm Chart Validation
# Run this for fast validation before deployment

set -e

CHART_PATH="."
NAMESPACE="pact-stack"

echo "🔍 Quick Helm Validation"
echo "========================"

# 1. Update dependencies
echo -e "\n📦 Updating dependencies..."
helm dependency update "$CHART_PATH"

# 2. Lint the chart
echo -e "\n🔨 Linting chart..."
helm lint "$CHART_PATH" --values values.yaml

# 3. Lint with dev values
if [ -f "values-dev.yaml" ]; then
    echo -e "\n🔨 Linting with dev values..."
    helm lint "$CHART_PATH" --values values.yaml --values values-dev.yaml
fi

# 4. Template rendering
echo -e "\n📄 Testing template rendering..."
helm template pact-stack "$CHART_PATH" \
    --namespace "$NAMESPACE" \
    --values values.yaml \
    > /tmp/helm-rendered.yaml

# 5. Kubectl dry-run
echo -e "\n✓ Running kubectl dry-run..."
kubectl apply --dry-run=client -f /tmp/helm-rendered.yaml

# 6. Show what will be created
echo -e "\n📋 Resources to be created:"
grep "^kind:" /tmp/helm-rendered.yaml | sort | uniq -c

echo -e "\n✅ Validation complete! Chart is ready for deployment."
echo -e "\n📝 Review rendered templates at: /tmp/helm-rendered.yaml"
echo -e "\n🚀 Deploy with:"
echo "   helm upgrade --install pact-stack . -n $NAMESPACE --values values.yaml --values values-dev.yaml --create-namespace --wait"
