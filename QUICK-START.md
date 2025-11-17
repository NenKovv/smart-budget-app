# SmartBudget - Quick Start Guide

Get SmartBudget running locally in **5 minutes**!

---

## Prerequisites

Make sure you have these installed:
- Node.js 20.x LTS
- PostgreSQL 15
- Git

---

## Quick Setup (5 Steps)

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### 2. Create Database

```bash
# Create database
createdb smartbudget

# Or using psql
psql -U postgres
CREATE DATABASE smartbudget;
\q
```

### 3. Set Up Environment Variables

**Backend** (`backend/.env`):
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/smartbudget
JWT_SECRET=your-super-secret-key-change-this
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Frontend** (`frontend/.env`):
```bash
cp frontend/.env.example frontend/.env
```

Content should be:
```env
REACT_APP_API_URL=http://localhost:5000/api
NODE_ENV=development
```

### 4. Run Database Migrations

```bash
cd backend

# Set DATABASE_URL (replace with your credentials)
export DATABASE_URL='postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/smartbudget'

# Make script executable (Mac/Linux)
chmod +x migrations/run_all_migrations.sh

# Run migrations
./migrations/run_all_migrations.sh

# Windows: Run migrations individually
psql -U YOUR_USERNAME -d smartbudget -f migrations/001_create_users_table.sql
psql -U YOUR_USERNAME -d smartbudget -f migrations/002_create_transactions_table.sql
psql -U YOUR_USERNAME -d smartbudget -f migrations/003_create_budget_limits_table.sql
```

### 5. Start the Application

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

Local:            http://localhost:3000
```

---

## Verify Installation

1. **Health Check:**
   - Open [http://localhost:5000/health](http://localhost:5000/health)
   - Should see: `{"status":"OK","timestamp":"..."}`

2. **Frontend:**
   - Open [http://localhost:3000](http://localhost:3000)
   - Should see SmartBudget login page

3. **Create Account:**
   - Click "Sign Up"
   - Enter email: `you@example.com`
   - Enter password: `password123` (min 8 chars)
   - Click "Sign Up"
   - Should redirect to empty dashboard

---

## Load Test Data (Optional)

Want to see sample data immediately?

```bash
cd backend
npx ts-node src/scripts/seed-test-data.ts
```

**Test credentials:**
- Email: `test@smartbudget.com`
- Password: `password123`

This creates:
- 1 test user
- 15 sample transactions (current month)
- 4 budget limits

Login with test credentials and explore!

---

## Troubleshooting

### Database Connection Error

**Error:** `ECONNREFUSED ::1:5432`

**Solution:**
```bash
# Check if PostgreSQL is running
pg_ctl status

# Start PostgreSQL (Mac/Linux)
pg_ctl start

# Windows: Check Services → PostgreSQL
```

---

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Find process
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process or change PORT in backend/.env
```

---

### JWT Secret Not Configured

**Error:** `JWT secret not configured`

**Solution:**
- Ensure `JWT_SECRET` is set in `backend/.env`
- Generate one using:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

---

### Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install

# Same for frontend
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

---

## What's Next?

### Explore Features

1. **Add Transaction:**
   - Click the blue "+" button (bottom right)
   - Enter amount, category, note, date
   - Click "Add Transaction"

2. **View Dashboard:**
   - See monthly summary (income, expenses, balance)
   - Spending breakdown pie chart
   - Recent transactions list

3. **Filter Transactions:**
   - Navigate to "Transactions" page
   - Filter by category
   - Filter by date range

4. **Delete Transaction:**
   - Click delete icon on any transaction
   - Confirm deletion

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Build for Production

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

---

## Docker Alternative

Prefer Docker? Run everything with one command:

```bash
docker-compose up
```

Access:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

---

## Key URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

---

## Default Accounts

**Created by you:**
- Email: (your email)
- Password: (your password)

**Test account (after seeding):**
- Email: test@smartbudget.com
- Password: password123

---

## Development Workflow

### Making Changes

**Backend:**
1. Edit files in `backend/src/`
2. Server auto-restarts (nodemon)
3. Changes apply immediately

**Frontend:**
1. Edit files in `frontend/src/`
2. React auto-reloads
3. See changes in browser

### Adding Dependencies

**Backend:**
```bash
cd backend
npm install <package-name>
```

**Frontend:**
```bash
cd frontend
npm install <package-name>
```

### Database Changes

1. Create new migration in `backend/migrations/`
2. Name it `00X_description.sql`
3. Run migration:
   ```bash
   psql -d smartbudget -f migrations/00X_description.sql
   ```

---

## Common Commands

```bash
# Start development servers
cd backend && npm run dev
cd frontend && npm start

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Seed test data
cd backend && npx ts-node src/scripts/seed-test-data.ts
```

---

## Support

**Having issues?**

1. Check [SETUP.md](SETUP.md) for detailed setup instructions
2. Review [Troubleshooting](#troubleshooting) section above
3. Check logs:
   - Backend: `backend/logs/error.log`
   - Frontend: Browser console (F12)
4. Open GitHub issue with error details

---

## Learning Resources

**Documentation:**
- [Setup Guide](SETUP.md) - Detailed setup instructions
- [Technical Architecture](bmad_docs/architect/05-TECHNICAL-ARCHITECTURE.md) - System design
- [Architecture Diagrams](bmad_docs/architect/ARCHITECTURE-DIAGRAMS.md) - Visual diagrams
- [Sprint 1 Progress](SPRINT-1-PROGRESS.md) - Current development status

**Code:**
- Backend: `backend/src/`
- Frontend: `frontend/src/`
- Database: `backend/migrations/`

---

## Success Checklist

After quick start, you should be able to:
- ✅ Create an account
- ✅ Login successfully
- ✅ See empty dashboard
- ✅ Add a transaction
- ✅ See transaction in dashboard
- ✅ Filter transactions
- ✅ Delete a transaction

**All working?** 🎉 You're ready to develop!

---

**Last Updated:** 2025-11-17
**SmartBudget** - Simple Personal Finance Management
