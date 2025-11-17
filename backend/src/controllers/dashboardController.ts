import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import transactionService from '../services/transactionService';

export const getDashboardData = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;
    const { month, year } = req.query;

    // Get monthly summary
    const summary = await transactionService.getMonthlySummary(
      userId,
      month ? parseInt(month as string) : undefined,
      year ? parseInt(year as string) : undefined
    );

    // Get recent transactions
    const recentTransactions = await transactionService.getRecentTransactions(userId, 10);

    res.status(200).json({
      summary,
      recentTransactions,
      month: month || new Date().getMonth() + 1,
      year: year || new Date().getFullYear(),
    });
  } catch (error) {
    next(error);
  }
};
