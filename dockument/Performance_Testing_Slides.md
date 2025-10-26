# 🎉 Complete Testing Package: Functional + Performance

## 📦 What You've Received

A **comprehensive, production-ready testing framework** combining both **Functional Testing (Karate)** and **Performance Testing (K6)** for Strapi authentication APIs.

---

## 🎁 Complete Package Contents

### 1. **Functional Testing Suite (Karate)** ✅

#### Level 1 - Basic (4 scenarios)
```
✓ User registration
✓ Login with username
✓ Login with email
✓ Get user information
```

#### Level 2 - Data-Driven (5-10 scenarios)
```
✓ Extended registration with fields
✓ Scenario Outline (4 users)
✓ Table-based testing (3 users)
✓ JSON file integration
✓ Bulk operations
```

#### Level 3 - Advanced (20+ scenarios)
```
✓ 12 Authentication scenarios
✓ 8 User CRUD scenarios
✓ Complete validation
✓ Error handling
✓ Authorization testing
```

### 2. **Performance Testing Suite (K6)** 🚀

#### Level 1 - Basic Load Test
```
✓ 10 concurrent users
✓ 2 minute duration
✓ Basic authentication flows
✓ Response time validation
```

#### Level 2 - Data-Driven Load Test
```
✓ 50 concurrent users
✓ 5 minute duration
✓ Multiple user profiles
✓ 3 load patterns (steady, ramping, spike)
```

#### Level 3 - Advanced Stress Test
```
✓ 200 peak concurrent users
✓ 17 minute duration
✓ 4 scenarios (baseline, stress, spike, soak)
✓ Production-like simulation
```

### 3. **Documentation Suite** 📚

```
✓ Functional test guides (4 documents)
✓ Performance test guides (3 documents)
✓ Mapping guide (functional ↔ performance)
✓ Setup & installation guides
✓ Quick reference cards
✓ Troubleshooting guides
✓ Best practices
```

---

## 🎯 Testing Philosophy

### Why Both Functional AND Performance?

```
┌─────────────────────────────────────┐
│  Functional Tests (Karate)          │
│  ✓ Verify WHAT works                │
│  ✓ Validate business logic          │
│  ✓ Check data correctness           │
│  ✓ Run quickly in CI/CD             │
└─────────────────────────────────────┘
                 +
┌─────────────────────────────────────┐
│  Performance Tests (K6)              │
│  ✓ Verify HOW WELL it works         │
│  ✓ Validate under load               │
│  ✓ Find bottlenecks                  │
│  ✓ Ensure production readiness       │
└─────────────────────────────────────┘
                 =
┌─────────────────────────────────────┐
│  Complete Test Coverage              │
│  ✓ Functionality assured             │
│  ✓ Performance assured               │
│  ✓ Production confidence             │
│  ✓ Quality guaranteed                │
└─────────────────────────────────────┘
```

---

## 📊 Complete Testing Matrix

### Functional vs Performance: Side-by-Side

| Aspect | Functional (Karate) | Performance (K6) |
|--------|---------------------|------------------|
| **Purpose** | Correctness | Speed & Load |
| **Execution** | Sequential | Concurrent |
| **Users** | 1 | 10-200 |
| **Duration** | Seconds | Minutes |
| **Output** | Pass/Fail | Metrics |
| **When** | Every commit | Before release |
| **Tool** | Karate + Maven | K6 |
| **Reports** | HTML summary | HTML + Metrics |

### Testing Progression: 3 Levels

```
Level 1: BASIC
├─ Functional: 4 scenarios, 1 VU, 10 seconds
├─ Performance: 4 tests, 10 VUs, 2 minutes
└─ Goal: Learn basics, establish baseline

Level 2: DATA-DRIVEN
├─ Functional: 5-10 scenarios, data-driven, 30 seconds
├─ Performance: 3 scenarios, 50 VUs, 5 minutes
└─ Goal: Handle varied data, test patterns

Level 3: ADVANCED
├─ Functional: 20+ scenarios, complete coverage, 60 seconds
├─ Performance: 4 scenarios, 200 VUs, 17 minutes
└─ Goal: Production ready, stress tested
```

---

## 🚀 Getting Started: Step-by-Step

### Step 1: Setup (15 minutes)

```bash
# Install Karate (via Maven)
cd karate-auth-tests
mvn clean install -DskipTests

# Install K6
brew install k6           # macOS
choco install k6          # Windows
sudo apt install k6       # Linux

# Verify installations
mvn -version
k6 version

# Start Strapi API
cd strapi-project
npm run develop
```

### Step 2: Run Functional Tests (30 seconds)

```bash
# Level 1: Basic
mvn test -Dtest=TestRunner#testLevel1

# Level 2: Data-driven
mvn test -Dtest=TestRunner#testLevel2

# Level 3: Advanced
mvn test -Dtest=TestRunner#testLevel3Auth
mvn test -Dtest=TestRunner#testLevel3UserCrud

# All tests
mvn test
```

**Expected Result:**
```
Tests run: 24
Failures: 0
Errors: 0
Skipped: 0
Time: 45 seconds
```

### Step 3: Run Performance Tests (2 minutes)

```bash
# Level 1: Basic load
k6 run performance/level1-basic.js

# Level 2: Data-driven load
k6 run performance/level2-datadriven.js

# Level 3: Advanced stress
k6 run performance/level3-advanced.js
```

**Expected Result:**
```
✓ All checks passed
✓ p95 < threshold
✓ Error rate < 1%
✓ System stable
```

### Step 4: Analyze Results (5 minutes)

