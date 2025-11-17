import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import pool from '../config/database';
import { AuthRequest } from '../middleware/authMiddleware';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const getTransactions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category, startDate, endDate } = req.query;
    const userId = req.userId;

    let query = 'SELECT * FROM transactions WHERE user_id = $1';
    const params: any[] = [userId];
    let paramIndex = 2;

    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (startDate) {
      query += ` AND date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const result = await pool.query(query, params);

    res.status(200).json({
      transactions: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, category, note, date } = req.body;
    const userId = req.userId;

    const result = await pool.query(
      'INSERT INTO transactions (user_id, amount, category, note, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, amount, category, note || null, date]
    );

    logger.info(`Transaction created by user ${userId}: ${category} ${amount}`);

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { amount, category, note, date } = req.body;
    const userId = req.userId;

    // Check ownership
    const checkResult = await pool.query('SELECT id FROM transactions WHERE id = $1 AND user_id = $2', [
      id,
      userId,
    ]);

    if (checkResult.rows.length === 0) {
      throw createError('Transaction not found', 404);
    }

    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (amount !== undefined) {
      updates.push(`amount = $${paramIndex}`);
      params.push(amount);
      paramIndex++;
    }

    if (category !== undefined) {
      updates.push(`category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    if (note !== undefined) {
      updates.push(`note = $${paramIndex}`);
      params.push(note);
      paramIndex++;
    }

    if (date !== undefined) {
      updates.push(`date = $${paramIndex}`);
      params.push(date);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw createError('No fields to update', 400);
    }

    params.push(id, userId);
    const query = `UPDATE transactions SET ${updates.join(', ')} WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *`;

    const result = await pool.query(query, params);

    logger.info(`Transaction ${id} updated by user ${userId}`);

    res.status(200).json({
      message: 'Transaction updated successfully',
      transaction: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      throw createError('Transaction not found', 404);
    }

    logger.info(`Transaction ${id} deleted by user ${userId}`);

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMonthlySummary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const { month, year } = req.query;

    // TODO: Add date filtering based on month/year if provided
    const query = `
      SELECT
        category,
        SUM(amount) as total,
        COUNT(*) as count
      FROM transactions
      WHERE user_id = $1
      GROUP BY category
      ORDER BY total DESC
    `;

    const result = await pool.query(query, [userId]);

    res.status(200).json({
      summary: result.rows,
    });
  } catch (error) {
    next(error);
  }
};
