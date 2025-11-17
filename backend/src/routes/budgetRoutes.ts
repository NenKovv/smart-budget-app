import express from 'express';
import { body, param } from 'express-validator';
import * as budgetController from '../controllers/budgetController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/budgets
router.get('/', budgetController.getBudgets);

// POST /api/budgets
router.post(
  '/',
  [
    body('category')
      .isIn(['Income', 'Salary', 'Rent', 'Transport', 'Groceries', 'Others'])
      .withMessage('Invalid category'),
    body('limitAmount').isFloat({ gte: 0 }).withMessage('Limit must be >= 0'),
    body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be 1-12'),
    body('year').isInt({ min: 2025 }).withMessage('Invalid year'),
  ],
  budgetController.setBudget
);

// GET /api/budgets/alerts
router.get('/alerts', budgetController.getBudgetAlerts);

export default router;
