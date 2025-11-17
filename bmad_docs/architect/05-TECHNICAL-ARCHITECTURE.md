# SmartBudget - Technical Architecture Specification

**Version:** 1.0
**Date:** 2025-11-17
**Architect:** Arhinna
**Status:** Approved
**Auto-saved:** Yes
**Save Path:** ./bmad_docs/architect/

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Security Architecture](#security-architecture)
5. [Database Design](#database-design)
6. [API Design](#api-design)
7. [Deployment Architecture](#deployment-architecture)

---

## 1. System Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript                                      │
│  - Material-UI Components                                    │
│  - Recharts (Data Visualization)                            │
│  - React Router (Navigation)                                │
│  - Axios (HTTP Client)                                      │
│  - Context API (State Management)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/REST API
                       │ JSON Requests/Responses
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Node.js + Express + TypeScript                             │
│  - Express Router (API Endpoints)                           │
│  - JWT Middleware (Authentication)                          │
│  - Express Validator (Input Validation)                     │
│  - Express Rate Limit (DDoS Protection)                     │
│  - Winston Logger (Structured Logging)                      │
│  - Helmet (Security Headers)                                │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL Queries (node-postgres)
                       │ Parameterized Statements
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                               │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL 15                                              │
│  - users table (authentication data)                        │
│  - transactions table (financial data)                      │
│  - budget_limits table (user budgets)                       │
│  - Indexes on user_id, date, category                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Frontend Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | React | 18.3.1 | UI rendering, component architecture |
| Language | TypeScript | 5.x | Type safety, developer experience |
| UI Library | Material-UI (MUI) | 5.x | Pre-built accessible components |
| Charts | Recharts | 2.x | Spending visualization |
| HTTP Client | Axios | 1.x | API communication |
| Routing | React Router | 6.x | Client-side navigation |
| State Management | React Context API | Built-in | Global state (user, auth) |
| Form Handling | React Hook Form | 7.x | Form validation |
| Date Handling | date-fns | 3.x | Date formatting |

**Frontend Dependencies:**
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "typescript": "^5.0.0",
    "@mui/material": "^5.0.0",
    "@mui/icons-material": "^5.0.0",
    "recharts": "^2.0.0",
    "axios": "^1.0.0",
    "react-router-dom": "^6.0.0",
    "react-hook-form": "^7.0.0",
    "date-fns": "^3.0.0"
  }
}
```

---

### 2.2 Backend Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Runtime | Node.js | 20.x LTS | JavaScript runtime |
| Framework | Express | 4.x | Web server, routing |
| Language | TypeScript | 5.x | Type safety |
| Database Client | node-postgres (pg) | 8.x | PostgreSQL queries |
| Authentication | jsonwebtoken | 9.x | JWT generation/verification |
| Password Hashing | bcrypt | 5.x | Secure password storage |
| Validation | express-validator | 7.x | Request validation |
| Security | helmet | 7.x | Security headers |
| Rate Limiting | express-rate-limit | 7.x | DoS prevention |
| Logging | winston | 3.x | Structured logging |
| CORS | cors | 2.x | Cross-origin handling |

**Backend Dependencies:**
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "typescript": "^5.0.0",
    "pg": "^8.11.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "express-validator": "^7.0.0",
    "helmet": "^7.0.0",
    "express-rate-limit": "^7.0.0",
    "winston": "^3.10.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0"
  }
}
```

---

### 2.3 Database & DevOps

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Database | PostgreSQL 15 | Relational data storage |
| Hosting | Heroku | Cloud platform |
| CI/CD | GitHub Actions | Automated testing/deployment |
| Containerization | Docker | Local development |
| Version Control | Git + GitHub | Source code management |
| Error Tracking | Sentry | Real-time error monitoring |
| Testing (Unit) | Jest | JavaScript testing |
| Testing (Integration) | Supertest | HTTP endpoint testing |
| Testing (E2E) | Playwright | Browser automation |
| Linting | ESLint | Code quality |
| Formatting | Prettier | Code style |

---

## 3. Directory Structure

```
smartbudget/
├── frontend/                 # React application
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── MonthlySummary.tsx
│   │   │   │   ├── SpendingChart.tsx
│   │   │   │   └── BudgetAlerts.tsx
│   │   │   ├── transactions/
│   │   │   │   ├── TransactionList.tsx
│   │   │   │   ├── TransactionForm.tsx
│   │   │   │   └── TransactionItem.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Navigation.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── common/
│   │   │       ├── Button.tsx
│   │   │       ├── Modal.tsx
│   │   │       └── Loading.tsx
│   │   ├── pages/            # Route pages
│   │   │   ├── HomePage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── TransactionsPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── context/          # Global state
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── services/         # API calls
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── transactionService.ts
│   │   │   └── budgetService.ts
│   │   ├── types/            # TypeScript types
│   │   │   ├── User.ts
│   │   │   ├── Transaction.ts
│   │   │   └── Budget.ts
│   │   ├── utils/            # Helper functions
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── constants.ts
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   └── useTransactions.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── styles/
│   │       └── theme.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── backend/                  # Express API
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── transactionController.ts
│   │   │   ├── budgetController.ts
│   │   │   └── dashboardController.ts
│   │   ├── middleware/       # Express middleware
│   │   │   ├── authMiddleware.ts
│   │   │   ├── errorMiddleware.ts
│   │   │   ├── validationMiddleware.ts
│   │   │   └── rateLimitMiddleware.ts
│   │   ├── models/           # Database models
│   │   │   ├── User.ts
│   │   │   ├── Transaction.ts
│   │   │   └── BudgetLimit.ts
│   │   ├── routes/           # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── transactionRoutes.ts
│   │   │   ├── budgetRoutes.ts
│   │   │   └── dashboardRoutes.ts
│   │   ├── services/         # Business logic
│   │   │   ├── authService.ts
│   │   │   ├── transactionService.ts
│   │   │   ├── budgetService.ts
│   │   │   └── dashboardService.ts
│   │   ├── db/               # Database
│   │   │   ├── connection.ts
│   │   │   ├── schema.sql
│   │   │   └── migrations/
│   │   ├── utils/            # Utilities
│   │   │   ├── logger.ts
│   │   │   ├── errors.ts
│   │   │   └── validators.ts
│   │   ├── types/            # TypeScript types
│   │   │   ├── User.ts
│   │   │   ├── Transaction.ts
│   │   │   └── express.d.ts
│   │   ├── config/           # Configuration
│   │   │   ├── database.ts
│   │   │   └── jwt.ts
│   │   ├── app.ts            # Express app setup
│   │   └── server.ts         # Server entry point
│   ├── tests/                # Test files
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── .github/
│   └── workflows/
│       ├── ci.yml            # CI pipeline
│       └── deploy.yml        # Deployment pipeline
├── docker-compose.yml        # Local development
├── README.md
└── .gitignore
```

---

## 4. Security Architecture

### 4.1 Authentication Flow

```
1. User Registration:
   ┌─────────┐         ┌─────────┐        ┌──────────┐
   │ Client  │────────>│  POST   │───────>│ bcrypt   │
   │         │  email  │ /auth/  │ hash   │ password │
   │         │  pass   │register │        │ (12 rounds)
   └─────────┘         └─────────┘        └────┬─────┘
                                                │
                                                ▼
                                          ┌──────────┐
                                          │Save user │
                                          │to DB     │
                                          └────┬─────┘
                                               │
                                               ▼
                                          ┌──────────┐
                                          │Generate  │
                                          │JWT token │
                                          │(24hr exp)│
                                          └────┬─────┘
                                               │
                                               ▼
                                          Return token
                                          + user data

2. User Login:
   Similar flow, verify bcrypt hash

3. Protected Routes:
   Client ────> Add JWT to ────> Verify JWT ────> Allow/Deny
            Authorization      middleware       request
            header
```

---

### 4.2 Security Measures Matrix

| Threat | Mitigation | Implementation |
|--------|-----------|----------------|
| **SQL Injection** | Parameterized queries | `pg` library with bind parameters |
| **XSS Attacks** | Input sanitization + CSP | `helmet` + React escaping |
| **CSRF** | SameSite cookies | Express session config |
| **Brute Force** | Rate limiting | `express-rate-limit` (100 req/15min) |
| **Weak Passwords** | Enforce strong passwords | Min 8 chars, 1 upper, 1 number, 1 special |
| **Token Theft** | Short-lived JWTs + HttpOnly | 24-hour expiration, secure flags |
| **MITM** | HTTPS enforcement | Heroku SSL certificate |
| **Dependency Vulns** | Automated scanning | `npm audit` + Dependabot alerts |

---

### 4.3 Password Policy

**Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

**Hashing:**
- Algorithm: bcrypt
- Salt rounds: 12
- Stored format: `$2b$12$<salt><hash>`

---

### 4.4 JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": 123,
    "email": "user@example.com",
    "iat": 1700000000,
    "exp": 1700086400
  },
  "signature": "<HMAC-SHA256 signature>"
}
```

**Token Expiration:** 24 hours
**Storage:** HttpOnly cookie (client cannot access via JavaScript)
**Refresh Strategy:** Re-authenticate after expiration (Phase 2: refresh tokens)

---

## 5. Database Design

### 5.1 Entity Relationship Diagram

```
┌─────────────┐
│   USERS     │
├─────────────┤
│ id (PK)     │
│ email       │
│ password_hash│
│ created_at  │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────────┐
│  TRANSACTIONS   │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │────┐
│ amount          │    │
│ category        │    │
│ note            │    │
│ date            │    │
│ created_at      │    │
└─────────────────┘    │
                       │
                       │
