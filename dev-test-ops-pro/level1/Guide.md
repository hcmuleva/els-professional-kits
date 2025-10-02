# 🔐 Authentication Server User Guide

## 📋 Overview
This guide provides commands for starting the authentication server, managing the database, and verifying data in your PostgreSQL container.

---

## 🚀 Server Management

### Starting the Server

| Command | Description | Use Case |
|---------|-------------|----------|
| `docker compose --env-file .env up -d --build` | Start all services in detached mode with environment file | Initial setup and when you make changes to the code |
| `docker compose --env-file .env up -d` | Start services without rebuilding | Quick restart when no code changes were made |
| `docker compose down` | Stop and remove all containers | Shutdown when done working |
| `docker compose logs` | View server logs | Debugging issues |

---

## 🗃️ Database Operations

### Initial Setup
| Command | Description | When to Use |
|---------|-------------|-------------|
| `docker exec -it auth_postgres psql -U appuser -d appdb -f /docker-entrypoint-initdb.d/init.sql` | Create tables and seed initial data | First-time setup or when you need to reset the database |

### Interactive Database Session
| Command | Description | Purpose |
|---------|-------------|---------|
| `docker exec -it auth_postgres psql -U appuser -d appdb` | Start interactive PostgreSQL session | Manual queries and database exploration |

#### Common `psql` Commands (inside session)

| Command | Description | Example Output |
|---------|-------------|----------------|
| `\dt` | List all tables | Shows tables like `users`, `sessions` |
| `\d users` | Inspect users table structure | Shows columns, types, constraints |
| `SELECT * FROM users;` | View all user records | Displays id, email, password, etc. |
| `\q` | Exit session | Returns to terminal |

### Quick Database Queries
| Command | Description | Use Case |
|---------|-------------|----------|
| `docker exec -it auth_postgres psql -U appuser -d appdb -c "SELECT * FROM users;"` | View all users | Quick verification of seeded data |
| `docker exec -it auth_postgres psql -U appuser -d appdb -c "SELECT count(*) FROM users;"` | Count total users | Data validation |
| `docker exec -it auth_postgres psql -U appuser -d appdb -c "\dt"` | List tables | Schema verification |

---

## 🔄 Common Workflows

### First-Time Setup
```bash
# 1. Start the server
docker compose --env-file .env up -d --build

# 2. Initialize database
docker exec -it auth_postgres psql -U appuser -d appdb -f /docker-entrypoint-initdb.d/init.sql

# 3. Verify data
docker exec -it auth_postgres psql -U appuser -d appdb -c "SELECT * FROM users;"
# 4. Register user 
curl -X POST http://localhost:5002/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"harish","email":"harisgh@a.com","password":"secret"}'

#5. Login
curl -X POST http://localhost:5002/api/login \
    -H "Content-Type: application/json" \
  -d '{"email":"harisgh@a.com","password":"secret"}'