# 🔥 Istio Chaos Testing for Temple API

Complete chaos engineering setup for testing temple-api resilience with configurable failure rates.

## 📋 What You Get

- **60% Failure Rate** by default (configurable via ConfigMap)
- **40% Success Rate** (adjustable)
- **Externalizable Parameters** - change without code deployment
- **No Downtime Changes** - update chaos parameters on-the-fly
- **Visual Monitoring** via Kiali, Grafana, and Jaeger
- **Automated Testing** scripts included

---

## 🚀 Quick Start (5 Minutes)

### One-Command Setup

```bash
# Make script executable
chmod +x quick-setup-chaos.sh

# Run setup
./quick-setup-chaos.sh
```

This will:
1. ✅ Enable Istio injection
2. ✅ Restart pods with sidecars
3. ✅ Apply chaos configuration
4. ✅ Run initial tests
5. ✅ Display access information

---

## 📁 Files Overview

```
chaos-testing/
├── istio-chaos-config.yaml      # Chaos configuration (VirtualService, DestinationRule, etc.)
├── chaos-controller.sh          # Script to update chaos parameters
├── test-chaos.sh               # Automated testing script
├── quick-setup-chaos.sh        # One-click setup script
├── Chaos-Makefile              # Convenient make commands
└── ISTIO_CHAOS_SETUP.md        # Detailed documentation
```

---

## 🎯 Usage Examples

### Change Failure Rate

```bash
# Method 1: Using Makefile (Easiest)
make set-chaos-80    # 80% failure
make set-chaos-30    # 30% failure
make set-chaos-0     # Disable chaos

# Method 2: Edit ConfigMap
kubectl edit configmap temple-api-chaos-config -n temple-stack
# Change failure-percent to desired value
./chaos-controller.sh

# Method 3: Using kubectl patch
kubectl patch configmap temple-api-chaos-config -n temple-stack \
  --type merge -p '{"data":{"failure-percent":"70","success-percent":"30"}}'
./chaos-controller.sh
```

### Run Tests

```bash
# Quick test (10 requests)
make test-chaos-quick

# Full test (100 requests)
make test-chaos

# Custom number of requests
./test-chaos.sh 500
```

### Monitor Traffic

```bash
# Open Kiali (visual service mesh)
make kiali
# Access at: http://localhost:20001

# Open Grafana (metrics)
make grafana
# Access at: http://localhost:3000

# Open Jaeger (tracing)
make jaeger
# Access at: http://localhost:16686
```

### View Logs

```bash
# Istio proxy logs (see traffic routing)
make logs-proxy

# Application logs
make logs-app

# Watch traffic in real-time
make watch-traffic
```

---

## 🎮 Makefile Commands

```bash
make help              # Show all commands

# Setup
make setup             # Complete setup
make enable-istio      # Enable Istio injection
make apply-chaos       # Apply chaos config

# Testing
make test-chaos        # Run 100-request test
make test-chaos-quick  # Run 10-request test
make test-health       # Test health endpoint

# Change Chaos Levels
make set-chaos-60      # 60% failure (default)
make set-chaos-80      # 80% failure
make set-chaos-30      # 30% failure
make set-chaos-0       # Disable chaos

# Monitoring
make status            # Show current configuration
make kiali             # Open Kiali dashboard
make grafana           # Open Grafana
make jaeger            # Open Jaeger

# Cleanup
make remove-chaos      # Remove chaos config
make disable-istio     # Disable Istio
make clean             # Complete cleanup
```

---

## 📊 Understanding the Results

### Test Output Example

```
╔══════════════════════════════════════════════════════════════╗
║                     Test Results                             ║
╚══════════════════════════════════════════════════════════════╝

Summary:
  Total Requests:    100
  Successful:        42 (42%)
  Failed:            58 (58%)

Status Code Distribution:
  200: 42 requests (42%)
  503: 58 requests (58%)

Expected vs Actual:
  Success Rate:   ✓ Within tolerance (Expected: 40%, Actual: 42%)
  Failure Rate:   ✓ Within tolerance (Expected: 60%, Actual: 58%)

Visual Distribution:
  [██████████████████████████████████████████████████]
   ^^^^^^^^^^^^^^^^^^^^^^^ Success (green)
                           ^^^^^^^^^^^^^^^^^^^^^^^^ Failure (red)
```

---

