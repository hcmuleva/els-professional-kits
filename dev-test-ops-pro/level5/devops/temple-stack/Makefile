# Temple Stack Makefile
# Convenient commands for managing the deployment

.PHONY: help install upgrade uninstall status logs clean deps lint template test-dev test-prod

# Default target
.DEFAULT_GOAL := help

# Variables
RELEASE_NAME := temple-stack
NAMESPACE := temple-stack
CHART_DIR := .
ENV ?= dev

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
NC := \033[0m

help: ## Show this help message
	@echo "$(BLUE)Temple Stack - Available Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

deps: ## Update chart dependencies
	@echo "$(BLUE)Updating dependencies...$(NC)"
	cd $(CHART_DIR) && helm dependency update
	@echo "$(GREEN)✅ Dependencies updated$(NC)"

lint: ## Lint the helm chart
	@echo "$(BLUE)Linting chart...$(NC)"
	helm lint $(CHART_DIR)
	@echo "$(GREEN)✅ Chart linted successfully$(NC)"

template: ## Generate and display Kubernetes manifests
	@echo "$(BLUE)Rendering templates for $(ENV) environment...$(NC)"
	helm template $(RELEASE_NAME) $(CHART_DIR) \
		-f $(CHART_DIR)/values-$(ENV).yaml \
		--namespace $(NAMESPACE)

template-debug: ## Generate templates with debug output
	helm template $(RELEASE_NAME) $(CHART_DIR) \
		-f $(CHART_DIR)/values-$(ENV).yaml \
		--namespace $(NAMESPACE) \
		--debug

install: deps lint ## Install the helm chart (ENV=dev by default)
	@echo "$(BLUE)Installing $(RELEASE_NAME) with $(ENV) configuration...$(NC)"
	helm install $(RELEASE_NAME) $(CHART_DIR) \
		-n $(NAMESPACE) \
		-f $(CHART_DIR)/values-$(ENV).yaml \
		--create-namespace \
		--wait \
		--timeout 10m
	@echo "$(GREEN)✅ Installation complete$(NC)"
	@make status

install-dev: ## Install with development configuration
	@make install ENV=dev

install-prod: ## Install with production configuration
	@make install ENV=prod

upgrade: deps ## Upgrade existing release (ENV=dev by default)
	@echo "$(BLUE)Upgrading $(RELEASE_NAME) with $(ENV) configuration...$(NC)"
	helm upgrade $(RELEASE_NAME) $(CHART_DIR) \
		-n $(NAMESPACE) \
		-f $(CHART_DIR)/values-$(ENV).yaml \
		--wait \
		--timeout 10m \
		--atomic \
		--cleanup-on-fail
	@echo "$(GREEN)✅ Upgrade complete$(NC)"
	@make status

upgrade-dev: ## Upgrade with development configuration
	@make upgrade ENV=dev

upgrade-prod: ## Upgrade with production configuration
	@make upgrade ENV=prod

uninstall: ## Uninstall the helm chart
	@echo "$(BLUE)Uninstalling $(RELEASE_NAME)...$(NC)"
	helm uninstall $(RELEASE_NAME) -n $(NAMESPACE)
	@echo "$(GREEN)✅ Uninstalled successfully$(NC)"

status: ## Show deployment status
	@echo "$(BLUE)Release Status:$(NC)"
	@helm list -n $(NAMESPACE)
	@echo ""
	@echo "$(BLUE)Pods:$(NC)"
	@kubectl get pods -n $(NAMESPACE)
	@echo ""
	@echo "$(BLUE)Services:$(NC)"
	@kubectl get svc -n $(NAMESPACE)
	@echo ""
	@echo "$(BLUE)Ingresses:$(NC)"
	@kubectl get ingress -n $(NAMESPACE)

logs-api: ## Show logs for temple-api
	kubectl logs -f deployment/temple-api -n $(NAMESPACE)

logs-ui: ## Show logs for temple-ui
	kubectl logs -f deployment/temple-ui -n $(NAMESPACE)

logs-db: ## Show logs for postgres
	kubectl logs -f statefulset/postgres-postgres -n $(NAMESPACE)

shell-api: ## Open shell in temple-api pod
	kubectl exec -it deployment/temple-api -n $(NAMESPACE) -- /bin/sh

shell-ui: ## Open shell in temple-ui pod
	kubectl exec -it deployment/temple-ui -n $(NAMESPACE) -- /bin/sh

shell-db: ## Open psql shell in postgres pod
	kubectl exec -it statefulset/postgres-postgres -n $(NAMESPACE) -- psql -U postgres -d temple

port-forward-api: ## Port forward temple-api to localhost:1337
	@echo "$(BLUE)Forwarding temple-api to http://localhost:1337$(NC)"
	kubectl port-forward -n $(NAMESPACE) svc/temple-api-service 1337:1337

port-forward-ui: ## Port forward temple-ui to localhost:8080
	@echo "$(BLUE)Forwarding temple-ui to http://localhost:8080$(NC)"
	kubectl port-forward -n $(NAMESPACE) svc/temple-ui-service 8080:80

port-forward-db: ## Port forward postgres to localhost:5432
	@echo "$(BLUE)Forwarding postgres to localhost:5432$(NC)"
	kubectl port-forward -n $(NAMESPACE) svc/postgres-postgres 5432:5432

describe-api: ## Describe temple-api deployment
	kubectl describe deployment temple-api -n $(NAMESPACE)

describe-ui: ## Describe temple-ui deployment
	kubectl describe deployment temple-ui -n $(NAMESPACE)

describe-db: ## Describe postgres statefulset
	kubectl describe statefulset postgres-postgres -n $(NAMESPACE)

restart-api: ## Restart temple-api deployment
	kubectl rollout restart deployment/temple-api -n $(NAMESPACE)
	kubectl rollout status deployment/temple-api -n $(NAMESPACE)

restart-ui: ## Restart temple-ui deployment
	kubectl rollout restart deployment/temple-ui -n $(NAMESPACE)
	kubectl rollout status deployment/temple-ui -n $(NAMESPACE)

restart-all: ## Restart all deployments
	@make restart-api
	@make restart-ui

clean: ## Delete all resources including PVCs
	@echo "$(BLUE)Cleaning up all resources...$(NC)"
	helm uninstall $(RELEASE_NAME) -n $(NAMESPACE) || true
	kubectl delete pvc --all -n $(NAMESPACE) || true
	kubectl delete namespace $(NAMESPACE) || true
	@echo "$(GREEN)✅ Cleanup complete$(NC)"

test-connection: ## Test connectivity to services
	@echo "$(BLUE)Testing service connectivity...$(NC)"
	@echo ""
	@echo "Testing temple-api health:"
	@kubectl run test-api --rm -it --restart=Never --image=curlimages/curl:latest -n $(NAMESPACE) -- curl -s http://temple-api-service:1337/_health || true
	@echo ""
	@echo "Testing temple-ui:"
	@kubectl run test-ui --rm -it --restart=Never --image=curlimages/curl:latest -n $(NAMESPACE) -- curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://temple-ui-service:80 || true

validate: lint template ## Validate chart without installing
	@echo "$(GREEN)✅ Chart validation passed$(NC)"

package: deps ## Package the helm chart
	@echo "$(BLUE)Packaging chart...$(NC)"
	helm package $(CHART_DIR)
	@echo "$(GREEN)✅ Chart packaged$(NC)"

dry-run: deps lint ## Simulate installation without actually installing
	@echo "$(BLUE)Performing dry-run for $(ENV) environment...$(NC)"
	helm install $(RELEASE_NAME) $(CHART_DIR) \
		-n $(NAMESPACE) \
		-f $(CHART_DIR)/values-$(ENV).yaml \
		--dry-run \
		--debug

diff: ## Show diff between current release and new values
	@echo "$(BLUE)Showing diff for $(ENV) environment...$(NC)"
	helm diff upgrade $(RELEASE_NAME) $(CHART_DIR) \
		-n $(NAMESPACE) \
		-f $(CHART_DIR)/values-$(ENV).yaml || echo "Install helm-diff plugin: helm plugin install https://github.com/databus23/helm-diff"

history: ## Show release history
	helm history $(RELEASE_NAME) -n $(NAMESPACE)

rollback: ## Rollback to previous release
	@echo "$(BLUE)Rolling back $(RELEASE_NAME)...$(NC)"
	helm rollback $(RELEASE_NAME) -n $(NAMESPACE)
	@echo "$(GREEN)✅ Rollback complete$(NC)"

get-values: ## Get current release values
	helm get values $(RELEASE_NAME) -n $(NAMESPACE)

get-manifest: ## Get current release manifest
	helm get manifest $(RELEASE_NAME) -n $(NAMESPACE)

events: ## Show recent events in namespace
	kubectl get events -n $(NAMESPACE) --sort-by='.lastTimestamp'

top: ## Show resource usage
	@echo "$(BLUE)Pod Resource Usage:$(NC)"
	kubectl top pods -n $(NAMESPACE) || echo "Metrics server not available"
	@echo ""
	@echo "$(BLUE)Node Resource Usage:$(NC)"
	kubectl top nodes || echo "Metrics server not available"