┌──────────────────┐   │
│  BUDGET_LIMITS   │   │
├──────────────────┤   │
│ id (PK)          │   │
│ user_id (FK)     │◄──┘
│ category         │
│ limit_amount     │
│ month            │
│ year             │
└──────────────────┘
```

---

### 5.2 SQL Schema

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);

---

-- Transactions Table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  category VARCHAR(50) NOT NULL CHECK (category IN ('Income', 'Salary', 'Rent', 'Transport', 'Groceries', 'Others')),
  note TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);

---

-- Budget Limits Table
CREATE TABLE budget_limits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Income', 'Salary', 'Rent', 'Transport', 'Groceries', 'Others')),
  limit_amount DECIMAL(10, 2) NOT NULL CHECK (limit_amount >= 0),
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year >= 2025),
  UNIQUE(user_id, category, month, year)
);

-- Indexes
CREATE INDEX idx_budget_limits_user_id ON budget_limits(user_id);
CREATE INDEX idx_budget_limits_period ON budget_limits(user_id, month, year);
```

---

### 5.3 Sample Data

```sql
-- Sample User
INSERT INTO users (email, password_hash) VALUES
('sarah@example.com', '$2b$12$KIX...<bcrypt hash>');

-- Sample Transactions
INSERT INTO transactions (user_id, amount, category, note, date) VALUES
(1, 1200.00, 'Rent', 'Monthly rent payment', '2025-11-01'),
(1, 45.50, 'Groceries', 'Weekly shopping', '2025-11-15'),
(1, 30.00, 'Transport', 'Metro pass', '2025-11-10');

-- Sample Budget Limits
INSERT INTO budget_limits (user_id, category, limit_amount, month, year) VALUES
(1, 'Groceries', 500.00, 11, 2025),
(1, 'Transport', 150.00, 11, 2025);
```

