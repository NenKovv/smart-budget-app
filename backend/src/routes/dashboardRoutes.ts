import express from 'express';
import * as dashboardController from '../controllers/dashboardController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/dashboard
router.get('/', dashboardController.getDashboardData);

export default router;
