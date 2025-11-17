/**
 * Seed Test Data Script
 *
 * This script creates a test user with sample transactions for development and testing.
 *
 * Usage:
 *   ts-node src/scripts/seed-test-data.ts
 */

import pool from '../config/database';
import bcrypt from 'bcrypt';
import { logger } from '../utils/logger';

const SALT_ROUNDS = 12;

async function seedTestData() {
  try {
    logger.info('Starting test data seeding...');

    // Create test user
    const testEmail = 'test@smartbudget.com';
    const testPassword = 'password123';
    const passwordHash = await bcrypt.hash(testPassword, SALT_ROUNDS);

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [testEmail]);

    let userId: number;

    if (existingUser.rows.length > 0) {
      userId = existingUser.rows[0].id;
      logger.info(`Test user already exists: ${testEmail}`);

      // Delete existing transactions for clean slate
      await pool.query('DELETE FROM transactions WHERE user_id = $1', [userId]);
      await pool.query('DELETE FROM budget_limits WHERE user_id = $1', [userId]);
      logger.info('Deleted existing test data');
    } else {
      const result = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
        [testEmail, passwordHash]
      );
      userId = result.rows[0].id;
      logger.info(`Created test user: ${testEmail}`);
    }

    // Sample transactions for the current month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-indexed

    const transactions = [
      // Income
      { amount: 3000.00, category: 'Salary', note: 'Monthly salary', daysAgo: 25 },
      { amount: 500.00, category: 'Income', note: 'Freelance work', daysAgo: 15 },

      // Expenses
      { amount: 850.00, category: 'Rent', note: 'Monthly rent payment', daysAgo: 24 },
      { amount: 120.50, category: 'Groceries', note: 'Weekly groceries - Supermarket', daysAgo: 2 },
      { amount: 85.30, category: 'Groceries', note: 'Weekly groceries', daysAgo: 9 },
      { amount: 95.75, category: 'Groceries', note: 'Farmers market', daysAgo: 16 },
      { amount: 110.20, category: 'Groceries', note: 'Weekly shopping', daysAgo: 23 },

      { amount: 45.00, category: 'Transport', note: 'Monthly bus pass', daysAgo: 23 },
      { amount: 35.50, category: 'Transport', note: 'Taxi to airport', daysAgo: 12 },
      { amount: 20.00, category: 'Transport', note: 'Uber rides', daysAgo: 5 },

      { amount: 65.00, category: 'Others', note: 'Gym membership', daysAgo: 20 },
      { amount: 45.99, category: 'Others', note: 'Netflix subscription', daysAgo: 18 },
      { amount: 150.00, category: 'Others', note: 'Dinner with friends', daysAgo: 10 },
      { amount: 80.00, category: 'Others', note: 'Birthday gift', daysAgo: 7 },
      { amount: 30.00, category: 'Others', note: 'Movie tickets', daysAgo: 3 },
    ];

    // Insert transactions
    for (const transaction of transactions) {
      const date = new Date(currentYear, currentMonth, currentDate.getDate() - transaction.daysAgo);
      const dateStr = date.toISOString().split('T')[0];

      await pool.query(
        'INSERT INTO transactions (user_id, amount, category, note, date) VALUES ($1, $2, $3, $4, $5)',
        [userId, transaction.amount, transaction.category, transaction.note, dateStr]
      );
    }

    logger.info(`Created ${transactions.length} test transactions`);

    // Create budget limits for current month
    const budgets = [
      { category: 'Rent', limitAmount: 900.00 },
      { category: 'Groceries', limitAmount: 400.00 },
      { category: 'Transport', limitAmount: 100.00 },
      { category: 'Others', limitAmount: 300.00 },
    ];

    for (const budget of budgets) {
      await pool.query(
        `INSERT INTO budget_limits (user_id, category, limit_amount, month, year)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id, category, month, year)
         DO UPDATE SET limit_amount = EXCLUDED.limit_amount`,
        [userId, budget.category, budget.limitAmount, currentMonth + 1, currentYear]
      );
    }

    logger.info(`Created ${budgets.length} budget limits`);

    // Summary
    logger.info('\n✅ Test data seeded successfully!');
    logger.info('\n📊 Test User Credentials:');
    logger.info(`   Email: ${testEmail}`);
    logger.info(`   Password: ${testPassword}`);
    logger.info('\n💡 You can now login with these credentials and see test data.');

  } catch (error) {
    logger.error('Error seeding test data:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the seeding
seedTestData()
  .then(() => {
    logger.info('Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Seeding failed:', error);
    process.exit(1);
  });