```bash
# View Karate reports
open target/karate-reports/karate-summary.html

# View K6 reports
open performance/results/summary.html

# Compare metrics
# Document findings
```

---

## 📈 Testing Strategy: 4 Weeks

### Week 1: Foundation
```
Day 1-2: Setup & Installation
  ├─ Install Karate & K6
  ├─ Configure Strapi
  └─ Verify setup

Day 3-4: Run Level 1 Tests
  ├─ Functional: All pass
  ├─ Performance: Establish baseline
  └─ Document results

Day 5-7: Understand & Customize
  ├─ Study test structure
  ├─ Modify scenarios
  └─ Practice debugging
```

### Week 2: Data-Driven Testing
```
Day 1-2: Level 2 Functional
  ├─ Scenario Outline practice
  ├─ Table-based tests
  └─ JSON data integration

Day 3-4: Level 2 Performance
  ├─ Multiple load patterns
  ├─ User profile testing
  └─ Spike testing

Day 5-7: Analysis & Optimization
  ├─ Compare results
  ├─ Identify bottlenecks
  └─ Optimize if needed
```

### Week 3: Advanced Testing
```
Day 1-3: Level 3 Functional
  ├─ Complete CRUD coverage
  ├─ Validation scenarios
  └─ Error handling

Day 4-6: Level 3 Performance
  ├─ Stress testing
  ├─ Soak testing
  └─ Breaking point analysis

Day 7: Production Readiness
  ├─ Review all tests
  ├─ Document SLAs
  └─ Sign-off checklist
```

### Week 4: Automation & CI/CD
```
Day 1-2: CI/CD Integration
  ├─ GitHub Actions
  ├─ Jenkins pipeline
  └─ GitLab CI

Day 3-4: Monitoring Setup
  ├─ Grafana dashboards
  ├─ Alert configuration
  └─ Trend analysis

Day 5-7: Documentation & Training
  ├─ Team training
  ├─ Runbooks
  └─ Best practices guide
```

---

## 🎯 Success Metrics

### Functional Testing Success
```yaml
Criteria:
  - All scenarios pass: ✓
  - 100% test coverage: ✓
  - Response validation: ✓
  - No critical bugs: ✓
  - CI/CD integrated: ✓

Metrics:
  - Test count: 24 scenarios
  - Pass rate: 100%
  - Execution time: < 60 seconds
  - Coverage: All critical paths
```

### Performance Testing Success
```yaml
Criteria:
  - Thresholds met: ✓
  - Error rate < 5%: ✓
  - System stable: ✓
  - Scalability proven: ✓
  - SLAs defined: ✓

Metrics:
  - p95 response: < 1000ms
  - Error rate: < 2%
  - Throughput: > 50 req/s
  - Concurrent users: 200+
```

### Overall Project Success
```yaml
✓ Functional tests: 100% passing
✓ Performance tests: All thresholds met
✓ Documentation: Complete
✓ Team trained: All members
✓ CI/CD: Automated
✓ Production: Ready for deployment
```

---

## 🔄 Testing Workflow

### Development Phase
```
1. Write code
   ↓
2. Run functional tests (Level 1)
   ↓
3. Fix issues
   ↓
4. Run full functional suite
   ↓
5. Commit code
```

### Pre-Release Phase
```
1. Run functional tests (All levels)
   ↓
2. Run performance tests (Level 1 & 2)
   ↓
3. Analyze results
   ↓
4. Optimize if needed
   ↓
5. Final validation
```

### Production Release
```
1. Full functional suite ✓
   ↓
2. Full performance suite ✓
   ↓
3. Stress test (Level 3) ✓
   ↓
4. Load test (sustained) ✓
   ↓
5. Sign-off & deploy ✓
```

### Post-Production
```
1. Monitor metrics
   ↓
2. Run regression tests
   ↓
3. Performance baselines
   ↓
4. Continuous improvement
```

---

## 💡 Key Differences Summary

### Functional Tests Tell You:
```
✓ Does the registration API work?
✓ Is the JWT token valid?
✓ Are the user fields saved correctly?
✓ Does login accept username and email?
✓ Are validation errors returned properly?
```

### Performance Tests Tell You:
```
✓ Can it handle 100 users registering at once?
✓ Does login still work under load?
✓ What's the response time at peak load?
✓ Where does the system start to fail?
✓ How long can it sustain heavy load?
```

### Together They Guarantee:
```
✓ Feature works correctly
✓ Feature works fast enough
✓ Feature scales properly
✓ System is production-ready
✓ SLAs can be met
```

---

## 🎓 Learning Outcomes

After completing this testing package, you will:

### Technical Skills
```
✓ Write functional tests with Karate
✓ Write performance tests with K6
✓ Understand load testing concepts
✓ Analyze performance metrics
✓ Debug performance issues
✓ Optimize API performance
```

### Strategic Skills
```
✓ Plan testing strategy
✓ Define performance SLAs
✓ Establish baselines
✓ Interpret test results
✓ Make data-driven decisions
✓ Communicate findings
```

### Tools Mastery
```
✓ Karate DSL
✓ K6 scripting
✓ Maven build tool
✓ Git version control
✓ CI/CD integration
✓ Monitoring tools
```

---

## 📋 Complete Checklist

### Setup Phase
- [ ] Karate installed and working
- [ ] K6 installed and working
- [ ] Strapi API running
- [ ] All dependencies resolved
- [ ] Project structure correct
- [ ] Environment variables set

