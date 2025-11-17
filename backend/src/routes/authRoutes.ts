import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';

const router = express.Router();

// POST /api/auth/signup
router.post(
  '/signup',
  [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  authController.signup
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

export default router;
