import pool from '../config/database';
import { createError } from '../middleware/errorHandler';

export interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  category: string;
  note: string | null;
  date: string;
  created_at: string;
}

export interface TransactionFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  categoryBreakdown: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

class TransactionService {
  /**
   * Get all transactions for a user with optional filters
   */
  async getUserTransactions(
    userId: number,
    filters: TransactionFilters = {}
  ): Promise<Transaction[]> {
    let query = 'SELECT * FROM transactions WHERE user_id = $1';
    const params: any[] = [userId];
    let paramIndex = 2;

    if (filters.category) {
      query += ` AND category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.startDate) {
      query += ` AND date >= $${paramIndex}`;
      params.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      query += ` AND date <= $${paramIndex}`;
      params.push(filters.endDate);
      paramIndex++;
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Create a new transaction
   */
  async createTransaction(
    userId: number,
    amount: number,
    category: string,
    note: string | null,
    date: string
  ): Promise<Transaction> {
    const result = await pool.query(
      'INSERT INTO transactions (user_id, amount, category, note, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, amount, category, note, date]
    );

    return result.rows[0];
  }

  /**
   * Get monthly summary with income, expenses, and breakdown
   */
  async getMonthlySummary(
    userId: number,
    month?: number,
    year?: number
  ): Promise<MonthlySummary> {
    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth() + 1;
    const targetYear = year || currentDate.getFullYear();

    // Get all transactions for the month
    const query = `
      SELECT
        category,
        SUM(amount) as total,
        COUNT(*) as count
      FROM transactions
      WHERE user_id = $1
        AND EXTRACT(MONTH FROM date) = $2
        AND EXTRACT(YEAR FROM date) = $3
      GROUP BY category
      ORDER BY total DESC
    `;

    const result = await pool.query(query, [userId, targetMonth, targetYear]);

    // Calculate totals
    let totalIncome = 0;
    let totalExpenses = 0;

    const incomeCategories = ['Income', 'Salary'];
    const categoryBreakdown: CategoryBreakdown[] = result.rows.map((row) => {
      const amount = parseFloat(row.total);

      if (incomeCategories.includes(row.category)) {
        totalIncome += amount;
      } else {
        totalExpenses += amount;
      }

      return {
        category: row.category,
        total: amount,
        count: parseInt(row.count),
        percentage: 0, // Will calculate after
      };
    });

    // Calculate percentages for expenses only
    const expenseBreakdown = categoryBreakdown.filter(
      (item) => !incomeCategories.includes(item.category)
    );

    expenseBreakdown.forEach((item) => {
      item.percentage = totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0;
    });

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      categoryBreakdown: expenseBreakdown,
    };
  }

  /**
   * Get transaction by ID (with ownership check)
   */
  async getTransactionById(userId: number, transactionId: number): Promise<Transaction> {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [transactionId, userId]
    );

    if (result.rows.length === 0) {
      throw createError('Transaction not found', 404);
    }

    return result.rows[0];
  }

  /**
   * Update transaction
   */
  async updateTransaction(
    userId: number,
    transactionId: number,
    updates: Partial<Pick<Transaction, 'amount' | 'category' | 'note' | 'date'>>
  ): Promise<Transaction> {
    // Check ownership first
    await this.getTransactionById(userId, transactionId);

    const updateFields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (updates.amount !== undefined) {
      updateFields.push(`amount = $${paramIndex}`);
      params.push(updates.amount);
      paramIndex++;
    }

    if (updates.category !== undefined) {
      updateFields.push(`category = $${paramIndex}`);
      params.push(updates.category);
      paramIndex++;
    }

    if (updates.note !== undefined) {
      updateFields.push(`note = $${paramIndex}`);
      params.push(updates.note);
      paramIndex++;
    }

    if (updates.date !== undefined) {
      updateFields.push(`date = $${paramIndex}`);
      params.push(updates.date);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      throw createError('No fields to update', 400);
    }

    params.push(transactionId, userId);
    const query = `UPDATE transactions SET ${updateFields.join(', ')} WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *`;

    const result = await pool.query(query, params);
    return result.rows[0];
  }

  /**
   * Delete transaction
   */
  async deleteTransaction(userId: number, transactionId: number): Promise<void> {
    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
      [transactionId, userId]
    );

    if (result.rows.length === 0) {
      throw createError('Transaction not found', 404);
    }
  }

  /**
   * Get recent transactions (last N)
   */
  async getRecentTransactions(userId: number, limit: number = 10): Promise<Transaction[]> {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC, created_at DESC LIMIT $2',
      [userId, limit]
    );

    return result.rows;
  }
}

export default new TransactionService();