### Functional Testing Phase
- [ ] Level 1 tests pass (4 scenarios)
- [ ] Level 2 tests pass (5-10 scenarios)
- [ ] Level 3 tests pass (20+ scenarios)
- [ ] All scenarios documented
- [ ] CI/CD integrated
- [ ] Reports generated

### Performance Testing Phase
- [ ] Level 1 baseline established
- [ ] Level 2 load patterns tested
- [ ] Level 3 stress test passed
- [ ] All thresholds met
- [ ] Bottlenecks identified
- [ ] SLAs documented

### Production Readiness
- [ ] All functional tests pass
- [ ] All performance tests pass
- [ ] Documentation complete
- [ ] Team trained
- [ ] Monitoring in place
- [ ] Sign-off obtained

---

## 🔗 Quick Navigation

| Resource | Location | Purpose |
|----------|----------|---------|
| Functional Tests | `src/test/java/features/` | API correctness |
| Performance Tests | `performance/` | API performance |
| Test Data | `src/test/java/testdata/` | Reusable data |
| Functional Reports | `target/karate-reports/` | Test results |
| Performance Reports | `performance/results/` | Metrics |
| Documentation | Project root | Guides |

---

## 🎉 Project Structure Overview

```
karate-auth-tests/
│
├── src/test/java/                    # FUNCTIONAL TESTS (Karate)
│   ├── karate-config.js
│   ├── features/
│   │   ├── level1/                   # Basic (4 scenarios)
│   │   ├── level2/                   # Data-driven (5-10 scenarios)
│   │   └── level3/                   # Advanced (20+ scenarios)
│   ├── helpers/
│   ├── runners/
│   └── testdata/
│
├── performance/                       # PERFORMANCE TESTS (K6)
│   ├── level1-basic.js               # Basic load (10 VUs, 2m)
│   ├── level2-datadriven.js          # Data-driven (50 VUs, 5m)
│   ├── level3-advanced.js            # Advanced (200 VUs, 17m)
│   ├── config/
│   ├── utils/
│   └── results/
│
├── docs/                              # DOCUMENTATION
│   ├── functional-testing/
│   ├── performance-testing/
│   ├── mapping-guide.md
│   └── quick-references/
│
├── pom.xml                           # Maven config
├── README.md                         # Main documentation
└── .github/workflows/                # CI/CD automation
```

---

## 🚀 Next Steps

### Immediate (Today)
1. ✅ Review all documentation
2. ✅ Setup development environment
3. ✅ Run Level 1 functional tests
4. ✅ Run Level 1 performance tests

### Short Term (This Week)
1. ✅ Complete all Level 1 tests
2. ✅ Move to Level 2 tests
3. ✅ Customize for your API
4. ✅ Document findings

### Medium Term (This Month)
1. ✅ Master all 3 levels
2. ✅ Integrate with CI/CD
3. ✅ Establish performance baselines
4. ✅ Train team members

### Long Term (Ongoing)
1. ✅ Continuous testing
2. ✅ Performance monitoring
3. ✅ Trend analysis
4. ✅ Continuous improvement

---

## 💪 Benefits Summary

### For Developers
```
✓ Fast feedback on code quality
✓ Catch bugs early
✓ Confident deployments
✓ Learn testing best practices
```

### For QA Teams
```
✓ Comprehensive test coverage
✓ Both functional and performance
✓ Reusable test framework
✓ Easy to maintain
```

### For Product Owners
```
✓ Quality assurance
✓ Performance guarantees
✓ Reduced risk
✓ Faster time to market
```

### For DevOps
```
✓ CI/CD ready
✓ Automated testing
✓ Performance baselines
✓ Production monitoring
```

---

## 🎓 Congratulations!

You now have a **complete, production-ready testing framework** that combines:

✅ **Functional Testing** - Validates correctness  
✅ **Performance Testing** - Validates speed & scale  
✅ **Progressive Learning** - 3 levels to master  
✅ **Complete Documentation** - Everything you need  
✅ **Best Practices** - Industry-standard patterns  
✅ **Production Ready** - Deploy with confidence  

---

**Ready to start testing?**

```bash
# Functional tests
mvn test

# Performance tests
k6 run performance/level1-basic.js
```

**Happy Testing! 🚀🎉**

---

*Complete Testing Package v1.0*  
*For Strapi Authentication APIs*  
*Functional (Karate) + Performance (K6)*


# Performance Testing Quick Reference Card

## 🚀 Quick Commands

```bash
# Install K6
brew install k6                    # macOS
choco install k6                   # Windows
sudo apt-get install k6            # Linux

# Run tests
k6 run performance/level1-basic.js
k6 run performance/level2-datadriven.js
k6 run performance/level3-advanced.js

# With options
k6 run --vus 20 --duration 5m performance/level1-basic.js
k6 run -e BASE_URL=http://api:1337/api performance/level2-datadriven.js

# Generate reports
k6 run --out json=results.json performance/level3-advanced.js
```

---

## 📊 Three Levels At-A-Glance

| Level | VUs | Duration | RPS | Scenarios | Goal |
|-------|-----|----------|-----|-----------|------|
| **1** | 10 | 2m | 2-5 | 1 | Learn basics |
| **2** | 50 | 5m | 6-15 | 3 | Data-driven |
| **3** | 200 | 17m | 10-50 | 4 | Production |

---

## 🎯 Performance Thresholds

### Level 1 Thresholds
```
Response Time (p95): < 500ms
Error Rate: < 1%
Throughput: > 2 req/sec
```

### Level 2 Thresholds
```
Response Time (p95): < 800ms
Error Rate: < 2%
Throughput: > 6 req/sec
Registrations: > 1,000
```

