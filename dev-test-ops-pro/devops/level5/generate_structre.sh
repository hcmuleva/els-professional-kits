#!/bin/bash

# Script to generate empty Helm charts folder structure for web-suite
# Usage: ./generate-helm-structure.sh [base-directory]

set -e

BASE_DIR="${1:-.}"

echo "Creating Helm charts structure in: $BASE_DIR"

# ============================================
# 1. Web-suite umbrella chart
# ============================================
echo "Creating web-suite umbrella chart..."
mkdir -p "$BASE_DIR/charts/web-suite/templates"
touch "$BASE_DIR/charts/web-suite/Chart.yaml"
touch "$BASE_DIR/charts/web-suite/values.yaml"
touch "$BASE_DIR/charts/web-suite/values-dev.yaml"
touch "$BASE_DIR/charts/web-suite/values-stage.yaml"
touch "$BASE_DIR/charts/web-suite/values-prod.yaml"
touch "$BASE_DIR/charts/web-suite/templates/ingress.yaml"

# ============================================
# 2. React-UI subchart
# ============================================
echo "Creating react-ui subchart..."
mkdir -p "$BASE_DIR/charts/react-ui/templates"
touch "$BASE_DIR/charts/react-ui/Chart.yaml"
touch "$BASE_DIR/charts/react-ui/values.yaml"
touch "$BASE_DIR/charts/react-ui/templates/_helpers.tpl"
touch "$BASE_DIR/charts/react-ui/templates/deployment.yaml"
touch "$BASE_DIR/charts/react-ui/templates/service.yaml"

# ============================================
# 3. Temple-API subchart
# ============================================
echo "Creating temple-api subchart..."
mkdir -p "$BASE_DIR/charts/temple-api/templates"
touch "$BASE_DIR/charts/temple-api/Chart.yaml"
touch "$BASE_DIR/charts/temple-api/values.yaml"
touch "$BASE_DIR/charts/temple-api/templates/_helpers.tpl"
touch "$BASE_DIR/charts/temple-api/templates/deployment.yaml"
touch "$BASE_DIR/charts/temple-api/templates/service.yaml"

# ============================================
# 4. Postgres subchart
# ============================================
echo "Creating postgres subchart..."
mkdir -p "$BASE_DIR/charts/postgres/templates"
touch "$BASE_DIR/charts/postgres/Chart.yaml"
touch "$BASE_DIR/charts/postgres/values.yaml"
touch "$BASE_DIR/charts/postgres/templates/_helpers.tpl"
touch "$BASE_DIR/charts/postgres/templates/statefulset.yaml"
touch "$BASE_DIR/charts/postgres/templates/service.yaml"

# ============================================
# 5. Hello-World subchart
# ============================================
echo "Creating hello-world subchart..."
mkdir -p "$BASE_DIR/charts/hello-world/templates"
touch "$BASE_DIR/charts/hello-world/Chart.yaml"
touch "$BASE_DIR/charts/hello-world/values.yaml"
touch "$BASE_DIR/charts/hello-world/templates/_helpers.tpl"
touch "$BASE_DIR/charts/hello-world/templates/deployment.yaml"
touch "$BASE_DIR/charts/hello-world/templates/service.yaml"

# ============================================
# 6. Environments directory
# ============================================
echo "Creating environments directory..."
mkdir -p "$BASE_DIR/environments/dev"
mkdir -p "$BASE_DIR/environments/stage"
mkdir -p "$BASE_DIR/environments/prod"
touch "$BASE_DIR/environments/dev/application.yaml"
touch "$BASE_DIR/environments/stage/application.yaml"
touch "$BASE_DIR/environments/prod/application.yaml"

echo ""
echo "✓ Folder structure created successfully!"
echo ""
echo "Structure created:"
echo "├─ charts/"
echo "│  ├─ web-suite/"
echo "│  │  ├─ Chart.yaml"
echo "│  │  ├─ values.yaml"
echo "│  │  ├─ values-dev.yaml"
echo "│  │  ├─ values-stage.yaml"
echo "│  │  ├─ values-prod.yaml"
echo "│  │  └─ templates/"
echo "│  │     └─ ingress.yaml"
echo "│  ├─ react-ui/"
echo "│  │  ├─ Chart.yaml"
echo "│  │  ├─ values.yaml"
echo "│  │  └─ templates/"
echo "│  │     ├─ _helpers.tpl"
echo "│  │     ├─ deployment.yaml"
echo "│  │     └─ service.yaml"
echo "│  ├─ temple-api/"
echo "│  │  ├─ Chart.yaml"
echo "│  │  ├─ values.yaml"
echo "│  │  └─ templates/"
echo "│  │     ├─ _helpers.tpl"
echo "│  │     ├─ deployment.yaml"
echo "│  │     └─ service.yaml"
echo "│  ├─ postgres/"
echo "│  │  ├─ Chart.yaml"
echo "│  │  ├─ values.yaml"
echo "│  │  └─ templates/"
echo "│  │     ├─ _helpers.tpl"
echo "│  │     ├─ statefulset.yaml"
echo "│  │     └─ service.yaml"
echo "│  └─ hello-world/"
echo "│     ├─ Chart.yaml"
echo "│     ├─ values.yaml"
echo "│     └─ templates/"
echo "│        ├─ _helpers.tpl"
echo "│        ├─ deployment.yaml"
echo "│        └─ service.yaml"
echo "└─ environments/"
echo "   ├─ dev/"
echo "   │  └─ application.yaml"
echo "   ├─ stage/"
echo "   │  └─ application.yaml"
echo "   └─ prod/"
echo "      └─ application.yaml"
echo ""
echo "All files are empty and ready for content."