## 🔧 Configuration Details

### Current Setup

**Default Configuration:**
- **Failure Rate:** 60%
- **Success Rate:** 40%
- **Failure Status Code:** 503 (Service Unavailable)
- **Scope:** All `/api/*` paths
- **Exception:** `/_health` endpoint (never fails)

### ConfigMap Structure

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: temple-api-chaos-config
  namespace: temple-stack
data:
  failure-percent: "60"    # Percentage of requests that fail
  success-percent: "40"    # Percentage of requests that succeed
  failure-status: "503"    # HTTP status code for failures
```

### How It Works

1. **VirtualService** intercepts traffic to temple-api
2. **Fault Injection** randomly fails requests based on percentage
3. **ConfigMap** stores parameters externally
4. **chaos-controller.sh** applies ConfigMap values to VirtualService
5. **No pod restart needed** - changes apply immediately

---

## 🎨 Kiali Visualization

After running `make kiali`, you'll see:

### Service Graph View
```
┌──────────────┐
│   Ingress    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  temple-api  │◄── 60% RED (failed)
│   Service    │◄── 40% GREEN (success)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  PostgreSQL  │
└──────────────┘
```

### Traffic Metrics
- **Request Volume:** Shows total RPS
- **Success Rate:** Visual percentage
- **Response Time:** P50, P95, P99
- **Error Rate:** Highlighted in red

---

## 🧪 Advanced Scenarios

### Scenario 1: Gradual Failure Increase

```bash
# Start with low failure rate
make set-chaos-30
make test-chaos

# Increase gradually
make set-chaos-50
make test-chaos

# High failure rate
make set-chaos-80
make test-chaos
```

### Scenario 2: Add Delay Instead of Failures

Edit `istio-chaos-config.yaml`:

```yaml
fault:
  delay:
    percentage:
      value: 60.0
    fixedDelay: 3s  # 3 second delay on 60% of requests
```

Apply:
```bash
kubectl apply -f istio-chaos-config.yaml
```

### Scenario 3: Path-Specific Chaos

Different failure rates for different endpoints:

```yaml
http:
- match:
  - uri:
      prefix: /api/users
  fault:
    abort:
      percentage:
        value: 80.0  # 80% failure for /users
      httpStatus: 503
- match:
  - uri:
      prefix: /api/posts
  fault:
    abort:
      percentage:
        value: 20.0  # 20% failure for /posts
      httpStatus: 503
```

---

## 🐛 Troubleshooting

### Problem: Chaos Not Working (All Requests Succeed)

**Check 1: Verify Istio Sidecars**
```bash
kubectl get pods -n temple-stack
# Should show 2/2 for temple-api
```

**Check 2: Verify VirtualService**
```bash
make describe-vs
# Check fault.abort.percentage.value
```

**Check 3: Test Directly**
```bash
for i in {1..20}; do
  curl -s -o /dev/null -w "Status: %{http_code}\n" http://temple-api.local/api/users
done
```

---

### Problem: All Requests Fail

**Solution 1: Check Configuration**
```bash
make status
# Verify failure-percent isn't 100
```

**Solution 2: Temporarily Disable Chaos**
```bash
make set-chaos-0
make test-chaos-quick
```

---

### Problem: Can't Access temple-api.local

**Solution: Update /etc/hosts**
```bash
echo "127.0.0.1 temple-api.local" | sudo tee -a /etc/hosts
echo "127.0.0.1 temple-ui.local" | sudo tee -a /etc/hosts
```

**Test Connection:**
```bash
ping temple-api.local
curl http://temple-api.local/_health
```

---

### Problem: Istio Sidecar Not Injected

**Solution: Re-enable and Restart**
```bash
# Re-label namespace
kubectl label namespace temple-stack istio-injection=enabled --overwrite

# Force restart
kubectl delete pod -n temple-stack -l app=temple-api
kubectl delete pod -n temple-stack -l app=temple-ui