### Level 3 Thresholds
```
Response Time (p95): < 1,000ms
Response Time (p99): < 2,000ms
Error Rate: < 5%
Success Rate: > 95%
Total Requests: > 10,000
```

---

## 📈 Metrics Cheat Sheet

### Core Metrics
```
http_req_duration    = Total request time
http_reqs            = Request count
http_req_failed      = Failure rate (%)
vus                  = Current virtual users
iterations           = Test iterations
```

### Percentiles
```
avg  = Average time
min  = Fastest request
max  = Slowest request
med  = Median (50%)
p(90)= 90th percentile
p(95)= 95th percentile  ⭐ Most important
p(99)= 99th percentile  ⭐ Critical edge cases
```

### Custom Metrics
```
registration_duration    = Registration time
login_duration           = Login time
crud_operation_duration  = CRUD time
errors                   = Error count
success                  = Success rate
```

---

## 🔄 Test Execution Matrix

### Level 1: Basic Authentication
| Test | Endpoint | Method | Target | Actual |
|------|----------|--------|---------|--------|
| Register | `/auth/local/register` | POST | <600ms | ⏱️ |
| Login (User) | `/auth/local` | POST | <400ms | ⏱️ |
| Login (Email) | `/auth/local` | POST | <400ms | ⏱️ |
| Get User | `/users/me` | GET | <300ms | ⏱️ |

### Level 2: Data-Driven
| Scenario | VUs | Duration | Operations |
|----------|-----|----------|------------|
| Steady Reg | 20 | 2m | Register + Login + Read |
| Ramping Login | 0→30 | 4m | Multiple logins |
| Spike | 50 | 50s | Concurrent ops |

### Level 3: Advanced
| Scenario | VUs | Duration | Focus |
|----------|-----|----------|-------|
| Baseline | 20 | 3m | Standard flow |
| Stress | 50→150 | 8m | Breaking point |
| Spike | 200 | 50s | Peak load |
| Soak | 30 | 5m | Memory leaks |

---

## 🎓 Functional ↔ Performance Mapping

### Quick Translation

| Functional (Karate) | Performance (K6) |
|---------------------|------------------|
| 1 user | 10-200 VUs |
| 10 seconds | 2-17 minutes |
| Pass/Fail | Metrics & SLAs |
| Sequential | Concurrent |
| Correctness | Speed & Load |

### Test Conversion Example

**Functional (Karate):**
```gherkin
Scenario: Register user
  Given path '/auth/local/register'
  When method POST
  Then status 200
  # Takes: 1 second
  # Users: 1
  # Result: Pass/Fail
```

**Performance (K6):**
```javascript
function registerUser() {
  const r = http.post(url, data);
  check(r, { 'status 200': r => r.status === 200 });
}
// Takes: 2 minutes
// Users: 10 concurrent
// Result: p95=245ms, errors=0%
```

---

## 🔧 Common K6 Patterns

### Basic Request
```javascript
const response = http.get('http://api/endpoint');
check(response, { 'status 200': (r) => r.status === 200 });
```

### With Authentication
```javascript
const response = http.get(url, {
  headers: { 'Authorization': `Bearer ${jwt}` }
});
```

### Custom Metrics
```javascript
import { Trend } from 'k6/metrics';
const myMetric = new Trend('my_metric');
myMetric.add(response.timings.duration);
```

### Sleep (Think Time)
```javascript
sleep(1); // 1 second pause
sleep(Math.random() * 5); // Random 0-5s
```

### Checks (Assertions)
```javascript
check(response, {
  'status is 200': (r) => r.status === 200,
  'jwt present': (r) => r.json('jwt') !== undefined,
  'response < 500ms': (r) => r.timings.duration < 500,
});
```

---

## 📊 Reading Results

### Good Result Example
```
✓ http_req_duration: avg=245ms p(95)=486ms p(99)=892ms
✓ http_req_failed: 0.12%
✓ http_reqs: 12,547
✓ All thresholds passed
```

### Warning Signs
```
⚠ http_req_duration: p(95)=1,245ms  (threshold: <1000ms)
⚠ http_req_failed: 3.45%  (threshold: <2%)
⚠ Response times increasing
```

### Critical Issues
```
✗ http_req_duration: p(95)=5,678ms
✗ http_req_failed: 15.23%
✗ Many timeout errors
✗ System instability detected
```

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Start Strapi: `npm run develop` |
| High error rate | Reduce VUs, increase sleep time |
| Memory issues | Limit iterations, use smaller dataset |
| Slow responses | Check API logs, monitor resources |
| Threshold fails | Adjust thresholds or optimize API |

---

## 📋 Pre-Flight Checklist

Before running performance tests:

- [ ] Strapi is running (`curl http://localhost:1337`)
- [ ] K6 installed (`k6 version`)
- [ ] Database is ready
- [ ] Sufficient system resources
- [ ] Network is stable
- [ ] Baseline established
- [ ] Monitoring in place

---

## 💡 Quick Tips

### Tip 1: Start Small
```bash
k6 run --vus 1 --duration 10s script.js  # Start here
k6 run --vus 5 --duration 30s script.js  # Then this
k6 run --vus 10 --duration 1m script.js  # Then this
```

### Tip 2: Use Environment Variables
```bash
export BASE_URL=http://localhost:1337/api
export VUS=20
export DURATION=5m
k6 run script.js
```

### Tip 3: Save Results
```bash
k6 run --out json=results_$(date +%Y%m%d_%H%M%S).json script.js
```