---

## 6. API Design

### 6.1 RESTful Endpoints

**Base URL:** `/api`

**Authentication Endpoints:**
- `POST /auth/register` - Create new user
- `POST /auth/login` - Authenticate user

**Transaction Endpoints:**
- `GET /transactions` - List transactions (filtered)
- `POST /transactions` - Create transaction
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction

**Budget Endpoints:**
- `GET /budget-limits` - Get budget limits
- `POST /budget-limits` - Set/update budget limit

**Dashboard Endpoint:**
- `GET /dashboard` - Get summary, charts, alerts

---

### 6.2 API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {
    // Response payload
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": [
      // Optional field-level errors
    ]
  }
}
```

---

## 7. Deployment Architecture

### 7.1 Heroku Deployment

```
GitHub Repository
       │
       │ Push to branch
       ▼
┌──────────────────┐
│ GitHub Actions   │
│ - Run tests      │
│ - Build frontend │
│ - Build backend  │
└────────┬─────────┘
         │ On success
         ▼
┌──────────────────┐
│ Heroku Staging   │
│ - Web dyno       │
│ - Postgres add-on│
└────────┬─────────┘
         │ Manual approval
         ▼
┌──────────────────┐
│ Heroku Production│
│ - Web dyno (x2)  │
│ - Postgres       │
│ - SSL enabled    │
└──────────────────┘
```

---

### 7.2 Environment Configuration

**Development:**
- Local Node.js server
- Local PostgreSQL (Docker)
- Frontend dev server (port 3000)
- Backend API server (port 5000)

**Staging:**
- Heroku free tier
- Auto-deploy on `develop` branch
- Heroku Postgres Hobby Dev

**Production:**
- Heroku hobby tier ($7/mo)
- Manual deploy approval
- Heroku Postgres Standard-0

---

**Architecture Complete!**

**Next Steps:**
1. Set up project repositories
2. Initialize database schema
3. Configure CI/CD pipelines
4. Begin Sprint 1 implementation

---

**Document Version:**
- Created: 2025-11-17
- Architect: Arhinna
- Status: Approved
- Auto-saved: ./bmad_docs/architect/

---

Generated with BMAD Method v6
Technical Architecture Complete
Agent: Arhinna (Architect)