# Wait for pods
kubectl wait --for=condition=ready pod -n temple-stack -l app=temple-api --timeout=5m
```

---

## 📈 Metrics and Observability

### Key Metrics to Monitor

**In Grafana:**
1. **Request Rate:** Total requests/second
2. **Success Rate:** Percentage of 2xx responses
3. **Error Rate:** Percentage of 5xx responses
4. **Latency:** P50, P95, P99 response times
5. **Retry Rate:** How often clients retry

**In Kiali:**
1. **Service Graph:** Visual representation of traffic
2. **Traffic Distribution:** Request flow percentages
3. **Health Status:** Service health indicators
4. **Configuration:** VirtualService and DestinationRule status

**In Jaeger:**
1. **Trace Duration:** End-to-end request time
2. **Span Details:** Individual service call times
3. **Error Traces:** Failed request paths
4. **Dependency Graph:** Service dependencies

---

## 🎓 Learning Objectives

This chaos testing setup helps you learn:

### 1. **Resilience Patterns**
- How services handle failures
- Circuit breaker behavior
- Retry mechanisms
- Fallback strategies

### 2. **Observability**
- Distributed tracing with Jaeger
- Metrics visualization with Grafana
- Service mesh visualization with Kiali
- Log aggregation and analysis

### 3. **Istio Features**
- Traffic management
- Fault injection
- Virtual services
- Destination rules
- Service mesh capabilities

### 4. **Testing Strategies**
- Chaos engineering principles
- Failure injection techniques
- Progressive testing approach
- Metrics-driven validation

---

## 🚦 Best Practices

### 1. **Start Small**
```bash
# Begin with low failure rates
make set-chaos-30
make test-chaos

# Gradually increase
make set-chaos-60
make test-chaos

# Test extremes
make set-chaos-80
make test-chaos
```

### 2. **Monitor Continuously**
```bash
# Keep Kiali open while testing
make kiali

# Watch logs in another terminal
make logs-proxy
```

### 3. **Test Incrementally**
```bash
# Quick validation
make test-chaos-quick

# Full test after validation
make test-chaos

# Extended test for statistics
./test-chaos.sh 1000
```

### 4. **Document Results**
```bash
# Test results are auto-saved
ls -la chaos-test-results-*.txt

# Review results
cat chaos-test-results-*.txt
```

### 5. **Clean Up After Testing**
```bash
# Disable chaos when not testing
make set-chaos-0

# Or remove completely
make remove-chaos
```

---

## 📊 Sample Test Scenarios

### Scenario 1: Basic Resilience Test
```bash
# Test with default 60% failure
make test-chaos

# Expected: Application handles failures gracefully
# UI should show error messages, not crash
```

### Scenario 2: High Load + Chaos
```bash
# Terminal 1: Generate load
while true; do curl http://temple-api.local/api/users; sleep 0.1; done

# Terminal 2: Monitor
make kiali

# Terminal 3: Increase chaos
make set-chaos-80
```

### Scenario 3: Recovery Test
```bash
# Start with high failure
make set-chaos-90
make test-chaos

# Gradually recover
make set-chaos-60
make test-chaos

make set-chaos-30
make test-chaos

make set-chaos-0
make test-chaos
```

### Scenario 4: Weekend Load Test
```bash
# Friday afternoon: Enable chaos
make set-chaos-40

# Monitor over weekend
make status

# Monday morning: Review results and disable
cat chaos-test-results-*.txt
make set-chaos-0
```

---

## 🔐 Security Considerations

### 1. **Namespace Isolation**
- Chaos only affects `temple-stack` namespace
- Other namespaces are unaffected
- Network policies can add extra isolation

### 2. **Health Check Exemption**
```yaml
# Health checks never fail
- match:
  - uri:
      prefix: /_health
  # No fault injection
  route:
  - destination:
      host: temple-api-service
```

### 3. **Production Safeguards**
```bash
# Never enable in production accidentally
# Add namespace check to scripts:
if [ "$NAMESPACE" == "production" ]; then
  echo "ERROR: Cannot enable chaos in production"
  exit 1
