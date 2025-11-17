-- Migration: Create transactions table
-- Date: 2025-11-17
-- Description: Transaction records with categories

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  category VARCHAR(50) NOT NULL CHECK (category IN ('Income', 'Salary', 'Rent', 'Transport', 'Groceries', 'Others')),
  note TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for query optimization
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date DESC);

-- Add comments
COMMENT ON TABLE transactions IS 'User transaction records (income and expenses)';
COMMENT ON COLUMN transactions.user_id IS 'Foreign key to users table';
COMMENT ON COLUMN transactions.amount IS 'Transaction amount in EUR (must be > 0)';
COMMENT ON COLUMN transactions.category IS 'Transaction category (6 fixed options)';
COMMENT ON COLUMN transactions.note IS 'Optional transaction description';
COMMENT ON COLUMN transactions.date IS 'Transaction date (not necessarily creation date)';
