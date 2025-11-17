import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import pool from '../config/database';
import { AuthRequest } from '../middleware/authMiddleware';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const getBudgets = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const { month, year } = req.query;

    let query = 'SELECT * FROM budget_limits WHERE user_id = $1';
    const params: any[] = [userId];
    let paramIndex = 2;

    if (month) {
      query += ` AND month = $${paramIndex}`;
      params.push(month);
      paramIndex++;
    }

    if (year) {
      query += ` AND year = $${paramIndex}`;
      params.push(year);
      paramIndex++;
    }

    const result = await pool.query(query, params);

    res.status(200).json({
      budgets: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const setBudget = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, limitAmount, month, year } = req.body;
    const userId = req.userId;

    // Upsert budget limit
    const query = `
      INSERT INTO budget_limits (user_id, category, limit_amount, month, year)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, category, month, year)
      DO UPDATE SET limit_amount = EXCLUDED.limit_amount
      RETURNING *
    `;

    const result = await pool.query(query, [userId, category, limitAmount, month, year]);

    logger.info(`Budget set by user ${userId}: ${category} ${limitAmount} (${month}/${year})`);

    res.status(200).json({
      message: 'Budget limit set successfully',
      budget: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getBudgetAlerts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Get budget limits for current month
    const budgetsResult = await pool.query(
      'SELECT * FROM budget_limits WHERE user_id = $1 AND month = $2 AND year = $3',
      [userId, currentMonth, currentYear]
    );

    const budgets = budgetsResult.rows;
    const alerts: any[] = [];

    // For each budget, check spending
    for (const budget of budgets) {
      const spendingResult = await pool.query(
        `SELECT SUM(amount) as total
         FROM transactions
         WHERE user_id = $1
         AND category = $2
         AND EXTRACT(MONTH FROM date) = $3
         AND EXTRACT(YEAR FROM date) = $4`,
        [userId, budget.category, currentMonth, currentYear]
      );

      const totalSpent = parseFloat(spendingResult.rows[0].total || '0');
      const limitAmount = parseFloat(budget.limit_amount);
      const percentage = (totalSpent / limitAmount) * 100;

      if (percentage >= 80) {
        alerts.push({
          category: budget.category,
          limitAmount: limitAmount,
          spent: totalSpent,
          percentage: percentage.toFixed(1),
          severity: percentage >= 100 ? 'critical' : 'warning',
        });
      }
    }

    res.status(200).json({ alerts });
  } catch (error) {
    next(error);
  }
};