fi
```

---

## 📚 Additional Resources

### Istio Documentation
- [Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)
- [Fault Injection](https://istio.io/latest/docs/tasks/traffic-management/fault-injection/)
- [Observability](https://istio.io/latest/docs/tasks/observability/)

### Chaos Engineering
- [Principles of Chaos Engineering](https://principlesofchaos.org/)
- [Chaos Engineering Book](https://www.oreilly.com/library/view/chaos-engineering/9781491988459/)
- [Netflix Chaos Monkey](https://netflix.github.io/chaosmonkey/)

### Tools
- [Kiali Documentation](https://kiali.io/docs/)
- [Grafana Dashboard](https://grafana.com/docs/)
- [Jaeger Tracing](https://www.jaegertracing.io/docs/)

---

## 🎯 Success Checklist

After setup, verify:

- [ ] Pods show `2/2` containers (app + istio-proxy)
- [ ] VirtualService is created and configured
- [ ] ConfigMap contains correct percentages
- [ ] Health check endpoint always succeeds
- [ ] Test script shows expected failure rate
- [ ] Kiali displays traffic with errors
- [ ] Grafana shows error rate metrics
- [ ] /etc/hosts has temple-api.local entry
- [ ] Can change failure rate without restart
- [ ] chaos-controller.sh updates successfully

---

## 🧹 Cleanup

### Temporary Disable
```bash
# Keep infrastructure, just disable chaos
make set-chaos-0
```

### Remove Chaos Config
```bash
# Remove chaos but keep Istio
make remove-chaos
```

### Complete Cleanup
```bash
# Remove chaos and disable Istio
make clean
```

### Manual Cleanup
```bash
# Delete chaos resources
kubectl delete virtualservice temple-api-chaos -n temple-stack
kubectl delete destinationrule temple-api-chaos -n temple-stack
kubectl delete gateway temple-api-gateway -n temple-stack
kubectl delete configmap temple-api-chaos-config -n temple-stack

# Remove Istio label
kubectl label namespace temple-stack istio-injection-

# Restart pods
kubectl rollout restart deployment/temple-api -n temple-stack
kubectl rollout restart deployment/temple-ui -n temple-stack
```

---

## 🤝 Support

### Getting Help

**Check Status:**
```bash
make status
```

**View Logs:**
```bash
make logs-proxy  # Istio routing logs
make logs-app    # Application logs
```

**Describe Resources:**
```bash
make describe-vs  # VirtualService details
make describe-dr  # DestinationRule details
```

**Community Resources:**
- Istio Slack: slack.istio.io
- Istio GitHub: github.com/istio/istio
- Stack Overflow: [istio] tag

---

## 📝 Common Questions

### Q: Why 60% failure rate?
**A:** Industry standard for chaos testing. Enough to expose issues but not overwhelming. Adjustable based on your needs.

### Q: Does this affect production?
**A:** Only if you deploy to production namespace. Recommended for dev/staging only.

### Q: Can I test specific endpoints?
**A:** Yes! Modify the VirtualService to target specific paths with different failure rates.

### Q: How do I test UI resilience?
**A:** Open http://temple-ui.local and interact while chaos is enabled. UI should handle API errors gracefully.

### Q: Can I schedule chaos tests?
**A:** Yes! Use a CronJob to enable/disable chaos at specific times.

### Q: Does this slow down my services?
**A:** Minimal overhead from Istio proxy. Failed requests are faster (immediate 503) than successful ones.

---

## 🎉 What's Next?

### Level 1: Basic Chaos ✅
- [x] Enable Istio
- [x] Apply fault injection
- [x] Run basic tests

### Level 2: Advanced Chaos
- [ ] Add delay injection
- [ ] Test different paths
- [ ] Circuit breaker configuration
- [ ] Retry policies

### Level 3: Automated Chaos
- [ ] CI/CD integration
- [ ] Scheduled chaos tests
- [ ] Automated metrics collection
- [ ] Alert on failure patterns

### Level 4: Production Chaos
- [ ] Gradual rollout strategy
- [ ] Percentage-based targeting
- [ ] Automated rollback
- [ ] Incident simulation

---

## 💡 Pro Tips

1. **Always test health checks first**
   ```bash
   make test-health
   ```

2. **Use Kiali for visual debugging**
   ```bash
   make kiali
   ```

3. **Save test results for analysis**
   ```bash
   ./test-chaos.sh 1000 > results.txt
   ```

4. **Monitor during changes**
   ```bash
   # Terminal 1
   make kiali
   
   # Terminal 2
   make set-chaos-80
   ```

5. **Test during low traffic**
   - Easier to see patterns
   - Less impact if issues arise

---

## 📞 Quick Reference Card

```bash
# Setup
./quick-setup-chaos.sh

# Change failure rates
make set-chaos-{0,30,60,80}

# Test
make test-chaos

# Monitor
make kiali

# Status
make status

# Cleanup
make clean

# Help
make help
```

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready ✅

---

Happy Chaos Testing! 🔥🧪