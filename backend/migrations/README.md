# Database Migrations

This directory contains SQL migration scripts for the SmartBudget PostgreSQL database.

## Migration Files

| File | Description | Status |
|------|-------------|--------|
| `001_create_users_table.sql` | Creates users table with authentication | ✅ |
| `002_create_transactions_table.sql` | Creates transactions table with categories | ✅ |
| `003_create_budget_limits_table.sql` | Creates budget_limits table for monthly budgets | ✅ |

## Running Migrations

### Option 1: Using psql (Manual)

Run each migration in order:

```bash
psql -U username -d smartbudget -f migrations/001_create_users_table.sql
psql -U username -d smartbudget -f migrations/002_create_transactions_table.sql
psql -U username -d smartbudget -f migrations/003_create_budget_limits_table.sql
```

### Option 2: Using Heroku Postgres

```bash
heroku pg:psql -a smartbudget-staging < migrations/001_create_users_table.sql
heroku pg:psql -a smartbudget-staging < migrations/002_create_transactions_table.sql
heroku pg:psql -a smartbudget-staging < migrations/003_create_budget_limits_table.sql
```

### Option 3: Run All Migrations (Combined)

```bash
cat migrations/*.sql | psql -U username -d smartbudget
```

## Database Schema

```
┌─────────────┐
│   users     │
├─────────────┤
│ id (PK)     │
│ email       │
│ password_   │
│  hash       │
│ created_at  │
└─────────────┘
       │
       │ 1:N
       │
       ├─────────────────────────────┐
       │                             │
       ▼                             ▼
┌──────────────┐            ┌────────────────┐
│ transactions │            │ budget_limits  │
├──────────────┤            ├────────────────┤
│ id (PK)      │            │ id (PK)        │
│ user_id (FK) │            │ user_id (FK)   │
│ amount       │            │ category       │
│ category     │            │ limit_amount   │
│ note         │            │ month          │
│ date         │            │ year           │
│ created_at   │            │ UNIQUE(user,   │
└──────────────┘            │  cat,mon,yr)   │
                            └────────────────┘
```

## Categories

Fixed 6 categories (MVP scope):
- `Income`
- `Salary`
- `Rent`
- `Transport`
- `Groceries`
- `Others`

## Indexes

**users:**
- `idx_users_email` on `email`

**transactions:**
- `idx_transactions_user_id` on `user_id`
- `idx_transactions_date` on `date`
- `idx_transactions_category` on `category`
- `idx_transactions_user_date` on `(user_id, date DESC)` - composite index for dashboard queries

**budget_limits:**
- `idx_budget_limits_user_id` on `user_id`
- `idx_budget_limits_user_month_year` on `(user_id, month, year)` - composite index for budget alerts

## Constraints

- All tables use `ON DELETE CASCADE` for user_id foreign keys
- Transactions: `amount > 0` (positive amounts only)
- Transactions: `category IN (...)` (6 fixed categories)
- Budget Limits: `limit_amount >= 0` (non-negative)
- Budget Limits: `month BETWEEN 1 AND 12`
- Budget Limits: `year >= 2025`
- Budget Limits: `UNIQUE(user_id, category, month, year)` - one budget per category per month

## Future Migrations (Phase 2+)

- Add `recurring_transactions` table
- Add `plaid_accounts` table for bank sync
- Add custom categories support
- Add multi-currency support
