-- Migration: Create budget_limits table
-- Date: 2025-11-17
-- Description: Monthly budget limits per category

CREATE TABLE IF NOT EXISTS budget_limits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  limit_amount DECIMAL(10, 2) NOT NULL CHECK (limit_amount >= 0),
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year >= 2025),
  UNIQUE(user_id, category, month, year)
);

-- Create index for query optimization
CREATE INDEX IF NOT EXISTS idx_budget_limits_user_id ON budget_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_limits_user_month_year ON budget_limits(user_id, month, year);

-- Add comments
COMMENT ON TABLE budget_limits IS 'Monthly budget limits per category';
COMMENT ON COLUMN budget_limits.user_id IS 'Foreign key to users table';
COMMENT ON COLUMN budget_limits.category IS 'Budget category (matches transaction categories)';
COMMENT ON COLUMN budget_limits.limit_amount IS 'Budget limit in EUR (0 = no budget)';
COMMENT ON COLUMN budget_limits.month IS 'Month (1-12)';
COMMENT ON COLUMN budget_limits.year IS 'Year (>= 2025)';
