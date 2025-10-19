# Istio Chaos Testing Makefile for Temple API

.PHONY: help setup enable-istio apply-chaos test-chaos update-chaos remove-chaos status monitor

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

NAMESPACE := temple-stack

help: ## Show this help message
	@echo "$(BLUE)Istio Chaos Testing - Available Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-25s$(NC) %s\n", $$1, $$2}'
	@echo ""

setup: enable-istio restart-pods wait-ready ## Complete setup (enable Istio, restart pods, wait for ready)

enable-istio: ## Enable Istio injection for temple-stack namespace
	@echo "$(BLUE)Enabling Istio injection for namespace $(NAMESPACE)...$(NC)"
	kubectl label namespace $(NAMESPACE) istio-injection=enabled --overwrite
	@echo "$(GREEN)✅ Istio injection enabled$(NC)"

restart-pods: ## Restart pods to inject Istio sidecars
	@echo "$(BLUE)Restarting deployments to inject Istio sidecars...$(NC)"
	kubectl rollout restart deployment/temple-api -n $(NAMESPACE)
	kubectl rollout restart deployment/temple-ui -n $(NAMESPACE)
	@echo "$(GREEN)✅ Deployments restarted$(NC)"

wait-ready: ## Wait for pods to be ready
	@echo "$(BLUE)Waiting for pods to be ready...$(NC)"
	kubectl rollout status deployment/temple-api -n $(NAMESPACE)
	kubectl rollout status deployment/temple-ui -n $(NAMESPACE)
	@echo "$(GREEN)✅ All pods ready$(NC)"

verify-sidecars: ## Verify Istio sidecars are injected
	@echo "$(BLUE)Verifying Istio sidecars...$(NC)"
	@kubectl get pods -n $(NAMESPACE) -o=custom-columns=NAME:.metadata.name,READY:.status.containerStatuses[*].ready
	@echo ""
	@echo "$(YELLOW)Note: Should see 2/2 for temple-api and temple-ui$(NC)"

apply-chaos: ## Apply chaos configuration
	@echo "$(BLUE)Applying chaos configuration...$(NC)"
	kubectl apply -f istio-chaos-config.yaml
	@echo "$(GREEN)✅ Chaos configuration applied$(NC)"

update-chaos: ## Update chaos parameters (run chaos-controller.sh)
	@echo "$(BLUE)Updating chaos parameters...$(NC)"
	./chaos-controller.sh

set-chaos-60: ## Set chaos to 60% failure (quick preset)
	@echo "$(BLUE)Setting chaos to 60% failure...$(NC)"
	kubectl patch configmap temple-api-chaos-config -n $(NAMESPACE) --type merge -p '{"data":{"failure-percent":"60","success-percent":"40"}}'
	./chaos-controller.sh
	@echo "$(GREEN)✅ Chaos set to 60% failure$(NC)"

set-chaos-80: ## Set chaos to 80% failure (quick preset)
	@echo "$(BLUE)Setting chaos to 80% failure...$(NC)"
	kubectl patch configmap temple-api-chaos-config -n $(NAMESPACE) --type merge -p '{"data":{"failure-percent":"80","success-percent":"20"}}'
	./chaos-controller.sh
	@echo "$(GREEN)✅ Chaos set to 80% failure$(NC)"

set-chaos-30: ## Set chaos to 30% failure (quick preset)
	@echo "$(BLUE)Setting chaos to 30% failure...$(NC)"
	kubectl patch configmap temple-api-chaos-config -n $(NAMESPACE) --type merge -p '{"data":{"failure-percent":"30","success-percent":"70"}}'
	./chaos-controller.sh
	@echo "$(GREEN)✅ Chaos set to 30% failure$(NC)"

set-chaos-0: ## Disable chaos (0% failure)
	@echo "$(BLUE)Disabling chaos...$(NC)"
	kubectl patch configmap temple-api-chaos-config -n $(NAMESPACE) --type merge -p '{"data":{"failure-percent":"0","success-percent":"100"}}'
	./chaos-controller.sh
	@echo "$(GREEN)✅ Chaos disabled$(NC)"

test-chaos: ## Run chaos test (100 requests)
	@echo "$(BLUE)Running chaos test (100 requests)...$(NC)"
	@./test-chaos.sh

