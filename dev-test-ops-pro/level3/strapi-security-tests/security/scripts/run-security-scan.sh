#!/bin/bash

# Main Security Scan Script
# Interactive menu to choose scan type

echo "========================================"
echo "Strapi Security Testing Kit"
echo "========================================"
echo ""

echo "Select scan type:"
echo "  1) Baseline Scan (Quick, 5-10 min)"
echo "  2) Full Scan (Comprehensive, 30-60 min)"
echo "  3) API Scan (Targeted, 15-20 min)"
echo "  4) Authenticated Scan (With JWT, 20-30 min)"
echo "  5) Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        ./security/scripts/baseline-scan.sh
        ;;
    2)
        echo ""
        read -p "Enter Strapi username (default: test@example.com): " username
        read -sp "Enter Strapi password: " password
        echo ""
        export STRAPI_USER="${username:-test@example.com}"
        export STRAPI_PASS="$password"
        ./security/scripts/full-scan.sh
        ;;
    3)
        echo ""
        ./security/scripts/api-scan.sh
        ;;
    4)
        echo ""
        read -p "Enter Strapi username (default: test@example.com): " username
        read -sp "Enter Strapi password: " password
        echo ""
        export STRAPI_USER="${username:-test@example.com}"
        export STRAPI_PASS="$password"
        ./security/scripts/authenticated-scan.sh
        ;;
    5)
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo "Invalid choice!"
        exit 1
        ;;
esac
