# Karate Starter Kit Generator - Complete Setup Guide

## 📦 What's Included

This starter kit generator creates a complete Karate API test automation project with three progressive levels:

### **Level 1 - Basic Authentication** 🟢
Perfect for beginners learning Karate fundamentals.

**Features:**
- Simple user registration
- Login with username/email
- Get authenticated user info
- 4 basic test scenarios

**Use Case:** Getting started with Karate, learning basic syntax and API testing

---

### **Level 2 - Data Driven Testing** 🟡
Intermediate level with data-driven approaches.

**Features:**
- Register users with extended fields (first_name, last_name)
- Scenario Outline for parameterized testing
- Table-based data generation
- Reading test data from JSON files
- Helper features for reusability
- Bulk user registration

**Use Case:** Testing with multiple data sets, learning reusable components

---

### **Level 3 - Advanced Testing** 🔴
Complete test suite with validations and CRUD operations.

**Features:**
- Comprehensive validation tests
- Error handling scenarios
- User CRUD operations (Create, Read, Update, Delete)
- Pagination and filtering
- Authorization testing
- Advanced assertions
- Complete Strapi API integration

**Use Case:** Production-ready test automation, complex scenarios

---

## 🚀 Quick Start

### Method 1: Using the Generator Script (Linux/Mac)

1. **Download the generator script:**
```bash
curl -O https://your-repo/generate-kit.sh
chmod +x generate-kit.sh
```

2. **Run the generator:**
```bash
./generate-kit.sh
```

3. **Follow the prompts:**
```
Select the starter kit level:
  1) Level 1 - Basic
  2) Level 2 - Data Driven
  3) Level 3 - Advanced
  4) All Levels

Enter your choice (1-4): 4
Enter project name: my-karate-tests
Enter API base URL: http://localhost:1337/api
```

4. **Navigate and run:**
```bash
cd my-karate-tests
mvn clean install -DskipTests
mvn test
```

### Method 2: Using the Generator Script (Windows)

1. **Download and run:**
```cmd
generate-kit.bat
```

2. **Follow the prompts and then:**
```cmd
cd my-karate-tests
mvn clean install -DskipTests
mvn test
```

### Method 3: Manual Setup

If you prefer to set up manually, follow the structure below:

```
project-name/
├── pom.xml
├── README.md
├── .gitignore
├── run-tests.sh
├── run-tests.bat
└── src/test/java/
    ├── karate-config.js
    ├── features/
    │   ├── level1/
    │   │   └── authentication.feature
    │   ├── level2/
    │   │   └── authentication.feature
    │   └── level3/
    │       ├── authentication.feature
    │       └── user-crud.feature
    ├── helpers/
    │   ├── create-user.feature
    │   ├── register-helper.feature
    │   └── login-helper.feature
    ├── runners/
    │   └── TestRunner.java
    └── testdata/
        └── users.json
```

---

## 📋 Prerequisites

- **Java**: Version 11 or higher
- **Maven**: Version 3.6 or higher
- **Strapi API**: Running instance (default: http://localhost:1337)
- **IDE** (Optional): IntelliJ IDEA, Eclipse, or VS Code

### Verify Prerequisites

```bash
# Check Java version
java -version

# Check Maven version
mvn -version

# Check if Strapi is running
curl http://localhost:1337/api
```

---

## 🎯 Level Details

### Level 1 - Test Scenarios

| Scenario | Description | Validates |
|----------|-------------|-----------|
| Register a new user | Creates a new user account | Registration API, JWT response |
| Login with registered user | Logs in with username | Login flow, token generation |
| Login with email | Logs in using email | Email-based login |
| Get current user info | Retrieves authenticated user data | Protected endpoint access |

**Sample Test Run:**
```bash
mvn test -Dtest=TestRunner#testLevel1
```

**Expected Output:**
```
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
```

---

### Level 2 - Test Scenarios

| Scenario | Description | Data Source |
|----------|-------------|-------------|
| Register with extended fields | User with first_name, last_name | Inline |
| Multiple users via Scenario Outline | 5 different users | Examples table |
| Bulk registration via Table | Multiple users at once | Table data |
| Read from JSON file | External test data | users.json |

**Sample Test Run:**
```bash
mvn test -Dtest=TestRunner#testLevel2
```

**Expected Registrations:** 10+ users with various data combinations

**Test Data File (`users.json`):**
```json
[
  {
    "username": "john_smith",
    "password": "Pass@123456",
    "first_name": "John",
    "last_name": "Smith"
  }
]
```

---

### Level 3 - Test Scenarios

#### Authentication Tests (12 scenarios)
- ✅ Successful registration
- ✅ Duplicate username/email validation
- ✅ Login with username/email
- ✅ Invalid credentials handling
- ✅ Missing field validation
- ✅ Protected endpoint access
- ✅ Token validation

#### User CRUD Tests (8 scenarios)
- ✅ Get current user
- ✅ Get all users with pagination
- ✅ Get user by ID
- ✅ Update user details
- ✅ User count
- ✅ Search and filter
- ✅ Sort operations
- ✅ Authorization checks

**Sample Test Run:**
```bash
# All Level 3 tests
mvn test -Dtest=TestRunner#testAllLevel3

# Only authentication
mvn test -Dtest=TestRunner#testLevel3Auth

# Only user CRUD
mvn test -Dtest=TestRunner#testLevel3UserCrud
```

---

## 🔧 Configuration

### Update API Base URL

Edit `src/test/java/karate-config.js`:

```javascript
if (env === 'dev') {
  config.baseUrl = 'http://localhost:1337/api';  // Change this
} else if (env === 'qa') {
  config.baseUrl = 'https://qa.yourapi.com/api';
}