import express from 'express';
import { body, query } from 'express-validator';
import * as transactionController from '../controllers/transactionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/transactions
router.get(
  '/',
  [
    query('category').optional().isString(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  transactionController.getTransactions
);

// POST /api/transactions
router.post(
  '/',
  [
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
    body('category')
      .isIn(['Income', 'Salary', 'Rent', 'Transport', 'Groceries', 'Others'])
      .withMessage('Invalid category'),
    body('note').optional().isString().trim(),
    body('date').isISO8601().withMessage('Invalid date format'),
  ],
  transactionController.createTransaction
);

// PUT /api/transactions/:id
router.put(
  '/:id',
  [
    body('amount').optional().isFloat({ gt: 0 }),
    body('category').optional().isIn(['Income', 'Salary', 'Rent', 'Transport', 'Groceries', 'Others']),
    body('note').optional().isString().trim(),
    body('date').optional().isISO8601(),
  ],
  transactionController.updateTransaction
);

// DELETE /api/transactions/:id
router.delete('/:id', transactionController.deleteTransaction);

// GET /api/transactions/summary
router.get('/summary', transactionController.getMonthlySummary);

export default router;
