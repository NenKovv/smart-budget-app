# SmartBudget - Developer Setup Guide

Complete setup instructions for local development environment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Docker Setup](#docker-setup)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** v20.x LTS ([Download](https://nodejs.org/))
- **PostgreSQL:** v15 ([Download](https://www.postgresql.org/download/))
- **Git:** Latest version
- **Docker & Docker Compose:** (Optional, for containerized setup)

Verify installations:

```bash
node --version    # Should show v20.x.x
npm --version     # Should show v10.x.x
psql --version    # Should show 15.x
git --version
```

---

## Quick Start

For experienced developers:

```bash
# 1. Clone repository
git clone https://github.com/yourusername/smartbudget.git
cd smartbudget

# 2. Install dependencies
cd backend && npm install && cd ../frontend && npm install && cd ..

# 3. Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Create database and run migrations
createdb smartbudget
cd backend && chmod +x migrations/run_all_migrations.sh
export DATABASE_URL='postgresql://yourusername:yourpassword@localhost:5432/smartbudget'
./migrations/run_all_migrations.sh

# 5. Start services
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm start
```

---

## Detailed Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/smartbudget.git
cd smartbudget
```

### Step 2: Backend Setup

#### 2.1 Install Dependencies

```bash
cd backend
npm install
```

#### 2.2 Configure Environment Variables

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://yourusername:yourpassword@localhost:5432/smartbudget
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
```

**Important:** Replace `yourusername`, `yourpassword`, and generate a secure `JWT_SECRET`:

```bash
# Generate JWT_SECRET (Linux/Mac)
openssl rand -hex 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 2.3 Create PostgreSQL Database

**Option A: Command Line**

```bash
createdb smartbudget
```

**Option B: psql Shell**

```bash
psql -U postgres
CREATE DATABASE smartbudget;
\q
```

#### 2.4 Run Database Migrations

```bash
cd backend

# Make script executable (Linux/Mac)
chmod +x migrations/run_all_migrations.sh

# Set DATABASE_URL
export DATABASE_URL='postgresql://yourusername:yourpassword@localhost:5432/smartbudget'

# Run migrations
./migrations/run_all_migrations.sh
```

**Windows Users:**

```bash
psql -U yourusername -d smartbudget -f migrations/001_create_users_table.sql
psql -U yourusername -d smartbudget -f migrations/002_create_transactions_table.sql
psql -U yourusername -d smartbudget -f migrations/003_create_budget_limits_table.sql
```

#### 2.5 Verify Database Setup

```bash
psql -d smartbudget -c "\dt"
```

Expected output:
```
             List of relations
 Schema |      Name      | Type  |  Owner
--------+----------------+-------+---------
 public | budget_limits  | table | yourusername
 public | transactions   | table | yourusername
 public | users          | table | yourusername
```

### Step 3: Frontend Setup

#### 3.1 Install Dependencies

```bash
cd ../frontend
npm install
```

#### 3.2 Configure Environment Variables

```bash
cp .env.example .env
```

Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
NODE_ENV=development
```

### Step 4: Run the Application

Open **two terminal windows/tabs**:

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Expected output:
```
[timestamp] [info]: Server running on port 5000
[timestamp] [info]: Environment: development
[timestamp] [info]: PostgreSQL database connected
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

Expected output:
```
Compiled successfully!

You can now view smartbudget-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Step 5: Access the Application

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

---

## Docker Setup

For containerized development environment:

### Prerequisites

- Docker Engine 24.x+
- Docker Compose v2.x+

### Quick Start with Docker

```bash
# Start all services (frontend, backend, database)
docker-compose up

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access:**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

### Docker Commands

```bash
# Rebuild containers after code changes
docker-compose up --build

# Run migrations in Docker
docker-compose exec backend npm run migrate

# Access PostgreSQL in Docker
docker-compose exec postgres psql -U smartbudget -d smartbudget

# View backend logs
docker-compose logs -f backend

# Stop and remove volumes (reset database)
docker-compose down -v
```

---

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm test
# Coverage report in: backend/coverage/
```

**Coverage Thresholds:**
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Generate coverage report
npm run test:coverage
```

---

## Troubleshooting

### Database Connection Issues

**Error:** `ECONNREFUSED ::1:5432`

**Solution:**
- Ensure PostgreSQL is running: `pg_ctl status`
- Start PostgreSQL: `pg_ctl start` (Mac/Linux) or check Windows Services
- Verify DATABASE_URL in `.env` matches your PostgreSQL credentials

---

**Error:** `password authentication failed for user`

**Solution:**
- Check PostgreSQL password: `psql -U yourusername -d postgres`
- Update `DATABASE_URL` in `backend/.env`

---

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**

**Find process:**
```bash
# Mac/Linux
lsof -i :5000

# Windows
netstat -ano | findstr :5000
```

**Kill process:**
```bash
# Mac/Linux
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

**Or change port:** Edit `backend/.env` to use PORT=5001

---

### JWT Token Errors

**Error:** `JWT secret not configured`

**Solution:**
- Ensure `JWT_SECRET` is set in `backend/.env`
- Generate a secure secret (see Step 2.2)

---

### Migration Fails

**Error:** `relation "users" already exists`

**Solution:**

```bash
# Drop and recreate database
dropdb smartbudget
createdb smartbudget

# Re-run migrations
cd backend
./migrations/run_all_migrations.sh
```

---

### React Build Errors

**Error:** `Module not found: Can't resolve '@mui/material'`

**Solution:**

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Development Workflow

### Code Quality

```bash
# Backend linting
cd backend
npm run lint
npm run lint:fix

# Frontend linting
cd frontend
npm run lint
npm run lint:fix
```

### Building for Production

**Backend:**

```bash
cd backend
npm run build
# Output in: backend/dist/
```

**Frontend:**

```bash
cd frontend
npm run build
# Output in: frontend/build/
```

---

## Next Steps

1. Read [Product Brief](bmad_docs/planner/03-PRODUCT-BRIEF.md) for feature requirements
2. Review [Technical Architecture](bmad_docs/architect/05-TECHNICAL-ARCHITECTURE.md) for system design
3. Check [Sprint Plan](bmad_docs/00-EXECUTION-SUMMARY.md) for implementation schedule
4. Run tests: `npm test` in both frontend and backend
5. Start implementing Sprint 1 tasks!

---

## Support

For setup issues:
1. Check [Troubleshooting](#troubleshooting) section
2. Review logs: `backend/logs/error.log`
3. Open GitHub issue with error details

---

**Last Updated:** 2025-11-17
**BMAD Method v6 - SmartBudget Project**