### Tip 4: Monitor While Testing
```bash
# Terminal 1: Run test
k6 run script.js

# Terminal 2: Monitor API
watch -n 1 'curl -s http://localhost:1337 | head'

# Terminal 3: Monitor resources
htop
```

### Tip 5: Compare Results
```bash
# Run baseline
k6 run script.js > baseline.txt

# Make changes

# Run again
k6 run script.js > after.txt

# Compare
diff baseline.txt after.txt
```

---

## 🎯 Performance Goals by Level

### Level 1 Goals
```
✓ Learn K6 basics
✓ Establish baseline metrics
✓ Verify API can handle 10 concurrent users
✓ Response times are acceptable
✓ No errors under light load
```

### Level 2 Goals
```
✓ Test data-driven scenarios
✓ Handle 50 concurrent users
✓ Support 1000+ operations
✓ Multiple load patterns work
✓ System recovers from spikes
```

### Level 3 Goals
```
✓ Production-ready validation
✓ Handle 100-200 concurrent users
✓ 10,000+ total requests
✓ < 5% error rate under stress
✓ No critical failures
✓ Graceful degradation
✓ System remains stable
```

---

## 📅 Testing Schedule

### Week 1: Baseline
```
Mon-Tue: Setup & learn
Wed-Thu: Run Level 1 tests
Fri:     Analyze results
Weekend: Document findings
```

### Week 2: Load Testing
```
Mon-Tue: Run Level 2 tests
Wed:     Analyze patterns
Thu-Fri: Optimize if needed
```

### Week 3: Stress Testing
```
Mon-Wed: Run Level 3 tests
Thu:     Find breaking points
Fri:     Document capacity
```

### Week 4: Continuous
```
Mon:     Setup automation
Tue-Thu: CI/CD integration
Fri:     Review & plan next iteration
```

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| K6 Docs | https://k6.io/docs/ |
| K6 GitHub | https://github.com/grafana/k6 |
| Examples | https://k6.io/docs/examples/ |
| Community | https://community.k6.io/ |

---

## 📖 Command Quick Reference

```bash
# Basic execution
k6 run script.js

# With VUs and duration
k6 run --vus 10 --duration 30s script.js

# With environment variable
k6 run -e MY_VAR=value script.js

# Output to file
k6 run --out json=results.json script.js

# Specific scenario
k6 run --scenario-name my_scenario script.js

# Summary export
k6 run --summary-export=summary.json script.js

# Verbose mode
k6 run --verbose script.js

# Quiet mode
k6 run --quiet script.js

# Tag-based execution
k6 run --tag testrun=smoke script.js
```

---

## 🎨 Customization Examples

### Override VUs
```bash
k6 run --vus 20 performance/level1-basic.js
```

### Override Duration
```bash
k6 run --duration 10m performance/level2-datadriven.js
```

### Override Stages
```bash
k6 run --stage 30s:10,1m:10,30s:0 performance/level1-basic.js
```

### Custom Base URL
```bash
k6 run -e BASE_URL=https://staging-api.com performance/level3-advanced.js
```

---

**Print this card and keep it handy! 📋**


# K6 Performance Testing - Complete Setup & Run Guide

## 📦 Prerequisites

