#!/bin/bash

# Run all database migrations in order
# Usage: ./run_all_migrations.sh

set -e # Exit on error

echo "🚀 Running SmartBudget database migrations..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable not set"
  echo "Please set it in .env file or export it:"
  echo "  export DATABASE_URL='postgresql://username:password@localhost:5432/smartbudget'"
  exit 1
fi

# Run each migration
echo "📊 Migration 1/3: Creating users table..."
psql "$DATABASE_URL" -f migrations/001_create_users_table.sql

echo "📊 Migration 2/3: Creating transactions table..."
psql "$DATABASE_URL" -f migrations/002_create_transactions_table.sql

echo "📊 Migration 3/3: Creating budget_limits table..."
psql "$DATABASE_URL" -f migrations/003_create_budget_limits_table.sql

echo "✅ All migrations completed successfully!"
echo "📋 Database schema created:"
echo "  - users table (authentication)"
echo "  - transactions table (income/expenses)"
echo "  - budget_limits table (monthly budgets)"