test-chaos-quick: ## Quick chaos test (10 requests)
	@echo "$(BLUE)Running quick chaos test...$(NC)"
	@for i in {1..10}; do \
		STATUS=$$(curl -s -o /dev/null -w "%{http_code}" http://temple-api.local/api/users); \
		if [ "$$STATUS" == "200" ]; then \
			echo "Request $$i: ✅ Success ($$STATUS)"; \
		else \
			echo "Request $$i: ❌ Failed ($$STATUS)"; \
		fi; \
		sleep 0.3; \
	done

test-health: ## Test health endpoint (should never fail)
	@echo "$(BLUE)Testing health endpoint...$(NC)"
	@curl -s http://temple-api.local/_health | jq . || echo "Health check OK"

status: ## Show chaos status
	@echo "$(BLUE)Chaos Configuration Status:$(NC)"
	@echo ""
	@echo "ConfigMap:"
	@kubectl get configmap temple-api-chaos-config -n $(NAMESPACE) -o json | jq -r '.data | to_entries[] | "\(.key): \(.value)"'
	@echo ""
	@echo "VirtualService:"
	@kubectl get virtualservice temple-api-chaos -n $(NAMESPACE) -o json | jq -r '.spec.http[0].fault.abort.percentage.value' | xargs -I {} echo "Failure Rate: {}%"
	@echo ""
	@echo "Pods with Sidecars:"
	@kubectl get pods -n $(NAMESPACE) -o wide

list-resources: ## List all chaos-related resources
	@echo "$(BLUE)Chaos Resources:$(NC)"
	@kubectl get virtualservice,destinationrule,gateway,configmap -n $(NAMESPACE) | grep chaos

remove-chaos: ## Remove chaos configuration
	@echo "$(BLUE)Removing chaos configuration...$(NC)"
	kubectl delete virtualservice temple-api-chaos -n $(NAMESPACE) --ignore-not-found
	kubectl delete destinationrule temple-api-chaos -n $(NAMESPACE) --ignore-not-found
	kubectl delete gateway temple-api-gateway -n $(NAMESPACE) --ignore-not-found
	kubectl delete configmap temple-api-chaos-config -n $(NAMESPACE) --ignore-not-found
	@echo "$(GREEN)✅ Chaos configuration removed$(NC)"

disable-istio: ## Disable Istio injection and restart pods
	@echo "$(BLUE)Disabling Istio injection...$(NC)"
	kubectl label namespace $(NAMESPACE) istio-injection-
	kubectl rollout restart deployment/temple-api -n $(NAMESPACE)
	kubectl rollout restart deployment/temple-ui -n $(NAMESPACE)
	kubectl rollout status deployment/temple-api -n $(NAMESPACE)
	kubectl rollout status deployment/temple-ui -n $(NAMESPACE)
	@echo "$(GREEN)✅ Istio disabled$(NC)"

logs-proxy: ## Show Istio proxy logs for temple-api
	kubectl logs -n $(NAMESPACE) deployment/temple-api -c istio-proxy -f

logs-app: ## Show application logs for temple-api
	kubectl logs -n $(NAMESPACE) deployment/temple-api -c temple-api -f

kiali: ## Open Kiali dashboard
	@echo "$(BLUE)Opening Kiali dashboard...$(NC)"
	@echo "Access at: http://localhost:20001"
	kubectl port-forward svc/kiali -n istio-system 20001:20001

grafana: ## Open Grafana dashboard
	@echo "$(BLUE)Opening Grafana dashboard...$(NC)"
	@echo "Access at: http://localhost:3000"
	@echo "Default credentials: admin/admin"
	kubectl port-forward svc/grafana -n istio-system 3000:3000

jaeger: ## Open Jaeger tracing UI
	@echo "$(BLUE)Opening Jaeger UI...$(NC)"
	@echo "Access at: http://localhost:16686"
	kubectl port-forward svc/tracing -n istio-system 16686:80

monitor: ## Open all monitoring dashboards (requires multiple terminals)
	@echo "$(BLUE)To open all monitoring tools, run these in separate terminals:$(NC)"
	@echo "  make kiali"
	@echo "  make grafana"
	@echo "  make jaeger"

describe-vs: ## Describe VirtualService
	kubectl describe virtualservice temple-api-chaos -n $(NAMESPACE)

describe-dr: ## Describe DestinationRule
	kubectl describe destinationrule temple-api-chaos -n $(NAMESPACE)

edit-config: ## Edit chaos ConfigMap
	kubectl edit configmap temple-api-chaos-config -n $(NAMESPACE)

watch-pods: ## Watch pod status
	watch kubectl get pods -n $(NAMESPACE)

watch-traffic: ## Watch istio-proxy access logs
	kubectl logs -n $(NAMESPACE) deployment/temple-api -c istio-proxy -f | grep -E "HTTP|503"

demo: ## Run complete demo (setup, test, show results)
	@echo "$(BLUE)╔══════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║           Istio Chaos Testing Demo                          ║$(NC)"
	@echo "$(BLUE)╚══════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)Step 1: Enabling Istio...$(NC)"
	@make enable-istio
	@echo ""
	@echo "$(YELLOW)Step 2: Restarting pods...$(NC)"
	@make restart-pods
	@echo ""
	@echo "$(YELLOW)Step 3: Waiting for pods to be ready...$(NC)"
	@make wait-ready
	@echo ""
	@echo "$(YELLOW)Step 4: Verifying sidecars...$(NC)"
	@make verify-sidecars
	@echo ""
	@echo "$(YELLOW)Step 5: Applying chaos configuration...$(NC)"
	@make apply-chaos
	@echo ""
	@echo "$(YELLOW)Step 6: Setting chaos to 60% failure...$(NC)"
	@make set-chaos-60
	@echo ""
	@echo "$(YELLOW)Step 7: Running chaos test...$(NC)"
	@make test-chaos
	@echo ""
	@echo "$(GREEN)╔══════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(GREEN)║              Demo Complete!                                  ║$(NC)"
	@echo "$(GREEN)╚══════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(BLUE)Next steps:$(NC)"
	@echo "  - Run: make kiali     (to view traffic in Kiali)"
	@echo "  - Run: make grafana   (to view metrics)"
	@echo "  - Run: make set-chaos-80  (to change failure rate)"
	@echo "  - Run: make test-chaos    (to run more tests)"

clean: remove-chaos disable-istio ## Complete cleanup (remove chaos and disable Istio)
	@echo "$(GREEN)✅ Complete cleanup done$(NC)"