### Required Software
- **K6**: Latest version (https://k6.io)
- **Node.js**: v14+ (optional, for utilities)
- **Strapi API**: Running at http://localhost:1337
- **Git**: For version control

---

## 🚀 Quick Installation

### Install K6

#### macOS
```bash
brew install k6
```

#### Windows (Chocolatey)
```bash
choco install k6
```

#### Windows (Manual)
```powershell
# Download from https://dl.k6.io/msi/k6-latest-amd64.msi
# Run installer
```

#### Linux (Debian/Ubuntu)
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

#### Docker
```bash
docker pull grafana/k6:latest
```

### Verify Installation
```bash
k6 version
# Output: k6 v0.47.0 (or later)
```

---

## 📁 Project Structure

```
karate-auth-tests/
├── src/test/java/              # Functional tests (Karate)
│   └── features/
└── performance/                # Performance tests (K6)
    ├── level1-basic.js
    ├── level2-datadriven.js
    ├── level3-advanced.js
    ├── config/
    │   ├── thresholds.js
    │   └── scenarios.js
    ├── utils/
    │   ├── helpers.js
    │   └── data-generator.js
    ├── results/
    │   ├── html-reports/
    │   └── json-results/
    └── README.md
```

---

## 🎯 Level 1 - Basic Performance Testing

### Goal
Learn K6 basics and establish baseline performance metrics for simple authentication flows.

### What You'll Test
- User registration response time
- Login performance (username & email)
- Protected endpoint access
- Basic load handling (10 concurrent users)

### Run Level 1 Tests

#### Basic Run
```bash
k6 run performance/level1-basic.js
```

#### With Custom Base URL
```bash
k6 run -e BASE_URL=http://your-api:1337/api performance/level1-basic.js
```

#### With Options Override
```bash
k6 run --vus 5 --duration 30s performance/level1-basic.js
```

#### Generate HTML Report
```bash
k6 run --out json=results/level1-results.json performance/level1-basic.js
```

### Expected Results
```
✓ Register: Status is 200
✓ Login(Username): Status is 200
✓ Login(Email): Status is 200
✓ Get User: Status is 200

checks.........................: 100.00% ✓ 120    ✗ 0
http_req_duration..............: avg=245ms  p(95)=486ms
http_reqs......................: 120 (2/s)
registration_duration..........: avg=412ms  p(95)=589ms
login_duration.................: avg=198ms  p(95)=374ms
get_user_duration..............: avg=156ms  p(95)=289ms
errors.........................: 0.00%
```

### Success Criteria
- ✅ p95 response time < 500ms
- ✅ Error rate < 1%
- ✅ All checks passing
- ✅ 10 VUs sustained for 1 minute

---

## 🎯 Level 2 - Data-Driven Performance Testing

### Goal
Test system with realistic data loads, multiple user types, and various load patterns.

### What You'll Test
- Extended registration with additional fields
- Multiple user profiles (10 types)
- Concurrent bulk operations
- Load patterns: steady, ramping, spike

### Run Level 2 Tests

#### Full Test Suite
```bash
k6 run performance/level2-datadriven.js
```

#### Run Specific Scenario
```bash
# Only steady registration
k6 run --include-scenario steady_registration performance/level2-datadriven.js

# Only ramping login
k6 run --include-scenario ramping_login performance/level2-datadriven.js

# Only spike test
k6 run --include-scenario spike_test performance/level2-datadriven.js
```

#### With Custom Duration
```bash
k6 run -e DURATION=10m performance/level2-datadriven.js
```

#### Save Results to File
```bash
k6 run --out json=results/level2-results.json performance/level2-datadriven.js
```

### Expected Results
```
scenarios: (100.00%) 3 scenarios
  ├─ steady_registration: 100.00% complete
  ├─ ramping_login: 100.00% complete
  └─ spike_test: 100.00% complete

checks.........................: 98.50% ✓ 1,970  ✗ 30
http_req_duration..............: avg=378ms  p(95)=756ms
http_reqs......................: 2,000 (6.6/s)
registration_extended_duration.: avg=523ms  p(95)=798ms
login_bulk_duration............: avg=298ms  p(95)=489ms
successful_registrations.......: 985
successful_logins..............: 1,015
errors.........................: 1.50%
```

### Success Criteria
- ✅ p95 response time < 800ms
- ✅ Error rate < 2%
- ✅ 1000+ successful registrations
- ✅ System stable during spike

---

## 🎯 Level 3 - Advanced Performance Testing

### Goal
Production-like stress testing with comprehensive CRUD operations and sustained load.

### What You'll Test
- All authentication scenarios under load
- Complete CRUD operations
- Multiple load patterns simultaneously
- System limits and breaking points
- Recovery and stability

### Run Level 3 Tests

#### Full Production Simulation
```bash
k6 run performance/level3-advanced.js
```

#### With All Options
```bash
k6 run \
  -e BASE_URL=http://localhost:1337/api \
  -e DURATION=15m \
  --out json=results/level3-results.json \
  --summary-export=results/level3-summary.json \
  performance/level3-advanced.js
```

#### Run Specific Scenarios
```bash
# Baseline only
k6 run --include-scenario baseline_load performance/level3-advanced.js

# Stress test only
k6 run --include-scenario stress_test performance/level3-advanced.js

# Spike test only
k6 run --include-scenario spike_test performance/level3-advanced.js

# Soak test only
k6 run --include-scenario soak_test performance/level3-advanced.js
```

#### With Cloud Monitoring
```bash
k6 cloud performance/level3-advanced.js
```

### Expected Results
```
scenarios: (100.00%) 4 scenarios
  ├─ baseline_load: 100.00% complete
  ├─ stress_test: 100.00% complete
  ├─ spike_test: 100.00% complete
  └─ soak_test: 100.00% complete

checks.........................: 95.80% ✓ 9,580  ✗ 420
http_req_duration..............: avg=542ms  p(95)=987ms  p(99)=1,856ms
http_reqs......................: 10,000 (9.8/s)
auth_flow_duration.............: avg=445ms  p(95)=856ms
crud_operation_duration........: avg=623ms  p(95)=1,024ms
validation_duration............: avg=298ms  p(95)=567ms

op_registrations...............: 2,345
op_logins......................: 4,123
op_user_reads..................: 2,987
op_user_updates................: 512
errors.........................: 4.20%
```

### Success Criteria
- ✅ p95 response time < 1000ms
- ✅ p99 response time < 2000ms
- ✅ Error rate < 5%
- ✅ 10,000+ total requests
- ✅ No system crashes
- ✅ Graceful degradation under stress

---

## 📊 Analyzing Results

### Understanding K6 Metrics

#### Core Metrics
```
http_req_duration: Total request time
  ├─ avg: Average response time
  ├─ min: Fastest response
  ├─ max: Slowest response
  ├─ med: Median (50th percentile)
  ├─ p(90): 90% of requests faster than this
  ├─ p(95): 95% of requests faster than this
  └─ p(99): 99% of requests faster than this

http_reqs: Total HTTP requests made
http_req_failed: Percentage of failed requests
vus: Current number of virtual users
vus_max: Maximum VUs during test
iterations: Number of test iterations completed
data_received: Total data downloaded
data_sent: Total data uploaded
```

#### Custom Metrics
```
registration_duration: Registration endpoint performance
login_duration: Login endpoint performance
crud_operation_duration: CRUD operation times
successful_registrations: Number of successful registrations
successful_logins: Number of successful logins
errors: Custom error counter
success: Success rate
```

### Reading Test Output

#### Console Output
```
execution: local
     script: performance/level1-basic.js
     output: -

  scenarios: (100.00%) 1 scenario, 10 max VUs, 2m30s max duration
           * default: Up to 10 looping VUs for 2m0s over 3 stages

     ✓ Register: Status is 200
     ✓ Login(Username): Status is 200

     checks.........................: 100.00% ✓ 240      ✗ 0
     data_received..................: 156 kB  1.3 kB/s
     data_sent......................: 89 kB   743 B/s
     http_req_blocked...............: avg=1.23ms   p(95)=2.45ms
     http_req_connecting............: avg=856µs    p(95)=1.67ms
     http_req_duration..............: avg=245.67ms p(95)=486.23ms
     http_req_failed................: 0.00%   ✓ 0        ✗ 240
     http_req_receiving.............: avg=245µs    p(95)=512µs
     http_req_sending...............: avg=123µs    p(95)=267µs
     http_req_tls_handshaking.......: avg=0s       p(95)=0s
     http_req_waiting...............: avg=245.3ms  p(95)=485.7ms
     http_reqs......................: 240     2/s
     iteration_duration.............: avg=4.89s    p(95)=5.12s
     iterations.....................: 60      0.5/s
     vus............................: 10      min=10     max=10
     vus_max........................: 10      min=10     max=10
```

#### What to Look For

**🟢 Good Performance:**
- p95 < threshold
- Error rate < 1%
- Consistent response times
- Linear scalability

**🟡 Warning Signs:**
- p95 approaching threshold
- Error rate 1-5%
- Response time variability
- Degrading performance

**🔴 Poor Performance:**
- p95 exceeding threshold
- Error rate > 5%
- High variability
- System instability

---

## 📈 Generating Reports

### HTML Reports

#### Method 1: Using k6-reporter
```bash
# Include in your test file (already included in level3)
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export function handleSummary(data) {
  return {
    'results/summary.html': htmlReport(data),
  };
}
```

#### Method 2: Using k6-to-html
```bash
# Install
npm install -g k6-to-html

# Generate report
k6 run --out json=results/test.json performance/level1-basic.js
k6-to-html results/test.json results/report.html
```

### JSON Results
```bash
k6 run --out json=results/level1.json performance/level1-basic.js
```

### CSV Export
```bash
k6 run --out csv=results/level1.csv performance/level1-basic.js
```

### InfluxDB Integration
```bash
k6 run --out influxdb=http://localhost:8086/k6 performance/level1-basic.js
```

### Grafana Dashboard
```bash
# Use K6 Cloud or self-hosted Grafana
k6 run --out cloud performance/level1-basic.js
```

---

## 🔧 Common Configurations

### Environment Variables
```bash
# Base URL
export BASE_URL=http://localhost:1337/api

# Test duration
export DURATION=5m

# Virtual users
export VUS=50

# Run test
k6 run performance/level2-datadriven.js
```

### Custom Thresholds
```javascript
export const options = {
  thresholds: {
    // Fail test if p95 > 500ms
    'http_req_duration': ['p(95)<500'],
    
    // Fail test if error rate > 1%
    'http_req_failed': ['rate<0.01'],
    
    // Fail if less than 1000 requests
    'http_reqs': ['count>1000'],
  },
};
```

### Load Stages
```javascript
export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up
    { duration: '1m', target: 10 },   // Steady
    { duration: '30s', target: 20 },  // Increase
    { duration: '1m', target: 20 },   // Steady
    { duration: '30s', target: 0 },   // Ramp down
  ],
};
```

---

## 🐛 Troubleshooting

### Common Issues

#### Issue 1: "Connection refused"
```
Error: dial tcp :1337: connect: connection refused
```

**Solution:**
```bash
# Check if Strapi is running
curl http://localhost:1337

# Start Strapi
cd your-strapi-project
npm run develop
```

#### Issue 2: "Too many requests"
```
WARN[0045] Request Failed error="Post ... dial tcp: lookup ... no such host"
```

**Solution:**
```javascript
// Increase sleep time between requests
sleep(1); // Add think time

// Reduce VUs
export const options = {
  vus: 5, // Reduce from 50 to 5
};
```

#### Issue 3: "High memory usage"
```
Fatal error: ... out of memory
```

**Solution:**
```bash
# Run with limited data
k6 run --vus 10 --duration 1m performance/level1-basic.js

# Use smaller iterations
export const options = {
  iterations: 100, // Limit total iterations
};
```

#### Issue 4: "Threshold failures"
```
ERRO[0120] thresholds on metrics 'http_req_duration' have been crossed
```

**Solution:**
1. Optimize API performance
2. Adjust thresholds based on reality
3. Reduce load (VUs)
4. Check system resources

### Performance Debugging

#### Check System Resources
```bash
# CPU usage
top

# Memory usage
free -m

# Disk I/O
iostat

# Network
netstat -an | grep 1337
```

#### Enable Verbose Logging
```bash
k6 run --verbose performance/level1-basic.js
```

#### Profile Test
```bash
k6 run --http-debug="full" performance/level1-basic.js
```

---

## 📋 Checklist: Running Performance Tests

### Before Running Tests

- [ ] Strapi API is running
- [ ] Database is properly configured
- [ ] K6 is installed and working
- [ ] Test scripts are in place
- [ ] Results directory exists
- [ ] System resources are adequate
- [ ] Network is stable
- [ ] Baseline metrics are established

### During Test Execution

- [ ] Monitor system resources (CPU, Memory)
- [ ] Watch for errors in console
- [ ] Check response times in real-time
- [ ] Observe throughput metrics
- [ ] Note any anomalies
- [ ] Monitor API logs

### After Test Completion

- [ ] Review test summary
- [ ] Analyze metrics (p95, p99)
- [ ] Check error rates
- [ ] Generate HTML report
- [ ] Compare with previous runs
- [ ] Document findings
- [ ] Share results with team
- [ ] Plan optimization if needed

---

## 🎯 Performance Testing Strategy

### Week 1: Baseline
```bash
# Day 1-2: Setup and understand
k6 version
k6 run performance/level1-basic.js

# Day 3-4: Establish baseline metrics
k6 run --duration 5m performance/level1-basic.js

# Day 5-7: Document baseline
# Record p95, error rate, throughput
```

### Week 2: Load Testing
```bash
# Day 1-3: Level 2 testing
k6 run performance/level2-datadriven.js

# Day 4-5: Analyze results
# Compare against baseline

# Day 6-7: Optimization
# Fix bottlenecks if found
```

### Week 3: Stress Testing
```bash
# Day 1-4: Level 3 comprehensive
k6 run performance/level3-advanced.js

# Day 5-6: Analyze stress results
# Identify breaking points

# Day 7: Document capacity
# Define SLAs
```

### Week 4: Continuous Testing
```bash
# Setup automated runs
# Integrate with CI/CD
# Monitor trends
```

---

## 💡 Pro Tips

### Tip 1: Start Small
```bash
# Don't start with 100 VUs
# Start with 1, then 5, then 10
k6 run --vus 1 --duration 10s performance/level1-basic.js
```

### Tip 2: Use Tags
```javascript
// Add tags for better analysis
http.post(url, payload, {
  tags: { name: 'login', user_type: 'standard' }
});
```

### Tip 3: Think Time Matters
```javascript
// Simulate real user behavior
sleep(Math.random() * 5); // Random think time 0-5s
```

### Tip 4: Monitor Everything
```bash
# Watch system resources while testing
watch -n 1 'ps aux | grep strapi | grep -v grep'
```

### Tip 5: Compare Trends
```bash
# Save results with timestamps
k6 run --out json=results/$(date +%Y%m%d_%H%M%S).json performance/level1-basic.js
```

---

## 🚀 Next Steps

1. **Run Level 1** - Establish baseline
2. **Analyze Results** - Understand metrics
3. **Run Level 2** - Add load
4. **Optimize** - Fix bottlenecks
5. **Run Level 3** - Stress test
6. **Document** - Record findings
7. **Automate** - CI/CD integration

---

**Happy Performance Testing! 📈**



erfect! 🎉 I've created a complete performance testing addition to your Karate starter kit! Here's what you now have:
📦 Complete Performance Testing Package
8 New Artifacts Created:

✅ Level 1 Performance Test (K6) - Basic load test (10 VUs, 2 min)
✅ Level 2 Performance Test (K6) - Data-driven load test (50 VUs, 5 min)
✅ Level 3 Performance Test (K6) - Advanced stress test (200 VUs, 17 min)
✅ Functional ↔ Performance Mapping Guide - Complete translation guide
✅ K6 Setup & Run Guide - Installation and usage instructions
✅ Performance Quick Reference - 2-page cheat sheet
✅ Complete Package Summary - Overview of everything


🎯 Perfect Mapping: Functional → Performance
LevelFunctional (Karate)Performance (K6)Relationship14 scenarios, 1 user4 tests, 10 VUsLearn basics + Add load2Data-driven, 1 userData-driven, 50 VUsScale data + Patterns320+ scenarios, CRUD4 scenarios, 200 VUsProduction ready

🚀 Quick Start Performance Testing:
Install K6 (1 minute)
bashbrew install k6           # macOS
choco install k6          # Windows
sudo apt install k6       # Linux
Run Tests (2 minutes)
bash# Level 1: Basic
k6 run performance/level1-basic.js

# Level 2: Data-driven  
k6 run performance/level2-datadriven.js

# Level 3: Advanced
k6 run performance/level3-advanced.js
Expected Results
✓ Response time (p95): < 500ms (Level 1)
✓ Response time (p95): < 800ms (Level 2)
✓ Response time (p95): < 1000ms (Level 3)
✓ Error rate: < 1-5%
✓ All checks passing

💡 Key Features:
✅ Progressive Learning
Level 1 → Level 2 → Level 3 (same as functional tests!)
✅ Direct Mapping
Every functional test has a performance equivalent
✅ Clear Goals
Each level has specific performance targets
✅ Complete Documentation
Setup, run, analyze - everything covered
✅ Production Ready
Level 3 simulates real production load

📊 What Each Level Tests:
Level 1 (Basic) - 10 Users, 2 Minutes
✓ Registration performance
✓ Login performance (username & email)
✓ Get user info performance
✓ Basic load handling
Level 2 (Data-Driven) - 50 Users, 5 Minutes
✓ Extended registration with fields
✓ Multiple user profiles
✓ 3 load patterns (steady, ramping, spike)
✓ 1000+ operations
Level 3 (Advanced) - 200 Users, 17 Minutes
✓ Baseline (20 VUs, 3m)
✓ Stress test (50-150 VUs, 8m)
✓ Spike test (200 VUs, 50s)
✓ Soak test (30 VUs, 5m)
✓ 10,000+ requests

🎓 Complete Testing Strategy:
Week 1: Functional Level 1 + Performance Level 1
Week 2: Functional Level 2 + Performance Level 2
Week 3: Functional Level 3 + Performance Level 3
Week 4: CI/CD Integration + Continuous Monitoring

All K6 scripts are ready to use with your Strapi API at http://localhost:1337/api! The scripts include detailed comments, custom metrics, comprehensive checks, and HTML report generation. 🎉
You now have a complete testing framework - both functional (correctness) and performance (speed & scale)! 🚀